import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { BarChart, LineChart } from "../components/ui/ChartPrimitives";
import { MotionItem, MotionSection } from "../components/ui/Motion";
import { dashboardViews } from "../data/marketplaceData";
import { pageEnter } from "../lib/motion";

const pageMotionProps = {
  variants: pageEnter,
  initial: "hidden" as const,
  animate: "visible" as const,
  exit: "exit" as const,
};

export function DashboardPage() {
  const [view, setView] = useState<"supplier" | "recycler">("supplier");
  const cards = useMemo(() => dashboardViews[view], [view]);

  return (
    <motion.main className="page" {...pageMotionProps}>
      <section className="shell page-hero">
        <MotionItem>
          <p className="eyebrow">Dashboard preview</p>
          <h1 className="heading-1">Supplier and recycler views designed for operational execution.</h1>
        </MotionItem>
      </section>

      <MotionSection className="section-gap shell">
        <MotionItem className="dashboard-top">
          <div className="tab-controls">
            <button
              className={`tab-button ${view === "supplier" ? "active" : ""}`}
              onClick={() => setView("supplier")}
              type="button"
            >
              Supplier View
            </button>
            <button
              className={`tab-button ${view === "recycler" ? "active" : ""}`}
              onClick={() => setView("recycler")}
              type="button"
            >
              Recycler View
            </button>
          </div>
        </MotionItem>

        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            className="dashboard-grid"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {cards.map((card) => (
              <article className="dashboard-widget panel float-hover" key={card.title}>
                <span className="widget-value">{card.value}</span>
                <span className="widget-label">{card.title}</span>
                {"items" in card && card.items ? (
                  <div className="widget-list">
                    {card.items.map((item) => (
                      <div className="widget-list-item" key={item.label}>
                        <span>{item.label}</span>
                        <strong>{item.value}</strong>
                      </div>
                    ))}
                  </div>
                ) : null}
                {"chart" in card && card.chart ? <LineChart points={card.chart} /> : null}
                {"bars" in card && card.bars ? <BarChart points={card.bars} /> : null}
              </article>
            ))}
          </motion.div>
        </AnimatePresence>
      </MotionSection>
    </motion.main>
  );
}
