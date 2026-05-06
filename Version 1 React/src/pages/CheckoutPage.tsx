import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecyclerOrderBook } from "../hooks/useRecyclerOrderBook";
import { useSupplierListingStore } from "../hooks/useSupplierListingStore";
import { pageEnter } from "../lib/motion";
import { AppImage } from "../components/ui/AppImage";

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
  const navigate = useNavigate();
  const { orderBook, totalItems, totalLots, setLots } = useRecyclerOrderBook();
  const { mergedLiveListings } = useSupplierListingStore();
  const [buyerReference, setBuyerReference] = useState("");
  const [deliveryContact, setDeliveryContact] = useState("");
  const [deliveryWindow, setDeliveryWindow] = useState("");
  const [purchaseError, setPurchaseError] = useState("");
  const stagedListings = mergedLiveListings.filter((listing) => (orderBook[listing.id] ?? 0) > 0);
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
            className="inline-flex items-center rounded-full border border-[#DCE3EF] bg-white/80 px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#253B80]"
          >
            Back to recycler dashboard
          </Link>
          <span className="rounded-full border border-[#DCE3EF] bg-white/80 px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#C8AA48]">
            Checkout
          </span>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-[34px] border border-[#DCE3EF] bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(244,236,224,0.9))] p-6 shadow-[0_28px_80px_rgba(46,41,31,0.08)]">
            <p className="eyebrow !mb-0">Staged order book</p>
            <h1 className="mt-2 max-w-[14ch] font-display text-[clamp(2.5rem,4vw,4.1rem)] leading-[0.94] tracking-[-0.06em] text-[#0F1115]">
              Review staged lots before moving into secure payment.
            </h1>
            <p className="mt-4 max-w-[44rem] text-[0.98rem] leading-8 text-[#6D7484]">
              This cart sits outside the auction flow. Adjust live listings here, confirm buyer-side delivery details, and move the fixed-price package into payment.
            </p>

            {stagedListings.length === 0 ? (
              <div className="mt-8 rounded-[28px] border border-dashed border-[#DCE3EF] bg-white/72 px-6 py-10 text-center">
                <strong className="block font-display text-[1.4rem] tracking-[-0.04em] text-[#0F1115]">
                  Your cart is empty.
                </strong>
                <p className="mt-3 text-[0.96rem] leading-7 text-[#6D7484]">
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
                      className="grid gap-4 overflow-hidden rounded-[28px] border border-[#DCE3EF] bg-white/82 p-4 lg:grid-cols-[220px_minmax(0,1fr)_220px]"
                    >
                      <AppImage
                        src={listing.image}
                        alt={listing.category}
                        className="h-44 w-full rounded-[22px] object-cover"
                      />

                      <div>
                        <span className="inline-flex rounded-full border border-[#DCE3EF] bg-[#DDF1E8] px-3 py-1 text-[0.66rem] font-extrabold uppercase tracking-[0.16em] text-[#253B80]">
                          {listing.verification}
                        </span>
                        <strong className="mt-3 block font-display text-[1.34rem] leading-[1.02] tracking-[-0.04em] text-[#0F1115]">
                          {listing.detailTitle}
                        </strong>
                        <p className="mt-3 text-[0.94rem] leading-7 text-[#6D7484]">
                          {listing.detailSummary}
                        </p>

                        <div className="mt-4 grid gap-4 md:grid-cols-3">
                          <CheckoutMeta label="Staged lots" value={`${stagedLots} lot${stagedLots === 1 ? "" : "s"}`} />
                          <CheckoutMeta label="Minimum lot size" value={cleanLotQuantity(listing.quantity)} />
                          <CheckoutMeta label="Listed price" value={listing.pricePerTon} />
                        </div>
                      </div>

                      <div className="flex flex-col justify-between gap-3 rounded-[24px] border border-[#DCE3EF] bg-[rgba(251,247,239,0.86)] p-4">
                        <div>
                          <span className="text-[0.66rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                            Est. purchase value
                          </span>
                          <strong className="mt-2 block font-display text-[1.7rem] tracking-[-0.05em] text-[#0F1115]">
                            ${(parsePricePerTon(listing.pricePerTon) * stagedLots).toLocaleString()}
                          </strong>
                          <p className="mt-2 text-[0.8rem] leading-6 text-[#6D7484]">
                            Seller manages logistics after the fixed-price purchase package is confirmed.
                          </p>
                        </div>

                        <div className="grid gap-3">
                          <span className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(145deg,#D9C47A,#C8AA48)] px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_14px_34px_rgba(184,139,60,0.22)]">
                            Ready to buy
                          </span>
                          <Link
                            to={`/dashboard/live/${listing.sourceId}/listing/${listing.id}`}
                            className="inline-flex items-center justify-center rounded-full border border-[#DCE3EF] bg-white/84 px-4 py-3 text-sm font-bold text-[#253B80]"
                          >
                            View details
                          </Link>
                          <button
                            type="button"
                            onClick={() => setLots(listing.id, 0)}
                            className="rounded-full border border-[#F6F8FC] bg-transparent px-4 py-3 text-sm font-bold text-[#6D7484] transition hover:border-[#DCE3EF] hover:text-[#253B80]"
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

          <aside className="rounded-[34px] border border-[#DCE3EF] bg-[rgba(255,252,247,0.94)] p-6 shadow-[0_28px_80px_rgba(46,41,31,0.08)]">
            <span className="badge">Cart summary</span>
            <div className="mt-5 grid gap-4">
              <SummaryStat label="Listings staged" value={`${totalItems}`} />
              <SummaryStat label="Lots staged" value={`${totalLots}`} />
              <SummaryStat label="Est. purchase value" value={`$${estimatedOrderValue.toLocaleString()}`} />
            </div>

            <div className="mt-6 rounded-[26px] border border-[#DCE3EF] bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(247,241,232,0.84))] p-5">
              <strong className="block font-display text-[1.24rem] tracking-[-0.04em] text-[#0F1115]">
                Purchase workflow
              </strong>
              <ul className="mt-4 space-y-3 text-[0.9rem] leading-7 text-[#6D7484]">
                <li>Stage fixed-price lots in the cart and review total purchase exposure.</li>
                <li>Seller-managed logistics remain part of the workflow after the purchase package is confirmed.</li>
                <li>Use the listing details page if you need diligence notes before final confirmation.</li>
              </ul>
            </div>

            <div className="mt-6 rounded-[26px] border border-[#DCE3EF] bg-white/80 p-5">
              <strong className="block font-display text-[1.24rem] tracking-[-0.04em] text-[#0F1115]">
                Purchase handoff details
              </strong>
              <div className="mt-4 grid gap-4">
                <label>
                  <span className="text-[0.64rem] font-extrabold uppercase tracking-[0.16em] text-[#6D7484]">
                    Buyer reference
                  </span>
                  <input
                    value={buyerReference}
                    onChange={(event) => setBuyerReference(event.target.value)}
                    className="mt-2 w-full rounded-[18px] border border-[#DCE3EF] bg-white px-4 py-3 text-[0.94rem] text-[#0F1115] outline-none transition focus:border-[#253B80]"
                    placeholder="Example: June procurement program"
                  />
                </label>
                <label>
                  <span className="text-[0.64rem] font-extrabold uppercase tracking-[0.16em] text-[#6D7484]">
                    Delivery contact
                  </span>
                  <input
                    value={deliveryContact}
                    onChange={(event) => setDeliveryContact(event.target.value)}
                    className="mt-2 w-full rounded-[18px] border border-[#DCE3EF] bg-white px-4 py-3 text-[0.94rem] text-[#0F1115] outline-none transition focus:border-[#253B80]"
                    placeholder="Name, email, or procurement desk"
                  />
                </label>
                <label>
                  <span className="text-[0.64rem] font-extrabold uppercase tracking-[0.16em] text-[#6D7484]">
                    Delivery window
                  </span>
                  <input
                    value={deliveryWindow}
                    onChange={(event) => setDeliveryWindow(event.target.value)}
                    className="mt-2 w-full rounded-[18px] border border-[#DCE3EF] bg-white px-4 py-3 text-[0.94rem] text-[#0F1115] outline-none transition focus:border-[#253B80]"
                    placeholder="Example: Within 10 business days"
                  />
                </label>
              </div>

              {purchaseError ? (
                <p className="mt-4 rounded-[18px] border border-[#E7C98A] bg-[rgba(255,249,238,0.92)] px-4 py-3 text-[0.84rem] leading-6 text-[#7C5A18]">
                  {purchaseError}
                </p>
              ) : null}

              <button
                type="button"
                disabled={stagedListings.length === 0}
                onClick={() => {
                  if (!buyerReference.trim() || !deliveryContact.trim() || !deliveryWindow.trim()) {
                    setPurchaseError("Complete buyer reference, delivery contact, and delivery window before submitting.");
                    return;
                  }

                  setPurchaseError("");
                  const paymentParams = new URLSearchParams({
                    mode: "purchase",
                    reference: buyerReference.trim(),
                    contact: deliveryContact.trim(),
                    window: deliveryWindow.trim(),
                  });
                  navigate(`/dashboard/payment?${paymentParams.toString()}`);
                }}
                className="mt-5 w-full rounded-full bg-[linear-gradient(145deg,#D9C47A,#C8AA48)] px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_14px_34px_rgba(184,139,60,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                Proceed to payment
              </button>
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
      <span className="text-[0.64rem] font-extrabold uppercase tracking-[0.16em] text-[#6D7484]">
        {label}
      </span>
      <p className="mt-2 text-[0.92rem] leading-7 text-[#6D7484]">{value}</p>
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-[#DCE3EF] bg-white/76 px-4 py-4">
      <span className="text-[0.64rem] font-extrabold uppercase tracking-[0.16em] text-[#6D7484]">
        {label}
      </span>
      <strong className="mt-2 block font-display text-[1.5rem] tracking-[-0.04em] text-[#0F1115]">
        {value}
      </strong>
    </div>
  );
}
