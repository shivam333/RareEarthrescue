import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ListingTable } from "../components/marketplace/ListingTable";
import { StepTimeline } from "../components/marketplace/StepTimeline";
import { WidgetCard } from "../components/marketplace/WidgetCard";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { CountUpStat } from "../components/ui/CountUpStat";
import { MotionItem, MotionSection } from "../components/ui/Motion";
import { SectionIntro } from "../components/ui/SectionIntro";
import {
  feedstockCategories,
  heroStats,
  listings,
  logisticsSteps,
  participantTabs,
  partnerLogos,
  pricingWidgets,
  problemCards,
  testimonials,
  trustItems,
  workflowTabs,
} from "../data/marketplaceData";
import { pageEnter } from "../lib/motion";

const pageMotionProps = {
  variants: pageEnter,
  initial: "hidden" as const,
  animate: "visible" as const,
  exit: "exit" as const,
};

gsap.registerPlugin(useGSAP, ScrollTrigger);

const heroFeatureCards = [
  {
    title: "Structured feedstock discovery",
    copy: `Explore ${feedstockCategories.length} mapped categories of rare-earth-bearing supply from dismantlers, ITAD networks, processors, and scrap generators.`,
  },
  {
    title: "Assured quality and diligence",
    copy: "Work with verified counterparties, assay-backed lots, and traceable quality signals before entering procurement conversations.",
  },
  {
    title: "One marketplace workflow",
    copy: "Move from listing and search to bids, logistics coordination, and settlement in one marketplace operating layer.",
  },
  {
    title: "Tailored sourcing paths",
    copy: "Different flows for suppliers, recyclers, and procurement teams, shaped around how industrial feedstock is actually bought and sold.",
  },
];

