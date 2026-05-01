import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AppImage } from "../components/ui/AppImage";
import { DashboardSourceId, dashboardMaterialTiles } from "../data/dashboardMarketplaceData";
import {
  ScrapPartRecord,
  SupplyFamilyListingDatabase,
  supplierListingDatabase,
} from "../data/supplierListingDatabase";
import { pageEnter } from "../lib/motion";

const pageMotionProps = {
  variants: pageEnter,
  initial: "hidden" as const,
  animate: "visible" as const,
  exit: "exit" as const,
};

type PricingMode = "manual" | "optimum";

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
  notes: string;
  imageNotes: string;
};

const publishSteps = [
  "Choose a supply family and exact scrap subcategory",
  "Match the lot to known OEMs, part numbers, and material composition",
  "Stage one or more listings, then set manual or optimum pricing",
];

const familyInsights: Record<
  DashboardSourceId,
  {
    title: string;
    body: string;
    note: string;
  }
> = {
  hdd: {
    title: "HDD lanes clear faster with structured manifests",
    body: "Use the database to group by drive family, teardown stage, and contamination profile before opening the listing.",
    note: "Data-center and ITAD lots are strongest when unit counts and image packs are consistent.",
  },
  "auto-motors": {
    title: "Motor listings perform better with known OEM and rotor context",
    body: "Select the right traction or mobility class so buyers can align recovery yield and teardown labor quickly.",
    note: "EV and hybrid buyers tend to reward cleaner OEM grouping and opened-housing evidence.",
  },
  "industrial-motors": {
    title: "Industrial motors need better classification than generic scrap",
    body: "Choosing servo, steering, appliance, or wind lanes up front helps avoid underpricing specialized recovery value.",
    note: "Nameplate photos and motor class tags reduce buyer diligence friction.",
  },
  mri: {
    title: "MRI lots need deinstallation detail before pricing",
    body: "The more complete the system status, field condition, and transport notes, the better the bid quality becomes.",
    note: "Medical systems price around complexity, not just gross tonnage.",
  },
  "other-items": {
    title: "Other magnet sources benefit from clean batching",
    body: "Robot actuators, lab motors, and linear systems clear more efficiently when grouped by OEM and assembly type.",
    note: "Smaller specialty lots price stronger when the listing removes ambiguity.",
  },
};

function getFamilyRecord(familyId: string | null): SupplyFamilyListingDatabase {
  return (
    supplierListingDatabase.find((record) => record.familyId === familyId) ?? supplierListingDatabase[0]
  );
}

function createListingId() {
  return `listing-${Math.random().toString(36).slice(2, 10)}`;
}

