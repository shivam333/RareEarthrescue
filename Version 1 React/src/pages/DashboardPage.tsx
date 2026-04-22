import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BidListingTable } from "../components/dashboard/BidListingTable";
import { MaterialTileGrid } from "../components/dashboard/MaterialTileGrid";
import {
  dashboardBidListings,
  dashboardMaterialTiles,
  DashboardSourceId,
  DashboardLocationFilter,
  DashboardLotSize,
  dashboardSourceContent,
} from "../data/dashboardMarketplaceData";
import { pageEnter } from "../lib/motion";

const pageMotionProps = {
  variants: pageEnter,
  initial: "hidden" as const,
  animate: "visible" as const,
  exit: "exit" as const,
};

const lotSizeFilters: { label: string; value: DashboardLotSize | "all" }[] = [
  { label: "All lots", value: "all" },
  { label: "< 10 MT", value: "small" },
  { label: "10-25 MT", value: "mid" },
  { label: "25+ MT", value: "large" },
];

const sourceFilters: { label: string; value: DashboardSourceId | "all" }[] = [
  { label: "All scrap", value: "all" },
  { label: "HDDs", value: "hdd" },
  { label: "Auto motors", value: "auto-motors" },
  { label: "Industrial", value: "industrial-motors" },
  { label: "MRI", value: "mri" },
  { label: "Other items", value: "other-items" },
];

const locationFilters: { label: string; value: DashboardLocationFilter | "all" }[] = [
  { label: "All regions", value: "all" },
  { label: "USA", value: "usa" },
  { label: "Canada", value: "canada" },
  { label: "Europe", value: "europe" },
  { label: "Asia", value: "asia" },
];

function FilterGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { label: string; value: T | "all" }[];
  value: T | "all";
  onChange: (next: T | "all") => void;
}) {
  return (
    <div className="grid gap-3">
      <span className="text-[0.72rem] font-extrabold uppercase tracking-[0.18em] text-[#837765]">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`rounded-full border px-4 py-2 text-[0.76rem] font-bold uppercase tracking-[0.14em] transition ${
                isActive
                  ? "border-[#b38a4e] bg-[#b38a4e] text-white shadow-[0_12px_30px_rgba(179,138,78,0.22)]"
                  : "border-[#ddd4c7] bg-white/78 text-[#5f6d79] hover:border-[#cfbf9f] hover:text-[#173550]"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function DashboardPage() {
  const [lotSize, setLotSize] = useState<DashboardLotSize | "all">("all");
  const [sourceId, setSourceId] = useState<DashboardSourceId | "all">("all");
  const [locationFilter, setLocationFilter] = useState<DashboardLocationFilter | "all">("all");
  const [bidQuantities, setBidQuantities] = useState<Record<string, string>>({});

  const filteredListings = useMemo(
    () =>
      dashboardBidListings.filter((listing) => {
        const matchesLotSize = lotSize === "all" || listing.lotSize === lotSize;
        const matchesSource = sourceId === "all" || listing.sourceId === sourceId;
        const matchesLocation =
          locationFilter === "all" || listing.locationFilter === locationFilter;

        return matchesLotSize && matchesSource && matchesLocation;
      }),
    [lotSize, sourceId, locationFilter]
  );

  const handleQuantityChange = (listingId: string, nextValue: string) => {
    if (!/^\d*(\.\d{0,2})?$/.test(nextValue)) return;

    setBidQuantities((current) => ({
      ...current,
      [listingId]: nextValue,
    }));
  };

  return (
    <motion.main className="page bg-transparent" {...pageMotionProps}>
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(210,175,103,0.16),transparent_24%),radial-gradient(circle_at_88%_12%,rgba(121,161,144,0.16),transparent_30%),linear-gradient(180deg,#fbf7ef_0%,#f4ebdb_56%,#f5efe4_100%)] pb-12 pt-28">
        <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(17,40,61,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(17,40,61,0.05)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="absolute left-[-6rem] top-[-2rem] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(201,159,76,0.2),transparent_68%)] blur-3xl" />
        <div className="absolute right-[-5rem] top-[6rem] h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(110,152,121,0.18),transparent_70%)] blur-3xl" />

        <div className="shell relative z-10">
          <div className="max-w-4xl">
            <p className="eyebrow">Recycler dashboard</p>
            <h1 className="max-w-[12ch] font-display text-[clamp(3rem,5.2vw,5.2rem)] leading-[0.95] tracking-[-0.06em] text-[#11283d]">
              Open live category boards built for rare earth recovery buyers.
            </h1>
            <p className="mt-5 max-w-[46rem] text-[1.04rem] leading-8 text-[#4b5b69]">
              Start from a feedstock family, move into a category-specific live marketplace, and
              stage lots into an order workflow with clearer pricing, availability, and purity context.
            </p>
          </div>

          <div className="mt-8">
            <MaterialTileGrid tiles={dashboardMaterialTiles} hrefMode="dashboard" />
          </div>
        </div>
      </section>

      <section className="shell section-gap pt-8">
        <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
          <motion.aside
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="self-start rounded-[32px] border border-[#d9cfbf] bg-[rgba(255,252,247,0.9)] p-6 shadow-[0_24px_70px_rgba(46,41,31,0.08)]"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow !mb-0">Filters</p>
                <h2 className="mt-2 font-display text-[1.5rem] tracking-[-0.04em] text-[#11283d]">
                  Refine open lots
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLotSize("all");
                  setSourceId("all");
                  setLocationFilter("all");
                }}
                className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#8d6d39] transition hover:text-[#173550]"
              >
                Reset
              </button>
            </div>

            <div className="mt-6 grid gap-6">
              <FilterGroup
                label="Lot size"
                options={lotSizeFilters}
                value={lotSize}
                onChange={setLotSize}
              />
              <FilterGroup
                label="Scrap type"
                options={sourceFilters}
                value={sourceId}
                onChange={setSourceId}
              />
              <FilterGroup
                label="Location"
                options={locationFilters}
                value={locationFilter}
                onChange={setLocationFilter}
              />
            </div>
          </motion.aside>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55 }}
            className="rounded-[34px] border border-[#d9cfbf] bg-[linear-gradient(180deg,rgba(255,252,247,0.95),rgba(244,236,224,0.9))] p-6 shadow-[0_28px_80px_rgba(46,41,31,0.08)]"
          >
            <div className="flex flex-col gap-4 border-b border-[#e0d7c9] pb-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="eyebrow !mb-0">Bidding platform</p>
                <h2 className="mt-2 font-display text-[2rem] leading-[0.98] tracking-[-0.05em] text-[#11283d]">
                  Live bidding board for verified rare-earth recovery opportunities.
                </h2>
                <p className="mt-3 max-w-[42rem] text-[0.98rem] leading-7 text-[#5a6a78]">
                  Enter a custom bid quantity in tons, compare opening bid levels in dollars per
                  kilogram, and move directly into a finalize-order workflow built for recycler procurement.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <span className="rounded-full border border-[#ddd4c7] bg-white/84 px-4 py-2 text-[0.74rem] font-bold uppercase tracking-[0.14em] text-[#173550]">
                  {filteredListings.length} live lots
                </span>
                <Link
                  className="button-ghost"
                  to={sourceId === "all" ? "/dashboard/live/hdd" : `/dashboard/live/${sourceId}`}
                >
                  Open live marketplace
                </Link>
              </div>
            </div>

            <div className="mt-6">
              <BidListingTable
                listings={filteredListings}
                quantityInputs={bidQuantities}
                onQuantityChange={handleQuantityChange}
                actionLabel="Place bid"
                getPlaceBidHref={(listing, quantityTons) =>
                  `/dashboard/place-order/${listing.id}?quantity=${encodeURIComponent(quantityTons || "0.00")}`
                }
              />
            </div>

            {sourceId !== "all" ? (
              <div className="mt-6 rounded-[28px] border border-[#ddd4c7] bg-white/72 p-5">
                <span className="badge">{dashboardSourceContent[sourceId].eyebrow}</span>
                <strong className="mt-4 block font-display text-[1.2rem] tracking-[-0.04em] text-[#11283d]">
                  {dashboardSourceContent[sourceId].title}
                </strong>
                <p className="mt-3 max-w-[44rem] text-[0.96rem] leading-7 text-[#5a6a78]">
                  {dashboardSourceContent[sourceId].body}
                </p>
              </div>
            ) : null}
          </motion.div>
        </div>
      </section>
    </motion.main>
  );
}
