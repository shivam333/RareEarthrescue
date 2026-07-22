import { motion } from "framer-motion";
import {
  Bookmark,
  ChevronRight,
  Clock3,
  Download,
  LayoutList,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AppImage } from "../components/ui/AppImage";
import {
  dashboardMaterialTiles,
  dashboardSourceContent,
  DashboardBidListing,
  DashboardLocationFilter,
  DashboardLotSize,
  DashboardSourceId,
} from "../data/dashboardMarketplaceData";
import { useSupplierListingStore } from "../hooks/useSupplierListingStore";
import { pageEnter } from "../lib/motion";
import { toAppRelativeUrl } from "../lib/site";

const pageMotionProps = {
  variants: pageEnter,
  initial: "hidden" as const,
  animate: "visible" as const,
  exit: "exit" as const,
};

const locationLabels: Record<DashboardLocationFilter, string> = {
  usa: "United States",
  canada: "Canada",
  europe: "Europe",
  asia: "Asia",
};

const lotSizeLabels: Record<DashboardLotSize, string> = {
  small: "Pilot lots",
  mid: "Mid-volume lots",
  large: "Program lots",
};

function isDashboardSourceId(value: string | undefined): value is DashboardSourceId {
  return Boolean(value && value in dashboardSourceContent);
}

function parsePricePerTon(value: string) {
  const match = value.match(/[\d,]+(?:\.\d+)?/);
  return match ? Number(match[0].replace(/,/g, "")) : 0;
}

function parseQuantityValue(value: string) {
  const match = value.match(/[\d,]+(?:\.\d+)?/);
  return match ? Number(match[0].replace(/,/g, "")) : 0;
}

function getLotSizeRank(lotSize: DashboardLotSize) {
  if (lotSize === "large") return 3;
  if (lotSize === "mid") return 2;
  return 1;
}

function isImmediateAvailability(listing: DashboardBidListing) {
  return /immediate|open|live/i.test(listing.availability);
}

function isVerifiedListing(listing: DashboardBidListing) {
  return /verified|assay/i.test(listing.verification);
}

function getListingCode(listingId: string) {
  return listingId
    .split("-")
    .slice(-3)
    .map((segment) => segment.toUpperCase())
    .join(" / ");
}

function formatAverageBid(listings: DashboardBidListing[]) {
  if (!listings.length) return "$0 / ton";
  const total = listings.reduce((sum, listing) => sum + parsePricePerTon(listing.pricePerTon), 0);
  return `$${Math.round(total / listings.length).toLocaleString()} / ton`;
}

function toggleValue<T extends string>(values: T[], nextValue: T) {
  return values.includes(nextValue)
    ? values.filter((value) => value !== nextValue)
    : [...values, nextValue];
}

