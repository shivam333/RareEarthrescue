import { motion } from "framer-motion";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { BidListingTable } from "../components/dashboard/BidListingTable";
import { MaterialTileGrid } from "../components/dashboard/MaterialTileGrid";
import { WidgetCard } from "../components/marketplace/WidgetCard";
import { MotionItem, MotionSection } from "../components/ui/Motion";
import {
  dashboardBidListings,
  dashboardMaterialTiles,
  dashboardSourceContent,
  DashboardSourceId,
} from "../data/dashboardMarketplaceData";
import { pricingWidgets, trustItems, logisticsSteps, testimonials } from "../data/marketplaceData";
import { pageEnter } from "../lib/motion";

const pageMotionProps = {
  variants: pageEnter,
  initial: "hidden" as const,
  animate: "visible" as const,
  exit: "exit" as const,
};

export function MarketplacePage() {
  const [searchParams] = useSearchParams();
  const sourceParam = searchParams.get("source") as DashboardSourceId | null;
  const activeSource = sourceParam && sourceParam in dashboardSourceContent ? sourceParam : "hdd";
  const previewRows = dashboardBidListings.slice(0, 4);
  const sourceListings = useMemo(
    () => dashboardBidListings.filter((listing) => listing.sourceId === activeSource),
    [activeSource]
  );
  const sourceContent = dashboardSourceContent[activeSource];

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
          <MotionItem className="rounded-[34px] border border-[#d8cfbf] bg-[linear-gradient(180deg,rgba(255,252,247,0.94),rgba(244,236,224,0.9))] p-6 shadow-[0_28px_80px_rgba(46,41,31,0.08)]">
            <div className="flex flex-col gap-4 border-b border-[#e0d7c9] pb-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="eyebrow mb-0">{sourceContent.eyebrow}</p>
                <h2 className="mt-2 font-display text-[1.95rem] leading-[1.02] tracking-[-0.05em] text-[#11283d]">
                  {sourceContent.title}
                </h2>
                <p className="mt-3 text-[0.98rem] leading-7 text-[#5a6a78]">{sourceContent.body}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full border border-[#ddd4c7] bg-white/82 px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#173550]">
                  {sourceListings.length} active listings
                </span>
                <span className="rounded-full border border-[#ddd4c7] bg-white/82 px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#173550]">
                  Concentration + verification visible
                </span>
              </div>
            </div>

            <div className="mt-6">
              <MaterialTileGrid tiles={dashboardMaterialTiles} compact />
            </div>

            <div className="mt-6 grid gap-3 lg:grid-cols-5">
              {sourceContent.scrapTypes.map((scrapType) => (
                <div
                  key={scrapType}
                  className="rounded-[22px] border border-[#ddd4c7] bg-white/78 px-4 py-4 text-center text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-[#5f6d79]"
                >
                  {scrapType}
                </div>
              ))}
            </div>

            <div className="mt-6">
              <BidListingTable listings={sourceListings} showTechnicalColumns />
            </div>
          </MotionItem>

          <div className="widget-grid">
            {pricingWidgets.map((widget) => (
              <MotionItem key={widget.label}>
                <WidgetCard {...widget} />
              </MotionItem>
            ))}
          </div>

          <div className="card-grid-3">
            {trustItems.slice(0, 3).map((item) => (
              <MotionItem key={item}>
                <article className="trust-card panel float-hover">
                  <strong>{item}</strong>
                  <p>
                    Structured workflows help buyers and suppliers transact with better visibility and
                    less manual diligence.
                  </p>
                </article>
              </MotionItem>
            ))}
          </div>

          <div className="flow-line">
            {logisticsSteps.map((step) => (
              <MotionItem key={step.title}>
                <article className="flow-step panel">
                  <strong>{step.title}</strong>
                  <p>{step.copy}</p>
                </article>
              </MotionItem>
            ))}
          </div>

          <div className="quote-section">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="eyebrow mb-0">Market voice</p>
                <h2 className="mt-2 font-display text-[1.8rem] leading-[1.02] tracking-[-0.05em] text-[#11283d]">
                  Floating perspective from operators already navigating rare earth recovery workflows.
                </h2>
              </div>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-2">
              {testimonials.slice(0, 2).map((testimonial, index) => (
                <MotionItem key={testimonial.role}>
                  <motion.article
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    whileHover={{ y: -6 }}
                    className="relative overflow-hidden rounded-[32px] border border-[#ddd4c7] bg-[linear-gradient(180deg,rgba(255,252,247,0.82),rgba(245,237,225,0.74))] p-7 shadow-[0_24px_70px_rgba(46,41,31,0.08)]"
                  >
                    <div className="absolute right-6 top-3 font-display text-[5rem] leading-none text-[#e7dbc7]">
                      "
                    </div>
                    <p className="relative z-10 max-w-[30rem] font-display text-[1.35rem] leading-[1.22] tracking-[-0.04em] text-[#11283d]">
                      {testimonial.quote}
                    </p>
                    <div className="mt-6 flex items-center gap-4">
                      <div className="h-14 w-14 overflow-hidden rounded-full border border-[#ddd4c7] bg-white shadow-[0_10px_24px_rgba(46,41,31,0.08)]">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="grid gap-1">
                        <strong className="font-display text-[1rem] tracking-[-0.03em] text-[#11283d]">
                          {testimonial.name}
                        </strong>
                        <span className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#7d7568]">
                          {testimonial.role}
                        </span>
                      </div>
                    </div>
                  </motion.article>
                </MotionItem>
              ))}
            </div>
          </div>
        </MotionSection>
      </section>
    </motion.main>
  );
}
