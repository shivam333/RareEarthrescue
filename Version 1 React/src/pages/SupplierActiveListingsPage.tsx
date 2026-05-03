import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { supplierActiveListings } from "../data/supplierListingsData";
import { pageEnter } from "../lib/motion";

const pageMotionProps = {
  variants: pageEnter,
  initial: "hidden" as const,
  animate: "visible" as const,
  exit: "exit" as const,
};

export function SupplierActiveListingsPage() {
  const [closedIds, setClosedIds] = useState<string[]>([]);

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
              Active listings
            </span>
          </div>

          <div className="mt-6 rounded-[34px] border border-[#DCE3EF] bg-white/88 p-6 shadow-[0_28px_80px_rgba(46,41,31,0.08)]">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="eyebrow">Supplier stock view</p>
                <h1 className="max-w-[12ch] font-display text-[clamp(2.5rem,4vw,4.2rem)] leading-[0.95] tracking-[-0.06em] text-[#0F1115]">
                  Review the stock currently live in your sell-side catalogue.
                </h1>
                <p className="mt-4 max-w-[42rem] text-[0.98rem] leading-7 text-[#6D7484]">
                  Track family, staged quantity, bid performance, and listing status before you add new supply into market.
                </p>
              </div>
              <Link className="button-primary" to="/dashboard/supplier/create-bid">
                Create another listing
              </Link>
            </div>

            <div className="mt-8 grid gap-4">
              {supplierActiveListings.map((listing, index) => {
                const isClosed = closedIds.includes(listing.id);

                return (
                <motion.article
                  key={listing.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.38, delay: index * 0.05 }}
                  className="grid gap-4 rounded-[26px] border border-[#DCE3EF] bg-[linear-gradient(180deg,rgba(255,252,247,0.92),rgba(249,244,236,0.86))] p-5 xl:grid-cols-[minmax(0,1.3fr)_repeat(6,minmax(0,0.42fr))]"
                >
                  <div>
                    <strong className="block font-display text-[1.18rem] tracking-[-0.04em] text-[#0F1115]">
                      {listing.title}
                    </strong>
                    <p className="mt-2 text-[0.88rem] leading-6 text-[#6D7484]">
                      {listing.family} | {listing.subcategory}
                    </p>
                    <p className="mt-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#6D7484]">
                      {listing.updated}
                    </p>
                  </div>

                  <div>
                    <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[#6D7484]">
                      Quantity
                    </span>
                    <p className="mt-2 font-display text-[1.04rem] tracking-[-0.04em] text-[#0F1115]">{listing.quantity}</p>
                  </div>
                  <div>
                    <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[#6D7484]">
                      Floor
                    </span>
                    <p className="mt-2 font-display text-[1.04rem] tracking-[-0.04em] text-[#0F1115]">{listing.floorPrice}</p>
                  </div>
                  <div>
                    <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[#6D7484]">
                      Best bid
                    </span>
                    <p className="mt-2 font-display text-[1.04rem] tracking-[-0.04em] text-[#253B80]">{listing.bestBid}</p>
                  </div>
                  <div>
                    <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[#6D7484]">
                      Bids received
                    </span>
                    <p className="mt-2 font-display text-[1.04rem] tracking-[-0.04em] text-[#0F1115]">{listing.bidCount}</p>
                  </div>
                  <div>
                    <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[#6D7484]">
                      Status
                    </span>
                    <p className={`mt-2 text-[0.82rem] font-bold uppercase tracking-[0.14em] ${isClosed ? "text-[#B16A1D]" : "text-[#253B80]"}`}>
                      {isClosed ? "Bid closed" : listing.status}
                    </p>
                  </div>
                  <div>
                    <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[#6D7484]">
                      Action
                    </span>
                    <button
                      type="button"
                      disabled={isClosed}
                      onClick={() => setClosedIds((current) => [...current, listing.id])}
                      className={`mt-2 inline-flex rounded-full px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] transition ${
                        isClosed
                          ? "cursor-not-allowed border border-[#DCE3EF] bg-[#F6F8FC] text-[#9AA4B2]"
                          : "bg-[#253B80] text-white hover:bg-[#11283D]"
                      }`}
                    >
                      {isClosed ? "Closed" : "Close bid"}
                    </button>
                  </div>
                </motion.article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </motion.main>
  );
}
