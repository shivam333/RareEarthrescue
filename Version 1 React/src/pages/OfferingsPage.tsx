import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AppImage } from "../components/ui/AppImage";
import { MotionItem, MotionSection } from "../components/ui/Motion";
import { ShadTabs, ShadTabsContent, ShadTabsList, ShadTabsTrigger } from "../components/ui/ShadTabs";
import { dashboardBidListings } from "../data/dashboardMarketplaceData";
import { pageEnter } from "../lib/motion";

const pageMotionProps = {
  variants: pageEnter,
  initial: "hidden" as const,
  animate: "visible" as const,
  exit: "exit" as const,
};

const services = [
  {
    title: "Feedstock Identification",
    copy: "Surface rare-earth-bearing scrap across magnets, motors, drives, industrial equipment, and residues.",
    icon: "FI",
  },
  {
    title: "Assay & Due Diligence",
    copy: "Package composition notes, verification support, and buyer-ready technical context around each lot.",
    icon: "AD",
  },
  {
    title: "Marketplace Matching",
    copy: "Connect verified supply with recycler demand through structured listings and bidding workflows.",
    icon: "MM",
  },
  {
    title: "Shipment & Transaction Support",
    copy: "Coordinate pickup, delivery, handling assumptions, and transaction-close workflows with less friction.",
    icon: "ST",
  },
] as const;

const categorySets = [
  {
    id: "magnets",
    label: "Magnet Scrap",
    totalLots: "58 lots",
    verification: "91% verified",
    tonnage: "186 MT visible",
    image:
      "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=1200&q=80",
    categories: ["NdFeB magnets", "SmCo magnets", "Magnet assemblies", "Powders and fines"],
  },
  {
    id: "motors",
    label: "Motors & Assemblies",
    totalLots: "73 lots",
    verification: "88% verified",
    tonnage: "242 MT visible",
    image:
      "https://images.unsplash.com/photo-1581092919535-7146ff1a5902?auto=format&fit=crop&w=1200&q=80",
    categories: ["EV traction motors", "Industrial motors", "Robotics motors", "Wind turbine components"],
  },
  {
    id: "electronics",
    label: "Electronics & Drives",
    totalLots: "46 lots",
    verification: "85% verified",
    tonnage: "124 MT visible",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    categories: ["HDD magnet assemblies", "E-waste fractions", "Data center components", "Consumer electronics scrap"],
  },
  {
    id: "industrial",
    label: "Industrial Equipment",
    totalLots: "29 lots",
    verification: "93% verified",
    tonnage: "88 MT visible",
    image:
      "https://images.unsplash.com/photo-1561144257-e32e8efc6c4f?auto=format&fit=crop&w=1200&q=80",
    categories: ["MRI magnets", "Factory automation equipment", "Sensor systems", "Specialty machinery"],
  },
] as const;

const analyticsCards = [
  {
    title: "Price Signals",
    value: "NdFeB leading",
    body: "Indicative bid ranges show cleaner magnet assemblies and traction-motor lots holding the best relative pricing context.",
    kind: "line" as const,
    data: [44, 50, 48, 56, 63, 67],
  },
  {
    title: "Supply Hotspots",
    value: "Great Lakes + Texas",
    body: "Concentration is strongest where ITAD, dismantling, and industrial salvage streams intersect with freight density.",
    kind: "map" as const,
  },
  {
    title: "Demand Pull",
    value: "Auto + HDD",
    body: "Recycler attention is clustering around verified traction motors and assay-backed HDD magnet material.",
    kind: "bars" as const,
    data: [62, 88, 76, 54],
  },
  {
    title: "Availability Trends",
    value: "Inventory broadening",
    body: "Listed tonnage is widening beyond core magnets into servo motors, MRI systems, and robotics-related subassemblies.",
    kind: "progress" as const,
    data: [78, 61, 54],
  },
] as const;

const journeySteps = {
  supplier: [
    "List material",
    "Verify composition",
    "Receive bids",
    "Schedule pickup",
    "Complete sale",
  ],
  recycler: [
    "Discover feedstock",
    "Review verification",
    "Place bid",
    "Coordinate delivery",
    "Secure supply",
  ],
} as const;

function PrimaryLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(145deg,#b88b3c,#9f742c)] px-6 py-3 text-[0.82rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_16px_40px_rgba(184,139,60,0.22)] transition hover:-translate-y-0.5"
    >
      {children}
    </Link>
  );
}

function SecondaryLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center justify-center rounded-full border border-[#d8cfbf] bg-white/84 px-6 py-3 text-[0.82rem] font-bold uppercase tracking-[0.14em] text-[#173550] transition hover:-translate-y-0.5 hover:border-[#b38a4e]"
    >
      {children}
    </Link>
  );
}

function OfferingsHero() {
  const flowSteps = [
    "Identify Scrap",
    "Verify Material",
    "Match Demand",
    "Move Shipment",
    "Complete Transaction",
  ];

  return (
    <section className="shell page-hero">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.95fr)] xl:items-center">
        <MotionItem>
          <p className="eyebrow">Our Offerings</p>
          <h1 className="heading-1 max-w-[12ch]">End-to-end infrastructure for rare earth recovery</h1>
          <p className="lede max-w-[44rem]">
            Rare Earth Rescue helps suppliers and recyclers identify valuable feedstock, verify material quality,
            coordinate transactions, and move rare-earth-bearing scrap through a more transparent recovery network.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <PrimaryLink to="/get-started">Get Started</PrimaryLink>
            <SecondaryLink to="/sign-in">Sign in / Create Account</SecondaryLink>
          </div>
        </MotionItem>

        <MotionItem className="rounded-[34px] border border-[#d8cfbf] bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(244,236,224,0.9))] p-6 shadow-[0_28px_80px_rgba(46,41,31,0.08)] lg:p-7">
          <div className="relative overflow-hidden rounded-[28px] border border-[#dfd5c7] bg-[radial-gradient(circle_at_top_left,rgba(184,139,60,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(110,152,121,0.14),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.88),rgba(248,242,233,0.94))] p-5">
            <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(17,40,61,0.24)_1px,transparent_1px),linear-gradient(90deg,rgba(17,40,61,0.24)_1px,transparent_1px)] [background-size:24px_24px]" />
            <span className="relative z-10 text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]">
              Product journey
            </span>
            <div className="relative z-10 mt-5 grid gap-4">
              {flowSteps.map((step, index) => (
                <div key={step} className="grid grid-cols-[30px_1fr] items-center gap-4">
                  <motion.div
                    initial={{ opacity: 0.4, scale: 0.92 }}
                    whileInView={{ opacity: 1, scale: [1, 1.08, 1] }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    className="relative flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#173550] text-[0.7rem] font-bold text-white"
                  >
                    {index + 1}
                    {index < flowSteps.length - 1 ? (
                      <motion.span
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.45, delay: 0.15 + index * 0.08 }}
                        className="absolute left-1/2 top-[28px] h-8 w-px origin-top bg-[linear-gradient(180deg,#173550,#c9b08a)]"
                      />
                    ) : null}
                  </motion.div>
                  <div className="rounded-[20px] border border-[#dfd5c7] bg-white/82 px-4 py-3 text-[0.92rem] font-semibold text-[#173550] shadow-[0_12px_28px_rgba(46,41,31,0.05)]">
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </MotionItem>
      </div>
    </section>
  );
}

function ServiceWorkflow() {
  return (
    <MotionSection className="shell section-gap">
      <MotionItem className="max-w-3xl">
        <p className="eyebrow">Service layer</p>
        <h2 className="font-display text-[clamp(2rem,3vw,3rem)] leading-[0.96] tracking-[-0.06em] text-[#11283d]">
          From material discovery to completed transaction
        </h2>
        <p className="mt-4 text-[1rem] leading-8 text-[#5a6a78]">
          We support the full recovery workflow from identifying the right scrap streams to assay verification,
          due diligence, shipment coordination, and transaction support.
        </p>
      </MotionItem>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {services.map((service, index) => (
          <motion.article
            key={service.title}
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] },
              },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -6 }}
            className="rounded-[28px] border border-[#d8cfbf] bg-[linear-gradient(180deg,rgba(255,252,247,0.95),rgba(244,236,224,0.9))] p-5 shadow-[0_20px_60px_rgba(46,41,31,0.07)]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#173550] text-[0.8rem] font-bold uppercase tracking-[0.12em] text-white">
              {service.icon}
            </div>
            <strong className="mt-5 block font-display text-[1.18rem] leading-[1.05] tracking-[-0.05em] text-[#11283d]">
              {service.title}
            </strong>
            <p className="mt-4 text-[0.94rem] leading-7 text-[#556576]">{service.copy}</p>
          </motion.article>
        ))}
      </div>
    </MotionSection>
  );
}

