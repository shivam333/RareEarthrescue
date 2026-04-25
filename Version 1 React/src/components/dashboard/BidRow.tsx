import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { DashboardBidListing } from "../../data/dashboardMarketplaceData";

function parsePricePerKg(pricePerTon: string) {
  const match = pricePerTon.match(/[\d,]+(?:\.\d+)?/);
  const perTon = match ? Number(match[0].replace(/,/g, "")) : 0;
  return perTon / 1000;
}

function cleanLotQuantity(quantity: string) {
  return quantity.replace(/\s*per lot/i, "");
}

function compactLocation(location: string) {
  const parts = location.split(",");
  if (parts.length >= 2) {
    return `${parts[1].trim()}, ${parts[2]?.trim() ?? ""}`.trim().replace(/,\s*$/, "");
  }

  return location;
}

export function BidRow({
  listing,
  bidCount,
  compact = false,
}: {
  listing: DashboardBidListing;
  bidCount: number;
  compact?: boolean;
}) {
  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="grid gap-4 border-b border-[#e6ddcf] py-4 last:border-b-0 last:pb-0 md:grid-cols-[minmax(0,2.1fr)_minmax(0,1.1fr)_minmax(0,0.9fr)_auto]"
    >
      <div className="min-w-0">
        <strong className="block truncate font-display text-[1.04rem] tracking-[-0.03em] text-[#11283d]">
          {listing.category}
        </strong>
        <p className="mt-2 truncate text-[0.9rem] leading-7 text-[#556576]">
          {listing.detailSummary}
        </p>
        <div className="mt-2 flex flex-wrap gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#8a7b65]">
          <span>{compactLocation(listing.location)}</span>
          <span>{bidCount} bids</span>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]">
          Purity / composition
        </span>
        <p className={`text-[0.88rem] leading-6 text-[#556576] ${compact ? "line-clamp-1" : "line-clamp-2"}`}>
          {listing.purityNotes}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
        <div>
          <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]">
            Opening price
          </span>
          <p className="mt-2 text-[0.92rem] font-semibold text-[#8d6d39]">
            ${parsePricePerKg(listing.pricePerTon).toFixed(2)} / kg
          </p>
        </div>
        <div>
          <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]">
            Opening quantity
          </span>
          <p className="mt-2 text-[0.92rem] font-semibold text-[#173550]">
            {cleanLotQuantity(listing.quantity)}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-start gap-2 md:items-end">
        <Link
          to={`/dashboard/place-order/${listing.id}`}
          className="inline-flex items-center rounded-full bg-[linear-gradient(145deg,#b88b3c,#9f742c)] px-4 py-2 text-[0.74rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_14px_34px_rgba(184,139,60,0.2)] transition hover:-translate-y-0.5"
        >
          Place Bid
        </Link>
        <Link
          to={`/dashboard/live/${listing.sourceId}/listing/${listing.id}`}
          className="text-[0.74rem] font-bold uppercase tracking-[0.14em] text-[#173550] transition hover:text-[#8d6d39]"
        >
          View Details
        </Link>
      </div>
    </motion.article>
  );
}
