import { motion } from "framer-motion";
import { AppImage } from "../components/ui/AppImage";
import { MotionItem, MotionSection } from "../components/ui/Motion";
import { SectionIntro } from "../components/ui/SectionIntro";
import { pageEnter } from "../lib/motion";

const pageMotionProps = {
  variants: pageEnter,
  initial: "hidden" as const,
  animate: "visible" as const,
  exit: "exit" as const,
};

const industryVoices = [
  {
    image:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=1200&q=80",
    alt: "Procurement professional in an industrial office",
    quote:
      "Reliable access to powerful, heat-resistant rare earth magnets is essential to helping industry deliver on AI infrastructure commitments.",
    speaker: "Gwen Handy",
    role: "Sector Supply Chain Manager, Moog Electric Motion Solutions",
    href: "https://www.globenewswire.com/news-release/2025/06/16/3099686/0/en/USA-Rare-Earth-and-Moog-Sign-Memorandum-of-Understanding-for-Delivery-of-U-S-Made-Neo-Magnets-for-Data-Center-Cooling-Solutions.html",
    isQuote: true,
  },
  {
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    alt: "Leadership team in a modern meeting room",
    quote:
      "Together we are making the circular economy a reality.",
    speaker: "Ahmad Ghahreman",
    role: "Co-founder and CEO, Cyclic Materials",
    href: "https://www.businesswire.com/news/home/20251022335302/en/Cyclic-Materials-and-VACUUMSCHMELZE-Expand-Partnership-to-Recycle-Rare-Earth-Magnet-Manufacturing-Waste-in-the-U.S.",
    isQuote: true,
  },
  {
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    alt: "Corporate headquarters building at dusk",
    quote:
      "A secure domestic supply chain for rare earth magnets is moving from strategic ambition to operating priority.",
    speaker: "Public market signal",
    role: "Synthesis of recent announcements from U.S. magnet and materials operators",
    href: "https://mpmaterials.com/news/mp-materials-reports-fourth-quarter-and-full-year-2025-results",
    isQuote: false,
  },
] as const;

const trustLenses = [
  {
    title: "Built for operators",
    copy:
      "The product is designed around the practical needs of ITAD firms, dismantlers, industrial salvage teams, and recycler procurement desks.",
  },
  {
    title: "Built for verification",
    copy:
      "We focus on making feedstock more legible through structured listings, quality context, counterparty checks, and delivery coordination.",
  },
  {
    title: "Built for resilience",
    copy:
      "The strategic goal is not just more recycling. It is more domestic circular supply and less idle processing capacity across North America.",
  },
] as const;

export function AboutPage() {
  return (
    <motion.main className="page" {...pageMotionProps}>
      <section className="shell page-hero">
        <MotionItem>
          <p className="eyebrow">About</p>
          <h1 className="heading-1">Rare Earth Rescue is building the operating layer for secondary rare earth supply.</h1>
          <p className="lede">
            We are building a marketplace, verification workflow, and procurement intelligence layer
            that helps rare-earth-bearing scrap move with more clarity, more trust, and more strategic value.
          </p>
        </MotionItem>
      </section>

      <MotionSection className="section-gap shell">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow">Industry validation</p>
            <h2 className="heading-2">Trust starts with signals from the companies already building domestic rare earth capability.</h2>
          </div>
          <p className="max-w-[26rem] text-[0.98rem] leading-7 text-[#5d6c79]">
            These are public industry perspectives and company signals that reflect the exact market
            need Rare Earth Rescue is built for. Verified customer case studies can layer in here as they are cleared for publication.
          </p>
        </div>

        <div className="mt-8 grid gap-5 xl:grid-cols-3">
          {industryVoices.map((voice, index) => (
            <MotionItem key={voice.speaker} className="h-full">
              <a
                href={voice.href}
                target="_blank"
                rel="noreferrer"
                className="group block h-full overflow-hidden rounded-[32px] border border-[#dacfbf] bg-[rgba(255,252,247,0.94)] shadow-[0_22px_60px_rgba(46,41,31,0.08)] transition duration-300 hover:-translate-y-1.5 hover:border-[#315e53]/24"
              >
                <div className="relative h-64 overflow-hidden">
                  <AppImage
                    src={voice.image}
                    alt={voice.alt}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,40,61,0.02),rgba(17,40,61,0.56))]" />
                  <div className="absolute left-5 top-5">
                    <span className="inline-flex rounded-full bg-white/14 px-3 py-1 text-[0.64rem] font-extrabold uppercase tracking-[0.18em] text-white backdrop-blur">
                      Proof point 0{index + 1}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <p className="font-display text-[1.18rem] leading-[1.08] tracking-[-0.04em] text-[#11283d]">
                    {voice.isQuote ? `“${voice.quote}”` : voice.quote}
                  </p>
                  <div className="mt-5 border-t border-[#e5dccf] pt-4">
                    <strong className="block text-[0.96rem] text-[#1b2430]">{voice.speaker}</strong>
                    <span className="mt-1 block text-[0.84rem] leading-6 text-[#6b756f]">{voice.role}</span>
                  </div>
                </div>
              </a>
            </MotionItem>
          ))}
        </div>
      </MotionSection>

      <MotionSection className="section-gap shell about-shell">
        <div className="comparison-grid">
          <MotionItem>
            <article className="panel p-6">
              <h3 className="heading-3">Our thesis</h3>
              <p className="mt-4 body-copy">
                Rare-earth-bearing scrap is strategically important but commercially messy. Supply is
                fragmented, quality data is inconsistent, and too many transactions still depend on
                ad hoc relationships instead of market infrastructure.
              </p>
            </article>
          </MotionItem>
          <MotionItem>
            <article className="panel p-6">
              <h3 className="heading-3">Our role</h3>
              <p className="mt-4 body-copy">
                Rare Earth Rescue is designed to make that supply legible, tradable, and verifiable
                for both sides of the market: suppliers trying to monetize hidden value and recyclers
                trying to keep facilities utilized.
              </p>
            </article>
          </MotionItem>
        </div>

        <div className="card-grid-3">
          {trustLenses.map((item) => (
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
                eyebrow="Why now"
                title="Circular rare earth supply is becoming an operating requirement, not a niche theme."
                copy="EV drivetrains, robotics, industrial motors, MRI equipment, and data-center hardware are all increasing the strategic importance of magnets and rare earth elements. Domestic recycling and recovery matter because resilient supply chains need more than primary extraction."
              />
            </article>
          </MotionItem>
          <MotionItem className="page-hero-visual overflow-hidden">
            <AppImage
              className="h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80"
              alt="Industrial team meeting around strategy and operations"
            />
          </MotionItem>
        </div>
      </MotionSection>
    </motion.main>
  );
}
