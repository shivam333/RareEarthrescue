import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppImage } from "../components/ui/AppImage";
import { DashboardSourceId, dashboardMaterialTiles } from "../data/dashboardMarketplaceData";
import { SupplyFamilyListingDatabase, supplierListingDatabase } from "../data/supplierListingDatabase";
import {
  SupplierListingPackage,
  SupplierPackageStatus,
  useSupplierListingStore,
} from "../hooks/useSupplierListingStore";
import { pageEnter } from "../lib/motion";

const pageMotionProps = {
  variants: pageEnter,
  initial: "hidden" as const,
  animate: "visible" as const,
  exit: "exit" as const,
};

type FamilyKey = DashboardSourceId | "specialized-products";
type DetailMode = "yes" | "no" | "";

type PartOption = {
  id: string;
  manufacturer: string;
  modelFamily: string;
  partNumber: string;
};

type SubcategoryOption = {
  id: string;
  label: string;
  guidance: string;
};

type FeedstockLineItem = {
  id: string;
  subcategoryLabel: string;
  manufacturer: string;
  modelFamily: string;
  partNumber: string;
  quantityKg: string;
  floorPriceKg: string;
  packaging: string;
  condition: string;
  detailMode: DetailMode;
  authorization: string;
  releasePath: string;
  isBelowRange: boolean;
};

type ValidationField =
  | "detailMode"
  | "manufacturerSelect"
  | "manufacturerManual"
  | "modelSelect"
  | "modelManual"
  | "partSelect"
  | "partManual"
  | "observedIdentifier"
  | "floorPriceKg"
  | "quantityKg"
  | "packageTitle"
  | "evidenceNotes"
  | "lineItems";

type ValidationErrors = Partial<Record<ValidationField, string>>;

const specializedTile = {
  id: "specialized-products" as const,
  title: "Specialized Products",
  subtitle:
    "Defense and security products that are authorized for scrap release, demil, recycling, or controlled recovery programs",
  image:
    "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1400&q=80",
};

const faqItems = [
  {
    question: "How does Rare Earth Rescue decide whether a supplier floor is low?",
    answer:
      "The platform checks the selected subcategory, known equipment details, and supplied evidence against a protected backend materials database. Suppliers only see guidance, never the underlying composition model or exact pricing output.",
  },
  {
    question: "What happens if the supplier enters a floor below the platform range?",
    answer:
      "Rare Earth Rescue gives the supplier two paths: keep the submitted floor and list it directly, or open a bid to let recycler demand compete above that floor.",
  },
  {
    question: "Why do we ask whether the supplier knows the equipment details?",
    answer:
      "That question decides whether the workflow should use guided dropdown matching, manual identifiers, or a platform-review path for unknown material.",
  },
  {
    question: "What is specialized products used for?",
    answer:
      "Specialized products is designed for authorized defense and security-related assets that require tighter release, demil, and handling context before the listing can go live.",
  },
];

const packagingOptions = ["Palletized", "Gaylords", "Drummed", "Loose units", "Containerized"];
const conditionOptions = ["Intact", "Dismantled", "Damaged", "Shredded fraction", "Mixed condition"];
const authorizationOptions = [
  "Authorized scrap release",
  "Demil completed",
  "Controlled recycler release",
  "OEM-approved disposition",
];
const releasePathOptions = [
  "Standard industrial release",
  "Secure handling channel",
  "Defense contractor release",
  "Government-approved recycler transfer",
];
const MANUAL_ENTRY_VALUE = "__manual__";

const specializedSubcategories: SubcategoryOption[] = [
  {
    id: "defense-electronics",
    label: "Defense electronics",
    guidance: "Boards, motors, and embedded magnet systems from approved defense electronics recovery streams.",
  },
  {
    id: "secure-comms",
    label: "Secure communications hardware",
    guidance: "Authorized communications and control equipment requiring tighter release records and handling notes.",
  },
  {
    id: "sensor-guidance",
    label: "Sensor and guidance assemblies",
    guidance: "Authorized motion-control, targeting, and sensing modules where embedded magnets may drive recovery value.",
  },
  {
    id: "protected-motor-units",
    label: "Protected motor units",
    guidance: "Controlled motor-bearing products that need extra release documentation before recycler visibility.",
  },
];

const specializedPartCatalog: Record<string, PartOption[]> = {
  "defense-electronics": [
    {
      id: "spec-harris-board",
      manufacturer: "L3Harris",
      modelFamily: "Secure electronics module",
      partNumber: "L3-SM-4401",
    },
    {
      id: "spec-raytheon-control",
      manufacturer: "RTX",
      modelFamily: "Control and actuation assembly",
      partNumber: "RTX-CA-9088",
    },
  ],
  "secure-comms": [
    {
      id: "spec-secure-radio",
      manufacturer: "General Dynamics",
      modelFamily: "Secure radio chassis",
      partNumber: "GD-SR-2002",
    },
    {
      id: "spec-thales-comms",
      manufacturer: "Thales",
      modelFamily: "Protected comms unit",
      partNumber: "TH-CU-7421",
    },
  ],
  "sensor-guidance": [
    {
      id: "spec-sensor-rig",
      manufacturer: "Northrop Grumman",
      modelFamily: "Sensor and tracking assembly",
      partNumber: "NG-ST-8820",
    },
    {
      id: "spec-guidance-kit",
      manufacturer: "BAE Systems",
      modelFamily: "Guidance support module",
      partNumber: "BAE-GM-3155",
    },
  ],
  "protected-motor-units": [
    {
      id: "spec-protected-motor",
      manufacturer: "Lockheed Martin",
      modelFamily: "Protected actuator motor",
      partNumber: "LM-PM-1108",
    },
    {
      id: "spec-aux-drive",
      manufacturer: "Boeing Defense",
      modelFamily: "Auxiliary drive package",
      partNumber: "BD-AD-6262",
    },
  ],
};

const platformEstimatedFloorByPart: Record<string, number> = {
  "hdd-seagate-exos": 2.42,
  "hdd-wd-ultrastar": 2.35,
  "hdd-toshiba-magnet-pack": 3.18,
  "hdd-shred-mix": 1.86,
  "auto-tesla-drive-unit": 3.94,
  "auto-gm-ultium": 3.72,
  "auto-toyota-prius": 3.31,
  "auto-bosch-ebike": 2.88,
  "ind-jtekt-steering": 2.94,
  "ind-dyson-v11": 2.12,
  "ind-siemens-servo": 3.26,
  "ind-vestas-wind": 3.44,
  "mri-ge-signa": 46.0,
  "mri-siemens-skyra": 58.0,
  "mri-fonar-open": 27.5,
  "other-fanuc-actuator": 4.24,
  "other-eppendorf-spin": 2.36,
  "other-thk-linear": 2.74,
  "spec-harris-board": 8.9,
  "spec-raytheon-control": 10.4,
  "spec-secure-radio": 7.6,
  "spec-thales-comms": 8.1,
  "spec-sensor-rig": 9.8,
  "spec-guidance-kit": 11.2,
  "spec-protected-motor": 12.6,
  "spec-aux-drive": 9.4,
};

