import { motion } from "framer-motion";
import { BidListingTable } from "../components/dashboard/BidListingTable";
import { MaterialTileGrid } from "../components/dashboard/MaterialTileGrid";
import { WidgetCard } from "../components/marketplace/WidgetCard";
import { MotionItem, MotionSection } from "../components/ui/Motion";
import { dashboardBidListings, dashboardMaterialTiles } from "../data/dashboardMarketplaceData";
import { pricingWidgets, trustItems, logisticsSteps, testimonials } from "../data/marketplaceData";
import { pageEnter } from "../lib/motion";

const pageMotionProps = {
  variants: pageEnter,
  initial: "hidden" as const,
  animate: "visible" as const,
  exit: "exit" as const,
};

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

          <div className="testimonial-grid compact">
            {testimonials.slice(0, 2).map((testimonial) => (
              <MotionItem key={testimonial.role}>
                <article className="testimonial-card compact panel">
                  <p>{testimonial.quote}</p>
                  <span className="testimonial-role">{testimonial.role}</span>
                </article>
              </MotionItem>
            ))}
          </div>
        </MotionSection>
      </section>
    </motion.main>
  );
}
