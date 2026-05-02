import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AppImage } from "../components/ui/AppImage";
import { DashboardSourceId, dashboardMaterialTiles } from "../data/dashboardMarketplaceData";
import { SupplyFamilyListingDatabase, supplierListingDatabase } from "../data/supplierListingDatabase";
import { pageEnter } from "../lib/motion";

const pageMotionProps = {
  variants: pageEnter,
  initial: "hidden" as const,
  animate: "visible" as const,
  exit: "exit" as const,
};

type FamilyKey = DashboardSourceId | "custom";
type SupplierAction = "list-at-floor" | "create-bid";

type StagedListing = {
  id: string;
  familyLabel: string;
  subcategoryLabel: string;
  manufacturer: string;
  modelFamily: string;
  partNumber: string;
  quantityKg: string;
  enteredFloor: string;
  action: SupplierAction;
};

const customTile = {
  id: "custom" as const,
  title: "Custom Listing",
  subtitle: "Use a guided path for equipment that does not map to the standard rare-earth scrap families",
  image:
    "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1400&q=80",
};

const faqItems = [
  {
    question: "How does Rare Earth Rescue determine whether my floor is low?",
    answer:
      "The platform checks the subcategory, manufacturer, part number, condition, and evidence you provide against an internal materials database. It does not reveal the composition model or pricing calculation back to the supplier.",
  },
  {
    question: "What happens if my floor price is below the platform range?",
    answer:
      "You will see two choices: keep the lower floor and list directly, or create a live bid to test buyer demand without exposing the platform's pricing output.",
  },
  {
    question: "Why is quantity entered in kilograms?",
    answer:
      "Supplier listing intake is standardized in kilograms so the backend pricing and recovery logic can compare lots consistently across families and subcategories.",
  },
  {
    question: "What is the custom listing path for?",
    answer:
      "Custom listing is for equipment that does not clearly fit into a standard family. The platform still collects structured details so it can classify the lane and return a protected pricing recommendation.",
  },
];

const packagingOptions = ["Palletized", "Gaylords", "Drummed", "Loose units", "Containerized"];
const conditionOptions = ["Intact", "Dismantled", "Damaged", "Shredded fraction", "Mixed condition"];

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
  "mri-ge-signa": 46000,
  "mri-siemens-skyra": 58000,
  "mri-fonar-open": 27500,
  "other-fanuc-actuator": 4.24,
  "other-eppendorf-spin": 2.36,
  "other-thk-linear": 2.74,
};

function getFamilyRecord(familyId: FamilyKey | undefined): SupplyFamilyListingDatabase | null {
  if (!familyId || familyId === "custom") {
    return null;
  }
  return supplierListingDatabase.find((record) => record.familyId === familyId) ?? null;
}

function createListingId() {
  return `listing-${Math.random().toString(36).slice(2, 10)}`;
}

function toCurrencyValue(value: string) {
  const normalized = value.replace(/[^0-9.]/g, "");
  return normalized ? Number(normalized) : NaN;
}

