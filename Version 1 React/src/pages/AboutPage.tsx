import { motion } from "framer-motion";
import { MotionItem, MotionSection } from "../components/ui/Motion";
import { SectionIntro } from "../components/ui/SectionIntro";
import { pageEnter } from "../lib/motion";

const pageMotionProps = {
  variants: pageEnter,
  initial: "hidden" as const,
  animate: "visible" as const,
  exit: "exit" as const,
};

export function AboutPage() {
  return (
    <motion.main className="page" {...pageMotionProps}>
      <section className="shell page-hero">
        <MotionItem>
          <p className="eyebrow">About</p>
          <h1 className="heading-1">The digital infrastructure layer for rare earth recycling supply chains.</h1>
          <p className="lede">
            Rare Earth Rescue exists to make fragmented secondary supply more legible, tradable,
            verifiable, and strategically useful for an industry under pressure to secure circular
            critical mineral inputs.
          </p>
        </MotionItem>
      </section>

      <MotionSection className="section-gap shell about-shell">
        <div className="comparison-grid">
          <MotionItem>
            <article className="panel p-6">
              <h3 className="heading-3">Our thesis</h3>
              <p className="mt-4 body-copy">
                Rare-earth-bearing scrap is commercially important but operationally difficult.
                Supply is fragmented, quality data is inconsistent, and too many transactions still
                depend on ad hoc relationships instead of market infrastructure.
              </p>
            </article>
          </MotionItem>
          <MotionItem>
            <article className="panel p-6">
              <h3 className="heading-3">Our role</h3>
              <p className="mt-4 body-copy">
                We are building the marketplace, verification layer, and procurement intelligence
                stack that helps suppliers and recyclers transact with more trust and less friction.
              </p>
            </article>
          </MotionItem>
        </div>

        <div className="card-grid-3">
          {[
            {
              title: "For operators",
              copy: "Better price discovery, clearer counterparties, and more structured transaction workflows.",
            },
            {
              title: "For procurement teams",
              copy: "Improved visibility into secondary sourcing options across categories and regions.",
            },
            {
              title: "For investors and partners",
              copy: "A category-defining platform for circular critical mineral supply chains.",
            },
          ].map((item) => (
            <MotionItem key={item.title}>
              <article className="mini-card panel float-hover">
                <strong>{item.title}</strong>
                <p>{item.copy}</p>
              </article>
            </MotionItem>
          ))}
        </div>

        <div className="page-grid">
          <MotionItem>
            <article className="panel p-6">
              <SectionIntro
                eyebrow="Macro context"
                title="Why rare earth recycling now"
                copy="EVs, wind, robotics, advanced electronics, and defense manufacturing are all raising the strategic importance of magnet materials and rare earth elements. Recycling and recovery create a secondary sourcing channel that is more resilient, more circular, and increasingly more valuable."
              />
            </article>
          </MotionItem>
          <MotionItem className="page-hero-visual overflow-hidden">
            <img
              className="h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1581092334394-2f5adab4c31d?auto=format&fit=crop&w=1400&q=80"
              alt="Industrial manufacturing environment"
            />
          </MotionItem>
        </div>
      </MotionSection>
    </motion.main>
  );
}
