import { motion } from "framer-motion";
import { BidListingTable } from "../components/dashboard/BidListingTable";
import { MaterialTileGrid } from "../components/dashboard/MaterialTileGrid";
import { MotionItem, MotionSection } from "../components/ui/Motion";
import { dashboardBidListings, dashboardMaterialTiles } from "../data/dashboardMarketplaceData";
import { pageEnter } from "../lib/motion";

const pageMotionProps = {
  variants: pageEnter,
  initial: "hidden" as const,
  animate: "visible" as const,
  exit: "exit" as const,
};

const productInsightCards = [
  {
    value: "142 MT",
    label: "Monthly listed tonnage",
    type: "line" as const,
  },
  {
    value: "8.7%",
    label: "Average bid spread",
    type: "bar" as const,
  },
  {
    value: "NdFeB",
    label: "Top demanded categories",
    type: "list" as const,
    points: [
      { label: "NdFeB magnet scrap", value: "31 bids" },
      { label: "Traction motor feedstock", value: "26 bids" },
      { label: "HDD magnet assemblies", value: "19 bids" },
    ],
  },
  {
    value: "North America",
    label: "Active listings by region",
    type: "map" as const,
  },
];

const productTrustCards = [
  {
    title: "Verified buyer and seller onboarding",
    copy: "Structured workflows help buyers and suppliers transact with better visibility and less manual diligence.",
  },
  {
    title: "KYC and business verification",
    copy: "Counterparty validation creates a cleaner sourcing environment for industrial procurement teams.",
  },
  {
    title: "Material classification standards",
    copy: "Shared listing structure improves how rare-earth-bearing lots are described, compared, and evaluated.",
  },
];

const productWorkflowCards = [
  {
    title: "Listing",
    copy: "Structured upload, media package, composition notes, and lot readiness.",
  },
  {
    title: "Pickup",
    copy: "Freight coordination, pickup scheduling, and cross-border sourcing support.",
  },
  {
    title: "Delivery",
    copy: "Batch consolidation, documentation, and receiving workflows.",
  },
  {
    title: "Settlement",
    copy: "Secure payment, milestone terms, contracting, and order management.",
  },
];

