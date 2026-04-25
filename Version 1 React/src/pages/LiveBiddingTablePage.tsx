import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BidRow } from "../components/dashboard/BidRow";
import { dashboardBidListings } from "../data/dashboardMarketplaceData";
import { pageEnter } from "../lib/motion";

const pageMotionProps = {
  variants: pageEnter,
  initial: "hidden" as const,
  animate: "visible" as const,
  exit: "exit" as const,
};

const PAGE_SIZE = 6;

function bidCountForIndex(index: number) {
  return 4 + (index % 7);
}

export function LiveBiddingTablePage() {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(dashboardBidListings.length / PAGE_SIZE));
  const activeListings = useMemo(
    () => dashboardBidListings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [page]
  );

  return (
    <motion.main className="page" {...pageMotionProps}>
      <section className="shell section-gap pt-10 lg:pt-14">
        <div className="rounded-[34px] border border-[#d9cfbf] bg-[linear-gradient(180deg,rgba(255,252,247,0.97),rgba(244,236,224,0.92))] p-6 shadow-[0_28px_80px_rgba(46,41,31,0.08)]">
          <div className="flex flex-col gap-4 border-b border-[#e0d7c9] pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <p className="eyebrow !mb-0">Live bidding dashboard</p>
              <h1 className="mt-2 font-display text-[2rem] leading-[0.98] tracking-[-0.05em] text-[#11283d] sm:text-[2.35rem] lg:text-[2.85rem]">
                Live bidding opportunities across active rare-earth-bearing scrap listings.
              </h1>
              <p className="mt-4 max-w-[48rem] text-[1rem] leading-8 text-[#5a6a78]">
                Use this table to scan current opportunities before you move into bid entry or open detailed listing views.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link className="button-ghost" to="/dashboard">
                Back to dashboard
              </Link>
              <span className="rounded-full border border-[#ddd4c7] bg-white/82 px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#173550]">
                {dashboardBidListings.length} active bids
              </span>
            </div>
          </div>

          <div className="mt-6 rounded-[30px] border border-[#ddd4c7] bg-white/82 px-6 py-3 shadow-[0_18px_50px_rgba(46,41,31,0.06)]">
            {activeListings.map((listing, index) => (
              <BidRow
                key={listing.id}
                listing={listing}
                bidCount={bidCountForIndex((page - 1) * PAGE_SIZE + index)}
              />
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-[#ddd4c7] bg-white/72 px-5 py-4">
            <p className="text-[0.9rem] leading-7 text-[#5a6a78]">
              Showing {activeListings.length} bidding opportunities on this page.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-[0.8rem] font-bold uppercase tracking-[0.14em] text-[#7b7367]">
                {page}/{pageCount}
              </span>
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
                className="rounded-full border border-[#d8cfbf] bg-white/84 px-4 py-2 text-[0.76rem] font-bold uppercase tracking-[0.14em] text-[#173550] transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
                disabled={page === pageCount}
                className="rounded-full border border-[#d8cfbf] bg-white/84 px-4 py-2 text-[0.76rem] font-bold uppercase tracking-[0.14em] text-[#173550] transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next page
              </button>
            </div>
          </div>
        </div>
      </section>
    </motion.main>
  );
}
