import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useRecyclerBidBook } from "../hooks/useRecyclerBidBook";
import { useSupplierListingStore } from "../hooks/useSupplierListingStore";
import { pageEnter } from "../lib/motion";

const pageMotionProps = {
  variants: pageEnter,
  initial: "hidden" as const,
  animate: "visible" as const,
  exit: "exit" as const,
};

function formatCurrency(value: number) {
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export function RecyclerActiveBidsPage() {
  const { bidBook } = useRecyclerBidBook();
  const { mergedAuctionListings } = useSupplierListingStore();

  const bidEntries = bidBook
    .map((record) => ({
      record,
      listing: mergedAuctionListings.find((item) => item.id === record.listingId),
    }))
    .filter((entry) => entry.listing);

  return (
    <motion.main className="page" {...pageMotionProps}>
      <section className="shell section-gap pt-10 lg:pt-14">
        <div className="rounded-[34px] border border-[#DCE3EF] bg-[linear-gradient(180deg,rgba(255,252,247,0.97),rgba(244,236,224,0.92))] p-6 shadow-[0_28px_80px_rgba(46,41,31,0.08)]">
          <div className="flex flex-col gap-4 border-b border-[#DCE3EF] pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <p className="eyebrow !mb-0">Active bids</p>
              <h1 className="mt-2 font-display text-[2rem] leading-[0.98] tracking-[-0.05em] text-[#0F1115] sm:text-[2.35rem] lg:text-[2.85rem]">
                Auctions where this recycler account already has a live bid in market.
              </h1>
              <p className="mt-4 max-w-[48rem] text-[1rem] leading-8 text-[#6D7484]">
                Review the current bid basis, quantity, and lot details for events you have already entered.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link className="button-ghost" to="/dashboard">
                Back to dashboard
              </Link>
              <span className="rounded-full border border-[#DCE3EF] bg-white/82 px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#253B80]">
                {bidEntries.length} active bid{bidEntries.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {bidEntries.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-[#DCE3EF] bg-white/74 px-6 py-10 text-center">
                <strong className="block font-display text-[1.4rem] tracking-[-0.04em] text-[#0F1115]">
                  No active bids yet.
                </strong>
                <p className="mt-3 text-[0.96rem] leading-7 text-[#6D7484]">
                  Open the live bidding dashboard to place your first auction bid.
                </p>
                <Link className="button-primary mt-6 inline-flex" to="/dashboard/live-bids">
                  Browse open bids
                </Link>
              </div>
            ) : (
              bidEntries.map(({ record, listing }, index) => (
                <motion.article
                  key={record.listingId}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className="rounded-[28px] border border-[#DCE3EF] bg-white/82 px-5 py-5 shadow-[0_18px_50px_rgba(46,41,31,0.06)]"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-[44rem]">
                      <strong className="block font-display text-[1.24rem] tracking-[-0.04em] text-[#0F1115]">
                        {listing?.detailTitle}
                      </strong>
                      <p className="mt-3 text-[0.94rem] leading-7 text-[#6D7484]">
                        {listing?.detailSummary}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-3 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#6D7484]">
                        <span>{listing?.location}</span>
                        <span>{listing?.availability}</span>
                        <span>{new Date(record.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      </div>
                    </div>

                    <div className="grid gap-3 rounded-[24px] border border-[#DCE3EF] bg-[rgba(255,252,247,0.88)] p-4 sm:grid-cols-3">
                      <Metric label="Bid price" value={`$${record.bidPricePerKg.toFixed(2)} / kg`} />
                      <Metric label="Quantity" value={`${record.quantityTons.toFixed(2)} tons`} />
                      <Metric label="Total bid" value={formatCurrency(record.totalBid)} />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link className="button-primary" to={`/dashboard/place-order/${record.listingId}`}>
                      Update bid
                    </Link>
                    <Link
                      className="button-ghost"
                      to={`/dashboard/live/${record.sourceId}/listing/${record.listingId}`}
                    >
                      View auction details
                    </Link>
                  </div>
                </motion.article>
              ))
            )}
          </div>
        </div>
      </section>
    </motion.main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
        {label}
      </span>
      <p className="mt-2 text-[0.96rem] font-semibold text-[#0F1115]">{value}</p>
    </div>
  );
}
