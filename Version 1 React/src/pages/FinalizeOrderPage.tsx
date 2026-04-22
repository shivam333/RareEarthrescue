import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { dashboardBidListings } from "../data/dashboardMarketplaceData";
import { pageEnter } from "../lib/motion";
import { AppImage } from "../components/ui/AppImage";

const pageMotionProps = {
  variants: pageEnter,
  initial: "hidden" as const,
  animate: "visible" as const,
  exit: "exit" as const,
};

function parsePricePerKg(pricePerTon: string) {
  const match = pricePerTon.match(/[\d,]+(?:\.\d+)?/);
  const perTon = match ? Number(match[0].replace(/,/g, "")) : 0;
  return perTon / 1000;
}

function sanitizeQuantity(value: string) {
  if (!/^\d*(\.\d{0,2})?$/.test(value)) {
    return null;
  }

  return value;
}

export function FinalizeOrderPage() {
  const { listingId } = useParams<{ listingId: string }>();
  const [searchParams] = useSearchParams();
  const listing = useMemo(
    () => dashboardBidListings.find((item) => item.id === listingId) ?? dashboardBidListings[0],
    [listingId]
  );
  const [activeImage, setActiveImage] = useState(0);
  const [quantityTons, setQuantityTons] = useState(searchParams.get("quantity") || "0.00");
  const cleanQuantity = listing.quantity.replace(/\s*per lot/i, "");

  const unitPricePerKg = parsePricePerKg(listing.pricePerTon);
  const quantityValue = Number(quantityTons || 0);
  const totalBid = quantityValue * 1000 * unitPricePerKg;

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
          <Link
            to={`/dashboard/live/${listing.sourceId}`}
            className="inline-flex items-center rounded-full border border-[#d8cfbf] bg-white/80 px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#173550]"
          >
            Back to live marketplace
          </Link>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[110px_minmax(0,1.16fr)_minmax(360px,0.84fr)]">
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
                <AppImage src={image} alt={listing.category} className="h-24 w-full object-cover" />
              </button>
            ))}
          </div>

          <article className="overflow-hidden rounded-[34px] border border-[#d8cfbf] bg-[rgba(255,252,247,0.96)] shadow-[0_28px_80px_rgba(46,41,31,0.08)]">
            <div className="relative min-h-[38rem]">
              <AppImage
                src={listing.images[activeImage]}
                alt={listing.detailTitle}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,40,61,0.02),rgba(17,40,61,0.28))]" />
            </div>
          </article>

          <aside className="rounded-[34px] border border-[#d8cfbf] bg-[linear-gradient(180deg,rgba(255,252,247,0.98),rgba(244,236,224,0.92))] p-6 shadow-[0_28px_80px_rgba(46,41,31,0.08)]">
            <p className="eyebrow !mb-0">Finalize order</p>
            <h1 className="mt-2 font-display text-[2.1rem] leading-[0.98] tracking-[-0.06em] text-[#11283d]">
              {listing.detailTitle}
            </h1>
            <p className="mt-4 text-[1rem] leading-8 text-[#556576]">{listing.detailSummary}</p>

            <div className="mt-6 rounded-[28px] border border-[#e0d7c9] bg-white/84 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="text-[0.66rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]">
                    Bid basis
                  </span>
                  <strong className="mt-2 block font-display text-[2.1rem] leading-none tracking-[-0.06em] text-[#11283d]">
                    ${unitPricePerKg.toFixed(2)} / kg
                  </strong>
                </div>
                <span className="rounded-full border border-[#ddd4c7] bg-[#eef4ef] px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#315e53]">
                  {listing.verification}
                </span>
              </div>

              <div className="mt-5 rounded-[24px] border border-[#cddfce] bg-[linear-gradient(135deg,rgba(233,244,235,0.92),rgba(247,241,232,0.92))] px-5 py-4">
                <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[#315e53]">
                  Seller-managed logistics
                </span>
                <p className="mt-2 text-[0.96rem] leading-7 text-[#44505b]">
                  Pickup scheduling, shipment handling, and lot handoff are managed by the seller after commercial confirmation.
                </p>
              </div>

              <div className="mt-5 grid gap-4">
                <div>
                  <label
                    htmlFor="final-bid-quantity"
                    className="text-[0.66rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]"
                  >
                    Quantity to bid
                  </label>
                  <div className="mt-3 rounded-[28px] border border-[#d8cfbf] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(251,247,239,0.96))] px-6 py-5 shadow-[0_16px_40px_rgba(46,41,31,0.06)]">
                    <input
                      id="final-bid-quantity"
                      type="text"
                      inputMode="decimal"
                      value={quantityTons}
                      onChange={(event) => {
                        const nextValue = sanitizeQuantity(event.target.value);
                        if (nextValue !== null) {
                          setQuantityTons(nextValue);
                        }
                      }}
                      className="w-full border-0 bg-transparent font-display text-[2.4rem] tracking-[-0.05em] text-[#173550] outline-none placeholder:text-[#9c927f]"
                    />
                    <span className="mt-2 block text-[0.74rem] font-bold uppercase tracking-[0.14em] text-[#8a7b65]">
                      Tons · max 2 decimals
                    </span>
                  </div>
                </div>

                <div className="rounded-[24px] border border-[#e4dbce] bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(247,241,232,0.84))] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[0.74rem] font-bold uppercase tracking-[0.14em] text-[#8a7b65]">
                      Total bid
                    </span>
                    <strong className="font-display text-[2rem] tracking-[-0.05em] text-[#11283d]">
                      ${Number.isFinite(totalBid) ? totalBid.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "0.00"}
                    </strong>
                  </div>
                  <p className="mt-3 text-[0.86rem] leading-7 text-[#6b756f]">
                    Calculated from {quantityTons || "0.00"} tons at ${unitPricePerKg.toFixed(2)} per kilogram.
                  </p>
                  <p className="mt-2 text-[0.78rem] leading-6 text-[#6b756f]">
                    Due diligence packs are available for a $50 request fee before commercial confirmation.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                <button
                  type="button"
                  className="rounded-full bg-[linear-gradient(145deg,#b88b3c,#9f742c)] px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_14px_34px_rgba(184,139,60,0.22)] transition hover:-translate-y-0.5"
                >
                  Submit bid request
                </button>
                <button
                  type="button"
                  className="rounded-full border border-[#cabfae] bg-white/84 px-4 py-3 text-sm font-bold text-[#173550]"
                >
                  Save to watchlist
                </button>
                <button
                  type="button"
                  className="rounded-full border border-[#cabfae] bg-white/84 px-4 py-3 text-sm font-bold text-[#173550]"
                >
                  Contact seller through marketplace desk
                </button>
              </div>
            </div>

            <div className="mt-6 rounded-[28px] border border-[#e0d7c9] bg-white/76 p-5">
              <span className="text-[0.66rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]">
                Execution details
              </span>
              <div className="mt-4 grid gap-4">
                {[
                  ["Available lot", cleanQuantity],
                  ["Packaging", listing.packaging],
                  ["Logistics", "Managed by seller after bid confirmation"],
                  ["Due diligence pack", "$50 request fee"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#8a7b65]">
                      {label}
                    </span>
                    <p className="mt-1 text-[0.94rem] leading-7 text-[#44505b]">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-8 grid gap-5 xl:grid-cols-[minmax(0,1fr)_400px]">
          <article className="rounded-[32px] border border-[#d8cfbf] bg-[rgba(255,252,247,0.94)] p-6 shadow-[0_24px_70px_rgba(46,41,31,0.07)]">
            <span className="badge">Order notes</span>
            <h2 className="mt-4 font-display text-[1.55rem] tracking-[-0.05em] text-[#11283d]">
              The bid flow is structured for industrial procurement, not impulse checkout.
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                {
                  title: "Review technical fit",
                  copy: "Check concentration range, source stream, packaging, and purity notes before confirming tonnage.",
                },
                {
                  title: "Confirm commercial basis",
                  copy: "The total bid reflects your entered tonnage at the current opening bid basis in dollars per kilogram.",
                },
                {
                  title: "Marketplace desk support",
                  copy: "Rare Earth Rescue can support due diligence, pickup planning, and commercial clarification before final contract flow.",
                },
                {
                  title: "Next-stage workflow",
                  copy: "This page is the current placeholder for a fuller bid and order submission experience that will follow.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-[24px] border border-[#e0d7c9] bg-white/78 p-4">
                  <strong className="block font-display text-[1.02rem] tracking-[-0.04em] text-[#11283d]">
                    {item.title}
                  </strong>
                  <p className="mt-3 text-[0.92rem] leading-7 text-[#556576]">{item.copy}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[32px] border border-[#d8cfbf] bg-[rgba(255,252,247,0.94)] p-6 shadow-[0_24px_70px_rgba(46,41,31,0.07)]">
            <span className="badge">Listing facts</span>
            <div className="mt-4 grid gap-4">
              {[
                ["Source stream", listing.sourceStream],
                ["Concentration", listing.concentration],
                ["Purity notes", listing.purityNotes],
                ["Availability", listing.availability],
                ["Recovery notes", listing.recoveryNotes],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[22px] border border-[#e0d7c9] bg-white/76 px-4 py-4">
                  <span className="text-[0.64rem] font-extrabold uppercase tracking-[0.16em] text-[#8a7b65]">
                    {label}
                  </span>
                  <p className="mt-2 text-[0.94rem] leading-7 text-[#44505b]">{value}</p>
                </div>
              ))}
            </div>
          </article>
        </section>
      </section>
    </motion.main>
  );
}