export function SupplierCreateBidPage() {
  const [searchParams] = useSearchParams();
  const selectedFamilyId = (searchParams.get("family") as DashboardSourceId | null) ?? dashboardMaterialTiles[0]?.id;
  const familyRecord = getFamilyRecord(selectedFamilyId);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(familyRecord.subcategories[0]?.id ?? "");
  const [selectedPartId, setSelectedPartId] = useState(familyRecord.subcategories[0]?.partRecords[0]?.id ?? "");
  const [listingTitle, setListingTitle] = useState("");
  const [quantity, setQuantity] = useState("");
  const [bidWindow, setBidWindow] = useState("");
  const [pricingMode, setPricingMode] = useState<PricingMode>("manual");
  const [manualPrice, setManualPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [imageNotes, setImageNotes] = useState("");
  const [stagedListings, setStagedListings] = useState<StagedListing[]>([]);

  useEffect(() => {
    const nextSubcategory = familyRecord.subcategories[0];
    setSelectedSubcategoryId(nextSubcategory?.id ?? "");
    setSelectedPartId(nextSubcategory?.partRecords[0]?.id ?? "");
    setListingTitle("");
    setQuantity("");
    setBidWindow("");
    setPricingMode("manual");
    setManualPrice("");
    setNotes("");
    setImageNotes("");
  }, [familyRecord.familyId]);

  const selectedSubcategory =
    familyRecord.subcategories.find((subcategory) => subcategory.id === selectedSubcategoryId) ??
    familyRecord.subcategories[0];

  const selectedPart =
    selectedSubcategory?.partRecords.find((record) => record.id === selectedPartId) ??
    selectedSubcategory?.partRecords[0];

  useEffect(() => {
    if (!selectedSubcategory) {
      return;
    }

    const stillValid = selectedSubcategory.partRecords.some((record) => record.id === selectedPartId);
    if (!stillValid) {
      setSelectedPartId(selectedSubcategory.partRecords[0]?.id ?? "");
    }
  }, [selectedPartId, selectedSubcategory]);

  const currentInsight = familyInsights[familyRecord.familyId];

  const handleAddListing = () => {
    if (!selectedSubcategory || !selectedPart || !quantity) {
      return;
    }

    setStagedListings((current) => [
      ...current,
      {
        id: createListingId(),
        familyLabel: familyRecord.familyLabel,
        subcategoryLabel: selectedSubcategory.label,
        manufacturer: selectedPart.manufacturer,
        modelFamily: selectedPart.modelFamily,
        partNumber: selectedPart.partNumber,
        quantity,
        pricingMode,
        manualPrice,
        notes,
        imageNotes,
      },
    ]);

    setListingTitle("");
    setQuantity("");
    setBidWindow("");
    setPricingMode("manual");
    setManualPrice("");
    setNotes("");
    setImageNotes("");
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
            <span className="rounded-full border border-[#DCE3EF] bg-[#F8FAFD] px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#253B80]">
              Create bid workflow
            </span>
          </div>

          <div className="mt-6 grid gap-8 xl:grid-cols-[minmax(0,1.14fr)_390px]">
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="rounded-[34px] border border-[#DCE3EF] bg-white/88 p-6 shadow-[0_28px_80px_rgba(46,41,31,0.08)]"
            >
              <p className="eyebrow">Supplier create bid</p>
              <h1 className="max-w-[12ch] font-display text-[clamp(2.8rem,4vw,4.4rem)] leading-[0.95] tracking-[-0.06em] text-[#0F1115]">
                Build a supply listing from a structured scrap database.
              </h1>
              <p className="mt-4 max-w-[42rem] text-[0.98rem] leading-7 text-[#6D7484]">
                Start from known equipment families, match to manufacturer and part numbers, review the expected recoverable materials, then stage multiple listings into one live sell-side program.
              </p>

              <div className="mt-8 grid gap-6">
                <div>
                  <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                    Choose supply family
                  </span>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {dashboardMaterialTiles.map((tile) => {
                      const isSelected = tile.id === familyRecord.familyId;
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

                <motion.article
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.08 }}
                  className="rounded-[28px] border border-[#DCE3EF] bg-[linear-gradient(180deg,rgba(255,252,247,0.92),rgba(249,244,236,0.86))] p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-[34rem]">
                      <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                        Family intelligence
                      </span>
                      <strong className="mt-2 block font-display text-[1.45rem] tracking-[-0.05em] text-[#0F1115]">
                        {currentInsight.title}
                      </strong>
                      <p className="mt-3 text-[0.92rem] leading-7 text-[#6D7484]">{currentInsight.body}</p>
                    </div>
                    <div className="rounded-[22px] border border-[#DCE3EF] bg-white/82 px-4 py-4 lg:max-w-[18rem]">
                      <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[#6D7484]">
                        Good listing patterns
                      </span>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {familyRecord.lotExamples.map((example) => (
                          <span
                            key={example}
                            className="rounded-full border border-[#DCE3EF] bg-[#F8FAFD] px-3 py-2 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#253B80]"
                          >
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 rounded-[20px] border border-[#DCE3EF] bg-white/78 px-4 py-4 text-[0.88rem] leading-6 text-[#0F1115]">
                    {currentInsight.note}
                  </p>
                </motion.article>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
                  <section className="rounded-[28px] border border-[#DCE3EF] bg-[rgba(255,252,247,0.94)] p-5">
                    <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                      Scrap database
                    </span>
                    <strong className="mt-2 block font-display text-[1.35rem] tracking-[-0.05em] text-[#0F1115]">
                      Select the exact subcategory you are listing
                    </strong>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {familyRecord.subcategories.map((subcategory) => {
                        const isSelected = subcategory.id === selectedSubcategoryId;
                        return (
                          <button
                            key={subcategory.id}
                            type="button"
                            onClick={() => setSelectedSubcategoryId(subcategory.id)}
                            className={`rounded-full px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] transition ${
                              isSelected
                                ? "bg-[#253B80] text-white shadow-[0_12px_28px_rgba(37,59,128,0.18)]"
                                : "border border-[#DCE3EF] bg-white text-[#0F1115] hover:border-[#253B80] hover:text-[#253B80]"
                            }`}
                          >
                            {subcategory.label}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-4 rounded-[22px] border border-[#DCE3EF] bg-white/82 px-4 py-4">
                      <p className="text-[0.88rem] leading-6 text-[#6D7484]">{selectedSubcategory?.guidance}</p>
                    </div>

                    <div className="mt-5 grid gap-3">
                      {(selectedSubcategory?.partRecords ?? []).map((record) => {
                        const isSelected = record.id === selectedPart?.id;
                        return (
                          <button
                            key={record.id}
                            type="button"
                            onClick={() => setSelectedPartId(record.id)}
                            className={`rounded-[22px] border px-4 py-4 text-left transition ${
                              isSelected
                                ? "border-[#253B80] bg-[linear-gradient(180deg,rgba(37,59,128,0.08),rgba(255,255,255,0.94))] shadow-[0_18px_40px_rgba(37,59,128,0.12)]"
                                : "border-[#DCE3EF] bg-white/84 hover:-translate-y-1 hover:border-[#253B80]/30"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <strong className="block font-display text-[1.02rem] tracking-[-0.04em] text-[#0F1115]">
                                  {record.manufacturer}
                                </strong>
                                <p className="mt-1 text-[0.84rem] leading-6 text-[#6D7484]">{record.modelFamily}</p>
                              </div>
                              <span className="rounded-full border border-[#DCE3EF] bg-[#F8FAFD] px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#253B80]">
                                {record.partNumber}
                              </span>
                            </div>
                            <p className="mt-3 text-[0.82rem] leading-6 text-[#0F1115]">{record.typicalForm}</p>
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  <section className="rounded-[28px] border border-[#DCE3EF] bg-[rgba(255,252,247,0.94)] p-5">
                    <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                      Listing builder
                    </span>
                    <strong className="mt-2 block font-display text-[1.35rem] tracking-[-0.05em] text-[#0F1115]">
                      Stage a lot with known composition and pricing intent
                    </strong>

                    {selectedPart ? (
                      <div className="mt-4 rounded-[24px] border border-[#DCE3EF] bg-white/84 p-4">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                          <div>
                            <strong className="block font-display text-[1.12rem] tracking-[-0.04em] text-[#0F1115]">
                              {selectedPart.manufacturer} | {selectedPart.modelFamily}
                            </strong>
                            <p className="mt-1 text-[0.84rem] leading-6 text-[#6D7484]">{selectedPart.typicalForm}</p>
                          </div>
                          <span className="rounded-full border border-[#DCE3EF] bg-[#F8FAFD] px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#253B80]">
                            {selectedPart.partNumber}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-2 sm:grid-cols-3">
                          {selectedPart.composition.map((item) => (
                            <div
                              key={item.label}
                              className="rounded-[18px] border border-[#DCE3EF] bg-[rgba(248,250,253,0.9)] px-3 py-3"
                            >
                              <span className="text-[0.6rem] font-extrabold uppercase tracking-[0.16em] text-[#6D7484]">
                                {item.label}
                              </span>
                              <p className="mt-2 font-display text-[1rem] tracking-[-0.04em] text-[#0F1115]">{item.value}</p>
                            </div>
                          ))}
                        </div>

                        <p className="mt-4 rounded-[18px] border border-[#DCE3EF] bg-[#F8FAFD] px-4 py-4 text-[0.84rem] leading-6 text-[#0F1115]">
                          {selectedPart.pricingHint}
                        </p>
                      </div>
                    ) : null}

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <label className="rounded-[24px] border border-[#DCE3EF] bg-white/82 p-4">
                        <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                          Listing title
                        </span>
                        <input
                          value={listingTitle}
                          onChange={(event) => setListingTitle(event.target.value)}
                          className="mt-3 w-full rounded-[18px] border border-[#DCE3EF] bg-white px-4 py-3 text-[0.95rem] text-[#0F1115] outline-none transition focus:border-[#253B80]"
                          placeholder={`Example: ${selectedSubcategory?.label ?? "Buyer-ready lot"}`}
                        />
                      </label>

                      <label className="rounded-[24px] border border-[#DCE3EF] bg-white/82 p-4">
                        <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                          Bid window
                        </span>
                        <input
                          value={bidWindow}
                          onChange={(event) => setBidWindow(event.target.value)}
                          className="mt-3 w-full rounded-[18px] border border-[#DCE3EF] bg-white px-4 py-3 text-[0.95rem] text-[#0F1115] outline-none transition focus:border-[#253B80]"
                          placeholder="Example: May 6 - May 13"
                        />
                      </label>

                      <label className="rounded-[24px] border border-[#DCE3EF] bg-white/82 p-4">
                        <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                          Available quantity
                        </span>
                        <input
                          value={quantity}
                          onChange={(event) => setQuantity(event.target.value)}
                          className="mt-3 w-full rounded-[18px] border border-[#DCE3EF] bg-white px-4 py-3 text-[0.95rem] text-[#0F1115] outline-none transition focus:border-[#253B80]"
                          placeholder="Metric tons staged for bid"
                        />
                      </label>

                      <div className="rounded-[24px] border border-[#DCE3EF] bg-white/82 p-4">
                        <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                          Pricing method
                        </span>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          {[
                            { mode: "manual" as const, label: "Manual listing price" },
                            { mode: "optimum" as const, label: "Request optimum pricing" },
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
                      </div>
                    </div>

                    {pricingMode === "manual" ? (
                      <label className="mt-4 block rounded-[24px] border border-[#DCE3EF] bg-white/82 p-4">
                        <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                          Manual listing price
                        </span>
                        <input
                          value={manualPrice}
                          onChange={(event) => setManualPrice(event.target.value)}
                          className="mt-3 w-full rounded-[18px] border border-[#DCE3EF] bg-white px-4 py-3 text-[0.95rem] text-[#0F1115] outline-none transition focus:border-[#253B80]"
                          placeholder="Example: $2.85 / kg"
                        />
                      </label>
                    ) : (
                      <div className="mt-4 rounded-[24px] border border-[#DCE3EF] bg-[linear-gradient(180deg,rgba(37,59,128,0.08),rgba(255,255,255,0.92))] p-4">
                        <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#253B80]">
                          Optimum pricing request
                        </span>
                        <p className="mt-3 text-[0.9rem] leading-7 text-[#0F1115]">
                          We will use the selected part profile, your lot notes, and submitted image evidence to recommend a stronger listing floor before launch.
                        </p>
                      </div>
                    )}

                    <label className="mt-4 block rounded-[24px] border border-[#DCE3EF] bg-white/82 p-4">
                      <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                        Lot details
                      </span>
                      <textarea
                        value={notes}
                        onChange={(event) => setNotes(event.target.value)}
                        className="mt-3 min-h-[110px] w-full rounded-[18px] border border-[#DCE3EF] bg-white px-4 py-3 text-[0.95rem] text-[#0F1115] outline-none transition focus:border-[#253B80]"
                        placeholder="Add dismantling stage, condition notes, contamination notes, packaging details, or anything the buyer should know."
                      />
                    </label>

                    <label className="mt-4 block rounded-[24px] border border-[#DCE3EF] bg-white/82 p-4">
                      <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                        Pictures and evidence
                      </span>
                      <textarea
                        value={imageNotes}
                        onChange={(event) => setImageNotes(event.target.value)}
                        className="mt-3 min-h-[90px] w-full rounded-[18px] border border-[#DCE3EF] bg-white px-4 py-3 text-[0.95rem] text-[#0F1115] outline-none transition focus:border-[#253B80]"
                        placeholder="Example: 12 pallet photos, 2 close-ups of nameplates, manifest screenshot, teardown images."
                      />
                    </label>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button className="button-primary" onClick={handleAddListing} type="button">
                        Add listing to package
                      </button>
                      <button className="button-secondary" type="button">
                        Preview bundle
                      </button>
                    </div>
                  </section>
                </div>

                <section className="rounded-[28px] border border-[#DCE3EF] bg-white/82 p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                      <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                        Multi-listing package
                      </span>
                      <strong className="mt-2 block font-display text-[1.35rem] tracking-[-0.05em] text-[#0F1115]">
                        Stage multiple subcategory listings before opening the live bid
                      </strong>
                    </div>
                    <span className="rounded-full border border-[#DCE3EF] bg-[#F8FAFD] px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#253B80]">
                      {stagedListings.length} staged
                    </span>
                  </div>

                  <div className="mt-5 space-y-3">
                    {stagedListings.length === 0 ? (
                      <div className="rounded-[22px] border border-dashed border-[#DCE3EF] bg-[rgba(248,250,253,0.8)] px-5 py-6 text-[0.92rem] leading-7 text-[#6D7484]">
                        No staged listings yet. Build one from the family database above, then add another if you want multiple supply lines under the same sell-side package.
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
                                {listing.pricingMode === "manual" ? listing.manualPrice || "Manual price" : "Optimum pricing requested"}
                              </span>
                            </div>
                          </div>
                          <div className="mt-4 grid gap-3 text-[0.84rem] leading-6 text-[#0F1115] md:grid-cols-2">
                            <div className="rounded-[18px] border border-[#DCE3EF] bg-white/84 px-4 py-3">
                              <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[#6D7484]">
                                Lot notes
                              </span>
                              <p className="mt-2">{listing.notes || "No additional lot notes added yet."}</p>
                            </div>
                            <div className="rounded-[18px] border border-[#DCE3EF] bg-white/84 px-4 py-3">
                              <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[#6D7484]">
                                Pictures and evidence
                              </span>
                              <p className="mt-2">{listing.imageNotes || "No picture summary added yet."}</p>
                            </div>
                          </div>
                        </motion.article>
                      ))
                    )}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button className="button-primary" type="button">
                      Save draft listing package
                    </button>
                    <button className="button-secondary" type="button">
                      Request review before launch
                    </button>
                  </div>
                </section>
              </div>
            </motion.section>

            <motion.aside
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              <section className="rounded-[34px] border border-[#DCE3EF] bg-white/86 p-5 shadow-[0_28px_80px_rgba(46,41,31,0.08)]">
                <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                  Workflow
                </span>
                <div className="mt-4 space-y-4">
                  {publishSteps.map((step, index) => (
                    <div key={step} className="flex gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#253B80] text-[0.78rem] font-bold text-white">
                        0{index + 1}
                      </div>
                      <p className="pt-1 text-[0.92rem] leading-6 text-[#0F1115]">{step}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[34px] border border-[#DCE3EF] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(239,244,252,0.92))] p-5 shadow-[0_28px_80px_rgba(46,41,31,0.08)]">
                <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                  Why this listing flow works
                </span>
                <div className="mt-4 space-y-3">
                  {[
                    "Suppliers do not need to classify every motor or device from scratch.",
                    "Known OEMs and part numbers anchor pricing conversations more quickly.",
                    "Composition visibility helps avoid generic scrap discounting.",
                    "Optimum pricing requests can use your pictures and notes before launch.",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-[20px] border border-[#DCE3EF] bg-white/86 px-4 py-3 text-[0.88rem] leading-6 text-[#0F1115]"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[34px] border border-[#DCE3EF] bg-white/86 p-5 shadow-[0_28px_80px_rgba(46,41,31,0.08)]">
                <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                  Pricing paths
                </span>
                <div className="mt-4 grid gap-3">
                  <div className="rounded-[22px] border border-[#DCE3EF] bg-[rgba(255,252,247,0.94)] px-4 py-4">
                    <strong className="block font-display text-[1rem] tracking-[-0.04em] text-[#0F1115]">
                      Manual listing price
                    </strong>
                    <p className="mt-2 text-[0.86rem] leading-6 text-[#6D7484]">
                      Use your own floor when you already know the lane economics and buyer appetite.
                    </p>
                  </div>
                  <div className="rounded-[22px] border border-[#DCE3EF] bg-[rgba(255,252,247,0.94)] px-4 py-4">
                    <strong className="block font-display text-[1rem] tracking-[-0.04em] text-[#0F1115]">
                      Request optimum pricing
                    </strong>
                    <p className="mt-2 text-[0.86rem] leading-6 text-[#6D7484]">
                      Let Rare Earth Rescue recommend a stronger opening price using part data, photos, and listing details.
                    </p>
                  </div>
                </div>
              </section>
            </motion.aside>
          </div>
        </div>
      </section>
    </motion.main>
  );
}
