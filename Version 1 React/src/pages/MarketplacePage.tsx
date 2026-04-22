import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { BidListingTable } from "../components/dashboard/BidListingTable";
import { MaterialTileGrid } from "../components/dashboard/MaterialTileGrid";
import { MotionItem, MotionSection } from "../components/ui/Motion";
import { dashboardBidListings, dashboardMaterialTiles } from "../data/dashboardMarketplaceData";
import { pageEnter } from "../lib/motion";

const ExecutiveInsightsGrid = lazy(() =>
  import("../components/charts/ExecutiveInsightsGrid").then((module) => ({
    default: module.ExecutiveInsightsGrid,
  }))
);

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

            <div className="mt-6">
              <Suspense
                fallback={
                  <div className="grid gap-4 lg:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={`insight-skeleton-${index}`}
                        className="h-[285px] rounded-[30px] border border-[#e2d8c9] bg-[linear-gradient(180deg,rgba(255,252,247,0.92),rgba(249,244,236,0.86))]"
                      />
                    ))}
                  </div>
                }
              >
                <ExecutiveInsightsGrid cards={productInsightCards} />
              </Suspense>
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
