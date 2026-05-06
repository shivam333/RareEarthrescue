import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AppImage } from "../components/ui/AppImage";
import { useRecyclerOrderBook } from "../hooks/useRecyclerOrderBook";
import { useSupplierListingStore } from "../hooks/useSupplierListingStore";
import { pageEnter } from "../lib/motion";

const pageMotionProps = {
  variants: pageEnter,
  initial: "hidden" as const,
  animate: "visible" as const,
  exit: "exit" as const,
};

function parsePricePerTon(pricePerTon: string) {
  const match = pricePerTon.match(/[\d,]+(?:\.\d+)?/);
  return match ? Number(match[0].replace(/,/g, "")) : 0;
}

export function PaymentPage() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") === "diligence" ? "diligence" : "purchase";
  const listingId = searchParams.get("listingId");
  const buyerReference = searchParams.get("reference") ?? "";
  const deliveryContact = searchParams.get("contact") ?? "";
  const deliveryWindow = searchParams.get("window") ?? "";

  const { orderBook, totalItems, totalLots, clearOrderBook } = useRecyclerOrderBook();
  const { mergedLiveListings, mergedAuctionListings } = useSupplierListingStore();
  const [cardholderName, setCardholderName] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [billingZip, setBillingZip] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [submittedSummary, setSubmittedSummary] = useState<{
    amount: number;
    title: string;
    detail: string;
  } | null>(null);

  const stagedListings = useMemo(
    () => mergedLiveListings.filter((listing) => (orderBook[listing.id] ?? 0) > 0),
    [mergedLiveListings, orderBook]
  );

  const diligenceListing = useMemo(
    () =>
      mergedLiveListings.find((listing) => listing.id === listingId) ??
      mergedAuctionListings.find((listing) => listing.id === listingId) ??
      null,
    [listingId, mergedAuctionListings, mergedLiveListings]
  );

  const purchaseAmount = stagedListings.reduce((sum, listing) => {
    const stagedLots = orderBook[listing.id] ?? 0;
    return sum + parsePricePerTon(listing.pricePerTon) * stagedLots;
  }, 0);

  const amountDue = mode === "diligence" ? 50 : purchaseAmount;
  const canSubmitPurchase = mode === "purchase" ? stagedListings.length > 0 : Boolean(diligenceListing);

  const paymentTitle =
    mode === "diligence"
      ? "Request due diligence access before commercial commitment."
      : "Move staged fixed-price lots into a secure payment step.";

  const paymentDetail =
    mode === "diligence"
      ? "The diligence fee unlocks supporting assay references, image review, and structured marketplace notes for this lot."
      : "Payment creates the commercial handoff for listed lots while seller-managed logistics and documentation continue through the marketplace.";

  return (
    <motion.main className="page" {...pageMotionProps}>
      <section className="shell section-gap pt-10 lg:pt-14">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to={mode === "diligence" && diligenceListing ? `/dashboard/live/${diligenceListing.sourceId}/listing/${diligenceListing.id}` : "/dashboard/checkout"}
            className="inline-flex items-center rounded-full border border-[#DCE3EF] bg-white/80 px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#253B80]"
          >
            Back
          </Link>
          <span className="rounded-full border border-[#DCE3EF] bg-white/80 px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#C8AA48]">
            Payment
          </span>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_400px]">
          <section className="rounded-[34px] border border-[#DCE3EF] bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(244,236,224,0.9))] p-6 shadow-[0_28px_80px_rgba(46,41,31,0.08)]">
            <p className="eyebrow !mb-0">{mode === "diligence" ? "Diligence payment" : "Purchase payment"}</p>
            <h1 className="mt-2 max-w-[14ch] font-display text-[clamp(2.5rem,4vw,4.1rem)] leading-[0.94] tracking-[-0.06em] text-[#0F1115]">
              {paymentTitle}
            </h1>
            <p className="mt-4 max-w-[46rem] text-[0.98rem] leading-8 text-[#6D7484]">{paymentDetail}</p>

            {mode === "purchase" ? (
              stagedListings.length === 0 ? (
                <div className="mt-8 rounded-[28px] border border-dashed border-[#DCE3EF] bg-white/72 px-6 py-10 text-center">
                  <strong className="block font-display text-[1.4rem] tracking-[-0.04em] text-[#0F1115]">
                    There are no staged purchase items.
                  </strong>
                  <p className="mt-3 text-[0.96rem] leading-7 text-[#6D7484]">
                    Return to the live marketplace, add fixed-price lots to cart, and then continue into payment.
                  </p>
                  <Link className="button-primary mt-6 inline-flex" to="/dashboard">
                    Browse live marketplaces
                  </Link>
                </div>
              ) : (
                <div className="mt-8 space-y-4">
                  {stagedListings.map((listing) => {
                    const stagedLots = orderBook[listing.id] ?? 0;

                    return (
                      <article
                        key={listing.id}
                        className="grid gap-4 overflow-hidden rounded-[28px] border border-[#DCE3EF] bg-white/82 p-4 lg:grid-cols-[160px_minmax(0,1fr)_180px]"
                      >
                        <AppImage
                          src={listing.image}
                          alt={listing.category}
                          className="h-36 w-full rounded-[22px] object-cover"
                        />
                        <div>
                          <strong className="block font-display text-[1.22rem] leading-[1.04] tracking-[-0.04em] text-[#0F1115]">
                            {listing.detailTitle}
                          </strong>
                          <p className="mt-2 text-[0.92rem] leading-7 text-[#6D7484]">{listing.detailSummary}</p>
                          <div className="mt-4 grid gap-3 md:grid-cols-3">
                            <PaymentMeta label="Staged quantity" value={`${stagedLots} lot${stagedLots === 1 ? "" : "s"}`} />
                            <PaymentMeta label="Price basis" value={listing.pricePerTon} />
                            <PaymentMeta label="Seller logistics" value="Managed by seller" />
                          </div>
                        </div>
                        <div className="rounded-[22px] border border-[#DCE3EF] bg-[rgba(251,247,239,0.86)] px-4 py-4">
                          <span className="text-[0.66rem] font-extrabold uppercase tracking-[0.16em] text-[#6D7484]">
                            Estimated total
                          </span>
                          <strong className="mt-2 block font-display text-[1.6rem] tracking-[-0.05em] text-[#0F1115]">
                            ${(parsePricePerTon(listing.pricePerTon) * stagedLots).toLocaleString()}
                          </strong>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )
            ) : diligenceListing ? (
              <article className="mt-8 grid gap-4 overflow-hidden rounded-[28px] border border-[#DCE3EF] bg-white/82 p-4 lg:grid-cols-[220px_minmax(0,1fr)]">
                <AppImage
                  src={diligenceListing.image}
                  alt={diligenceListing.category}
                  className="h-48 w-full rounded-[22px] object-cover"
                />
                <div>
                  <span className="inline-flex rounded-full border border-[#DCE3EF] bg-[#DDF1E8] px-3 py-1 text-[0.66rem] font-extrabold uppercase tracking-[0.16em] text-[#253B80]">
                    {diligenceListing.verification}
                  </span>
                  <strong className="mt-3 block font-display text-[1.4rem] leading-[1.04] tracking-[-0.04em] text-[#0F1115]">
                    {diligenceListing.detailTitle}
                  </strong>
                  <p className="mt-3 text-[0.94rem] leading-7 text-[#6D7484]">{diligenceListing.detailSummary}</p>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <PaymentMeta label="Due diligence fee" value="$50 flat fee" />
                    <PaymentMeta label="Commercial context" value={diligenceListing.pricePerTon} />
                    <PaymentMeta label="Pack includes" value="Assay refs + media review" />
                  </div>
                </div>
              </article>
            ) : (
              <div className="mt-8 rounded-[28px] border border-dashed border-[#DCE3EF] bg-white/72 px-6 py-10 text-center">
                <strong className="block font-display text-[1.4rem] tracking-[-0.04em] text-[#0F1115]">
                  This diligence request could not be loaded.
                </strong>
                <p className="mt-3 text-[0.96rem] leading-7 text-[#6D7484]">
                  Return to the listing detail page and try the diligence request again.
                </p>
              </div>
            )}
          </section>

          <aside className="rounded-[34px] border border-[#DCE3EF] bg-[rgba(255,252,247,0.94)] p-6 shadow-[0_28px_80px_rgba(46,41,31,0.08)]">
            <span className="badge">Payment summary</span>
            <div className="mt-5 grid gap-4">
              <SummaryStat label={mode === "diligence" ? "Charge type" : "Listings staged"} value={mode === "diligence" ? "Due diligence pack" : `${totalItems}`} />
              <SummaryStat label={mode === "diligence" ? "Service fee" : "Lots staged"} value={mode === "diligence" ? "$50" : `${totalLots}`} />
              <SummaryStat label="Amount due" value={`$${amountDue.toLocaleString()}`} />
            </div>

            {mode === "purchase" && (buyerReference || deliveryContact || deliveryWindow) ? (
              <div className="mt-6 rounded-[26px] border border-[#DCE3EF] bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(247,241,232,0.84))] p-5">
                <strong className="block font-display text-[1.24rem] tracking-[-0.04em] text-[#0F1115]">
                  Procurement details
                </strong>
                <div className="mt-4 grid gap-4">
                  <PaymentMeta label="Buyer reference" value={buyerReference || "Not provided"} />
                  <PaymentMeta label="Delivery contact" value={deliveryContact || "Not provided"} />
                  <PaymentMeta label="Delivery window" value={deliveryWindow || "Not provided"} />
                </div>
              </div>
            ) : null}

            <div className="mt-6 rounded-[26px] border border-[#DCE3EF] bg-white/80 p-5">
              <strong className="block font-display text-[1.24rem] tracking-[-0.04em] text-[#0F1115]">
                Payment method
              </strong>
              <div className="mt-4 grid gap-4">
                <PaymentInput
                  label="Cardholder name"
                  value={cardholderName}
                  onChange={setCardholderName}
                  placeholder="Name on card"
                />
                <PaymentInput
                  label="Billing email"
                  value={billingEmail}
                  onChange={setBillingEmail}
                  placeholder="you@company.com"
                />
                <PaymentInput
                  label="Company"
                  value={companyName}
                  onChange={setCompanyName}
                  placeholder="Organization name"
                />
                <PaymentInput
                  label="Card number"
                  value={cardNumber}
                  onChange={setCardNumber}
                  placeholder="4242 4242 4242 4242"
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <PaymentInput
                    label="Expiry"
                    value={expiryDate}
                    onChange={setExpiryDate}
                    placeholder="MM/YY"
                  />
                  <PaymentInput
                    label="Security code"
                    value={securityCode}
                    onChange={setSecurityCode}
                    placeholder="CVC"
                  />
                </div>
                <PaymentInput
                  label="Billing ZIP"
                  value={billingZip}
                  onChange={setBillingZip}
                  placeholder="ZIP / postal code"
                />
              </div>

              {paymentError ? (
                <p className="mt-4 rounded-[18px] border border-[#E7C98A] bg-[rgba(255,249,238,0.92)] px-4 py-3 text-[0.84rem] leading-6 text-[#7C5A18]">
                  {paymentError}
                </p>
              ) : null}

              {submittedSummary ? (
                <div className="mt-4 rounded-[20px] border border-[#DDF1E8] bg-[rgba(233,244,235,0.92)] px-4 py-4 text-[0.88rem] leading-7 text-[#253B80]">
                  <strong className="block font-display text-[1.04rem] tracking-[-0.04em] text-[#0F1115]">
                    Payment submitted
                  </strong>
                  <p className="mt-2">
                    {submittedSummary.title} for ${submittedSummary.amount.toLocaleString()} is now in marketplace processing.
                  </p>
                  <p className="mt-1">{submittedSummary.detail}</p>
                </div>
              ) : null}

              <button
                type="button"
                disabled={!canSubmitPurchase}
                onClick={() => {
                  if (
                    !cardholderName.trim() ||
                    !billingEmail.trim() ||
                    !companyName.trim() ||
                    !cardNumber.trim() ||
                    !expiryDate.trim() ||
                    !securityCode.trim() ||
                    !billingZip.trim()
                  ) {
                    setPaymentError("Complete all payment fields before submitting.");
                    return;
                  }

                  if (cardNumber.replace(/\s+/g, "").length < 12) {
                    setPaymentError("Enter a valid card number to continue.");
                    return;
                  }

                  if (securityCode.replace(/\D/g, "").length < 3) {
                    setPaymentError("Enter a valid security code.");
                    return;
                  }

                  setPaymentError("");

                  if (mode === "purchase") {
                    setSubmittedSummary({
                      amount: amountDue,
                      title: `${totalLots} lot${totalLots === 1 ? "" : "s"} across ${totalItems} listing${totalItems === 1 ? "" : "s"}`,
                      detail: "The marketplace desk will confirm seller-managed logistics, availability, and commercial paperwork next.",
                    });
                    clearOrderBook();
                    return;
                  }

                  setSubmittedSummary({
                    amount: 50,
                    title: "Due diligence access",
                    detail: "The diligence pack request has been queued for marketplace review and release.",
                  });
                }}
                className="mt-5 w-full rounded-full bg-[linear-gradient(145deg,#D9C47A,#C8AA48)] px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_14px_34px_rgba(184,139,60,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {mode === "diligence" ? "Pay and request diligence" : "Pay and complete purchase"}
              </button>
            </div>
          </aside>
        </div>
      </section>
    </motion.main>
  );
}

function PaymentInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (nextValue: string) => void;
  placeholder: string;
}) {
  return (
    <label>
      <span className="text-[0.64rem] font-extrabold uppercase tracking-[0.16em] text-[#6D7484]">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-[18px] border border-[#DCE3EF] bg-white px-4 py-3 text-[0.94rem] text-[#0F1115] outline-none transition focus:border-[#253B80]"
        placeholder={placeholder}
      />
    </label>
  );
}

function PaymentMeta({ label, value }: { label: string; value: string }) {
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