export function SupplierCreateBidPage() {
  const params = useParams<{ familyId?: string }>();
  const familyId = (params.familyId as FamilyKey | undefined) ?? undefined;
  const isSelectionPage = !familyId;
  const familyRecord = getFamilyRecord(familyId);
  const activeTile =
    familyId === "custom"
      ? customTile
      : dashboardMaterialTiles.find((tile) => tile.id === familyId) ?? null;

  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
  const [selectedManufacturer, setSelectedManufacturer] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedPartId, setSelectedPartId] = useState("");
  const [listingTitle, setListingTitle] = useState("");
  const [quantityKg, setQuantityKg] = useState("");
  const [enteredFloor, setEnteredFloor] = useState("");
  const [packaging, setPackaging] = useState(packagingOptions[0]);
  const [condition, setCondition] = useState(conditionOptions[0]);
  const [evidenceNotes, setEvidenceNotes] = useState("");
  const [stagedListings, setStagedListings] = useState<StagedListing[]>([]);

  const subcategoryCards =
    familyId === "custom"
      ? [
          {
            id: "custom-listing",
            label: "Custom listing",
            guidance: "Use this path when your equipment needs platform review before it can be matched to a standard lane.",
          },
        ]
      : (familyRecord?.subcategories ?? []).map((subcategory) => ({
          id: subcategory.id,
          label: subcategory.label,
          guidance: subcategory.guidance,
        }));

  const selectedSubcategory =
    familyId === "custom"
      ? selectedSubcategoryId === "custom-listing"
        ? { id: "custom-listing", label: "Custom listing", partRecords: [] as never[] }
        : null
      : familyRecord?.subcategories.find((subcategory) => subcategory.id === selectedSubcategoryId) ?? null;

  const manufacturerOptions = useMemo(() => {
    if (!selectedSubcategory || familyId === "custom" || !("partRecords" in selectedSubcategory)) {
      return [];
    }
    return [...new Set(selectedSubcategory.partRecords.map((record) => record.manufacturer))];
  }, [familyId, selectedSubcategory]);

  const modelOptions = useMemo(() => {
    if (!selectedSubcategory || familyId === "custom" || !selectedManufacturer || !("partRecords" in selectedSubcategory)) {
      return [];
    }
    return [
      ...new Set(
        selectedSubcategory.partRecords
          .filter((record) => record.manufacturer === selectedManufacturer)
          .map((record) => record.modelFamily),
      ),
    ];
  }, [familyId, selectedManufacturer, selectedSubcategory]);

  const partOptions = useMemo(() => {
    if (!selectedSubcategory || familyId === "custom" || !selectedManufacturer || !selectedModel || !("partRecords" in selectedSubcategory)) {
      return [];
    }
    return selectedSubcategory.partRecords.filter(
      (record) => record.manufacturer === selectedManufacturer && record.modelFamily === selectedModel,
    );
  }, [familyId, selectedManufacturer, selectedModel, selectedSubcategory]);

  useEffect(() => {
    setSelectedSubcategoryId("");
    setSelectedManufacturer("");
    setSelectedModel("");
    setSelectedPartId("");
    setListingTitle("");
    setQuantityKg("");
    setEnteredFloor("");
    setPackaging(packagingOptions[0]);
    setCondition(conditionOptions[0]);
    setEvidenceNotes("");
  }, [familyId]);

  useEffect(() => {
    setSelectedManufacturer("");
    setSelectedModel("");
    setSelectedPartId("");
    setListingTitle("");
    setQuantityKg("");
    setEnteredFloor("");
    setPackaging(packagingOptions[0]);
    setCondition(conditionOptions[0]);
    setEvidenceNotes("");
  }, [selectedSubcategoryId]);

  useEffect(() => {
    if (partOptions.length === 1) {
      setSelectedPartId(partOptions[0].id);
    }
  }, [partOptions]);

  const estimatedFloor =
    familyId === "custom"
      ? null
      : selectedPartId
        ? platformEstimatedFloorByPart[selectedPartId] ?? null
        : null;

  const enteredFloorNumber = toCurrencyValue(enteredFloor);
  const isBelowPlatformRange =
    typeof estimatedFloor === "number" && Number.isFinite(enteredFloorNumber) && enteredFloorNumber < estimatedFloor;

  const pricingGuidance = isBelowPlatformRange
    ? "This floor is below the platform's protected pricing range for the selected feedstock."
    : Number.isFinite(enteredFloorNumber)
      ? "This floor can move forward without exposing the platform's pricing model."
      : "Enter a supplier floor price to receive pricing guidance.";

  const handleStageListing = (action: SupplierAction) => {
    if (!selectedSubcategoryId || !quantityKg || !enteredFloor) {
      return;
    }

    setStagedListings((current) => [
      ...current,
      {
        id: createListingId(),
        familyLabel: activeTile?.title ?? "Listing",
        subcategoryLabel: selectedSubcategory?.label ?? "Selected subcategory",
        manufacturer: selectedManufacturer || "Platform-reviewed",
        modelFamily: selectedModel || "Platform-reviewed",
        partNumber: selectedPartId || "Platform-reviewed",
        quantityKg,
        enteredFloor,
        action,
      },
    ]);
  };

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
              <p className="mt-4 max-w-[42rem] text-[0.98rem] leading-7 text-[#6D7484]">
                Start with the category. Rare Earth Rescue will open a dedicated listing workflow on the next page, then use subcategory and equipment details to guide pricing without revealing the underlying composition logic.
              </p>

              <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {[...dashboardMaterialTiles, customTile].map((tile) => (
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
                Select a subcategory to unlock the supplier listing form.
              </h1>
              <p className="mt-4 max-w-[44rem] text-[0.98rem] leading-7 text-[#6D7484]">
                Once you click a subcategory, Rare Earth Rescue will open a dropdown-led form that maps your listing to its backend materials database and checks the supplier floor you enter.
              </p>

              {activeTile ? (
                <div className="mt-6 rounded-[26px] border border-[#DCE3EF] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(247,241,232,0.84))] p-4">
                  <div className="grid gap-4 md:grid-cols-[200px_minmax(0,1fr)]">
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
                  Subcategories
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
                        Supplier form
                      </span>
                      <strong className="mt-2 block font-display text-[1.46rem] tracking-[-0.05em] text-[#0F1115]">
                        Enter supplier-visible details for platform-assisted pricing
                      </strong>
                    </div>
                    <div className="rounded-[22px] border border-[#DCE3EF] bg-white/84 px-4 py-4 lg:min-w-[320px]">
                      <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[#6D7484]">
                        Pricing guidance
                      </span>
                      <p className={`mt-2 text-[0.92rem] leading-6 ${isBelowPlatformRange ? "text-[#B16A1D]" : "text-[#253B80]"}`}>
                        {pricingGuidance}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <label className="rounded-[24px] border border-[#DCE3EF] bg-white/84 p-4">
                      <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                        Listing title
                      </span>
                      <input
                        value={listingTitle}
                        onChange={(event) => setListingTitle(event.target.value)}
                        className="mt-3 w-full rounded-[18px] border border-[#DCE3EF] bg-white px-4 py-3 text-[0.95rem] text-[#0F1115] outline-none transition focus:border-[#253B80]"
                        placeholder="Example: Buyer-ready motor lot"
                      />
                    </label>

                    <label className="rounded-[24px] border border-[#DCE3EF] bg-white/84 p-4">
                      <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                        Manufacturer
                      </span>
                      <select
                        value={selectedManufacturer}
                        onChange={(event) => setSelectedManufacturer(event.target.value)}
                        className="mt-3 w-full rounded-[18px] border border-[#DCE3EF] bg-white px-4 py-3 text-[0.95rem] text-[#0F1115] outline-none transition focus:border-[#253B80]"
                      >
                        <option value="">Select manufacturer</option>
                        {(familyId === "custom" ? ["Custom / not listed"] : manufacturerOptions).map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="rounded-[24px] border border-[#DCE3EF] bg-white/84 p-4">
                      <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                        Model family
                      </span>
                      <select
                        value={selectedModel}
                        onChange={(event) => setSelectedModel(event.target.value)}
                        className="mt-3 w-full rounded-[18px] border border-[#DCE3EF] bg-white px-4 py-3 text-[0.95rem] text-[#0F1115] outline-none transition focus:border-[#253B80]"
                      >
                        <option value="">Select model family</option>
                        {(familyId === "custom" ? ["Supplier-defined model family"] : modelOptions).map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="rounded-[24px] border border-[#DCE3EF] bg-white/84 p-4">
                      <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                        Part number
                      </span>
                      <select
                        value={selectedPartId}
                        onChange={(event) => setSelectedPartId(event.target.value)}
                        className="mt-3 w-full rounded-[18px] border border-[#DCE3EF] bg-white px-4 py-3 text-[0.95rem] text-[#0F1115] outline-none transition focus:border-[#253B80]"
                      >
                        <option value="">Select part number</option>
                        {(familyId === "custom" ? [{ id: "custom", partNumber: "Custom / platform reviewed" }] : partOptions).map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.partNumber}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="rounded-[24px] border border-[#DCE3EF] bg-white/84 p-4">
                      <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                        Supplier floor price / kg
                      </span>
                      <input
                        value={enteredFloor}
                        onChange={(event) => setEnteredFloor(event.target.value)}
                        className="mt-3 w-full rounded-[18px] border border-[#DCE3EF] bg-white px-4 py-3 text-[0.95rem] text-[#0F1115] outline-none transition focus:border-[#253B80]"
                        placeholder="Example: $2.95"
                      />
                    </label>

                    <label className="rounded-[24px] border border-[#DCE3EF] bg-white/84 p-4">
                      <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                        Quantity in kg
                      </span>
                      <input
                        value={quantityKg}
                        onChange={(event) => setQuantityKg(event.target.value)}
                        className="mt-3 w-full rounded-[18px] border border-[#DCE3EF] bg-white px-4 py-3 text-[0.95rem] text-[#0F1115] outline-none transition focus:border-[#253B80]"
                        placeholder="Example: 12000"
                      />
                    </label>

                    <label className="rounded-[24px] border border-[#DCE3EF] bg-white/84 p-4">
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

                    <label className="rounded-[24px] border border-[#DCE3EF] bg-white/84 p-4">
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
                  </div>

                  <label className="mt-4 block rounded-[24px] border border-[#DCE3EF] bg-white/84 p-4">
                    <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                      Pictures and evidence notes
                    </span>
                    <textarea
                      value={evidenceNotes}
                      onChange={(event) => setEvidenceNotes(event.target.value)}
                      className="mt-3 min-h-[110px] w-full rounded-[18px] border border-[#DCE3EF] bg-white px-4 py-3 text-[0.95rem] text-[#0F1115] outline-none transition focus:border-[#253B80]"
                      placeholder="Describe uploaded photos, manifests, teardown stage, or anything that helps the platform assist pricing."
                    />
                  </label>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {isBelowPlatformRange ? (
                      <>
                        <button className="button-secondary" onClick={() => handleStageListing("list-at-floor")} type="button">
                          List at floor price
                        </button>
                        <button className="button-primary" onClick={() => handleStageListing("create-bid")} type="button">
                          Create bid
                        </button>
                      </>
                    ) : (
                      <button className="button-primary" onClick={() => handleStageListing("list-at-floor")} type="button">
                        Save listing draft
                      </button>
                    )}
                  </div>
                </motion.section>
              ) : null}

              <section className="mt-8 rounded-[28px] border border-[#DCE3EF] bg-white/82 p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                      Multi-listing package
                    </span>
                    <strong className="mt-2 block font-display text-[1.35rem] tracking-[-0.05em] text-[#0F1115]">
                      Listings staged from this category workflow
                    </strong>
                  </div>
                  <span className="rounded-full border border-[#DCE3EF] bg-[#F8FAFD] px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#253B80]">
                    {stagedListings.length} staged
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  {stagedListings.length === 0 ? (
                    <div className="rounded-[22px] border border-dashed border-[#DCE3EF] bg-[rgba(248,250,253,0.8)] px-5 py-6 text-[0.92rem] leading-7 text-[#6D7484]">
                      No staged listings yet. Click a subcategory above to unlock the workflow and start building supplier-ready lots.
                    </div>
                  ) : (
                    stagedListings.map((listing, index) => (
                      <motion.article
                        key={listing.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: index * 0.05 }}
                        className="rounded-[22px] border border-[#DCE3EF] bg-[rgba(255,252,247,0.9)] px-4 py-4"
                      >
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                          <div>
                            <strong className="block font-display text-[1.04rem] tracking-[-0.04em] text-[#0F1115]">
                              {listing.subcategoryLabel} | {listing.manufacturer}
                            </strong>
                            <p className="mt-1 text-[0.84rem] leading-6 text-[#6D7484]">
                              {listing.modelFamily} | {listing.partNumber}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-full border border-[#DCE3EF] bg-white px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#253B80]">
                              {listing.quantityKg} kg
                            </span>
                            <span className="rounded-full border border-[#DCE3EF] bg-white px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#253B80]">
                              {listing.enteredFloor} / kg
                            </span>
                            <span className="rounded-full border border-[#DCE3EF] bg-white px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#253B80]">
                              {listing.action === "create-bid" ? "Create bid" : "List at floor"}
                            </span>
                          </div>
                        </div>
                      </motion.article>
                    ))
                  )}
                </div>
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
      </section>
    </motion.main>
  );
}
