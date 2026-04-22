import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { dashboardBidListings } from "../data/dashboardMarketplaceData";
import { useRecyclerOrderBook } from "../hooks/useRecyclerOrderBook";
import { pageEnter } from "../lib/motion";

const pageMotionProps = {
  variants: pageEnter,
  initial: "hidden" as const,
  animate: "visible" as const,
  exit: "exit" as const,
};

export function DashboardListingDetailPage() {
  const { listingId, sourceId } = useParams<{ listingId: string; sourceId: string }>();
  const listing = useMemo(
    () => dashboardBidListings.find((item) => item.id === listingId) ?? dashboardBidListings[0],
    [listingId]
  );
  const relatedListings = dashboardBidListings
    .filter((item) => item.id !== listing.id && item.sourceId === listing.sourceId)
    .slice(0, 3);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedLots, setSelectedLots] = useState(1);
  const { orderBook, addLots } = useRecyclerOrderBook();
  const stagedLots = orderBook[listing.id] ?? 0;

  return (
    <motion.main className="page" {...pageMotionProps}>
      <section className="shell section-gap pt-10 lg:pt-14">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to={`/dashboard/live/${sourceId ?? listing.sourceId}`}
            className="inline-flex items-center rounded-full border border-[#d8cfbf] bg-white/80 px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#173550]"
          >
            Back to live marketplace
          </Link>
          <span className="rounded-full border border-[#d8cfbf] bg-white/80 px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#8d6d39]">
            {listing.category}
          </span>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[118px_minmax(0,1.14fr)_minmax(360px,0.86fr)]">
          <div className="grid gap-3">
            {listing.images.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setActiveImage(index)}
                className={`overflow-hidden rounded-[22px] border transition ${
                  activeImage === index
                    ? "border-[#b38a4e] shadow-[0_14px_34px_rgba(179,138,78,0.16)]"
                    : "border-[#ddd4c7]"
                }`}
              >
                <img src={image} alt={listing.category} className="h-24 w-full object-cover" />
              </button>
            ))}
          </div>

          <article className="overflow-hidden rounded-[34px] border border-[#d8cfbf] bg-[rgba(255,252,247,0.95)] shadow-[0_28px_80px_rgba(46,41,31,0.08)]">
            <div className="relative min-h-[34rem]">
              <img
                src={listing.images[activeImage]}
                alt={listing.detailTitle}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,40,61,0.03),rgba(17,40,61,0.36))]" />
            </div>
          </article>

          <aside className="rounded-[34px] border border-[#d8cfbf] bg-[linear-gradient(180deg,rgba(255,252,247,0.97),rgba(244,236,224,0.9))] p-6 shadow-[0_28px_80px_rgba(46,41,31,0.08)]">
            <p className="eyebrow !mb-0">Live recycler listing</p>
            <h1 className="mt-2 font-display text-[2.1rem] leading-[0.98] tracking-[-0.06em] text-[#11283d]">
              {listing.detailTitle}
            </h1>
            <p className="mt-4 text-[1rem] leading-8 text-[#556576]">{listing.detailSummary}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-[#ddd4c7] bg-white/82 px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#173550]">
                {listing.location}
              </span>
              <span className="rounded-full border border-[#ddd4c7] bg-white/82 px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#315e53]">
                {listing.verification}
              </span>
            </div>

            <div className="mt-6 rounded-[28px] border border-[#e0d7c9] bg-white/78 p-5">
              <strong className="block font-display text-[2.3rem] leading-none tracking-[-0.06em] text-[#11283d]">
                {listing.pricePerTon}
              </strong>
              <p className="mt-2 text-[0.9rem] leading-7 text-[#6b756f]">
                {listing.quantity} · {listing.availableLots} lot{listing.availableLots === 1 ? "" : "s"} available
              </p>

              <div className="mt-5 flex items-center justify-between gap-3 rounded-full border border-[#d8cfbf] bg-[#fbf7ef] px-2 py-2">
                <button
                  type="button"
                  onClick={() => setSelectedLots((current) => Math.max(1, current - 1))}
                  className="grid h-10 w-10 place-items-center rounded-full border border-[#ddd4c7] bg-white text-lg font-bold text-[#173550]"
                >
                  −
                </button>
                <div className="text-center">
                  <strong className="block text-[1rem] text-[#11283d]">{selectedLots}</strong>
                  <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#7b7367]">
                    lot{selectedLots === 1 ? "" : "s"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedLots((current) => Math.min(listing.availableLots, current + 1))
                  }
                  className="grid h-10 w-10 place-items-center rounded-full border border-[#ddd4c7] bg-white text-lg font-bold text-[#173550]"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={() => addLots(listing.id, selectedLots)}
                className="mt-4 w-full rounded-full bg-[linear-gradient(145deg,#b88b3c,#9f742c)] px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_14px_34px_rgba(184,139,60,0.22)] transition hover:-translate-y-0.5"
              >
                Add {selectedLots} lot{selectedLots === 1 ? "" : "s"} to order
              </button>

              <div className="mt-4 grid gap-3">
                <button
                  type="button"
                  className="rounded-full border border-[#cabfae] bg-white/84 px-4 py-3 text-sm font-bold text-[#173550]"
                >
                  Request due diligence pack
                </button>
                <button
                  type="button"
                  className="rounded-full border border-[#cabfae] bg-white/84 px-4 py-3 text-sm font-bold text-[#173550]"
                >
                  Talk to marketplace desk
                </button>
              </div>

              <p className="mt-4 text-[0.78rem] leading-6 text-[#6b756f]">
                {stagedLots > 0
                  ? `${stagedLots} lot${stagedLots === 1 ? "" : "s"} already staged from this listing.`
                  : "Nothing staged from this listing yet."}
              </p>
            </div>

            <div className="mt-6 grid gap-4">
              {[
                ["Seller", `${listing.sellerName} · ${listing.sellerType}`],
                ["Purity notes", listing.purityNotes],
                ["Concentration", listing.concentration],
                ["Packaging", listing.packaging],
                ["Source stream", listing.sourceStream],
                ["Logistics", listing.logistics],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[22px] border border-[#e0d7c9] bg-white/72 px-4 py-4">
                  <span className="text-[0.64rem] font-extrabold uppercase tracking-[0.16em] text-[#8a7b65]">
                    {label}
                  </span>
                  <p className="mt-2 text-[0.94rem] leading-7 text-[#44505b]">{value}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <section className="mt-8 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <article className="rounded-[32px] border border-[#d8cfbf] bg-[rgba(255,252,247,0.94)] p-6 shadow-[0_24px_70px_rgba(46,41,31,0.07)]">
            <span className="badge">Recovery notes</span>
            <h2 className="mt-4 font-display text-[1.55rem] tracking-[-0.05em] text-[#11283d]">
              What a recycler should know before committing volume.
            </h2>
            <p className="mt-4 text-[0.98rem] leading-8 text-[#556576]">{listing.recoveryNotes}</p>
          </article>

          <article className="rounded-[32px] border border-[#d8cfbf] bg-[rgba(255,252,247,0.94)] p-6 shadow-[0_24px_70px_rgba(46,41,31,0.07)]">
            <span className="badge">Related lots</span>
            <div className="mt-4 grid gap-3">
              {relatedListings.map((item) => (
                <Link
                  key={item.id}
                  to={`/dashboard/live/${item.sourceId}/listing/${item.id}`}
                  className="rounded-[22px] border border-[#e0d7c9] bg-white/78 px-4 py-4 transition hover:-translate-y-0.5"
                >
                  <strong className="block font-display text-[1rem] tracking-[-0.04em] text-[#11283d]">
                    {item.category}
                  </strong>
                  <p className="mt-2 text-[0.9rem] leading-7 text-[#556576]">
                    {item.location} · {item.pricePerTon}
                  </p>
                </Link>
              ))}
            </div>
          </article>
        </section>
      </section>
    </motion.main>
  );
}