function FilterToggle({
  checked,
  label,
  hint,
  onClick,
}: {
  checked: boolean;
  label: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-4 rounded-[22px] border border-[#d7cfbf] bg-[rgba(255,252,247,0.82)] px-4 py-3 text-left transition duration-200 hover:border-[#17695d]/25 hover:bg-white/90"
    >
      <div>
        <strong className="block text-[0.92rem] tracking-[-0.01em] text-[#111613]">{label}</strong>
        <span className="mt-1 block text-[0.78rem] leading-6 text-[#5b554c]">{hint}</span>
      </div>
      <span
        className={`relative inline-flex h-8 w-14 shrink-0 rounded-full border transition ${
          checked
            ? "border-[#17695d] bg-[linear-gradient(135deg,#17695d,#c16039)]"
            : "border-[#d7cfbf] bg-[#e9dcc7]"
        }`}
      >
        <span
          className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-[0_8px_20px_rgba(17,22,19,0.16)] transition ${
            checked ? "left-[1.45rem]" : "left-1"
          }`}
        />
      </span>
    </button>
  );
}

export function SourceMarketplacePage() {
  const { sourceId } = useParams<{ sourceId: string }>();
  const activeSource: DashboardSourceId = isDashboardSourceId(sourceId) ? sourceId : "hdd";
  const sourceContent = dashboardSourceContent[activeSource];
  const activeTile = dashboardMaterialTiles.find((item) => item.id === activeSource);
  const { mergedLiveListings } = useSupplierListingStore();
  const sourceListings = useMemo(
    () => mergedLiveListings.filter((listing) => listing.sourceId === activeSource),
    [activeSource, mergedLiveListings]
  );

  const [searchValue, setSearchValue] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [immediateOnly, setImmediateOnly] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState<DashboardLocationFilter[]>([]);
  const [selectedLotSizes, setSelectedLotSizes] = useState<DashboardLotSize[]>([]);
  const [sortBy, setSortBy] = useState("recommended");

  const categoryOptions = useMemo(
    () => ["all", ...Array.from(new Set(sourceListings.map((listing) => listing.category)))],
    [sourceListings]
  );
  const availableLocations = useMemo(
    () => Array.from(new Set(sourceListings.map((listing) => listing.locationFilter))),
    [sourceListings]
  );
  const availableLotSizes = useMemo(
    () => Array.from(new Set(sourceListings.map((listing) => listing.lotSize))),
    [sourceListings]
  );

  const filteredListings = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    const nextListings = sourceListings.filter((listing) => {
      if (activeCategory !== "all" && listing.category !== activeCategory) return false;
      if (verifiedOnly && !isVerifiedListing(listing)) return false;
      if (immediateOnly && !isImmediateAvailability(listing)) return false;
      if (selectedLocations.length > 0 && !selectedLocations.includes(listing.locationFilter)) return false;
      if (selectedLotSizes.length > 0 && !selectedLotSizes.includes(listing.lotSize)) return false;
      if (!normalizedSearch) return true;

      const haystack = [
        listing.material,
        listing.detailTitle,
        listing.detailSummary,
        listing.location,
        listing.sellerName,
        listing.category,
        listing.sourceStream,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });

    nextListings.sort((left, right) => {
      if (sortBy === "price-high") {
        return parsePricePerTon(right.pricePerTon) - parsePricePerTon(left.pricePerTon);
      }

      if (sortBy === "price-low") {
        return parsePricePerTon(left.pricePerTon) - parsePricePerTon(right.pricePerTon);
      }

      if (sortBy === "quantity-high") {
        return parseQuantityValue(right.quantity) - parseQuantityValue(left.quantity);
      }

      if (sortBy === "location") {
        return left.location.localeCompare(right.location);
      }

      const availabilityDelta =
        Number(isImmediateAvailability(right)) - Number(isImmediateAvailability(left));
      if (availabilityDelta !== 0) return availabilityDelta;

      const verificationDelta = Number(isVerifiedListing(right)) - Number(isVerifiedListing(left));
      if (verificationDelta !== 0) return verificationDelta;

      return getLotSizeRank(right.lotSize) - getLotSizeRank(left.lotSize);
    });

    return nextListings;
  }, [
    activeCategory,
    immediateOnly,
    searchValue,
    selectedLocations,
    selectedLotSizes,
    sortBy,
    sourceListings,
    verifiedOnly,
  ]);

  const activeFilterLabels = useMemo(() => {
    const labels: string[] = [];

    if (activeCategory !== "all") labels.push(activeCategory);
    if (verifiedOnly) labels.push("Verified only");
    if (immediateOnly) labels.push("Open now");
    labels.push(...selectedLocations.map((location) => locationLabels[location]));
    labels.push(...selectedLotSizes.map((lotSize) => lotSizeLabels[lotSize]));
    if (searchValue.trim()) labels.push(`Search: ${searchValue.trim()}`);

    return labels;
  }, [activeCategory, immediateOnly, searchValue, selectedLocations, selectedLotSizes, verifiedOnly]);

  const totalAvailableLots = filteredListings.reduce((sum, listing) => sum + listing.availableLots, 0);
  const immediateCount = filteredListings.filter(isImmediateAvailability).length;

  const resetFilters = () => {
    setSearchValue("");
    setActiveCategory("all");
    setVerifiedOnly(false);
    setImmediateOnly(false);
    setSelectedLocations([]);
    setSelectedLotSizes([]);
    setSortBy("recommended");
  };

  const handleExport = () => {
    if (typeof window === "undefined" || !filteredListings.length) return;

    const headers = [
      "Material",
      "Category",
      "Location",
      "Quantity",
      "Opening bid",
      "Price per ton",
      "Verification",
      "Availability",
      "Seller",
    ];

    const rows = filteredListings.map((listing) => [
      listing.material,
      listing.category,
      listing.location,
      listing.quantity,
      listing.openingBid,
      listing.pricePerTon,
      listing.verification,
      listing.availability,
      listing.sellerName,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, "\"\"")}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeSource}-marketplace-listings.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <motion.main className="page" {...pageMotionProps}>
      <section className="shell pt-6 lg:pt-8">
        <div className="overflow-hidden rounded-[30px] border border-[#d7cfbf] bg-[linear-gradient(180deg,rgba(255,252,247,0.94),rgba(239,228,208,0.92))] shadow-[0_20px_70px_rgba(54,36,18,0.08)]">
          <div className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
            <div className="flex min-w-0 items-center gap-4 overflow-x-auto">
              <span className="shrink-0 text-[0.92rem] font-bold text-[#111613]">Featured lanes:</span>
              {categoryOptions.slice(1).map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-[0.78rem] font-bold transition ${
                    activeCategory === category
                      ? "border-[#17695d] bg-[#17695d] text-white shadow-[0_10px_22px_rgba(23,105,93,0.22)]"
                      : "border-[#d7cfbf] bg-white/82 text-[#17695d] hover:border-[#17695d]/35"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 text-[0.9rem] text-[#5b554c]">
              <span className="font-semibold">Saved searches:</span>
              <Link
                to={`/sign-in?redirect_url=${encodeURIComponent(toAppRelativeUrl(`/marketplace/source/${activeSource}`))}`}
                className="font-bold text-[#17695d] underline underline-offset-4"
              >
                Sign in
              </Link>
              <span>to save this marketplace view</span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[305px_minmax(0,1fr)]">
          <aside className="h-fit rounded-[32px] border border-[#d7cfbf] bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(239,228,208,0.88))] p-5 shadow-[0_18px_60px_rgba(54,36,18,0.08)] xl:sticky xl:top-28">
            <div className="flex items-center justify-between gap-3 border-b border-[#d7cfbf] pb-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d7cfbf] bg-white/88 text-[#17695d]">
                  <SlidersHorizontal className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.18em] text-[#c16039]">
                    Filters
                  </p>
                  <h2 className="font-display text-[1.7rem] leading-none tracking-[0.03em] text-[#111613]">
                    Refine lots
                  </h2>
                </div>
              </div>

              {activeFilterLabels.length ? (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-[0.78rem] font-bold text-[#17695d] underline underline-offset-4"
                >
                  Clear all
                </button>
              ) : null}
            </div>

            <div className="mt-5 space-y-4">
              <FilterToggle
                checked={verifiedOnly}
                label="Verified listings only"
                hint="Prioritize assay-backed or seller-verified material streams."
                onClick={() => setVerifiedOnly((current) => !current)}
              />
              <FilterToggle
                checked={immediateOnly}
                label="Immediate / live availability"
                hint="Show lots that can move now or are open for active bidding."
                onClick={() => setImmediateOnly((current) => !current)}
              />
            </div>

            <div className="mt-5 rounded-[24px] border border-[#d7cfbf] bg-white/74 p-4">
              <label className="text-[0.72rem] font-extrabold uppercase tracking-[0.18em] text-[#5b554c]">
                Search materials
              </label>
              <div className="mt-3 flex items-center gap-3 rounded-[18px] border border-[#d7cfbf] bg-[#fffaf2] px-4 py-3">
                <Search className="h-4 w-4 text-[#5b554c]" />
                <input
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Magnets, motors, seller, location..."
                  className="w-full border-0 bg-transparent text-[0.92rem] text-[#111613] outline-none placeholder:text-[#8f8679]"
                />
              </div>
            </div>

            <div className="mt-5 rounded-[24px] border border-[#d7cfbf] bg-white/74 p-4">
              <div className="flex items-center justify-between gap-3">
                <strong className="text-[0.82rem] font-extrabold uppercase tracking-[0.18em] text-[#5b554c]">
                  Region
                </strong>
                <span className="text-[0.76rem] text-[#8f8679]">{selectedLocations.length || "All"}</span>
              </div>

              <div className="mt-4 space-y-3">
                {availableLocations.map((location) => {
                  const checked = selectedLocations.includes(location);

                  return (
                    <label key={location} className="flex cursor-pointer items-center gap-3 text-[#111613]">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          setSelectedLocations((current) => toggleValue(current, location))
                        }
                        className="h-4 w-4 rounded border-[#cdbfa7] text-[#17695d] focus:ring-[#17695d]"
                      />
                      <span className="text-[0.92rem] font-medium">{locationLabels[location]}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 rounded-[24px] border border-[#d7cfbf] bg-white/74 p-4">
              <div className="flex items-center justify-between gap-3">
                <strong className="text-[0.82rem] font-extrabold uppercase tracking-[0.18em] text-[#5b554c]">
                  Lot scale
                </strong>
                <span className="text-[0.76rem] text-[#8f8679]">{selectedLotSizes.length || "All"}</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                {availableLotSizes.map((lotSize) => {
                  const active = selectedLotSizes.includes(lotSize);

                  return (
                    <button
                      key={lotSize}
                      type="button"
                      onClick={() => setSelectedLotSizes((current) => toggleValue(current, lotSize))}
                      className={`rounded-full border px-4 py-2 text-[0.78rem] font-bold transition ${
                        active
                          ? "border-[#c16039] bg-[#c16039] text-white"
                          : "border-[#d7cfbf] bg-[#fffaf2] text-[#17695d] hover:border-[#17695d]/35"
                      }`}
                    >
                      {lotSizeLabels[lotSize]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 rounded-[26px] border border-[#d7cfbf] bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(245,236,221,0.92))] p-4 text-[#111613] shadow-[0_18px_46px_rgba(54,36,18,0.08)]">
              <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.18em] text-[#c16039]">
                Marketplace signals
              </p>
              <div className="mt-4 grid gap-3">
                <div className="rounded-[18px] border border-[#d7cfbf] bg-white/82 px-4 py-3">
                  <span className="text-[0.7rem] uppercase tracking-[0.16em] text-[#5b554c]">Visible lots</span>
                  <strong className="mt-2 block font-display text-[1.8rem] leading-none tracking-[0.03em] text-[#111613]">
                    {filteredListings.length}
                  </strong>
                </div>
                <div className="rounded-[18px] border border-[#d7cfbf] bg-white/82 px-4 py-3">
                  <span className="text-[0.7rem] uppercase tracking-[0.16em] text-[#5b554c]">Available lots</span>
                  <strong className="mt-2 block font-display text-[1.8rem] leading-none tracking-[0.03em] text-[#111613]">
                    {totalAvailableLots}
                  </strong>
                </div>
                <div className="rounded-[18px] border border-[#d7cfbf] bg-white/82 px-4 py-3">
                  <span className="text-[0.7rem] uppercase tracking-[0.16em] text-[#5b554c]">Average ask</span>
                  <strong className="mt-2 block text-[1rem] font-semibold text-[#111613]">{formatAverageBid(filteredListings)}</strong>
                </div>
              </div>
            </div>
          </aside>

          <div className="min-w-0">
            <div className="rounded-[34px] border border-[#d7cfbf] bg-[linear-gradient(180deg,rgba(255,252,247,0.98),rgba(239,228,208,0.9))] p-5 shadow-[0_22px_70px_rgba(54,36,18,0.08)] lg:p-6">
              <div className="flex flex-col gap-5 border-b border-[#d7cfbf] pb-5">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-[0.86rem] text-[#5b554c]">
                      <Link to="/" className="font-medium text-[#17695d]">
                        Home
                      </Link>
                      <ChevronRight className="h-4 w-4 text-[#8f8679]" />
                      <Link to="/marketplace" className="font-medium text-[#17695d]">
                        Marketplace
                      </Link>
                      <ChevronRight className="h-4 w-4 text-[#8f8679]" />
                      <span>{activeTile?.title ?? sourceContent.eyebrow}</span>
                    </div>

                    <p className="mt-4 text-[0.72rem] font-extrabold uppercase tracking-[0.18em] text-[#c16039]">
                      {sourceContent.eyebrow}
                    </p>
                    <h1 className="mt-2 max-w-[18ch] font-display text-[clamp(2.2rem,4vw,3.8rem)] leading-[0.92] tracking-[0.03em] text-[#111613]">
                      {filteredListings.length} lots on sale for{" "}
                      <span className="text-[#17695d]">{activeTile?.title ?? "this feedstock lane"}</span>
                    </h1>
                    <p className="mt-4 max-w-4xl text-[1rem] leading-8 text-[#5b554c]">
                      {sourceContent.liveBody}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 xl:max-w-[32rem] xl:justify-end">
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="inline-flex items-center gap-2 rounded-[18px] border border-[#17695d]/28 bg-white/84 px-4 py-3 text-[0.82rem] font-bold text-[#17695d] transition hover:-translate-y-0.5"
                    >
                      Show all
                    </button>
                    <button
                      type="button"
                      onClick={handleExport}
                      className="inline-flex items-center gap-2 rounded-[18px] border border-[#17695d]/28 bg-white/84 px-4 py-3 text-[0.82rem] font-bold text-[#17695d] transition hover:-translate-y-0.5"
                    >
                      <Download className="h-4 w-4" />
                      Export
                    </button>
                    <Link
                      to={`/sign-in?redirect_url=${encodeURIComponent(toAppRelativeUrl(`/marketplace/source/${activeSource}`))}`}
                      className="inline-flex items-center gap-2 rounded-[18px] border border-[#17695d]/28 bg-white/84 px-4 py-3 text-[0.82rem] font-bold text-[#17695d] transition hover:-translate-y-0.5"
                    >
                      <Bookmark className="h-4 w-4" />
                      Save search
                    </Link>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-[18px] border border-[#17695d] bg-[#17695d] px-4 py-3 text-[0.82rem] font-bold text-white shadow-[0_14px_30px_rgba(23,105,93,0.22)]"
                    >
                      <LayoutList className="h-4 w-4" />
                      Structured view
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-wrap gap-2">
                    {activeFilterLabels.length ? (
                      activeFilterLabels.map((label) => (
                        <span
                          key={label}
                          className="rounded-full border border-[#d7cfbf] bg-white/84 px-4 py-2 text-[0.74rem] font-bold uppercase tracking-[0.14em] text-[#17695d]"
                        >
                          {label}
                        </span>
                      ))
                    ) : (
                      <span className="rounded-full border border-[#d7cfbf] bg-white/84 px-4 py-2 text-[0.74rem] font-bold uppercase tracking-[0.14em] text-[#5b554c]">
                        All listings visible
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[0.82rem] font-bold uppercase tracking-[0.14em] text-[#5b554c]">
                      Sort by
                    </span>
                    <select
                      value={sortBy}
                      onChange={(event) => setSortBy(event.target.value)}
                      className="rounded-[16px] border border-[#d7cfbf] bg-white/88 px-4 py-3 text-[0.9rem] font-medium text-[#111613] outline-none"
                    >
                      <option value="recommended">Recommended</option>
                      <option value="price-high">Price high to low</option>
                      <option value="price-low">Price low to high</option>
                      <option value="quantity-high">Largest quantity</option>
                      <option value="location">Location</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[22px] border border-[#d7cfbf] bg-white/74 px-4 py-4">
                  <span className="text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-[#5b554c]">
                    Visible listings
                  </span>
                  <strong className="mt-2 block font-display text-[1.7rem] leading-none tracking-[0.03em] text-[#111613]">
                    {filteredListings.length}
                  </strong>
                </div>
                <div className="rounded-[22px] border border-[#d7cfbf] bg-white/74 px-4 py-4">
                  <span className="text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-[#5b554c]">
                    Open now
                  </span>
                  <strong className="mt-2 block font-display text-[1.7rem] leading-none tracking-[0.03em] text-[#111613]">
                    {immediateCount}
                  </strong>
                </div>
                <div className="rounded-[22px] border border-[#d7cfbf] bg-white/74 px-4 py-4">
                  <span className="text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-[#5b554c]">
                    Average opening bid
                  </span>
                  <strong className="mt-2 block text-[1rem] font-semibold text-[#111613]">
                    {formatAverageBid(filteredListings)}
                  </strong>
                </div>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-[34px] border border-[#d7cfbf] bg-[rgba(255,252,247,0.92)] shadow-[0_24px_70px_rgba(54,36,18,0.08)]">
              <div className="hidden grid-cols-[190px_minmax(0,1.8fr)_0.95fr_1.1fr_1fr_210px] gap-4 border-b border-[#d7cfbf] bg-[linear-gradient(180deg,rgba(255,250,242,0.98),rgba(240,229,210,0.96))] px-4 py-4 text-[0.78rem] font-extrabold uppercase tracking-[0.16em] text-[#5b554c] lg:grid">
                <span>Image</span>
                <span>Lot info</span>
                <span>Material info</span>
                <span>Quality</span>
                <span>Sale info</span>
                <span>Bids</span>
              </div>

              <div className="divide-y divide-[#e5d8c3]">
                {filteredListings.length ? (
                  filteredListings.map((listing, index) => {
                    const detailHref = `/sign-in?redirect_url=${encodeURIComponent(
                      toAppRelativeUrl(`/dashboard/live/${listing.sourceId}/listing/${listing.id}`)
                    )}`;

                    return (
                      <motion.article
                        key={listing.id}
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ duration: 0.35, delay: index * 0.03 }}
                        className="grid gap-4 px-4 py-4 lg:grid-cols-[190px_minmax(0,1.8fr)_0.95fr_1.1fr_1fr_210px] lg:items-start"
                      >
                        <Link
                          to={detailHref}
                          className="group relative overflow-hidden rounded-[22px] border border-[#d7cfbf] bg-[#e7d8bf] shadow-[0_14px_34px_rgba(54,36,18,0.08)]"
                        >
                          <AppImage
                            src={listing.image}
                            alt={listing.category}
                            className="aspect-[1.24/1] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                          />
                          <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-full border border-[#d7cfbf] bg-[rgba(255,250,242,0.94)] px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#111613] backdrop-blur">
                            <span>{listing.availableLots} lots</span>
                            <span className="text-[#17695d]">{lotSizeLabels[listing.lotSize]}</span>
                          </div>
                        </Link>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-[#17695d]/18 bg-[#d6e4d9] px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-[#17695d]">
                              {listing.category}
                            </span>
                            <span className="rounded-full border border-[#d7cfbf] bg-white/84 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#5b554c]">
                              Batch {getListingCode(listing.id)}
                            </span>
                          </div>

                          <Link to={detailHref} className="mt-4 block transition hover:text-[#17695d]">
                            <h2 className="max-w-[24ch] font-display text-[1.55rem] leading-[1.02] tracking-[0.02em] text-[#111613]">
                              {listing.detailTitle}
                            </h2>
                          </Link>

                          <p className="mt-3 max-w-[44rem] text-[0.94rem] leading-7 text-[#5b554c]">
                            {listing.detailSummary}
                          </p>

                          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.82rem] text-[#5b554c]">
                            <span>
                              <strong className="text-[#111613]">Seller:</strong> {listing.sellerName}
                            </span>
                            <span>
                              <strong className="text-[#111613]">Type:</strong> {listing.sellerType}
                            </span>
                            <span>
                              <strong className="text-[#111613]">Source:</strong> {listing.sourceStream}
                            </span>
                          </div>

                          <div className="mt-5 flex flex-wrap gap-3">
                            <Link
                              to={`/sign-in?redirect_url=${encodeURIComponent(toAppRelativeUrl(`/marketplace/source/${activeSource}`))}`}
                              className="inline-flex items-center gap-2 rounded-full border border-[#17695d]/28 bg-white/94 px-4 py-2 text-[0.76rem] font-bold uppercase tracking-[0.14em] text-[#17695d] transition hover:-translate-y-0.5"
                            >
                              <Bookmark className="h-4 w-4" />
                              Watch lane
                            </Link>
                            <span className="inline-flex items-center gap-2 rounded-full border border-[#d3a245]/28 bg-[#fff6df] px-4 py-2 text-[0.76rem] font-bold uppercase tracking-[0.14em] text-[#865425]">
                              <ShieldCheck className="h-4 w-4" />
                              {listing.verification}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-4 rounded-[24px] border border-[#d7cfbf] bg-white/72 p-4">
                          <div>
                            <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-[#8f8679]">
                              Quantity
                            </span>
                            <strong className="mt-1 block text-[1rem] text-[#111613]">{listing.quantity}</strong>
                          </div>
                          <div>
                            <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-[#8f8679]">
                              Opening bid
                            </span>
                            <strong className="mt-1 block text-[1rem] text-[#17695d]">{listing.openingBid}</strong>
                          </div>
                          <div>
                            <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-[#8f8679]">
                              Packaging
                            </span>
                            <p className="mt-1 text-[0.9rem] leading-7 text-[#5b554c]">{listing.packaging}</p>
                          </div>
                        </div>

                        <div className="space-y-4 rounded-[24px] border border-[#d7cfbf] bg-white/72 p-4">
                          <div>
                            <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-[#8f8679]">
                              Concentration
                            </span>
                            <strong className="mt-1 block text-[1rem] text-[#111613]">{listing.concentration}</strong>
                          </div>
                          <div>
                            <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-[#8f8679]">
                              Purity notes
                            </span>
                            <p className="mt-1 text-[0.9rem] leading-7 text-[#5b554c]">{listing.purityNotes}</p>
                          </div>
                        </div>

                        <div className="space-y-4 rounded-[24px] border border-[#d7cfbf] bg-white/72 p-4">
                          <div className="flex items-start gap-3">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#c16039]" />
                            <div>
                              <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-[#8f8679]">
                                Location
                              </span>
                              <strong className="mt-1 block text-[1rem] text-[#111613]">{listing.location}</strong>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#c16039]" />
                            <div>
                              <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-[#8f8679]">
                                Availability
                              </span>
                              <strong className="mt-1 block text-[1rem] text-[#17695d]">{listing.availability}</strong>
                            </div>
                          </div>
                          <div>
                            <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-[#8f8679]">
                              Logistics
                            </span>
                            <p className="mt-1 text-[0.9rem] leading-7 text-[#5b554c]">{listing.logistics}</p>
                          </div>
                        </div>

                        <div className="flex h-full flex-col justify-between rounded-[24px] border border-[#d7cfbf] bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(245,236,221,0.88))] p-4 shadow-[0_16px_40px_rgba(54,36,18,0.06)]">
                          <div>
                            <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-[#8f8679]">
                              Price per ton
                            </span>
                            <strong className="mt-2 block font-display text-[1.9rem] leading-none tracking-[0.03em] text-[#111613]">
                              {listing.pricePerTon}
                            </strong>
                            <p className="mt-3 text-[0.82rem] leading-6 text-[#5b554c]">
                              {listing.availableLots} lot{listing.availableLots === 1 ? "" : "s"} available
                            </p>
                          </div>

                          <div className="mt-6 space-y-3">
                            <Link
                              to={detailHref}
                              className="inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,#17695d,#c16039)] px-5 py-3 text-[0.78rem] font-extrabold uppercase tracking-[0.16em] text-white shadow-[0_14px_30px_rgba(23,105,93,0.22)] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#17695d] focus:ring-offset-2"
                            >
                              Open secure view
                            </Link>
                            <span className="block text-center text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#17695d]">
                              Buyer verification required
                            </span>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })
                ) : (
                  <div className="px-6 py-16 text-center">
                    <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.18em] text-[#c16039]">
                      No lots match these filters
                    </p>
                    <h2 className="mt-3 font-display text-[2rem] tracking-[0.03em] text-[#111613]">
                      Widen the filter set and surface more supply.
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-[0.98rem] leading-8 text-[#5b554c]">
                      Try turning off one or two constraints, switching the featured lane, or clearing the
                      search phrase to reopen more verified marketplace inventory.
                    </p>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="mt-6 inline-flex items-center justify-center rounded-full border border-[#17695d]/28 bg-white/84 px-5 py-3 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-[#17695d]"
                    >
                      Reset filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.main>
  );
}