const hotspotRegionsByFamily: Record<FamilyKey, string[]> = {
  hdd: ["Texas", "Illinois", "Ontario"],
  "auto-motors": ["Ontario", "Texas", "Michigan"],
  "industrial-motors": ["Midwest", "Texas", "Pacific Northwest"],
  mri: ["Upper Midwest", "Northeast", "Mid-Atlantic"],
  "other-items": ["California", "Upper Midwest", "Germany-linked buyers"],
  "specialized-products": ["Virginia", "Texas", "Mid-Atlantic secure handling"],
};

function getFamilyRecord(familyId: FamilyKey | undefined): SupplyFamilyListingDatabase | null {
  if (!familyId || familyId === "specialized-products") {
    return null;
  }
  return supplierListingDatabase.find((record) => record.familyId === familyId) ?? null;
}

function createLineItemId() {
  return `line-${Math.random().toString(36).slice(2, 10)}`;
}

function toNumberValue(value: string) {
  const normalized = value.replace(/[^0-9.]/g, "");
  return normalized ? Number(normalized) : NaN;
}

function currency(value: number) {
  return `$${value.toFixed(2)}/kg`;
}

function normalizeLookupValue(value: string) {
  return value.trim().toLowerCase();
}

function hasValue(value: string) {
  return value.trim().length > 0;
}

function createPackageId() {
  return `pkg-${Math.random().toString(36).slice(2, 10)}`;
}

