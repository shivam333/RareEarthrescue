import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { DashboardBidListing } from "../../data/dashboardMarketplaceData";
import { useRecyclerOrderBook } from "../../hooks/useRecyclerOrderBook";

const PAGE_SIZE = 8;

export function LiveMarketplaceBoard({
  listings,
  sourceId,
}: {
  listings: DashboardBidListing[];
  sourceId: string;
}) {
  const { orderBook, addLots, totalItems, totalLots } = useRecyclerOrderBook();
  const [page, setPage] = useState(1);
  const [lotSelections, setLotSelections] = useState<Record<string, number>>({});

  useEffect(() => {
    setPage(1);
    setLotSelections({});
  }, [sourceId]);

  const pageCount = Math.max(1, Math.ceil(listings.length / PAGE_SIZE));
  const activeListings = useMemo(
    () => listings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [listings, page]
  );

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="rounded-[26px] border border-[#ddd4c7] bg-[rgba(255,252,247,0.92)] px-5 py-4 shadow-[0_18px_50px_rgba(46,41,31,0.06)]">
          <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]">
            Order staging
          </span>
          <p className="mt-2 text-[0.98rem] leading-7 text-[#556576]">
            {totalLots > 0
              ? `${totalLots} lots staged across ${totalItems} listing${totalItems === 1 ? "" : "s"}.`
              : "Stage lots from this live marketplace to build a recycler order basket."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
            className="rounded-full border border-[#d8cfbf] bg-white/80 px-4 py-2 text-[0.76rem] font-bold uppercase tracking-[0.14em] text-[#173550] transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-[0.8rem] font-bold uppercase tracking-[0.14em] text-[#7b7367]">
            Page {page} / {pageCount}
          </span>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
            disabled={page === pageCount}
            className="rounded-full border border-[#d8cfbf] bg-white/80 px-4 py-2 text-[0.76rem] font-bold uppercase tracking-[0.14em] text-[#173550] transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {activeListings.map((listing, index) => {
          const selectedLots = lotSelections[listing.id] ?? 0;
          const stagedLots = orderBook[listing.id] ?? 0;
          const lotsToStage = Math.max(1, selectedLots);
          const cleanQuantity = listing.quantity.replace(/\s*per lot/i, "");

          return (
            <motion.article
              key={listing.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
              className="overflow-hidden rounded-[30px] border border-[#d9cfbf] bg-[rgba(255,252,247,0.95)] shadow-[0_24px_70px_rgba(46,41,31,0.07)]"
            >
              <div className="grid gap-0 xl:grid-cols-[240px_minmax(0,1fr)_270px]">
                <Link
                  to={`/dashboard/live/${sourceId}/listing/${listing.id}`}
                  className="relative block min-h-[14rem] overflow-hidden border-b border-[#e5dccf] transition hover:opacity-95 xl:border-b-0 xl:border-r"
                >
                  <img
                    src={listing.image}
                    alt={listing.category}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,40,61,0.02),rgba(17,40,61,0.34))]" />
                  <div className="absolute left-4 top-4">
                    <span className="inline-flex rounded-full bg-white/14 px-3 py-1 text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-white backdrop-blur">
                      {listing.category}
                    </span>
                  </div>
                </Link>

                <Link
                  to={`/dashboard/live/${sourceId}/listing/${listing.id}`}
                  className="block border-b border-[#e5dccf] px-5 py-5 transition hover:bg-white/40 xl:border-b-0 xl:border-r xl:px-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="max-w-[42rem]">
                      <strong className="block font-display text-[1.22rem] leading-[1.04] tracking-[-0.04em] text-[#11283d]">
                        {listing.detailTitle}
                      </strong>
                      <p className="mt-3 text-[0.98rem] leading-7 text-[#556576]">
                        {listing.detailSummary}
                      </p>
                    </div>
                    <span className="rounded-full border border-[#d8cfbf] bg-[#eef4ef] px-3 py-1 text-[0.64rem] font-extrabold uppercase tracking-[0.16em] text-[#315e53]">
                      {listing.verification}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <MarketMeta label="Location" value={listing.location} />
                    <MarketMeta label="Lot quantity" value={cleanQuantity} />
                    <MarketMeta label="Availability" value={listing.availability} />
                    <MarketMeta label="Purity notes" value={listing.purityNotes} />
                  </div>

                  <div className="mt-5 rounded-[24px] border border-[#e4dbce] bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(247,241,232,0.84))] px-4 py-4">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      <MarketMeta label="Source stream" value={listing.sourceStream} />
                      <MarketMeta label="Concentration" value={listing.concentration} />
                      <MarketMeta label="Packaging" value={listing.packaging} />
                    </div>
                  </div>
                </Link>

                <div className="px-5 py-5 xl:px-6">
                  <span className="text-[0.66rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]">
                    Commercial terms
                  </span>
                  <strong className="mt-3 block font-display text-[2rem] leading-none tracking-[-0.06em] text-[#11283d]">
                    {listing.pricePerTon}
                  </strong>
                  <p className="mt-2 text-[0.84rem] leading-6 text-[#6b756f]">
                    {listing.availableLots} lot{listing.availableLots === 1 ? "" : "s"} available · {listing.openingBid}
                  </p>

                  <div className="mt-6 rounded-[22px] border border-[#e4dbce] bg-white/76 p-4">
                    <span className="text-[0.66rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]">
                      Add to order
                    </span>
                    <div className="mt-3 flex items-center justify-between gap-3 rounded-full border border-[#d8cfbf] bg-[#fbf7ef] px-2 py-2">
                      <button
                        type="button"
                        onClick={() =>
                          setLotSelections((current) => ({
                            ...current,
                            [listing.id]: Math.max(0, selectedLots - 1),
                          }))
                        }
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
                          setLotSelections((current) => ({
                            ...current,
                            [listing.id]: Math.min(listing.availableLots, selectedLots + 1),
                          }))
                        }
                        className="grid h-10 w-10 place-items-center rounded-full border border-[#ddd4c7] bg-white text-lg font-bold text-[#173550]"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => addLots(listing.id, lotsToStage)}
                      className="mt-4 w-full rounded-full bg-[linear-gradient(145deg,#b88b3c,#9f742c)] px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_14px_34px_rgba(184,139,60,0.22)] transition hover:-translate-y-0.5"
                    >
                      {selectedLots === 0
                        ? "Add 1 lot to order"
                        : `Add ${selectedLots} lot${selectedLots === 1 ? "" : "s"} to order`}
                    </button>
                    <p className="mt-3 text-[0.76rem] leading-6 text-[#6b756f]">
                      {stagedLots > 0
                        ? `${stagedLots} lot${stagedLots === 1 ? "" : "s"} already staged from this listing.`
                        : "Stage lots here and refine volume after due diligence."}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-col gap-3">
                    <Link
                      to={`/dashboard/live/${sourceId}/listing/${listing.id}`}
                      className="inline-flex items-center justify-center rounded-full border border-[#cabfae] bg-white/84 px-4 py-3 text-[0.76rem] font-bold uppercase tracking-[0.14em] text-[#173550] transition hover:-translate-y-0.5 hover:border-[#b38a4e]"
                    >
                      View details
                    </Link>
                    <span className="text-[0.74rem] leading-6 text-[#7b7367]">
                      Seller: {listing.sellerName} · {listing.sellerType}
                    </span>
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-4 rounded-[24px] border border-[#ddd4c7] bg-[rgba(255,252,247,0.9)] px-5 py-4 shadow-[0_16px_40px_rgba(46,41,31,0.05)]">
        <p className="text-[0.92rem] leading-7 text-[#556576]">
          Showing {activeListings.length} listings on this page. Use the navigation controls to move across the live category board.
        </p>
        <div className="flex items-center gap-3">
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
  );
}

function MarketMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-[0.64rem] font-extrabold uppercase tracking-[0.16em] text-[#8a7b65]">
        {label}
      </span>
      <p className="mt-2 text-[0.92rem] leading-7 text-[#44505b]">{value}</p>
    </div>
  );
}