function CategoryTabs() {
  return (
    <ShadTabs defaultValue={categorySets[0].id} className="w-full">
      <ShadTabsList className="flex w-full flex-wrap justify-start gap-2 rounded-[22px] border-none bg-transparent p-0 shadow-none">
        {categorySets.map((set) => (
          <ShadTabsTrigger
            key={set.id}
            value={set.id}
            className="rounded-full border border-[#d8cfbf] bg-white/82 px-4 py-2 text-[0.76rem] uppercase tracking-[0.14em] data-[state=active]:bg-[#173550] data-[state=active]:text-white"
          >
            {set.label}
          </ShadTabsTrigger>
        ))}
      </ShadTabsList>

      {categorySets.map((set) => (
        <ShadTabsContent key={set.id} value={set.id} className="mt-6">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[24px] border border-[#ddd4c7] bg-white/82 p-5">
                <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]">
                  Managed category
                </span>
                <strong className="mt-2 block font-display text-[1.42rem] tracking-[-0.04em] text-[#11283d]">
                  {set.label}
                </strong>
              </div>
              <div className="rounded-[24px] border border-[#ddd4c7] bg-white/82 p-5">
                <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]">
                  Active subcategories
                </span>
                <strong className="mt-2 block font-display text-[1.42rem] tracking-[-0.04em] text-[#11283d]">
                  {set.categories.length}
                </strong>
              </div>
              <div className="rounded-[24px] border border-[#ddd4c7] bg-white/82 p-5">
                <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]">
                  Visible supply
                </span>
                <strong className="mt-2 block font-display text-[1.42rem] tracking-[-0.04em] text-[#11283d]">
                  {set.tonnage}
                </strong>
              </div>
            </div>

            <div className="rounded-[28px] border border-[#ddd4c7] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(247,241,232,0.86))] p-4 shadow-[0_18px_48px_rgba(46,41,31,0.05)]">
              <div className="grid gap-4 md:grid-cols-[180px_minmax(0,1fr)]">
                <AppImage src={set.image} alt={set.label} className="h-40 w-full rounded-[22px] object-cover" />
                <div className="flex flex-col justify-between">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-[#d8cfbf] bg-[#eef4ef] px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#315e53]">
                      {set.verification}
                    </span>
                    <span className="rounded-full border border-[#d8cfbf] bg-white/82 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#173550]">
                      {set.totalLots}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {set.categories.map((category) => (
                      <span
                        key={category}
                        className="rounded-full border border-[#ddd4c7] bg-white/82 px-3 py-2 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#173550]"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ShadTabsContent>
      ))}
    </ShadTabs>
  );
}

function MarketplaceSnapshot() {
  const managedCategories = categorySets.length;
  const activeSubcategories = categorySets.reduce((sum, set) => sum + set.categories.length, 0);
  const totalVisibleLots = categorySets.reduce((sum, set) => sum + Number.parseInt(set.totalLots, 10), 0);

  return (
    <MotionSection className="shell section-gap">
      <MotionItem className="max-w-3xl">
        <p className="eyebrow">Marketplace snapshot</p>
        <h2 className="font-display text-[clamp(2rem,3vw,3rem)] leading-[0.96] tracking-[-0.06em] text-[#11283d]">
          A structured marketplace for fragmented feedstock supply
        </h2>
        <p className="mt-4 text-[1rem] leading-8 text-[#5a6a78]">
          Browse rare-earth-bearing materials across managed categories and subcategories designed around real
          recovery workflows.
        </p>
      </MotionItem>

      <div className="mt-8 rounded-[34px] border border-[#d8cfbf] bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(244,236,224,0.9))] p-6 shadow-[0_28px_80px_rgba(46,41,31,0.08)] lg:p-7">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-[24px] border border-[#ddd4c7] bg-white/82 p-5">
            <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]">Managed categories</span>
            <strong className="mt-2 block font-display text-[1.55rem] tracking-[-0.04em] text-[#11283d]">{managedCategories}</strong>
          </div>
          <div className="rounded-[24px] border border-[#ddd4c7] bg-white/82 p-5">
            <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]">Active subcategories</span>
            <strong className="mt-2 block font-display text-[1.55rem] tracking-[-0.04em] text-[#11283d]">{activeSubcategories}</strong>
          </div>
          <div className="rounded-[24px] border border-[#ddd4c7] bg-white/82 p-5">
            <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]">Visible lots</span>
            <strong className="mt-2 block font-display text-[1.55rem] tracking-[-0.04em] text-[#11283d]">{totalVisibleLots}</strong>
          </div>
          <div className="rounded-[24px] border border-[#ddd4c7] bg-white/82 p-5">
            <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]">Verification status</span>
            <strong className="mt-2 block font-display text-[1.55rem] tracking-[-0.04em] text-[#315e53]">High-trust listings</strong>
          </div>
        </div>

        <div className="mt-8">
          <CategoryTabs />
        </div>
      </div>
    </MotionSection>
  );
}