export function HomePage() {
  const [workflowView, setWorkflowView] = useState<"suppliers" | "recyclers">("suppliers");
  const [participantView, setParticipantView] = useState(participantTabs[0].id);
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [heroSearch, setHeroSearch] = useState("NdFeB magnets");
  const heroScope = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.documentElement.classList.add("home-scroll-mode");
    document.body.classList.add("home-scroll-mode");

    return () => {
      document.documentElement.classList.remove("home-scroll-mode");
      document.body.classList.remove("home-scroll-mode");
    };
  }, []);

  useGSAP(
    () => {
      const heroTimeline = gsap.timeline({
        defaults: {
          duration: 0.9,
          ease: "power3.out",
        },
      });

      heroTimeline
        .from("[data-gsap='hero-learn']", { autoAlpha: 0, y: 18 })
        .from(
          "[data-gsap='hero-heading']",
          { autoAlpha: 0, y: 36, filter: "blur(8px)" },
          "-=0.55"
        )
        .from("[data-gsap='hero-copy']", { autoAlpha: 0, y: 26 }, "-=0.5")
        .from("[data-gsap='hero-search']", { autoAlpha: 0, y: 24, scale: 0.98 }, "-=0.45")
        .from("[data-gsap='hero-trending']", { autoAlpha: 0, y: 20 }, "-=0.45")
        .from(
          "[data-gsap='hero-card']",
          {
            autoAlpha: 0,
            y: 36,
            stagger: 0.1,
          },
          "-=0.35"
        );

      gsap.to("[data-gsap='hero-media']", {
        yPercent: 8,
        scale: 1.04,
        ease: "none",
        scrollTrigger: {
          trigger: heroScope.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: heroScope }
  );

  const activeWorkflow = workflowTabs[workflowView];
  const activeParticipant = useMemo(
    () => participantTabs.find((item) => item.id === participantView) ?? participantTabs[0],
    [participantView]
  );

  const storyParticipants = participantTabs.slice(0, 4);
  const featuredListings = listings.slice(0, 2);
  const featuredCategories = feedstockCategories.slice(0, 4);
  const featuredTrust = trustItems.slice(0, 4);
  const featuredStats = heroStats.slice(0, 4);
  const featuredTestimonials = testimonials.slice(0, 2);

  return (
    <motion.main className="page home-page" {...pageMotionProps}>
      <section className="home-screen hero-screen" ref={heroScope}>
        <div className="hero-band">
          <div className="hero-media" data-gsap="hero-media" />
          <div className="hero-overlay" />
          <div className="shell hero-shell">
            <MotionItem className="hero-copy hero-copy-immersive">
              <div className="hero-learn" data-gsap="hero-learn">
                <span className="hero-learn-dot" />
                Learn about Rare Earth Rescue
              </div>
              <h1 className="heading-1 hero-heading" data-gsap="hero-heading">
                The leading B2B marketplace for recycled rare earth feedstock.
              </h1>
              <p className="lede hero-lede" data-gsap="hero-copy">
                Source and sell magnet scrap, motor feedstock, HDD assemblies, and assay-backed rare
                earth material streams through one industrial marketplace.
              </p>

              <div className="hero-search" data-gsap="hero-search" role="search">
                <input
                  aria-label="Search feedstock"
                  onChange={(event) => setHeroSearch(event.target.value)}
                  type="text"
                  value={heroSearch}
                />
                <Button href="/marketplace" className="hero-search-button">
                  Search
                </Button>
              </div>

              <div className="hero-trending" data-gsap="hero-trending">
                <span>Frequently searched:</span>
                <div className="hero-pills hero-pills-dark">
                  {feedstockCategories.slice(0, 4).map((category) => (
                    <span className="hero-pill hero-pill-dark" key={category.title}>
                      {category.title}
                    </span>
                  ))}
                </div>
              </div>
            </MotionItem>
          </div>
        </div>

        <div className="shell hero-card-section">
          <div className="hero-card-grid">
            {heroFeatureCards.map((card) => (
              <MotionItem key={card.title}>
                <article className="hero-feature-card" data-gsap="hero-card">
                  <div className="hero-feature-icon" />
                  <h3>{card.title}</h3>
                  <p>{card.copy}</p>
                </article>
              </MotionItem>
            ))}
          </div>
        </div>
      </section>

      <MotionSection className="home-screen shell stories-screen">
        <div className="stories-screen-layout">
          <MotionItem className="logo-strip-section compact">
            <div className="logo-strip-intro">
              <p className="eyebrow">Marketplace ecosystem</p>
              <p className="body-copy">
                Designed for the participants already generating, aggregating, buying, and
                processing rare-earth-bearing material streams.
              </p>
            </div>
            <div className="logo-strip">
              {partnerLogos.map((logo) => (
                <div className="logo-pill" key={logo}>
                  {logo}
                </div>
              ))}
            </div>
          </MotionItem>

          <div className="stories-content">
            <MotionItem>
              <SectionIntro
                eyebrow="Customer stories"
                title="A homepage that moves in complete screens, not a continuous wall of content."
                copy="Each snap now carries one idea: ecosystem fit, role-specific value, and real operating use cases for the marketplace."
              />
            </MotionItem>

            <div className="story-grid compact">
              {storyParticipants.map((participant, index) => (
                <MotionItem key={participant.id}>
                  <article className="story-card panel compact">
                    <span className="story-index">{String(index + 1).padStart(2, "0")}</span>
                    <Badge outline>{participant.label}</Badge>
                    <h3 className="heading-3">{participant.title}</h3>
                    <p className="body-copy">{participant.value}</p>
                    <p className="story-usecase">{participant.useCase}</p>
                  </article>
                </MotionItem>
              ))}
            </div>
          </div>
        </div>
      </MotionSection>

      <MotionSection className="home-screen shell solution-screen">
        <div className="solution-grid">
          <div className="solution-column">
            <MotionItem>
              <SectionIntro
                eyebrow="Pain points"
                title="Critical material circularity is valuable, but the market is still operationally fragmented."
                copy="Suppliers lack consistent characterization and specialist buyer access. Recyclers struggle to source repeatable lots with clear quality signals, logistics assumptions, and counterparty confidence."
              />
            </MotionItem>

            <div className="problem-grid compact">
              {problemCards.map((card) => (
                <MotionItem key={card.title}>
                  <article className="issue-card panel compact">
                    <span className="issue-index">{card.index}</span>
                    <h3 className="heading-3">{card.title}</h3>
                    <p>{card.copy}</p>
                  </article>
                </MotionItem>
              ))}
            </div>
          </div>

          <div className="response-shell compact">
            <MotionItem className="response-header compact">
              <SectionIntro
                eyebrow="Platform response"
                title="A cleaner sourcing flow for both sides of the marketplace."
                copy="The experience is organized around the real transaction path: structured upload, technical context, verified matching, and delivery coordination."
              />
              <div className="tab-controls">
                <button
                  className={`tab-button ${workflowView === "suppliers" ? "active" : ""}`}
                  onClick={() => setWorkflowView("suppliers")}
                  type="button"
                >
                  For Suppliers
                </button>
                <button
                  className={`tab-button ${workflowView === "recyclers" ? "active" : ""}`}
                  onClick={() => setWorkflowView("recyclers")}
                  type="button"
                >
                  For Recyclers
                </button>
              </div>
            </MotionItem>

            <div className="response-grid compact">
              <AnimatePresence mode="wait">
                <motion.div
                  className="response-main"
                  key={workflowView}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <StepTimeline items={activeWorkflow} />
                </motion.div>
              </AnimatePresence>

              <MotionItem className="panel response-aside compact">
                <p className="eyebrow">Why this structure works</p>
                <h3 className="heading-3">Operational clarity replaces generic marketplace noise.</h3>
                <div className="aside-points">
                  {featuredTrust.map((item) => (
                    <div className="aside-point" key={item}>
                      <span />
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
                <Button href="/marketplace" variant="secondary">
                  See Current Listings
                </Button>
              </MotionItem>
            </div>
          </div>
        </div>
      </MotionSection>

      <MotionSection className="home-screen shell market-screen" id="intelligence">
        <div className="market-screen-grid">
          <div className="proof-section compact">
            <MotionItem>
              <SectionIntro
                eyebrow="Marketplace intelligence"
                title="Live supply and market signals live alongside the sourcing workflow."
                copy="Each snap should feel complete, so listings, signals, and category coverage now live in one screen."
              />
            </MotionItem>

            <div className="proof-grid compact">
              <MotionItem className="proof-table">
                <ListingTable listings={featuredListings} />
              </MotionItem>

              <div className="widget-grid compact">
                {pricingWidgets.map((widget, index) => (
                  <MotionItem key={`${widget.label}-${index}`}>
                    <WidgetCard {...widget} />
                  </MotionItem>
                ))}
              </div>
            </div>
          </div>

          <div className="market-categories">
            <MotionItem>
              <SectionIntro
                eyebrow="Material coverage"
                title="Built around real feedstock streams."
              />
            </MotionItem>

            <div className="feedstock-grid compact">
              {featuredCategories.map((category) => (
                <MotionItem key={category.title}>
                  <article className="feedstock-card panel compact">
                    <Badge outline>{category.subtitle}</Badge>
                    <h3 className="heading-3">{category.title}</h3>
                    <div className="feedstock-meta compact">
                      {category.content.slice(0, 2).map((line) => (
                        <span key={line}>{line}</span>
                      ))}
                    </div>
                  </article>
                </MotionItem>
              ))}
            </div>
          </div>
        </div>
      </MotionSection>

      <MotionSection className="home-screen shell trust-flow-screen">
        <div className="trust-flow-grid">
          <div className="trust-section compact">
            <MotionItem>
              <SectionIntro
                eyebrow="Trust and verification"
                title="The credibility layer should be as visible as the listings themselves."
                copy="Verification, assay context, quality signals, and chain-of-custody support appear as core proof points instead of secondary details."
              />
            </MotionItem>

            <div className="trust-layout compact">
              <div className="trust-stack compact">
                {featuredTrust.map((item) => (
                  <MotionItem key={item}>
                    <article className="trust-card panel compact">
                      <strong>{item}</strong>
                      <p>Built to reduce transaction friction before counterparties commit resources.</p>
                    </article>
                  </MotionItem>
                ))}
              </div>

              <div className="metrics-row compact">
                {featuredStats.map((stat) => (
                  <MotionItem key={stat.label}>
                    <CountUpStat value={stat.value} label={stat.label} />
                  </MotionItem>
                ))}
              </div>
            </div>
          </div>

          <div className="logistics-section compact">
            <MotionItem className="logistics-header compact">
              <SectionIntro
                eyebrow="Execution path"
                title="The transaction path continues past the match."
                copy="Listing, pickup, delivery, and settlement all need to stay visible in the product story."
              />
              <Button onClick={() => setPricingModalOpen(true)} variant="secondary">
                How pricing works
              </Button>
            </MotionItem>

            <div className="flow-line compact">
              {logisticsSteps.map((step) => (
                <MotionItem key={step.title}>
                  <article className="flow-step panel compact">
                    <strong>{step.title}</strong>
                    <p>{step.copy}</p>
                  </article>
                </MotionItem>
              ))}
            </div>
          </div>
        </div>
      </MotionSection>

      <MotionSection className="home-screen shell participant-screen">
        <div className="participant-screen-grid">
          <div className="participant-section compact">
            <MotionItem>
              <SectionIntro
                eyebrow="Role-specific value"
                title="Each participant type gets a clearer message and a more specific outcome."
              />
            </MotionItem>

            <MotionItem className="participant-controls compact">
              <div className="tab-controls">
                {participantTabs.map((tab) => (
                  <button
                    className={`tab-button ${participantView === tab.id ? "active" : ""}`}
                    key={tab.id}
                    onClick={() => setParticipantView(tab.id)}
                    type="button"
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </MotionItem>

            <AnimatePresence mode="wait">
              <motion.div
                className="participant-grid compact"
                key={activeParticipant.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <article className="panel participant-main compact">
                  <Badge outline>{activeParticipant.label}</Badge>
                  <h3 className="heading-3">{activeParticipant.title}</h3>
                  <p className="body-copy">{activeParticipant.painPoint}</p>
                </article>

                <div className="participant-points compact">
                  <article className="mini-card panel">
                    <strong>Pain point</strong>
                    <p>{activeParticipant.painPoint}</p>
                  </article>
                  <article className="mini-card panel">
                    <strong>Platform value</strong>
                    <p>{activeParticipant.value}</p>
                  </article>
                  <article className="mini-card panel">
                    <strong>Example use case</strong>
                    <p>{activeParticipant.useCase}</p>
                  </article>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="participant-side-column">
            <div className="testimonial-grid compact">
              {featuredTestimonials.map((testimonial) => (
                <MotionItem key={testimonial.role}>
                  <article className="testimonial-card panel compact">
                    <p className="body-copy">“{testimonial.quote}”</p>
                    <div className="testimonial-role">{testimonial.role}</div>
                  </article>
                </MotionItem>
              ))}
            </div>

            <MotionItem className="cta-panel compact">
              <div>
                <p className="eyebrow">Calls to action</p>
                <h2 className="heading-2">
                  List feedstock, become a verified recycler, or request a conversation.
                </h2>
              </div>
              <div className="cta-actions">
                <Button href="/supplier-onboarding">List Your Feedstock</Button>
                <Button href="/recycler-onboarding" variant="secondary">
                  Become a Verified Recycler
                </Button>
                <Button href="/contact" variant="ghost">
                  Contact the Team
                </Button>
              </div>
            </MotionItem>
          </div>
        </div>
      </MotionSection>

      <AnimatePresence>
        {pricingModalOpen ? (
          <motion.div
            className="modal open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPricingModalOpen(false)}
          >
            <motion.div
              className="modal-card"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <p className="eyebrow">How pricing works</p>
                  <strong className="text-2xl">
                    Institutional-style signals for fragmented recycled feedstock
                  </strong>
                </div>
                <button className="icon-button" onClick={() => setPricingModalOpen(false)} type="button">
                  &times;
                </button>
              </div>
              <p className="body-copy">
                Indicative pricing blends recent bid activity, feedstock form, quality bands, assay
                confidence, logistics complexity, and regional demand pressure. The goal is better
                price discovery for an imperfect, fragmented market, not the false precision of a
                standardized commodity exchange.
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.main>
  );
}