export function MarketplacePage() {
  const previewRows = dashboardBidListings.slice(0, 4);

  return (
    <motion.main className="page" {...pageMotionProps}>
      <section className="shell page-hero">
        <div className="page-hero-grid">
          <MotionItem>
            <p className="eyebrow">Marketplace listings</p>
            <h1 className="heading-1">Search rare-earth-bearing feedstock with institutional-grade filters.</h1>
            <p className="lede">
              Explore verified listings across magnets, motors, HDD assemblies, industrial
              equipment, and intermediate materials. Sort by assay quality, geography, quantity,
              or seller verification.
            </p>
          </MotionItem>
          <MotionItem className="page-hero-visual overflow-hidden">
            <img
              className="h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80"
              alt="Industrial data operations and intelligence screens"
            />
          </MotionItem>
        </div>
      </section>

      <section className="shell pb-2">
        <MotionItem className="rounded-[34px] border border-[#d8cfbf] bg-[linear-gradient(180deg,rgba(255,252,247,0.94),rgba(244,236,224,0.9))] p-6 shadow-[0_28px_80px_rgba(46,41,31,0.08)]">
          <div className="flex flex-col gap-4 border-b border-[#e0d7c9] pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="eyebrow mb-0">Buyer workspace snapshot</p>
              <h2 className="mt-2 font-display text-[1.9rem] leading-[1.02] tracking-[-0.05em] text-[#11283d]">
                A static preview of the logged-in bidding dashboard.
              </h2>
              <p className="mt-3 text-[0.98rem] leading-7 text-[#5a6a78]">
                This shows how verified buyers see item families at the top and a structured bidding
                board below. Material and location details stay blurred in the public view.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {["Static preview", "Buyer workspace", "Sensitive fields blurred"].map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-[#ddd4c7] bg-white/82 px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#173550]"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <MaterialTileGrid tiles={dashboardMaterialTiles} compact />
          </div>

          <div className="mt-6">
            <BidListingTable listings={previewRows} blurred compact />
          </div>
        </MotionItem>
      </section>

      <section className="section-gap shell">
        <MotionSection className="table-shell">
          <MotionItem className="rounded-[34px] border border-[#d8cfbf] bg-[linear-gradient(180deg,rgba(255,252,247,0.95),rgba(244,236,224,0.9))] p-6 shadow-[0_28px_80px_rgba(46,41,31,0.08)] lg:p-7">
            <div className="flex flex-col gap-4 border-b border-[#e0d7c9] pb-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="eyebrow mb-0">Marketplace intelligence</p>
                <h2 className="mt-2 font-display text-[1.95rem] leading-[1.02] tracking-[-0.05em] text-[#11283d]">
                  A static public view of marketplace depth, verification, and transaction structure.
                </h2>
                <p className="mt-3 max-w-[42rem] text-[0.98rem] leading-7 text-[#5a6a78]">
                  This product page stays fixed for all visitors. It highlights how Rare Earth
                  Rescue combines market signals, verification standards, and workflow support
                  around rare-earth-bearing scrap transactions.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {["Public product page", "Static overview", "No login required"].map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full border border-[#ddd4c7] bg-white/82 px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#173550]"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {productInsightCards.map((card, index) => (
                <motion.article
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  className="rounded-[30px] border border-[#e2d8c9] bg-[linear-gradient(180deg,rgba(255,252,247,0.92),rgba(249,244,236,0.86))] p-5 shadow-[0_18px_55px_rgba(46,41,31,0.06)]"
                >
                  <div className="min-h-[13.5rem]">
                    <div className="text-[2.6rem] font-display leading-none tracking-[-0.08em] text-[#11283d] sm:text-[3.1rem]">
                      {card.value}
                    </div>
                    <p className="mt-4 text-[0.76rem] font-bold uppercase tracking-[0.22em] text-[#8b7d6a]">
                      {card.label}
                    </p>

                    {card.type === "line" ? (
                      <div className="mt-7 h-[8.5rem] rounded-[24px] bg-[linear-gradient(180deg,rgba(250,246,238,0.86),rgba(246,239,227,0.72))] p-4">
                        <svg viewBox="0 0 320 140" className="h-full w-full" aria-hidden="true">
                          <path
                            d="M28 18C66 24 76 36 108 48C138 59 154 60 181 74C210 89 232 100 258 105C282 110 294 118 304 122"
                            fill="none"
                            stroke="#b88b31"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M28 18C66 24 76 36 108 48C138 59 154 60 181 74C210 89 232 100 258 105C282 110 294 118 304 122L304 140L28 140Z"
                            fill="rgba(184,139,49,0.12)"
                          />
                        </svg>
                      </div>
                    ) : null}

                    {card.type === "bar" ? (
                      <div className="mt-7 flex h-[8.5rem] items-end justify-center gap-5 rounded-[24px] bg-[linear-gradient(180deg,rgba(250,246,238,0.86),rgba(246,239,227,0.72))] px-6 pb-5 pt-4">
                        {[54, 76, 96, 108, 86].map((height, barIndex) => (
                          <motion.div
                            key={height}
                            initial={{ opacity: 0, y: 10, scaleY: 0.5 }}
                            whileInView={{ opacity: 1, y: 0, scaleY: 1 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.45, delay: barIndex * 0.06 }}
                            className="w-8 rounded-t-[8px] bg-[#9caf81]"
                            style={{ height }}
                          />
                        ))}
                      </div>
                    ) : null}

                    {card.type === "list" ? (
                      <div className="mt-6 grid gap-3">
                        {card.points.map((point, pointIndex) => (
                          <motion.div
                            key={point.label}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.4 }}
                            transition={{ duration: 0.35, delay: pointIndex * 0.06 }}
                            className="flex items-center justify-between rounded-[18px] bg-[#eef2ec] px-4 py-3 text-[0.92rem] text-[#5a6a78]"
                          >
                            <span>{point.label}</span>
                            <strong className="font-semibold text-[#173550]">{point.value}</strong>
                          </motion.div>
                        ))}
                      </div>
                    ) : null}

                    {card.type === "map" ? (
                      <div className="mt-6 flex h-[10rem] items-center justify-center rounded-[24px] bg-[linear-gradient(180deg,rgba(250,246,238,0.86),rgba(246,239,227,0.72))] p-4">
                        <svg viewBox="0 0 360 170" className="h-full w-full" aria-hidden="true">
                          <path
                            d="M36 78C66 56 104 49 133 61C155 71 171 93 201 97C237 102 249 74 290 77C309 79 321 85 334 92"
                            fill="none"
                            stroke="rgba(189,173,141,0.9)"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M62 117C94 96 130 92 154 106C173 118 179 136 207 138C236 140 258 122 289 121C312 120 329 125 344 130"
                            fill="none"
                            stroke="rgba(210,197,174,0.95)"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                          />
                          <motion.circle
                            cx="112"
                            cy="78"
                            r="7"
                            fill="#c1933b"
                            initial={{ scale: 0.8, opacity: 0.7 }}
                            whileInView={{ scale: [0.9, 1.15, 0.9], opacity: [0.7, 1, 0.7] }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 2.2, repeat: Infinity, repeatType: "loop" }}
                          />
                          <motion.circle
                            cx="187"
                            cy="116"
                            r="8"
                            fill="#92aa74"
                            initial={{ scale: 0.8, opacity: 0.7 }}
                            whileInView={{ scale: [0.9, 1.15, 0.9], opacity: [0.7, 1, 0.7] }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 2.2, delay: 0.35, repeat: Infinity, repeatType: "loop" }}
                          />
                          <motion.circle
                            cx="292"
                            cy="84"
                            r="7"
                            fill="#c1933b"
                            initial={{ scale: 0.8, opacity: 0.7 }}
                            whileInView={{ scale: [0.9, 1.15, 0.9], opacity: [0.7, 1, 0.7] }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 2.2, delay: 0.7, repeat: Infinity, repeatType: "loop" }}
                          />
                        </svg>
                      </div>
                    ) : null}
                  </div>
                </motion.article>
              ))}
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              {productTrustCards.map((card, index) => (
                <motion.article
                  key={card.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="rounded-[26px] border border-[#e2d8c9] bg-[linear-gradient(180deg,rgba(255,252,247,0.92),rgba(249,244,236,0.86))] p-5 shadow-[0_18px_55px_rgba(46,41,31,0.06)]"
                >
                  <h3 className="max-w-[16rem] font-display text-[1.02rem] leading-[1.15] tracking-[-0.04em] text-[#173550]">
                    {card.title}
                  </h3>
                  <p className="mt-4 text-[0.96rem] leading-8 text-[#7a746a]">{card.copy}</p>
                </motion.article>
              ))}
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-4">
              {productWorkflowCards.map((card, index) => (
                <motion.article
                  key={card.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="rounded-[26px] border border-[#e2d8c9] bg-[linear-gradient(180deg,rgba(255,252,247,0.92),rgba(249,244,236,0.86))] p-5 shadow-[0_18px_55px_rgba(46,41,31,0.06)]"
                >
                  <h3 className="font-display text-[1.18rem] tracking-[-0.05em] text-[#173550]">
                    {card.title}
                  </h3>
                  <p className="mt-6 text-[0.96rem] leading-8 text-[#7a746a]">{card.copy}</p>
                </motion.article>
              ))}
            </div>
          </MotionItem>
        </MotionSection>
      </section>
    </motion.main>
  );
}