function BiddingSnapshot() {
  const preview = dashboardBidListings.slice(0, 3);

  return (
    <MotionSection className="shell section-gap">
      <MotionItem className="max-w-3xl">
        <p className="eyebrow">Bidding activity</p>
        <h2 className="font-display text-[clamp(2rem,3vw,3rem)] leading-[0.96] tracking-[-0.06em] text-[#11283d]">
          Turn fragmented supply into competitive market activity
        </h2>
        <p className="mt-4 text-[1rem] leading-8 text-[#5a6a78]">
          Suppliers can surface material opportunities while recyclers can review details, compare lots, and place structured bids.
        </p>
      </MotionItem>

      <div className="mt-8 rounded-[34px] border border-[#d8cfbf] bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(244,236,224,0.9))] p-6 shadow-[0_28px_80px_rgba(46,41,31,0.08)] lg:p-7">
        <div className="space-y-4">
          {preview.map((listing, index) => (
            <motion.article
              key={listing.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              whileHover={{ y: -4 }}
              className="grid gap-4 rounded-[28px] border border-[#ddd4c7] bg-white/84 p-4 shadow-[0_18px_42px_rgba(46,41,31,0.05)] lg:grid-cols-[92px_minmax(0,1.4fr)_repeat(4,minmax(0,0.55fr))]"
            >
              <AppImage src={listing.image} alt={listing.category} className="h-20 w-full rounded-[20px] object-cover" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#173550] px-3 py-1 text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-white">
                    Live
                  </span>
                  <span className="rounded-full border border-[#d8cfbf] bg-[#eef4ef] px-3 py-1 text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[#315e53]">
                    {listing.verification}
                  </span>
                </div>
                <strong className="mt-3 block font-display text-[1.08rem] leading-[1.03] tracking-[-0.04em] text-[#11283d]">
                  {listing.category}
                </strong>
                <p className="mt-2 max-w-[32rem] text-[0.88rem] leading-7 text-[#556576]">{listing.detailSummary}</p>
              </div>
              <MetricCell label="Quantity" value={listing.quantity} />
              <MetricCell label="Location" value={listing.location} />
              <MetricCell label="Price" value={listing.openingBid} />
              <div className="flex flex-col items-start justify-center gap-3">
                <Link
                  to={`/listing/${listing.id}`}
                  className="inline-flex rounded-full border border-[#d8cfbf] bg-white/82 px-4 py-2 text-[0.74rem] font-bold uppercase tracking-[0.14em] text-[#173550]"
                >
                  View Details
                </Link>
                <Link
                  to="/sign-in"
                  className="inline-flex rounded-full bg-[linear-gradient(145deg,#b88b3c,#9f742c)] px-4 py-2 text-[0.74rem] font-bold uppercase tracking-[0.14em] text-white"
                >
                  Place Bid
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}

function MetricCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col justify-center">
      <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]">{label}</span>
      <strong className="mt-2 text-[0.92rem] leading-7 text-[#173550]">{value}</strong>
    </div>
  );
}

function CommodityAnalytics() {
  return (
    <MotionSection className="shell section-gap">
      <MotionItem className="max-w-3xl">
        <p className="eyebrow">Commodity analytics</p>
        <h2 className="font-display text-[clamp(2rem,3vw,3rem)] leading-[0.96] tracking-[-0.06em] text-[#11283d]">
          Market intelligence for better sourcing and selling decisions
        </h2>
        <p className="mt-4 text-[1rem] leading-8 text-[#5a6a78]">
          Access signals around pricing, supply hotspots, demand concentration, and material availability to make better commercial decisions.
        </p>
      </MotionItem>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {analyticsCards.map((card, index) => (
          <motion.article
            key={card.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="rounded-[28px] border border-[#d8cfbf] bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(244,236,224,0.9))] p-5 shadow-[0_20px_60px_rgba(46,41,31,0.07)]"
          >
            <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]">{card.title}</span>
            <strong className="mt-3 block font-display text-[1.36rem] leading-[1.04] tracking-[-0.05em] text-[#11283d]">
              {card.value}
            </strong>
            <p className="mt-3 text-[0.9rem] leading-7 text-[#556576]">{card.body}</p>
            <div className="mt-5">
              {card.kind === "line" ? <LineSparkline data={card.data} /> : null}
              {card.kind === "map" ? <MapDots /> : null}
              {card.kind === "bars" ? <BarSignal data={card.data} /> : null}
              {card.kind === "progress" ? <ProgressSignal data={card.data} /> : null}
            </div>
          </motion.article>
        ))}
      </div>
    </MotionSection>
  );
}

function LineSparkline({ data }: { data: readonly number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = Math.max(max - min, 1);
  const path = data
    .map((value, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * 100;
      const y = 72 - ((value - min) / range) * 50;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 80" className="h-24 w-full" preserveAspectRatio="none">
      <path d={`${path} L 100 80 L 0 80 Z`} fill="rgba(184,139,60,0.16)" />
      <path d={path} fill="none" stroke="#b88b3c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MapDots() {
  return (
    <svg viewBox="0 0 220 120" className="h-24 w-full">
      <path d="M18 70C48 40 87 28 122 32c21 3 39 11 57 25 11 9 19 22 23 39-29-8-56-10-81-7-39 4-74-2-121-21Z" fill="rgba(248,242,233,0.96)" stroke="rgba(146,128,95,0.24)" strokeWidth="1.2" />
      {[["46", "58"], ["92", "76"], ["132", "48"], ["172", "64"]].map(([cx, cy], index) => (
        <motion.circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="5"
          fill={index % 2 === 0 ? "#173550" : "#6e9879"}
          initial={{ opacity: 0.5, scale: 0.88 }}
          whileInView={{ opacity: 1, scale: [1, 1.22, 1] }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: index * 0.08 }}
        />
      ))}
    </svg>
  );
}

function BarSignal({ data }: { data: readonly number[] }) {
  const max = Math.max(...data);

  return (
    <div className="flex h-24 items-end gap-3">
      {data.map((value, index) => (
        <motion.div
          key={`${value}-${index}`}
          initial={{ height: 0 }}
          whileInView={{ height: `${(value / max) * 100}%` }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: index * 0.06 }}
          className="w-full rounded-t-[14px] bg-[linear-gradient(180deg,#173550,#2a506d)]"
        />
      ))}
    </div>
  );
}

function ProgressSignal({ data }: { data: readonly number[] }) {
  return (
    <div className="space-y-3">
      {data.map((value, index) => (
        <div key={`${value}-${index}`}>
          <div className="h-2.5 rounded-full bg-[#ebe2d4]">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${value}%` }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="h-full rounded-full bg-[linear-gradient(145deg,#6e9879,#4d7f63)]"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function UserJourney() {
  return (
    <MotionSection className="shell section-gap">
      <MotionItem className="max-w-3xl">
        <p className="eyebrow">Shared journey</p>
        <h2 className="font-display text-[clamp(2rem,3vw,3rem)] leading-[0.96] tracking-[-0.06em] text-[#11283d]">
          One platform, two sides of the recovery network
        </h2>
      </MotionItem>

      <div className="mt-8 rounded-[34px] border border-[#d8cfbf] bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(244,236,224,0.9))] p-6 shadow-[0_28px_80px_rgba(46,41,31,0.08)] lg:p-7">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_180px_minmax(0,1fr)] xl:items-start">
          <JourneyColumn
            title="Supplier path"
            badge="Sell-side"
            steps={journeySteps.supplier}
            tone="gold"
          />
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <span className="rounded-full border border-[#d8cfbf] bg-white/84 px-4 py-2 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]">
              Shared infrastructure
            </span>
            <div className="relative flex h-36 w-36 items-center justify-center rounded-full border border-[#ddd4c7] bg-[radial-gradient(circle_at_top_left,rgba(184,139,60,0.12),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(110,152,121,0.14),transparent_40%),rgba(255,255,255,0.88)] shadow-[0_18px_42px_rgba(46,41,31,0.05)]">
              <span className="max-w-[10ch] text-center font-display text-[1.24rem] leading-[1.04] tracking-[-0.05em] text-[#11283d]">
                Verification, bidding, and transaction flow
              </span>
            </div>
          </div>
          <JourneyColumn
            title="Recycler path"
            badge="Buy-side"
            steps={journeySteps.recycler}
            tone="green"
          />
        </div>
      </div>
    </MotionSection>
  );
}

function JourneyColumn({
  title,
  badge,
  steps,
  tone,
}: {
  title: string;
  badge: string;
  steps: readonly string[];
  tone: "gold" | "green";
}) {
  return (
    <div className="rounded-[28px] border border-[#ddd4c7] bg-white/82 p-5 shadow-[0_18px_42px_rgba(46,41,31,0.05)]">
      <span
        className={`rounded-full px-3 py-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.16em] ${
          tone === "gold" ? "bg-[rgba(184,139,60,0.12)] text-[#8d6d39]" : "bg-[rgba(110,152,121,0.14)] text-[#315e53]"
        }`}
      >
        {badge}
      </span>
      <strong className="mt-4 block font-display text-[1.4rem] tracking-[-0.05em] text-[#11283d]">{title}</strong>
      <div className="mt-6 grid gap-4">
        {steps.map((step, index) => (
          <div key={step} className="grid grid-cols-[28px_1fr] gap-4">
            <div className={`relative flex h-7 w-7 items-center justify-center rounded-full text-[0.68rem] font-bold text-white ${tone === "gold" ? "bg-[#b88b3c]" : "bg-[#6e9879]"}`}>
              {index + 1}
              {index < steps.length - 1 ? (
                <span className={`absolute left-1/2 top-[27px] h-7 w-px -translate-x-1/2 ${tone === "gold" ? "bg-[linear-gradient(180deg,#b88b3c,#d6c1a0)]" : "bg-[linear-gradient(180deg,#6e9879,#c6d7cb)]"}`} />
              ) : null}
            </div>
            <div className="rounded-[20px] border border-[#e0d7c9] bg-[rgba(251,247,239,0.92)] px-4 py-3 text-[0.92rem] font-semibold text-[#173550]">
              {step}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FinalCTA() {
  return (
    <MotionSection className="shell section-gap">
      <div className="rounded-[36px] border border-[#d8cfbf] bg-[radial-gradient(circle_at_top_left,rgba(184,139,60,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(110,152,121,0.16),transparent_28%),linear-gradient(180deg,rgba(255,252,247,0.96),rgba(244,236,224,0.92))] p-8 shadow-[0_32px_90px_rgba(46,41,31,0.08)] lg:p-10">
        <MotionItem className="mx-auto max-w-4xl text-center">
          <p className="eyebrow">Ready to start?</p>
          <h2 className="font-display text-[clamp(2rem,3.2vw,3.4rem)] leading-[0.95] tracking-[-0.06em] text-[#11283d]">
            Ready to move rare earth recovery from fragmented to structured?
          </h2>
          <p className="mx-auto mt-5 max-w-[48rem] text-[1rem] leading-8 text-[#5a6a78]">
            Start with a one-time transaction, subscribe for recurring marketplace access, or work with our team on a custom enterprise program.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <PrimaryLink to="/get-started">Get Started</PrimaryLink>
            <SecondaryLink to="/sign-in">Sign in / Create Account</SecondaryLink>
          </div>
          <p className="mt-4 text-[0.86rem] leading-7 text-[#7a746a]">
            No role selection required upfront. Choose your path after account creation.
          </p>
        </MotionItem>
      </div>
    </MotionSection>
  );
}

export function OfferingsPage() {
  return (
    <motion.main className="page" {...pageMotionProps}>
      <OfferingsHero />
      <ServiceWorkflow />
      <MarketplaceSnapshot />
      <BiddingSnapshot />
      <CommodityAnalytics />
      <UserJourney />
      <FinalCTA />
    </motion.main>
  );
}
