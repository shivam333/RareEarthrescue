import { motion } from "framer-motion";
import { ListingTable } from "../components/marketplace/ListingTable";
import { MotionItem, MotionSection } from "../components/ui/Motion";
import { SectionIntro } from "../components/ui/SectionIntro";
import { listings } from "../data/marketplaceData";
import { pageEnter } from "../lib/motion";

const pageMotionProps = {
  variants: pageEnter,
  initial: "hidden" as const,
  animate: "visible" as const,
  exit: "exit" as const,
};

export function MarketplacePage() {
  return (
    <motion.main className="page" {...pageMotionProps}>
      <section className="shell page-hero">
        <div className="page-hero-grid">
          <MotionItem>
            <p className="eyebrow">Marketplace listings</p>
            <h1 className="heading-1">Search rare-earth-bearing feedstock with institutional-grade filters.</h1>
            <p className="lede">
              Explore verified listings across magnets, motors, HDD assemblies, industrial
              equipment, and intermediate materials. Sort by assay quality, geography, quantity, or
              seller verification.
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

      <section className="section-gap shell marketplace-layout">
        <aside className="filters-sidebar">
          <div className="panel">
            <h3 className="heading-3 mb-4">Filter listings</h3>
            <div className="panel-stack">
              <div className="filter-group">
                <span className="filter-label">Material type</span>
                <div className="filter-row">
                  <button className="chip active" type="button">All</button>
                  <button className="chip" type="button">NdFeB</button>
                  <button className="chip" type="button">SmCo</button>
                  <button className="chip" type="button">Motors</button>
                </div>
              </div>
              <div className="filter-group">
                <span className="filter-label">Geography</span>
                <div className="filter-row">
                  <button className="chip active" type="button">Global</button>
                  <button className="chip" type="button">North America</button>
                  <button className="chip" type="button">Europe</button>
                  <button className="chip" type="button">Asia</button>
                </div>
              </div>
              <div className="filter-group">
                <span className="filter-label">Quantity</span>
                <div className="filter-row">
                  <button className="chip active" type="button">Any</button>
                  <button className="chip" type="button">&lt; 5 MT</button>
                  <button className="chip" type="button">5-20 MT</button>
                  <button className="chip" type="button">20+ MT</button>
                </div>
              </div>
              <div className="filter-group">
                <span className="filter-label">Quality signals</span>
                <div className="filter-row">
                  <button className="chip active" type="button">Any</button>
                  <button className="chip" type="button">Assay available</button>
                  <button className="chip" type="button">Verified seller</button>
                  <button className="chip" type="button">Logistics available</button>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <MotionSection className="table-shell">
          <MotionItem className="toolbar flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <SectionIntro
              eyebrow="Marketplace"
              title="Live marketplace snapshot"
              copy="Example feedstock currently visible to verified buyers across regions and categories."
            />
            <div className="filter-row">
              <button className="chip active" type="button">Newest</button>
              <button className="chip" type="button">Highest quantity</button>
              <button className="chip" type="button">Best assay</button>
              <button className="chip" type="button">Nearest</button>
            </div>
          </MotionItem>

          <MotionItem>
            <ListingTable listings={listings} />
          </MotionItem>

          <div className="card-grid-3">
            {[
              "NdFeB assembly scrap index +4.2% month-over-month on stronger North American demand.",
              "Traction motor and magnet manufacturing scrap remain top watched categories this week.",
              "61% of current listings include document-backed assay or composition metadata.",
            ].map((text) => (
              <MotionItem key={text}>
                <article className="mini-card panel float-hover">
                  <strong>Market signal</strong>
                  <p>{text}</p>
                </article>
              </MotionItem>
            ))}
          </div>
        </MotionSection>
      </section>
    </motion.main>
  );
}