export function SupplierCreateBidPage() {
  const navigate = useNavigate();
  const params = useParams<{ familyId?: string }>();
  const familyId = (params.familyId as FamilyKey | undefined) ?? undefined;
  const isSelectionPage = !familyId;
  const familyRecord = getFamilyRecord(familyId);
  const { savePackage } = useSupplierListingStore();

  const activeTile =
    familyId === "specialized-products"
      ? specializedTile
      : dashboardMaterialTiles.find((tile) => tile.id === familyId) ?? null;

  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
  const [packageTitle, setPackageTitle] = useState("");
  const [evidenceNotes, setEvidenceNotes] = useState("");
  const [detailMode, setDetailMode] = useState<DetailMode>("");
  const [manufacturerSelect, setManufacturerSelect] = useState("");
  const [manufacturerManual, setManufacturerManual] = useState("");
  const [modelSelect, setModelSelect] = useState("");
  const [modelManual, setModelManual] = useState("");
  const [partSelect, setPartSelect] = useState("");
  const [partManual, setPartManual] = useState("");
  const [observedIdentifier, setObservedIdentifier] = useState("");
  const [quantityKg, setQuantityKg] = useState("");
  const [floorPriceKg, setFloorPriceKg] = useState("");
  const [packaging, setPackaging] = useState(packagingOptions[0]);
  const [condition, setCondition] = useState(conditionOptions[0]);
  const [authorization, setAuthorization] = useState(authorizationOptions[0]);
  const [releasePath, setReleasePath] = useState(releasePathOptions[0]);
  const [lineItems, setLineItems] = useState<FeedstockLineItem[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [isRecommendationOpen, setIsRecommendationOpen] = useState(false);
  const [showLineItemValidation, setShowLineItemValidation] = useState(false);
  const [showPackageValidation, setShowPackageValidation] = useState(false);

  const subcategoryCards: SubcategoryOption[] =
    familyId === "specialized-products"
      ? specializedSubcategories
      : (familyRecord?.subcategories ?? []).map((subcategory) => ({
          id: subcategory.id,
          label: subcategory.label,
          guidance: subcategory.guidance,
        }));

  const selectedSubcategory =
    subcategoryCards.find((subcategory) => subcategory.id === selectedSubcategoryId) ?? null;

  const partCatalog: PartOption[] = useMemo(() => {
    if (!selectedSubcategoryId) {
      return [];
    }
    if (familyId === "specialized-products") {
      return specializedPartCatalog[selectedSubcategoryId] ?? [];
    }
    const sourceSubcategory = familyRecord?.subcategories.find((subcategory) => subcategory.id === selectedSubcategoryId);
    return (
      sourceSubcategory?.partRecords.map((record) => ({
        id: record.id,
        manufacturer: record.manufacturer,
        modelFamily: record.modelFamily,
        partNumber: record.partNumber,
      })) ?? []
    );
  }, [familyId, familyRecord, selectedSubcategoryId]);

  const manufacturerOptions = [...new Set(partCatalog.map((record) => record.manufacturer))];
  const modelOptions = [...new Set(partCatalog.filter((record) => !manufacturerSelect || record.manufacturer === manufacturerSelect).map((record) => record.modelFamily))];
  const partOptions = partCatalog.filter(
    (record) =>
      (!manufacturerSelect ||
        manufacturerSelect === MANUAL_ENTRY_VALUE ||
        record.manufacturer === manufacturerSelect) &&
      (!modelSelect || record.modelFamily === modelSelect),
  );
  const isManualEntry = detailMode === "yes" && manufacturerSelect === MANUAL_ENTRY_VALUE;

  useEffect(() => {
    setSelectedSubcategoryId("");
    setPackageTitle("");
    setEvidenceNotes("");
    setLineItems([]);
    setStatusMessage("");
    setShowLineItemValidation(false);
    setShowPackageValidation(false);
    setIsRecommendationOpen(false);
  }, [familyId]);

  useEffect(() => {
    setDetailMode("");
    setManufacturerSelect("");
    setManufacturerManual("");
    setModelSelect("");
    setModelManual("");
    setPartSelect("");
    setPartManual("");
    setObservedIdentifier("");
    setQuantityKg("");
    setFloorPriceKg("");
    setPackaging(packagingOptions[0]);
    setCondition(conditionOptions[0]);
    setAuthorization(authorizationOptions[0]);
    setReleasePath(releasePathOptions[0]);
    setStatusMessage("");
    setShowLineItemValidation(false);
  }, [selectedSubcategoryId]);

  const platformEstimate = useMemo(() => {
    if (partSelect && platformEstimatedFloorByPart[partSelect]) {
      return platformEstimatedFloorByPart[partSelect];
    }

    if (partCatalog.length === 0) {
      return null;
    }

    const manufacturerLookup = normalizeLookupValue(manufacturerManual || manufacturerSelect);
    const modelLookup = normalizeLookupValue(modelManual || modelSelect);
    const partLookup = normalizeLookupValue(partManual);

    const matchedRecord = partCatalog.find((record) => {
      const manufacturerMatch = manufacturerLookup
        ? normalizeLookupValue(record.manufacturer).includes(manufacturerLookup)
        : true;
      const modelMatch = modelLookup ? normalizeLookupValue(record.modelFamily).includes(modelLookup) : true;
      const partMatch = partLookup ? normalizeLookupValue(record.partNumber).includes(partLookup) : true;
      return manufacturerMatch && modelMatch && partMatch;
    });

    if (matchedRecord && platformEstimatedFloorByPart[matchedRecord.id]) {
      return platformEstimatedFloorByPart[matchedRecord.id];
    }

    const estimatePool = partCatalog
      .map((record) => platformEstimatedFloorByPart[record.id])
      .filter((value): value is number => typeof value === "number");

    if (estimatePool.length === 0) {
      return null;
    }

    return estimatePool.reduce((sum, value) => sum + value, 0) / estimatePool.length;
  }, [manufacturerManual, manufacturerSelect, modelManual, modelSelect, partCatalog, partManual, partSelect]);
  const enteredFloorNumber = toNumberValue(floorPriceKg);
  const isBelowPlatformRange =
    typeof platformEstimate === "number" && Number.isFinite(enteredFloorNumber) && enteredFloorNumber < platformEstimate;

  const resolvedManufacturer = detailMode === "yes" ? manufacturerManual || manufacturerSelect : "Platform review required";
  const resolvedModel = detailMode === "yes" ? modelManual || modelSelect : observedIdentifier || "Observed identifier pending";
  const resolvedPart = detailMode === "yes" ? partManual || partSelect : "Platform-reviewed";
  const lineItemErrors = useMemo<ValidationErrors>(() => {
    const errors: ValidationErrors = {};

    if (!detailMode) {
      errors.detailMode = "Choose whether you know the item details or need platform review.";
    } else if (detailMode === "yes") {
      if (!manufacturerSelect) {
        errors.manufacturerSelect = "Choose a manufacturer or select Enter manually.";
      } else if (manufacturerSelect === MANUAL_ENTRY_VALUE) {
        if (!hasValue(manufacturerManual)) {
          errors.manufacturerManual = "Type the manufacturer name.";
        }
        if (!hasValue(modelManual)) {
          errors.modelManual = "Type the model family.";
        }
        if (!hasValue(partManual)) {
          errors.partManual = "Type the part number.";
        }
      } else {
        if (!modelSelect) {
          errors.modelSelect = "Select the model family.";
        }
        if (!partSelect) {
          errors.partSelect = "Select the part number.";
        }
      }
    } else if (!hasValue(observedIdentifier)) {
      errors.observedIdentifier = "Enter the best identifier you can see on the scrap.";
    }

    if (!hasValue(floorPriceKg)) {
      errors.floorPriceKg = "Enter the supplier floor price per kg.";
    } else if (!Number.isFinite(enteredFloorNumber) || enteredFloorNumber <= 0) {
      errors.floorPriceKg = "Enter a valid positive floor price.";
    }

    const quantityNumber = toNumberValue(quantityKg);
    if (!hasValue(quantityKg)) {
      errors.quantityKg = "Enter the quantity in kg.";
    } else if (!Number.isFinite(quantityNumber) || quantityNumber <= 0) {
      errors.quantityKg = "Enter a valid positive quantity.";
    }

    return errors;
  }, [
    detailMode,
    enteredFloorNumber,
    floorPriceKg,
    manufacturerManual,
    manufacturerSelect,
    modelManual,
    modelSelect,
    observedIdentifier,
    partManual,
    partSelect,
    quantityKg,
  ]);

  const packageErrors = useMemo<ValidationErrors>(() => {
    const errors: ValidationErrors = {};

    if (!hasValue(packageTitle)) {
      errors.packageTitle = "Add a listing package title.";
    }

    if (!hasValue(evidenceNotes)) {
      errors.evidenceNotes = "Add the evidence and photos summary.";
    }

    if (lineItems.length === 0) {
      errors.lineItems = "Add at least one complete feedstock item before continuing.";
    }

    return errors;
  }, [evidenceNotes, lineItems.length, packageTitle]);

  const lineItemComplete = Boolean(selectedSubcategoryId) && Object.keys(lineItemErrors).length === 0;
  const packageComplete = Object.keys(packageErrors).length === 0;

  const averageFloor =
    lineItems.length > 0
      ? lineItems.reduce((sum, item) => sum + toNumberValue(item.floorPriceKg), 0) / lineItems.length
      : 0;
  const bidSpreadLow = averageFloor ? averageFloor * 1.04 : 0;
  const bidSpreadHigh = averageFloor ? averageFloor * 1.11 : 0;
  const totalQuantityKg = lineItems.reduce((sum, item) => sum + (toNumberValue(item.quantityKg) || 0), 0);
  const minRecommendedQty = totalQuantityKg > 0 ? Math.max(500, Math.round(totalQuantityKg * 0.4)) : 0;
  const demandHotspots = familyId ? hotspotRegionsByFamily[familyId] : [];
  const anyBelowRange = lineItems.some((item) => item.isBelowRange);
  const bidSpreadLowPct = anyBelowRange ? -4 : -2;
  const bidSpreadHighPct = Math.min(14, 8 + Math.max(1, lineItems.length));

  const persistPackage = (status: SupplierPackageStatus) => {
    if (!familyId || !selectedSubcategory) {
      return;
    }

    const timestamp = new Date().toISOString();
    const nextPackage: SupplierListingPackage = {
      id: createPackageId(),
      familyId,
      familyLabel: activeTile?.title ?? "Supplier listing",
      subcategoryId: selectedSubcategory.id,
      subcategoryLabel: selectedSubcategory.label,
      packageTitle,
      evidenceNotes,
      status,
      createdAt: timestamp,
      updatedAt: timestamp,
      lineItems,
    };

    savePackage(nextPackage);
  };

  const addLineItem = () => {
    setShowLineItemValidation(true);

    if (!lineItemComplete || !selectedSubcategory) {
      setStatusMessage("Complete every required field in Step 3 before adding the item to the package.");
      return;
    }

    setLineItems((current) => [
      ...current,
      {
        id: createLineItemId(),
        subcategoryLabel: selectedSubcategory.label,
        manufacturer: resolvedManufacturer,
        modelFamily: resolvedModel,
        partNumber: resolvedPart,
        quantityKg,
        floorPriceKg,
        packaging,
        condition,
        detailMode,
        authorization,
        releasePath,
        isBelowRange: isBelowPlatformRange,
      },
    ]);

    setDetailMode("");
    setManufacturerSelect("");
    setManufacturerManual("");
    setModelSelect("");
    setModelManual("");
    setPartSelect("");
    setPartManual("");
    setObservedIdentifier("");
    setQuantityKg("");
    setFloorPriceKg("");
    setPackaging(packagingOptions[0]);
    setCondition(conditionOptions[0]);
    setAuthorization(authorizationOptions[0]);
    setReleasePath(releasePathOptions[0]);
    setShowLineItemValidation(false);
    setStatusMessage("Feedstock item added to the listing package.");
  };

  const handleSaveDraft = () => {
    setShowPackageValidation(true);

    if (!packageComplete) {
      setStatusMessage("Complete the package title, evidence notes, and at least one feedstock item before saving.");
      return;
    }
    persistPackage("draft");
    navigate("/dashboard");
  };

  const handleListAtSpecifiedFloor = () => {
    setShowPackageValidation(true);

    if (!packageComplete) {
      setStatusMessage("Complete all mandatory sections before listing the package.");
      return;
    }
    persistPackage("live-floor");
    navigate("/dashboard/supplier/listings");
  };

  const handleOpenRecommendation = () => {
    setShowPackageValidation(true);

    if (!packageComplete) {
      setStatusMessage("Complete all mandatory sections before requesting a bidding recommendation.");
      return;
    }
    setIsRecommendationOpen(true);
  };

  const getFieldShellClass = (hasError: boolean) =>
    `rounded-[24px] border p-4 ${hasError ? "border-[#B16A1D] bg-[rgba(255,248,240,0.98)]" : "border-[#DCE3EF] bg-white"}`;

  const getInputClass = (hasError: boolean, extraClasses = "") =>
    `mt-3 w-full rounded-[18px] border px-4 py-3 text-[0.95rem] text-[#0F1115] outline-none transition focus:border-[#253B80] ${
      hasError ? "border-[#B16A1D] bg-[#FFFDFC]" : "border-[#DCE3EF] bg-white"
    } ${extraClasses}`.trim();

  const getErrorMessage = (errors: ValidationErrors, field: ValidationField, shouldShow: boolean) =>
    shouldShow ? errors[field] : undefined;

  return (
    <motion.main className="page bg-transparent" {...pageMotionProps}>
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(121,161,144,0.18),transparent_26%),radial-gradient(circle_at_92%_0%,rgba(210,175,103,0.16),transparent_24%),linear-gradient(180deg,#FFFFFF_0%,#F6F8FC_58%,#F6F8FC_100%)] pb-16 pt-28">
        <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(17,40,61,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(17,40,61,0.04)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="shell relative z-10">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex rounded-full border border-[#DCE3EF] bg-white/82 px-4 py-2 text-[0.76rem] font-bold uppercase tracking-[0.14em] text-[#0F1115] transition hover:border-[#253B80] hover:text-[#253B80]"
            >
              Back to dashboard
            </Link>
            {!isSelectionPage ? (
              <Link
                to="/dashboard/supplier/create-bid"
                className="inline-flex rounded-full border border-[#DCE3EF] bg-[#F8FAFD] px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#253B80]"
              >
                Choose another category
              </Link>
            ) : null}
          </div>

          {isSelectionPage ? (
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="mt-6 rounded-[34px] border border-[#DCE3EF] bg-white/88 p-6 shadow-[0_28px_80px_rgba(46,41,31,0.08)]"
            >
              <p className="eyebrow">Supplier create listing</p>
              <h1 className="max-w-[12ch] font-display text-[clamp(2.8rem,4vw,4.4rem)] leading-[0.95] tracking-[-0.06em] text-[#0F1115]">
                Choose the feedstock family you want to list.
              </h1>
              <p className="mt-4 max-w-[44rem] text-[0.98rem] leading-7 text-[#6D7484]">
                Start with the category. Rare Earth Rescue opens a dedicated workflow on the next page, then uses the subcategory and the supplier’s details to check pricing without exposing the protected model.
              </p>

              <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {[...dashboardMaterialTiles, specializedTile].map((tile) => (
                  <Link
                    key={tile.id}
                    to={`/dashboard/supplier/create-bid/${tile.id}`}
                    className="grid gap-3 rounded-[24px] border border-[#DCE3EF] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(247,241,232,0.84))] p-3 transition hover:-translate-y-1 hover:border-[#253B80]/30 hover:shadow-[0_20px_56px_rgba(37,59,128,0.12)]"
                  >
                    <AppImage src={tile.image} alt={tile.title} className="h-28 w-full rounded-[20px] object-cover" />
                    <div>
                      <strong className="block font-display text-[1.06rem] tracking-[-0.04em] text-[#0F1115]">
                        {tile.title}
                      </strong>
                      <p className="mt-2 text-[0.84rem] leading-6 text-[#6D7484]">{tile.subtitle}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.section>
          ) : (
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="mt-6 rounded-[34px] border border-[#DCE3EF] bg-white/88 p-6 shadow-[0_28px_80px_rgba(46,41,31,0.08)]"
            >
              <p className="eyebrow">Create listing | {activeTile?.title}</p>
              <h1 className="max-w-[12ch] font-display text-[clamp(2.8rem,4vw,4.3rem)] leading-[0.95] tracking-[-0.06em] text-[#0F1115]">
                Select a subcategory to unlock the supplier listing workflow.
              </h1>
              <p className="mt-4 max-w-[46rem] text-[0.98rem] leading-7 text-[#6D7484]">
                Suppliers choose the subcategory first. Then the platform opens a required form where each feedstock item can be entered manually or matched from dropdowns before pricing guidance is returned.
              </p>

              {activeTile ? (
                <div className="mt-6 rounded-[26px] border border-[#DCE3EF] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(247,241,232,0.84))] p-4">
                  <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
                    <AppImage src={activeTile.image} alt={activeTile.title} className="h-32 w-full rounded-[20px] object-cover" />
                    <div className="flex flex-col justify-center">
                      <strong className="block font-display text-[1.3rem] tracking-[-0.04em] text-[#0F1115]">
                        {activeTile.title}
                      </strong>
                      <p className="mt-2 text-[0.92rem] leading-7 text-[#6D7484]">{activeTile.subtitle}</p>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="mt-8">
                <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                  Step 1 | Choose subcategory
                </span>
                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {subcategoryCards.map((subcategory) => {
                    const isSelected = subcategory.id === selectedSubcategoryId;
                    return (
                      <button
                        key={subcategory.id}
                        type="button"
                        onClick={() => setSelectedSubcategoryId(subcategory.id)}
                        className={`rounded-[24px] border p-5 text-left transition ${
                          isSelected
                            ? "border-[#253B80] bg-[linear-gradient(180deg,rgba(37,59,128,0.08),rgba(255,255,255,0.94))] shadow-[0_18px_40px_rgba(37,59,128,0.12)]"
                            : "border-[#DCE3EF] bg-[rgba(255,252,247,0.92)] hover:-translate-y-1 hover:border-[#253B80]/30"
                        }`}
                      >
                        <strong className="block font-display text-[1.08rem] tracking-[-0.04em] text-[#0F1115]">
                          {subcategory.label}
                        </strong>
                        <p className="mt-3 text-[0.84rem] leading-6 text-[#6D7484]">{subcategory.guidance}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedSubcategoryId ? (
                <motion.section
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.42 }}
                  className="mt-8 rounded-[30px] border border-[#DCE3EF] bg-[linear-gradient(180deg,rgba(255,252,247,0.92),rgba(249,244,236,0.86))] p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                        Step 2 | Complete required package fields
                      </span>
                      <strong className="mt-2 block font-display text-[1.46rem] tracking-[-0.05em] text-[#0F1115]">
                        Build one listing package and add multiple feedstock items below
                      </strong>
                    </div>
                    {statusMessage ? (
                      <div className="rounded-[18px] border border-[#DCE3EF] bg-white/84 px-4 py-3 text-[0.86rem] leading-6 text-[#253B80]">
                        {statusMessage}
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <label className={getFieldShellClass(Boolean(getErrorMessage(packageErrors, "packageTitle", showPackageValidation)))}>
                      <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                        Listing package title
                      </span>
                      <input
                        value={packageTitle}
                        onChange={(event) => setPackageTitle(event.target.value)}
                        className={getInputClass(Boolean(getErrorMessage(packageErrors, "packageTitle", showPackageValidation)))}
                        placeholder="Example: Mixed approved motor lots"
                      />
                      {getErrorMessage(packageErrors, "packageTitle", showPackageValidation) ? (
                        <p className="mt-2 text-[0.8rem] leading-6 text-[#B16A1D]">
                          {getErrorMessage(packageErrors, "packageTitle", showPackageValidation)}
                        </p>
                      ) : null}
                    </label>

                    <label className={getFieldShellClass(Boolean(getErrorMessage(packageErrors, "evidenceNotes", showPackageValidation)))}>
                      <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                        Evidence and photos summary
                      </span>
                      <textarea
                        value={evidenceNotes}
                        onChange={(event) => setEvidenceNotes(event.target.value)}
                        className={getInputClass(
                          Boolean(getErrorMessage(packageErrors, "evidenceNotes", showPackageValidation)),
                          "min-h-[112px]",
                        )}
                        placeholder="Describe manifests, photos, teardown stage, release notes, and handling information."
                      />
                      {getErrorMessage(packageErrors, "evidenceNotes", showPackageValidation) ? (
                        <p className="mt-2 text-[0.8rem] leading-6 text-[#B16A1D]">
                          {getErrorMessage(packageErrors, "evidenceNotes", showPackageValidation)}
                        </p>
                      ) : null}
                    </label>
                  </div>

                  <div className="mt-6 rounded-[26px] border border-[#DCE3EF] bg-white/84 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                      <div>
                        <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                          Step 3 | Add feedstock item
                        </span>
                        <strong className="mt-2 block font-display text-[1.3rem] tracking-[-0.05em] text-[#0F1115]">
                          One item at a time, all fields required
                        </strong>
                      </div>
                      <span className="rounded-full border border-[#DCE3EF] bg-[#F8FAFD] px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#253B80]">
                        {selectedSubcategory?.label}
                      </span>
                    </div>

                    <div className="mt-5 rounded-[22px] border border-[#DCE3EF] bg-[rgba(248,250,253,0.82)] p-4">
                      <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[#6D7484]">
                        Do you know any details about the scrap?
                      </span>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {[
                          { value: "yes" as const, label: "Yes, I know the item details" },
                          { value: "no" as const, label: "No, platform review needed" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setDetailMode(option.value)}
                            className={`rounded-[18px] px-4 py-3 text-left text-[0.78rem] font-bold uppercase tracking-[0.12em] transition ${
                              detailMode === option.value
                                ? "bg-[#253B80] text-white"
                                : "border border-[#DCE3EF] bg-white text-[#0F1115] hover:border-[#253B80]"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                      {getErrorMessage(lineItemErrors, "detailMode", showLineItemValidation) ? (
                        <p className="mt-3 text-[0.8rem] leading-6 text-[#B16A1D]">
                          {getErrorMessage(lineItemErrors, "detailMode", showLineItemValidation)}
                        </p>
                      ) : null}
                    </div>

                    {detailMode === "yes" ? (
                      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <label
                          className={getFieldShellClass(
                            Boolean(getErrorMessage(lineItemErrors, "manufacturerSelect", showLineItemValidation)),
                          )}
                        >
                          <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                            Manufacturer dropdown
                          </span>
                          <select
                            value={manufacturerSelect}
                            onChange={(event) => {
                              const nextValue = event.target.value;
                              setManufacturerSelect(nextValue);
                              setModelSelect("");
                              setPartSelect("");
                              if (nextValue !== MANUAL_ENTRY_VALUE) {
                                setManufacturerManual("");
                                setModelManual("");
                                setPartManual("");
                              }
                            }}
                            className={getInputClass(
                              Boolean(getErrorMessage(lineItemErrors, "manufacturerSelect", showLineItemValidation)),
                            )}
                          >
                            <option value="">Select manufacturer</option>
                            {manufacturerOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                            <option value={MANUAL_ENTRY_VALUE}>Enter manually</option>
                          </select>
                          {getErrorMessage(lineItemErrors, "manufacturerSelect", showLineItemValidation) ? (
                            <p className="mt-2 text-[0.8rem] leading-6 text-[#B16A1D]">
                              {getErrorMessage(lineItemErrors, "manufacturerSelect", showLineItemValidation)}
                            </p>
                          ) : null}
                        </label>

                        {isManualEntry ? (
                          <>
                            <label
                              className={getFieldShellClass(
                                Boolean(getErrorMessage(lineItemErrors, "manufacturerManual", showLineItemValidation)),
                              )}
                            >
                              <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                                Type manufacturer
                              </span>
                              <input
                                value={manufacturerManual}
                                onChange={(event) => setManufacturerManual(event.target.value)}
                                className={getInputClass(
                                  Boolean(getErrorMessage(lineItemErrors, "manufacturerManual", showLineItemValidation)),
                                )}
                                placeholder="Type manufacturer name"
                              />
                              {getErrorMessage(lineItemErrors, "manufacturerManual", showLineItemValidation) ? (
                                <p className="mt-2 text-[0.8rem] leading-6 text-[#B16A1D]">
                                  {getErrorMessage(lineItemErrors, "manufacturerManual", showLineItemValidation)}
                                </p>
                              ) : null}
                            </label>

                            <label
                              className={getFieldShellClass(
                                Boolean(getErrorMessage(lineItemErrors, "modelManual", showLineItemValidation)),
                              )}
                            >
                              <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                                Type model family
                              </span>
                              <input
                                value={modelManual}
                                onChange={(event) => setModelManual(event.target.value)}
                                className={getInputClass(
                                  Boolean(getErrorMessage(lineItemErrors, "modelManual", showLineItemValidation)),
                                )}
                                placeholder="Type model family"
                              />
                              {getErrorMessage(lineItemErrors, "modelManual", showLineItemValidation) ? (
                                <p className="mt-2 text-[0.8rem] leading-6 text-[#B16A1D]">
                                  {getErrorMessage(lineItemErrors, "modelManual", showLineItemValidation)}
                                </p>
                              ) : null}
                            </label>

                            <label
                              className={getFieldShellClass(
                                Boolean(getErrorMessage(lineItemErrors, "partManual", showLineItemValidation)),
                              )}
                            >
                              <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                                Type part number
                              </span>
                              <input
                                value={partManual}
                                onChange={(event) => setPartManual(event.target.value)}
                                className={getInputClass(
                                  Boolean(getErrorMessage(lineItemErrors, "partManual", showLineItemValidation)),
                                )}
                                placeholder="Type part number"
                              />
                              {getErrorMessage(lineItemErrors, "partManual", showLineItemValidation) ? (
                                <p className="mt-2 text-[0.8rem] leading-6 text-[#B16A1D]">
                                  {getErrorMessage(lineItemErrors, "partManual", showLineItemValidation)}
                                </p>
                              ) : null}
                            </label>
                          </>
                        ) : (
                          <>
                            <label
                              className={getFieldShellClass(
                                Boolean(getErrorMessage(lineItemErrors, "modelSelect", showLineItemValidation)),
                              )}
                            >
                              <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                                Model family dropdown
                              </span>
                              <select
                                value={modelSelect}
                                onChange={(event) => {
                                  setModelSelect(event.target.value);
                                  setPartSelect("");
                                }}
                                disabled={!manufacturerSelect}
                                className={getInputClass(
                                  Boolean(getErrorMessage(lineItemErrors, "modelSelect", showLineItemValidation)),
                                  "disabled:cursor-not-allowed disabled:opacity-50",
                                )}
                              >
                                <option value="">Select model family</option>
                                {modelOptions.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                              {getErrorMessage(lineItemErrors, "modelSelect", showLineItemValidation) ? (
                                <p className="mt-2 text-[0.8rem] leading-6 text-[#B16A1D]">
                                  {getErrorMessage(lineItemErrors, "modelSelect", showLineItemValidation)}
                                </p>
                              ) : null}
                            </label>

                            <label
                              className={getFieldShellClass(
                                Boolean(getErrorMessage(lineItemErrors, "partSelect", showLineItemValidation)),
                              )}
                            >
                              <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                                Part number dropdown
                              </span>
                              <select
                                value={partSelect}
                                onChange={(event) => setPartSelect(event.target.value)}
                                disabled={!manufacturerSelect || !modelSelect}
                                className={getInputClass(
                                  Boolean(getErrorMessage(lineItemErrors, "partSelect", showLineItemValidation)),
                                  "disabled:cursor-not-allowed disabled:opacity-50",
                                )}
                              >
                                <option value="">Select part number</option>
                                {partOptions.map((option) => (
                                  <option key={option.id} value={option.id}>
                                    {option.partNumber}
                                  </option>
                                ))}
                              </select>
                              {getErrorMessage(lineItemErrors, "partSelect", showLineItemValidation) ? (
                                <p className="mt-2 text-[0.8rem] leading-6 text-[#B16A1D]">
                                  {getErrorMessage(lineItemErrors, "partSelect", showLineItemValidation)}
                                </p>
                              ) : null}
                            </label>
                          </>
                        )}
                      </div>
                    ) : null}

                    {detailMode === "no" ? (
                      <label
                        className={`mt-4 block ${getFieldShellClass(
                          Boolean(getErrorMessage(lineItemErrors, "observedIdentifier", showLineItemValidation)),
                        )}`}
                      >
                        <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                          Best observed identifier
                        </span>
                        <input
                          value={observedIdentifier}
                          onChange={(event) => setObservedIdentifier(event.target.value)}
                          className={getInputClass(
                            Boolean(getErrorMessage(lineItemErrors, "observedIdentifier", showLineItemValidation)),
                          )}
                          placeholder="Example: nameplate fragment, stamp, release code, or visual marker"
                        />
                        {getErrorMessage(lineItemErrors, "observedIdentifier", showLineItemValidation) ? (
                          <p className="mt-2 text-[0.8rem] leading-6 text-[#B16A1D]">
                            {getErrorMessage(lineItemErrors, "observedIdentifier", showLineItemValidation)}
                          </p>
                        ) : null}
                      </label>
                    ) : null}

                    <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      <label
                        className={getFieldShellClass(
                          Boolean(getErrorMessage(lineItemErrors, "floorPriceKg", showLineItemValidation)),
                        )}
                      >
                        <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                          Supplier floor price / kg
                        </span>
                        <input
                          value={floorPriceKg}
                          onChange={(event) => setFloorPriceKg(event.target.value)}
                          className={getInputClass(
                            Boolean(getErrorMessage(lineItemErrors, "floorPriceKg", showLineItemValidation)),
                          )}
                          placeholder="Example: $2.95"
                        />
                        {getErrorMessage(lineItemErrors, "floorPriceKg", showLineItemValidation) ? (
                          <p className="mt-2 text-[0.8rem] leading-6 text-[#B16A1D]">
                            {getErrorMessage(lineItemErrors, "floorPriceKg", showLineItemValidation)}
                          </p>
                        ) : null}
                      </label>

                      <label
                        className={getFieldShellClass(
                          Boolean(getErrorMessage(lineItemErrors, "quantityKg", showLineItemValidation)),
                        )}
                      >
                        <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                          Quantity in kg
                        </span>
                        <input
                          value={quantityKg}
                          onChange={(event) => setQuantityKg(event.target.value)}
                          className={getInputClass(
                            Boolean(getErrorMessage(lineItemErrors, "quantityKg", showLineItemValidation)),
                          )}
                          placeholder="Example: 12000"
                        />
                        {getErrorMessage(lineItemErrors, "quantityKg", showLineItemValidation) ? (
                          <p className="mt-2 text-[0.8rem] leading-6 text-[#B16A1D]">
                            {getErrorMessage(lineItemErrors, "quantityKg", showLineItemValidation)}
                          </p>
                        ) : null}
                      </label>

                      <label className="rounded-[24px] border border-[#DCE3EF] bg-white p-4">
                        <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                          Condition
                        </span>
                        <select
                          value={condition}
                          onChange={(event) => setCondition(event.target.value)}
                          className="mt-3 w-full rounded-[18px] border border-[#DCE3EF] bg-white px-4 py-3 text-[0.95rem] text-[#0F1115] outline-none transition focus:border-[#253B80]"
                        >
                          {conditionOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="rounded-[24px] border border-[#DCE3EF] bg-white p-4">
                        <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                          Packaging
                        </span>
                        <select
                          value={packaging}
                          onChange={(event) => setPackaging(event.target.value)}
                          className="mt-3 w-full rounded-[18px] border border-[#DCE3EF] bg-white px-4 py-3 text-[0.95rem] text-[#0F1115] outline-none transition focus:border-[#253B80]"
                        >
                          {packagingOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>

                      {familyId === "specialized-products" ? (
                        <>
                          <label className="rounded-[24px] border border-[#DCE3EF] bg-white p-4">
                            <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                              Authorization status
                            </span>
                            <select
                              value={authorization}
                              onChange={(event) => setAuthorization(event.target.value)}
                              className="mt-3 w-full rounded-[18px] border border-[#DCE3EF] bg-white px-4 py-3 text-[0.95rem] text-[#0F1115] outline-none transition focus:border-[#253B80]"
                            >
                              {authorizationOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </label>

                          <label className="rounded-[24px] border border-[#DCE3EF] bg-white p-4">
                            <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                              Release path
                            </span>
                            <select
                              value={releasePath}
                              onChange={(event) => setReleasePath(event.target.value)}
                              className="mt-3 w-full rounded-[18px] border border-[#DCE3EF] bg-white px-4 py-3 text-[0.95rem] text-[#0F1115] outline-none transition focus:border-[#253B80]"
                            >
                              {releasePathOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </label>
                        </>
                      ) : null}
                    </div>

                    <div className="mt-4 rounded-[22px] border border-[#DCE3EF] bg-[rgba(248,250,253,0.82)] px-4 py-4">
                      <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[#6D7484]">
                        Platform pricing guidance
                      </span>
                      <p className={`mt-2 text-[0.92rem] leading-6 ${isBelowPlatformRange ? "text-[#B16A1D]" : "text-[#253B80]"}`}>
                        {typeof platformEstimate === "number"
                          ? isBelowPlatformRange
                            ? "Entered floor appears below the platform's protected range for this item. After you add it, choose whether to list at your floor or open a recycler bid."
                            : "Entered floor is within a workable supplier range. Exact pricing logic remains hidden."
                          : "Complete the item details to let Rare Earth Rescue assess the supplier floor."}
                      </p>
                    </div>

                    {showLineItemValidation && Object.keys(lineItemErrors).length > 0 ? (
                      <div className="mt-4 rounded-[22px] border border-[#E7C98A] bg-[rgba(255,249,238,0.92)] px-4 py-4">
                        <p className="text-[0.9rem] leading-7 text-[#7C5A18]">
                          Finish every required Step 3 field before the item can move into Package items.
                        </p>
                      </div>
                    ) : null}

                    <div className="mt-5">
                      <button className="button-primary" type="button" onClick={addLineItem}>
                        Add feedstock item
                      </button>
                    </div>
                  </div>
                </motion.section>
              ) : null}

              <section className="mt-8 rounded-[28px] border border-[#DCE3EF] bg-white/82 p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                      Step 4 | Package items
                    </span>
                    <strong className="mt-2 block font-display text-[1.35rem] tracking-[-0.05em] text-[#0F1115]">
                      Multiple feedstock items can be grouped into one listing package
                    </strong>
                  </div>
                  <span className="rounded-full border border-[#DCE3EF] bg-[#F8FAFD] px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#253B80]">
                    {lineItems.length} items
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  {lineItems.length === 0 ? (
                    <div
                      className={`rounded-[22px] border border-dashed px-5 py-6 text-[0.92rem] leading-7 ${
                        getErrorMessage(packageErrors, "lineItems", showPackageValidation)
                          ? "border-[#E7C98A] bg-[rgba(255,249,238,0.92)] text-[#7C5A18]"
                          : "border-[#DCE3EF] bg-[rgba(248,250,253,0.8)] text-[#6D7484]"
                      }`}
                    >
                      {getErrorMessage(packageErrors, "lineItems", showPackageValidation) ??
                        "Add at least one complete feedstock item. All sections are mandatory before the package can be saved, recommended, or listed."}
                    </div>
                  ) : (
                    lineItems.map((item, index) => (
                      <motion.article
                        key={item.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: index * 0.05 }}
                        className="rounded-[22px] border border-[#DCE3EF] bg-[rgba(255,252,247,0.9)] px-4 py-4"
                      >
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                          <div>
                            <strong className="block font-display text-[1.04rem] tracking-[-0.04em] text-[#0F1115]">
                              {item.subcategoryLabel} | {item.manufacturer}
                            </strong>
                            <p className="mt-1 text-[0.84rem] leading-6 text-[#6D7484]">
                              {item.modelFamily} | {item.partNumber}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-full border border-[#DCE3EF] bg-white px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#253B80]">
                              {item.quantityKg} kg
                            </span>
                            <span className="rounded-full border border-[#DCE3EF] bg-white px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#253B80]">
                              {item.floorPriceKg}/kg
                            </span>
                            <span className="rounded-full border border-[#DCE3EF] bg-white px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#253B80]">
                              {item.isBelowRange ? "Below range" : "Within range"}
                            </span>
                          </div>
                        </div>
                      </motion.article>
                    ))
                  )}
                </div>

                {showPackageValidation &&
                (getErrorMessage(packageErrors, "packageTitle", true) ||
                  getErrorMessage(packageErrors, "evidenceNotes", true) ||
                  getErrorMessage(packageErrors, "lineItems", true)) ? (
                  <div className="mt-5 rounded-[22px] border border-[#E7C98A] bg-[rgba(255,249,238,0.92)] px-4 py-4">
                    <p className="text-[0.9rem] leading-7 text-[#7C5A18]">
                      {getErrorMessage(packageErrors, "lineItems", true) ??
                        "Complete the package title and evidence summary before continuing."}
                    </p>
                  </div>
                ) : null}

                <div className="mt-6 flex flex-wrap gap-3">
                  <button className="button-secondary" type="button" onClick={handleSaveDraft}>
                    Save draft
                  </button>
                  <button className="button-secondary" type="button" onClick={handleOpenRecommendation}>
                    Get bidding recommendation
                  </button>
                  <button className="button-primary" type="button" onClick={handleListAtSpecifiedFloor}>
                    List at specified floor price
                  </button>
                </div>

                {anyBelowRange ? (
                  <div className="mt-4 rounded-[22px] border border-[#E7C98A] bg-[rgba(255,249,238,0.92)] p-4">
                    <p className="text-[0.9rem] leading-7 text-[#7C5A18]">
                      One or more items are below the platform-protected range. Choose either{" "}
                      <span className="font-semibold text-[#0F1115]">List at specified floor price</span> or{" "}
                      <span className="font-semibold text-[#0F1115]">Get bidding recommendation</span> to open a competitive recycler bid.
                    </p>
                  </div>
                ) : null}
              </section>
            </motion.section>
          )}

          <section className="mt-10 rounded-[34px] border border-[#DCE3EF] bg-white/84 p-6 shadow-[0_24px_70px_rgba(46,41,31,0.07)]">
            <div className="flex flex-col gap-2">
              <p className="eyebrow">FAQ</p>
              <h2 className="font-display text-[clamp(2rem,3vw,3rem)] leading-[0.96] tracking-[-0.06em] text-[#0F1115]">
                Supplier listing guidance
              </h2>
            </div>

            <div className="mt-6 grid gap-3">
              {faqItems.map((item, index) => (
                <motion.details
                  key={item.question}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className="group rounded-[24px] border border-[#DCE3EF] bg-[rgba(255,252,247,0.9)] p-5"
                >
                  <summary className="cursor-pointer list-none font-display text-[1.06rem] tracking-[-0.04em] text-[#0F1115]">
                    {item.question}
                  </summary>
                  <p className="mt-3 max-w-[60rem] text-[0.92rem] leading-7 text-[#6D7484]">{item.answer}</p>
                </motion.details>
              ))}
            </div>
          </section>
        </div>

        <AnimatePresence>
          {isRecommendationOpen ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F1115]/46 px-4"
            >
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.98 }}
                transition={{ duration: 0.28 }}
                className="w-full max-w-3xl rounded-[32px] border border-[#DCE3EF] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,241,232,0.95))] p-6 shadow-[0_32px_120px_rgba(15,17,21,0.24)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow">Bidding recommendation</p>
                    <h3 className="font-display text-[2rem] leading-[0.96] tracking-[-0.06em] text-[#0F1115]">
                      Protected pricing guidance for this listing package
                    </h3>
                    <p className="mt-3 max-w-[42rem] text-[0.94rem] leading-7 text-[#6D7484]">
                      This recommendation is based on category, equipment detail, current recycler pull, and your submitted floor prices. The platform never reveals the backend composition model directly.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsRecommendationOpen(false)}
                    aria-label="Close recommendation"
                    className="grid h-10 w-10 place-items-center rounded-full border border-[#DCE3EF] bg-white/84 text-[1.2rem] font-bold text-[#0F1115] transition hover:border-[#253B80] hover:text-[#253B80]"
                  >
                    ×
                  </button>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-[22px] border border-[#DCE3EF] bg-white/86 p-4">
                    <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[#6D7484]">
                      Listed floor price
                    </span>
                    <p className="mt-2 font-display text-[1.3rem] tracking-[-0.05em] text-[#0F1115]">
                      {averageFloor ? currency(averageFloor) : "N/A"}
                    </p>
                  </div>
                  <div className="rounded-[22px] border border-[#DCE3EF] bg-white/86 p-4">
                    <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[#6D7484]">
                      Bid spread
                    </span>
                    <p className="mt-2 font-display text-[1.1rem] tracking-[-0.05em] text-[#253B80]">
                      {averageFloor ? `${bidSpreadLowPct}% to +${bidSpreadHighPct}%` : "Add items first"}
                    </p>
                  </div>
                  <div className="rounded-[22px] border border-[#DCE3EF] bg-white/86 p-4">
                    <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[#6D7484]">
                      Min qty recommended
                    </span>
                    <p className="mt-2 font-display text-[1.3rem] tracking-[-0.05em] text-[#0F1115]">
                      {minRecommendedQty ? `${minRecommendedQty.toLocaleString()} kg` : "N/A"}
                    </p>
                  </div>
                  <div className="rounded-[22px] border border-[#DCE3EF] bg-white/86 p-4">
                    <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[#6D7484]">
                      Demand hotspots
                    </span>
                    <p className="mt-2 text-[0.88rem] leading-6 text-[#0F1115]">{demandHotspots.join(" | ") || "N/A"}</p>
                  </div>
                </div>

                <div className="mt-5 rounded-[22px] border border-[#DCE3EF] bg-[rgba(248,250,253,0.84)] p-4">
                  <p className="text-[0.92rem] leading-7 text-[#6D7484]">
                    {anyBelowRange
                      ? "At least one feedstock item is below the platform's protected range. You can still list it at the specified floor, or open a recycler bid to test stronger pricing."
                      : "The package is within a workable listing range. A live recycler bid may still improve price discovery if you want broader demand tension."}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="button-primary"
                    onClick={() => {
                      persistPackage("live-bid");
                      setIsRecommendationOpen(false);
                      navigate("/dashboard/supplier/listings");
                    }}
                  >
                    Create bid for recyclers
                  </button>
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={() => setIsRecommendationOpen(false)}
                  >
                    Keep editing
                  </button>
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>
    </motion.main>
  );
}
