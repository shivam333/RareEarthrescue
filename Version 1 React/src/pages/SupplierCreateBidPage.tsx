import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AppImage } from "../components/ui/AppImage";
import { DashboardSourceId, dashboardMaterialTiles } from "../data/dashboardMarketplaceData";
import { ScrapPartRecord, SupplyFamilyListingDatabase, supplierListingDatabase } from "../data/supplierListingDatabase";
import { pageEnter } from "../lib/motion";

const pageMotionProps = {
  variants: pageEnter,
  initial: "hidden" as const,
  animate: "visible" as const,
  exit: "exit" as const,
};

type PricingMode = "manual" | "optimum";
type FamilyKey = DashboardSourceId | "custom";

type StagedListing = {
  id: string;
  familyLabel: string;
  subcategoryLabel: string;
  manufacturer: string;
  modelFamily: string;
  partNumber: string;
  quantity: string;
  pricingMode: PricingMode;
  manualPrice: string;
  recommendedFloor: string;
};

type CustomFamilyTile = {
  id: "custom";
  title: string;
  subtitle: string;
  image: string;
};

const customTile: CustomFamilyTile = {
  id: "custom",
  title: "Custom Listing",
  subtitle: "Create a guided listing for equipment not yet matched to a standard source family",
  image:
    "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1400&q=80",
};

const faqItems = [
  {
    question: "How does the workflow decide my floor price?",
    answer:
      "Rare Earth Rescue uses the selected equipment family, matched manufacturer details, supplier notes, and listing evidence to estimate a recommended floor without exposing the underlying composition model.",
  },
  {
    question: "Can I still enter my own listing price?",
    answer:
      "Yes. Suppliers can accept the recommended floor or override it with a manual listing price when they already understand lane economics and buyer appetite.",
  },
  {
    question: "What if my equipment does not match the database exactly?",
    answer:
      "Use the custom listing path. It captures the right form inputs for backend review so the platform can still recommend pricing and classify the listing before launch.",
  },
  {
    question: "Why does the platform ask for dropdowns first?",
    answer:
      "Structured selection helps Rare Earth Rescue map the listing to known manufacturing patterns and recoverable-material assumptions, which reduces generic scrap discounting in market.",
  },
];

const packagingOptions = ["Palletized", "Gaylords", "Drummed", "Loose units", "Containerized"];
const conditionOptions = ["Intact", "Dismantled", "Damaged", "Shredded fraction", "Mixed condition"];

const recommendedFloorByPart: Record<string, string> = {
  "hdd-seagate-exos": "$2.42 / kg recommended floor",
  "hdd-wd-ultrastar": "$2.35 / kg recommended floor",
  "hdd-toshiba-magnet-pack": "$3.18 / kg recommended floor",
  "hdd-shred-mix": "$1.86 / kg recommended floor",
  "auto-tesla-drive-unit": "$3.94 / kg recommended floor",
  "auto-gm-ultium": "$3.72 / kg recommended floor",
  "auto-toyota-prius": "$3.31 / kg recommended floor",
  "auto-bosch-ebike": "$2.88 / kg recommended floor",
  "ind-jtekt-steering": "$2.94 / kg recommended floor",
  "ind-dyson-v11": "$2.12 / kg recommended floor",
  "ind-siemens-servo": "$3.26 / kg recommended floor",
  "ind-vestas-wind": "$3.44 / kg recommended floor",
  "mri-ge-signa": "$46,000 / unit recommended floor",
  "mri-siemens-skyra": "$58,000 / unit recommended floor",
  "mri-fonar-open": "$27,500 / unit recommended floor",
  "other-fanuc-actuator": "$4.24 / kg recommended floor",
  "other-eppendorf-spin": "$2.36 / kg recommended floor",
  "other-thk-linear": "$2.74 / kg recommended floor",
};

function getFamilyRecord(familyId: string | null): SupplyFamilyListingDatabase | null {
  return supplierListingDatabase.find((record) => record.familyId === familyId) ?? null;
}

function createListingId() {
  return `listing-${Math.random().toString(36).slice(2, 10)}`;
}

