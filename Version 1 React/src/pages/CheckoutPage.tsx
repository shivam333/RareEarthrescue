import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { dashboardBidListings } from "../data/dashboardMarketplaceData";
import { useRecyclerOrderBook } from "../hooks/useRecyclerOrderBook";
import { pageEnter } from "../lib/motion";

const pageMotionProps = {
  variants: pageEnter,
  initial: "hidden" as const,
  animate: "visible" as const,
  exit: "exit" as const,
};

function cleanLotQuantity(quantity: string) {
  return quantity.replace(/\s*per lot/i, "");
}

function parsePricePerTon(pricePerTon: string) {
  const match = pricePerTon.match(/[\d,]+(?:\.\d+)?/);
  return match ? Number(match[0].replace(/,/g, "")) : 0;
}

export function CheckoutPage() {
  const { orderBook, totalItems, totalLots, setLots } = useRecyclerOrderBook();
  const stagedListings = dashboardBidListings.filter((listing) => (orderBook[listing.id] ?? 0) > 0);
  const estimatedOrderValue = stagedListings.reduce((sum, listing) => {
    const stagedLots = orderBook[listing.id] ?? 0;
    return sum + parsePricePerTon(listing.pricePerTon) * stagedLots;
  }, 0);

  return (
    <motion.main className="page" {...pageMotionProps}>
      <section className="shell section-gap pt-10 lg:pt-14">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center rounded-full border border-[#d8cfbf] bg-white/80 px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#173550]"
          >
            Back to recycler dashboard
          </Link>
          <span className="rounded-full border border-[#d8cfbf] bg-white/80 px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#8d6d39]">
            Checkout
          </span>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-[34px] border border-[#d9cfbf] bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(244,236,224,0.9))] p-6 shadow-[0_28px_80px_rgba(46,41,31,0.08)]">
            <p className="eyebrow !mb-0">Staged order book</p>
            <h1 className="mt-2 max-w-[14ch] font-display text-[clamp(2.5rem,4vw,4.1rem)] leading-[0.94] tracking-[-0.06em] text-[#11283d]">
              Review staged lots before moving into final bid requests.
            </h1>
            <p className="mt-4 max-w-[44rem] text-[0.98rem] leading-8 text-[#556576]">
              Use this cart as a working checkout layer for recycler procurement. Adjust staged lots,
              reopen listing details, or move directly into the bid screen for the selected feedstock.
            </p>

            {stagedListings.length === 0 ? (
              <div className="mt-8 rounded-[28px] border border-dashed border-[#d8cfbf] bg-white/72 px-6 py-10 text-center">
                <strong className="block font-display text-[1.4rem] tracking-[-0.04em] text-[#11283d]">
                  Your cart is empty.
                </strong>
                <p className="mt-3 text-[0.96rem] leading-7 text-[#5a6a78]">
                  Add lots from any live recycler marketplace to build your checkout basket.
                </p>
                <Link className="button-primary mt-6 inline-flex" to="/dashboard">
                  Browse live marketplaces
                </Link>
              </div>
            ) : (
              <div className="mt-8 space-y-4">
                {stagedListings.map((listing, index) => {
                  const stagedLots = orderBook[listing.id] ?? 0;

                  return (
                    <motion.article
                      key={listing.id}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.1 }}
                      transition={{ duration: 0.35, delay: index * 0.04 }}
                      className="grid gap-4 overflow-hidden rounded-[28px] border border-[#ddd4c7] bg-white/82 p-4 lg:grid-cols-[220px_minmax(0,1fr)_220px]"
                    >
                      <img
                        src={listing.image}
                        alt={listing.category}
                        className="h-44 w-full rounded-[22px] object-cover"
                      />

                      <div>
                        <span className="inline-flex rounded-full border border-[#ddd4c7] bg-[#eef4ef] px-3 py-1 text-[0.66rem] font-extrabold uppercase tracking-[0.16em] text-[#315e53]">
                          {listing.verification}
                        </span>
                        <strong className="mt-3 block font-display text-[1.34rem] leading-[1.02] tracking-[-0.04em] text-[#11283d]">
                          {listing.detailTitle}
                        </strong>
                        <p className="mt-3 text-[0.94rem] leading-7 text-[#556576]">
                          {listing.detailSummary}
                        </p>

                        <div className="mt-4 grid gap-4 md:grid-cols-3">
                          <CheckoutMeta label="Staged lots" value={`${stagedLots} lot${stagedLots === 1 ? "" : "s"}`} />
                          <CheckoutMeta label="Minimum lot size" value={cleanLotQuantity(listing.quantity)} />
                          <CheckoutMeta label="Bid basis" value={listing.pricePerTon} />
                        </div>
                      </div>

                      <div className="flex flex-col justify-between gap-3 rounded-[24px] border border-[#e0d7c9] bg-[rgba(251,247,239,0.86)] p-4">
                        <div>
                          <span className="text-[0.66rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]">
                            Est. staged value
                          </span>
                          <strong className="mt-2 block font-display text-[1.7rem] tracking-[-0.05em] text-[#11283d]">
                            ${(parsePricePerTon(listing.pricePerTon) * stagedLots).toLocaleString()}
                          </strong>
                          <p className="mt-2 text-[0.8rem] leading-6 text-[#6b756f]">
                            Seller manages logistics after bid confirmation and lot award.
                          </p>
                        </div>

                        <div className="grid gap-3">
                          <Link
                            to={`/dashboard/place-order/${listing.id}`}
                            className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(145deg,#b88b3c,#9f742c)] px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_14px_34px_rgba(184,139,60,0.22)] transition hover:-translate-y-0.5"
                          >
                            Continue to bid
                          </Link>
                          <Link
                            to={`/dashboard/live/${listing.sourceId}/listing/${listing.id}`}
                            className="inline-flex items-center justify-center rounded-full border border-[#cabfae] bg-white/84 px-4 py-3 text-sm font-bold text-[#173550]"
                          >
                            View details
                          </Link>
                          <button
                            type="button"
                            onClick={() => setLots(listing.id, 0)}
                            className="rounded-full border border-[#e1d7c7] bg-transparent px-4 py-3 text-sm font-bold text-[#7f6d53] transition hover:border-[#cabfae] hover:text-[#173550]"
                          >
                            Remove from cart
                          </button>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            )}
          </section>

          <aside className="rounded-[34px] border border-[#d9cfbf] bg-[rgba(255,252,247,0.94)] p-6 shadow-[0_28px_80px_rgba(46,41,31,0.08)]">
            <span className="badge">Cart summary</span>
            <div className="mt-5 grid gap-4">
              <SummaryStat label="Listings staged" value={`${totalItems}`} />
              <SummaryStat label="Lots staged" value={`${totalLots}`} />
              <SummaryStat label="Est. order value" value={`$${estimatedOrderValue.toLocaleString()}`} />
            </div>

            <div className="mt-6 rounded-[26px] border border-[#e0d7c9] bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(247,241,232,0.84))] p-5">
              <strong className="block font-display text-[1.24rem] tracking-[-0.04em] text-[#11283d]">
                Checkout guidance
              </strong>
              <ul className="mt-4 space-y-3 text-[0.9rem] leading-7 text-[#556576]">
                <li>Stage lots first, then enter exact bid quantity on the next screen.</li>
                <li>Seller-managed logistics remain part of the commercial workflow after bid acceptance.</li>
                <li>Due diligence packs can be requested for $50 before final commitment.</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </motion.main>
  );
}

function CheckoutMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-[0.64rem] font-extrabold uppercase tracking-[0.16em] text-[#8a7b65]">
        {label}
      </span>
      <p className="mt-2 text-[0.92rem] leading-7 text-[#44505b]">{value}</p>
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-[#e0d7c9] bg-white/76 px-4 py-4">
      <span className="text-[0.64rem] font-extrabold uppercase tracking-[0.16em] text-[#8a7b65]">
        {label}
      </span>
      <strong className="mt-2 block font-display text-[1.5rem] tracking-[-0.04em] text-[#11283d]">
        {value}
      </strong>
    </div>
  );
}