export function SupplierCreateBidPage() {
  const [searchParams] = useSearchParams();
  const familyQuery = searchParams.get("family");
  const selectedFamilyKey: FamilyKey =
    familyQuery === "custom"
      ? "custom"
      : ((familyQuery as DashboardSourceId | null) ?? dashboardMaterialTiles[0]?.id ?? "hdd");

  const familyRecord = getFamilyRecord(selectedFamilyKey === "custom" ? null : selectedFamilyKey);
  const familyTiles = [...dashboardMaterialTiles, customTile];

  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
  const [selectedManufacturer, setSelectedManufacturer] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedPartId, setSelectedPartId] = useState("");
  const [listingTitle, setListingTitle] = useState("");
  const [quantity, setQuantity] = useState("");
  const [pricingMode, setPricingMode] = useState<PricingMode>("manual");
  const [manualPrice, setManualPrice] = useState("");
  const [packaging, setPackaging] = useState(packagingOptions[0]);
  const [condition, setCondition] = useState(conditionOptions[0]);
  const [evidenceNotes, setEvidenceNotes] = useState("");
  const [stagedListings, setStagedListings] = useState<StagedListing[]>([]);

  const selectedSubcategory =
    selectedFamilyKey === "custom"
      ? null
      : familyRecord?.subcategories.find((subcategory) => subcategory.id === selectedSubcategoryId) ?? null;

  const manufacturerOptions = useMemo(() => {
    if (!selectedSubcategory) {
      return [];
    }
    return [...new Set(selectedSubcategory.partRecords.map((record) => record.manufacturer))];
  }, [selectedSubcategory]);

  const modelOptions = useMemo(() => {
    if (!selectedSubcategory || !selectedManufacturer) {
      return [];
    }
    return [
      ...new Set(
        selectedSubcategory.partRecords
          .filter((record) => record.manufacturer === selectedManufacturer)
          .map((record) => record.modelFamily),
      ),
    ];
  }, [selectedManufacturer, selectedSubcategory]);

  const partOptions = useMemo(() => {
    if (!selectedSubcategory || !selectedManufacturer || !selectedModel) {
      return [];
    }
    return selectedSubcategory.partRecords.filter(
      (record) => record.manufacturer === selectedManufacturer && record.modelFamily === selectedModel,
    );
  }, [selectedManufacturer, selectedModel, selectedSubcategory]);

  const selectedPart: ScrapPartRecord | null =
    partOptions.find((record) => record.id === selectedPartId) ??
    (partOptions.length === 1 ? partOptions[0] : null);

  const recommendedFloor =
    selectedFamilyKey === "custom"
      ? "Recommended floor available after platform review"
      : selectedPart
        ? recommendedFloorByPart[selectedPart.id] ?? "Recommended floor available after review"
        : "Select equipment details to generate a recommended floor";

  useEffect(() => {
    setSelectedSubcategoryId("");
    setSelectedManufacturer("");
    setSelectedModel("");
    setSelectedPartId("");
    setListingTitle("");
    setQuantity("");
    setPricingMode("manual");
    setManualPrice("");
    setPackaging(packagingOptions[0]);
    setCondition(conditionOptions[0]);
    setEvidenceNotes("");
  }, [selectedFamilyKey]);

  useEffect(() => {
    setSelectedManufacturer("");
    setSelectedModel("");
    setSelectedPartId("");
    setListingTitle("");
    setQuantity("");
    setPricingMode("manual");
    setManualPrice("");
    setPackaging(packagingOptions[0]);
    setCondition(conditionOptions[0]);
    setEvidenceNotes("");
  }, [selectedSubcategoryId]);

  useEffect(() => {
    if (!selectedSubcategory || !selectedManufacturer) {
      return;
    }
    if (!manufacturerOptions.includes(selectedManufacturer)) {
      setSelectedManufacturer("");
    }
  }, [manufacturerOptions, selectedManufacturer, selectedSubcategory]);

  useEffect(() => {
    if (!selectedManufacturer) {
      setSelectedModel("");
      setSelectedPartId("");
    }
  }, [selectedManufacturer]);

  useEffect(() => {
    if (!selectedModel) {
      setSelectedPartId("");
    }
  }, [selectedModel]);

  useEffect(() => {
    if (partOptions.length === 1) {
      setSelectedPartId(partOptions[0].id);
    }
  }, [partOptions]);

  const handleAddListing = () => {
    if (!selectedSubcategoryId || !quantity) {
      return;
    }

    const familyLabel = selectedFamilyKey === "custom" ? "Custom Listing" : familyRecord?.familyLabel ?? "Listing";
    const subcategoryLabel =
      selectedFamilyKey === "custom"
        ? "Custom supplier-defined lane"
        : selectedSubcategory?.label ?? "Selected subcategory";

    setStagedListings((current) => [
      ...current,
      {
        id: createListingId(),
        familyLabel,
        subcategoryLabel,
        manufacturer: selectedManufacturer || "Custom manufacturer",
        modelFamily: selectedModel || "Custom model family",
        partNumber: selectedPart?.partNumber || "Platform-reviewed",
        quantity,
        pricingMode,
        manualPrice,
        recommendedFloor,
      },
    ]);

    setQuantity("");
    setManualPrice("");
    setEvidenceNotes("");
  };

  const isFormUnlocked =
    selectedFamilyKey === "custom"
      ? selectedSubcategoryId === "custom-listing"
      : Boolean(selectedSubcategoryId);

  const subcategoryCards =
    selectedFamilyKey === "custom"
      ? [
          {
            id: "custom-listing",
            label: "Custom listing",
            guidance: "Use this path when your equipment does not map cleanly to the standard families.",
          },
        ]
      : (familyRecord?.subcategories ?? []).map((subcategory) => ({
          id: subcategory.id,
          label: subcategory.label,
          guidance: subcategory.guidance,
        }));

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
            <span className="rounded-full border border-[#DCE3EF] bg-[#F8FAFD] px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#253B80]">
              Create bid workflow
            </span>
          </div>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mt-6 rounded-[34px] border border-[#DCE3EF] bg-white/88 p-6 shadow-[0_28px_80px_rgba(46,41,31,0.08)]"
          >
            <p className="eyebrow">Supplier create bid</p>
            <h1 className="max-w-[12ch] font-display text-[clamp(2.8rem,4vw,4.4rem)] leading-[0.95] tracking-[-0.06em] text-[#0F1115]">
              Build a supply listing from a structured scrap database.
            </h1>
            <p className="mt-4 max-w-[44rem] text-[0.98rem] leading-7 text-[#6D7484]">
              Choose the source family, click the exact subcategory, and the platform will open a guided listing form that can recommend a floor price from its backend materials database.
            </p>

            <div className="mt-8">
              <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                Choose supply family
              </span>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {familyTiles.map((tile) => {
                  const isSelected = tile.id === selectedFamilyKey;
                  return (
                    <Link
                      key={tile.id}
                      to={`/dashboard/supplier/create-bid?family=${tile.id}`}
                      className={`grid gap-3 rounded-[24px] border p-3 transition ${
                        isSelected
                          ? "border-[#253B80] bg-[linear-gradient(180deg,rgba(37,59,128,0.08),rgba(255,255,255,0.92))] shadow-[0_20px_56px_rgba(37,59,128,0.12)]"
                          : "border-[#DCE3EF] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(247,241,232,0.84))] hover:-translate-y-1 hover:border-[#253B80]/30"
                      }`}
                    >
                      <AppImage src={tile.image} alt={tile.title} className="h-28 w-full rounded-[20px] object-cover" />
                      <div>
                        <strong className="block font-display text-[1.06rem] tracking-[-0.04em] text-[#0F1115]">
                          {tile.title}
                        </strong>
                        <p className="mt-2 text-[0.84rem] leading-6 text-[#6D7484]">{tile.subtitle}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                  Choose subcategory
                </span>
                <span className="rounded-full border border-[#DCE3EF] bg-[#F8FAFD] px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#253B80]">
                  Click a subcategory to start a listing
                </span>
              </div>
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

            {isFormUnlocked ? (
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42 }}
                className="mt-8 rounded-[30px] border border-[#DCE3EF] bg-[linear-gradient(180deg,rgba(255,252,247,0.92),rgba(249,244,236,0.86))] p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                      Listing form
                    </span>
                    <strong className="mt-2 block font-display text-[1.46rem] tracking-[-0.05em] text-[#0F1115]">
                      Enter supplier-visible details and let the platform recommend the floor
                    </strong>
                  </div>
                  <div className="rounded-[22px] border border-[#DCE3EF] bg-white/84 px-4 py-4 lg:min-w-[280px]">
                    <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[#6D7484]">
                      Platform pricing signal
                    </span>
                    <p className="mt-2 font-display text-[1.2rem] tracking-[-0.04em] text-[#253B80]">{recommendedFloor}</p>
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
                      {(selectedFamilyKey === "custom" ? ["Custom / not listed"] : manufacturerOptions).map((option) => (
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
                      {(selectedFamilyKey === "custom" ? ["Supplier-defined model family"] : modelOptions).map((option) => (
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
                      {(selectedFamilyKey === "custom" ? [{ id: "custom", partNumber: "Custom / reviewed by platform" }] : partOptions).map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.partNumber}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="rounded-[24px] border border-[#DCE3EF] bg-white/84 p-4">
                    <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                      Quantity
                    </span>
                    <input
                      value={quantity}
                      onChange={(event) => setQuantity(event.target.value)}
                      className="mt-3 w-full rounded-[18px] border border-[#DCE3EF] bg-white px-4 py-3 text-[0.95rem] text-[#0F1115] outline-none transition focus:border-[#253B80]"
                      placeholder="Metric tons or units"
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

                  <div className="rounded-[24px] border border-[#DCE3EF] bg-white/84 p-4 md:col-span-2 xl:col-span-3">
                    <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                      Pricing choice
                    </span>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {[
                        { mode: "manual" as const, label: "Enter manual listing price" },
                        { mode: "optimum" as const, label: "Use recommended floor from platform" },
                      ].map((option) => (
                        <button
                          key={option.mode}
                          type="button"
                          onClick={() => setPricingMode(option.mode)}
                          className={`rounded-[18px] px-4 py-3 text-left text-[0.76rem] font-bold uppercase tracking-[0.12em] transition ${
                            pricingMode === option.mode
                              ? "bg-[#253B80] text-white"
                              : "border border-[#DCE3EF] bg-[#F8FAFD] text-[#0F1115] hover:border-[#253B80]"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                    {pricingMode === "manual" ? (
                      <input
                        value={manualPrice}
                        onChange={(event) => setManualPrice(event.target.value)}
                        className="mt-3 w-full rounded-[18px] border border-[#DCE3EF] bg-white px-4 py-3 text-[0.95rem] text-[#0F1115] outline-none transition focus:border-[#253B80]"
                        placeholder="Example: $2.95 / kg"
                      />
                    ) : (
                      <p className="mt-3 rounded-[18px] border border-[#DCE3EF] bg-[#F8FAFD] px-4 py-3 text-[0.9rem] leading-6 text-[#0F1115]">
                        The platform will keep the backend composition model private and surface only the recommended floor price for the listing.
                      </p>
                    )}
                  </div>
                </div>

                <label className="mt-4 block rounded-[24px] border border-[#DCE3EF] bg-white/84 p-4">
                  <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                    Evidence and pictures
                  </span>
                  <textarea
                    value={evidenceNotes}
                    onChange={(event) => setEvidenceNotes(event.target.value)}
                    className="mt-3 min-h-[110px] w-full rounded-[18px] border border-[#DCE3EF] bg-white px-4 py-3 text-[0.95rem] text-[#0F1115] outline-none transition focus:border-[#253B80]"
                    placeholder="Add image notes, manifests, teardown stage, or anything that helps the platform assist pricing."
                  />
                </label>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button className="button-primary" onClick={handleAddListing} type="button">
                    Add listing to package
                  </button>
                  <button className="button-secondary" type="button">
                    Save draft
                  </button>
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
                    Stage multiple listings before opening the live bid
                  </strong>
                </div>
                <span className="rounded-full border border-[#DCE3EF] bg-[#F8FAFD] px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#253B80]">
                  {stagedListings.length} staged
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {stagedListings.length === 0 ? (
                  <div className="rounded-[22px] border border-dashed border-[#DCE3EF] bg-[rgba(248,250,253,0.8)] px-5 py-6 text-[0.92rem] leading-7 text-[#6D7484]">
                    Select a subcategory to unlock the listing form, then add one or more supplier-ready lots into the package.
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
                            {listing.quantity}
                          </span>
                          <span className="rounded-full border border-[#DCE3EF] bg-white px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#253B80]">
                            {listing.pricingMode === "manual" ? listing.manualPrice || "Manual price" : listing.recommendedFloor}
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  ))
                )}
              </div>
            </section>
          </motion.section>

          <section className="mt-10 rounded-[34px] border border-[#DCE3EF] bg-white/84 p-6 shadow-[0_24px_70px_rgba(46,41,31,0.07)]">
            <div className="flex flex-col gap-2">
              <p className="eyebrow">FAQ</p>
              <h2 className="font-display text-[clamp(2rem,3vw,3rem)] leading-[0.96] tracking-[-0.06em] text-[#0F1115]">
                Listing guidance before launch
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
