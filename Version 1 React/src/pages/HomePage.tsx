import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Metric = {
  value: number;
  label: string;
  suffix: string;
  prefix?: string;
};

type ServiceModule = {
  index: string;
  title: string;
  body: string;
  href?: string;
  action?: "modal";
};

const heroPaths = [
  {
    badge: "Marketplace",
    title: "Explore Marketplace",
    body: "See live rare-earth-bearing lots and buyer demand.",
    href: "/marketplace",
  },
  {
    badge: "Subscription",
    title: "Join as Buyer",
    body: "Access recurring supply, watchlists, and procurement signals.",
    href: "/recycler-onboarding",
  },
  {
    badge: "Custom order",
    title: "Place an Order",
    body: "Use Rare Earth Rescue for a guided one-time sourcing mandate.",
    href: "/contact",
  },
  {
    badge: "One-time supply",
    title: "List Feedstock",
    body: "List one lot fast and route it to verified industrial buyers.",
    href: "/supplier-onboarding",
  },
] as const;

const metrics: Metric[] = [
  { value: 420, suffix: "+", label: "verified suppliers" },
  { value: 165, suffix: "+", label: "recycler buyers" },
  { value: 12, suffix: "", label: "feedstock categories" },
  { value: 84, prefix: "$", suffix: "M", label: "matched volume" },
  { value: 1920, suffix: " MT", label: "recirculated" },
];

const ribbonItems = [
  "Strategic OEM programs",
  "ITAD recovery networks",
  "Auto dismantler groups",
  "Magnet recycler partners",
  "KYC verified sellers",
  "Assay-backed listings",
  "Traceability reporting",
  "Industrial compliance checks",
] as const;

const issues = [
  {
    index: "01",
    title: "Fragmented supply",
    body: "Rare-earth-bearing scrap sits across scrapyards, ITAD operators, dismantlers, industrial salvage, and OEM reverse logistics programs.",
  },
  {
    index: "02",
    title: "Opaque quality",
    body: "Lots are rarely described with consistent magnet type, composition estimates, contamination notes, or packaging details.",
  },
  {
    index: "03",
    title: "Weak price discovery",
    body: "Suppliers often sell high-value scrap too generically because specialist recycler demand and pricing signals are hard to access.",
  },
  {
    index: "04",
    title: "Critical mineral pressure",
    body: "EVs, wind, robotics, electronics, and defense are all pushing buyers to secure more traceable and local secondary supply.",
  },
] as const;

const articleCards = [
  {
    badge: "Government signal",
    title: "White House proclamation on processed critical minerals imports",
    body: "U.S. policy is now tying critical mineral dependence directly to national resilience and domestic capacity.",
    meta: "Source: The White House",
    href: "https://www.whitehouse.gov/presidential-actions/2026/01/adjusting-imports-of-processed-critical-minerals-and-their-derivative-products-into-the-united-states/",
    image:
      "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?auto=format&fit=crop&w=1400&q=80",
  },
  {
    badge: "Tech advancement",
    title: "Sorting rare earth motors without opening them",
    body: "Better sorting methods are making REE-bearing motor streams easier to identify before teardown and recovery.",
    meta: "Source: Scientific Reports",
    href: "https://www.nature.com/articles/s41598-025-94667-x",
    image:
      "https://images.unsplash.com/photo-1581091870622-2cf1f3c71f54?auto=format&fit=crop&w=1400&q=80",
  },
] as const;

const heroCards = [
  {
    badge: "Featured listing",
    title: "NdFeB Magnet Scrap - 18 MT - Texas, USA",
    body: "Verified seller and assay-backed material.",
  },
  {
    badge: "Impact created",
    title: "1,920 MT of waste recirculated",
    body: "Recovered into local circular supply.",
  },
  {
    badge: "Bid activity",
    title: "14 active recycler buyers",
    body: "Strongest interest in motors and HDD magnet streams.",
  },
  {
    badge: "Pricing signal",
    title: "Motor scrap spread tightened 6.4%",
    body: "Verified assays are tightening buyer spread.",
  },
] as const;

const workflowContent = {
  suppliers: {
    cta: "/supplier-onboarding",
    ctaLabel: "Start Supplier Onboarding",
    secondary: "/contact",
    secondaryLabel: "Prefer a one-time listing?",
    steps: [
      {
        title: "Sign up and choose your plan",
        body: "Choose between one-time supply listing or a recurring supplier subscription with deeper tools.",
      },
      {
        title: "Provide feedstock detail",
        body: "Upload photos, quantity, location, composition estimate, source type, and packaging format.",
      },
      {
        title: "Schedule pickup",
        body: "Align logistics, batch readiness, sampling, and documentation requirements with the buyer side.",
      },
      {
        title: "Complete transaction",
        body: "Move through confirmation, settlement, and reporting with Rare Earth Rescue managing execution friction.",
      },
    ],
  },
  buyers: {
    cta: "/recycler-onboarding",
    ctaLabel: "Start Buyer Onboarding",
    secondary: "/marketplace",
    secondaryLabel: "Browse current marketplace signals",
    steps: [
      {
        title: "Sign up and choose your plan",
        body: "Onboard as a verified buyer to access recurring supply, saved demand, and custom procurement flows.",
      },
      {
        title: "Search and assess needs",
        body: "Filter by category, geography, form, quality metadata, and recurring availability.",
      },
      {
        title: "Submit composition and delivery requirements",
        body: "Send batch preference, composition thresholds, and delivery assumptions to refine the match.",
      },
      {
        title: "Complete transaction and settlement",
        body: "Close the loop with logistics support, milestone payments, and better visibility into delivered material.",
      },
    ],
  },
} as const;

const dashboardContent = {
  buyer: {
    badge: "Buyer control room",
    sideCards: [
      {
        title: "Available catalogs",
        body: "Category-aware discovery across core feedstock types.",
        href: "/marketplace",
      },
      {
        title: "Material heatmap",
        body: "See where supply density is building.",
        href: "/marketplace",
      },
    ],
    widgets: [
      {
        label: "Open sourcing mandates",
        value: "07",
        body: "Mandates across magnets, motors, and HDD lots.",
      },
      {
        label: "Top category heat",
        value: "NdFeB",
        body: "Assay-backed magnet material is driving attention.",
      },
      {
        label: "Predictive intelligence",
        value: "+6.1%",
        body: "Buyer competition is rising in REE-rich motor fractions.",
      },
      {
        label: "Price transparency",
        value: "Live spread",
        body: "HDD, NdFeB, and motor fractions benchmarked live.",
      },
    ],
    oppositeCards: [
      {
        title: "Inventory and watchlists",
        body: "Track recurring sellers and saved searches.",
        href: "/dashboard",
      },
      {
        title: "Order support",
        body: "Escalate hard-to-source categories into managed requests.",
        href: "/contact",
      },
    ],
  },
  supplier: {
    badge: "Supplier control room",
    sideCards: [
      {
        title: "Live listings",
        body: "See active lots and buyer engagement in one place.",
        href: "/supplier-onboarding",
      },
      {
        title: "Pickup scheduling",
        body: "Coordinate readiness, pickup windows, and documents.",
        href: "/supplier-onboarding",
      },
    ],
    widgets: [
      {
        label: "Active feedstock lots",
        value: "11",
        body: "Traction motors, HDD assemblies, and magnet offcuts.",
      },
      {
        label: "Bid transparency",
        value: "14 bids",
        body: "Texas magnet lots are leading buyer activity.",
      },
      {
        label: "Market heatmap",
        value: "Ontario + Texas",
        body: "Buyer pull is strongest where verified material is available.",
      },
      {
        label: "Settlement pipeline",
        value: "$1.9M",
        body: "Pending value across shipped and accepted lots.",
      },
    ],
    oppositeCards: [
      {
        title: "Catalog intelligence",
        body: "Learn which lots generate stronger buyer engagement.",
        href: "/marketplace",
      },
      {
        title: "Managed logistics",
        body: "Use Rare Earth Rescue for bid and freight coordination.",
        href: "/contact",
      },
    ],
  },
} as const;

const serviceModules: ServiceModule[] = [
  {
    index: "01",
    title: "Feedstock Intelligence",
    body: "Classification built around real material streams.",
    href: "/marketplace",
  },
  {
    index: "02",
    title: "Marketplace Discovery",
    body: "Listings and demand visibility for fragmented categories.",
    href: "/marketplace",
  },
  {
    index: "03",
    title: "Pricing Intelligence",
    body: "Bid spread and demand signals for recycled material.",
    action: "modal",
  },
  {
    index: "04",
    title: "Trust and Verification",
    body: "Assays, onboarding checks, and counterparty validation.",
    href: "/recycler-onboarding",
  },
  {
    index: "05",
    title: "Logistics and Transactions",
    body: "Pickup, documentation, settlement, and execution support.",
    href: "/contact",
  },
];

const flywheelNotes = [
  {
    title: "Competitive edge",
    body: "Operational data compounds across supply, pricing, and execution.",
  },
  {
    title: "Value creation",
    body: "Suppliers monetize better. Buyers source with more structure.",
  },
  {
    title: "Why it matters now",
    body: "Visible quality and logistics make local circular supply more investable.",
  },
] as const;

const comparisonRows = [
  {
    label: "Access model",
    oneTime: "Single transaction path",
    subscription: "Continuous marketplace access",
  },
  {
    label: "Discovery",
    oneTime: "Targeted matching support",
    subscription: "Saved searches and recurring demand visibility",
  },
  {
    label: "Commercial signals",
    oneTime: "Basic market context",
    subscription: "Expanded pricing and bid transparency",
  },
  {
    label: "Operations support",
    oneTime: "Complete the immediate lot",
    subscription: "Ongoing workflow coordination",
  },
] as const;

const panelTransition = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.22, ease: [0.4, 0, 1, 1] } },
};

function HomeLinkCard({
  title,
  body,
  href,
}: {
  title: string;
  body: string;
  href: string;
}) {
  return (
    <Link
      to={href}
      className="group rounded-[24px] border border-[#d9cfbf] bg-[rgba(255,252,247,0.82)] p-5 shadow-[0_24px_70px_rgba(32,36,28,0.08)] transition duration-300 hover:-translate-y-1.5 hover:border-[#1d4f47]/25"
    >
      <strong className="block font-display text-[1.02rem] tracking-[-0.03em] text-[#11283d] transition duration-300 group-hover:text-[#143a58]">
        {title}
      </strong>
      <p className="mt-2 text-sm leading-7 text-[#5c6b79]">{body}</p>
    </Link>
  );
}

function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="gsap-reveal max-w-4xl">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="heading-2">{title}</h2>
      {body ? <p className="body-copy section-copy">{body}</p> : null}
    </div>
  );
}

export function HomePage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [workflowAudience, setWorkflowAudience] = useState<"suppliers" | "buyers">("suppliers");
  const [dashboardView, setDashboardView] = useState<"buyer" | "supplier">("buyer");
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  useGSAP(
    () => {
      const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      heroTimeline
        .from(".gsap-hero-logo", { scale: 0.82, opacity: 0, duration: 0.7 })
        .from(".gsap-hero-copy > *", { y: 26, opacity: 0, duration: 0.72, stagger: 0.11 }, "-=0.3")
        .from(".gsap-hero-path", { y: 24, opacity: 0, duration: 0.6, stagger: 0.08 }, "-=0.35")
        .from(".gsap-hero-visual", { y: 34, opacity: 0, scale: 0.97, duration: 1 }, "-=0.55")
        .from(".gsap-hero-card", { x: 22, opacity: 0, duration: 0.55, stagger: 0.07 }, "-=0.55")
        .from(".gsap-hero-signal", { y: 18, opacity: 0, duration: 0.6 }, "-=0.65");

      gsap.fromTo(
        ".gsap-map-line",
        { strokeDasharray: 280, strokeDashoffset: 280 },
        { strokeDashoffset: 0, duration: 1.8, stagger: 0.16, ease: "power2.out", delay: 0.45 }
      );

      gsap.to(".gsap-orb", {
        xPercent: 6,
        yPercent: -6,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".gsap-grid-shift", {
        backgroundPosition: "32px 32px",
        duration: 16,
        repeat: -1,
        ease: "none",
      });

      gsap.utils.toArray<HTMLElement>(".gsap-float-card").forEach((card, index) => {
        gsap.to(card, {
          y: index % 2 === 0 ? -10 : -16,
          duration: 3.2 + index * 0.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      gsap.utils.toArray<HTMLElement>(".gsap-ribbon-track").forEach((track, index) => {
        gsap.fromTo(
          track,
          { xPercent: index % 2 === 0 ? 0 : -50 },
          {
            xPercent: index % 2 === 0 ? -50 : 0,
            duration: 28,
            repeat: -1,
            ease: "none",
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".gsap-dashboard-bar").forEach((bar, index) => {
        gsap.fromTo(
          bar,
          { scaleY: 0.25, transformOrigin: "bottom center" },
          {
            scaleY: 1,
            duration: 1.2,
            delay: index * 0.05,
            ease: "power2.out",
            scrollTrigger: {
              trigger: bar,
              start: "top 92%",
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".gsap-service-line").forEach((line, index) => {
        gsap.fromTo(
          line,
          { scaleX: 0.18, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 1.1,
            delay: index * 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: line,
              start: "top 92%",
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".gsap-reveal").forEach((node) => {
        gsap.fromTo(
          node,
          { autoAlpha: 0, y: 42 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.95,
            ease: "power3.out",
            scrollTrigger: {
              trigger: node,
              start: "top 84%",
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".gsap-parallax").forEach((node) => {
        gsap.to(node, {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: node,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>(".gsap-count").forEach((node) => {
        const targetValue = Number(node.dataset.value || "0");
        const prefix = node.dataset.prefix || "";
        const suffix = node.dataset.suffix || "";
        const counter = { value: 0 };

        gsap.to(counter, {
          value: targetValue,
          duration: 1.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: node,
            start: "top 88%",
            once: true,
          },
          onUpdate: () => {
            node.textContent = `${prefix}${Math.round(counter.value).toLocaleString()}${suffix}`;
          },
        });
      });
    },
    { scope: rootRef }
  );

  const workflowPanel = workflowContent[workflowAudience];
  const dashboardPanel = dashboardContent[dashboardView];

  return (
    <div ref={rootRef} className="bg-[#f7f1e6] text-[#11283d]">
      <main className="page bg-transparent">
        <section
          id="top"
          className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(210,175,103,0.24),transparent_24%),radial-gradient(circle_at_88%_12%,rgba(121,161,144,0.24),transparent_30%),linear-gradient(180deg,#fbf7ef_0%,#f4ebdb_48%,#f5efe4_100%)] pb-16 pt-32 lg:pb-20"
        >
          <div className="gsap-grid-shift absolute inset-0 opacity-[0.2] [background-image:linear-gradient(rgba(17,40,61,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(17,40,61,0.06)_1px,transparent_1px)] [background-size:32px_32px]" />
          <div className="gsap-orb absolute left-[-8rem] top-[-3rem] h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(201,159,76,0.28),transparent_70%)] blur-3xl" />
          <div className="gsap-orb absolute bottom-[-10rem] right-[-7rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(110,152,121,0.2),transparent_68%)] blur-3xl" />

          <div className="shell relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1.18fr)_minmax(520px,0.82fr)] lg:items-start">
            <div className="gsap-hero-copy pt-3">
              <div className="gsap-hero-logo mb-7 inline-flex h-24 w-24 items-center justify-center rounded-[2rem] border border-[#d8cfbf] bg-[rgba(255,252,247,0.88)] shadow-[0_18px_40px_rgba(46,41,31,0.08)] backdrop-blur">
                <svg viewBox="0 0 100 100" className="h-14 w-14 text-[#173550]">
                  <circle cx="50" cy="50" r="39" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M73 17l15 8-1 18-7-8" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 64L45 40l13 17 11-9 15 16" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <p className="eyebrow !text-[#7e7668]">Circular critical mineral supply chains built for North America</p>
              <h1 className="max-w-[12.5ch] font-display text-[clamp(3.1rem,5.4vw,5.6rem)] leading-[0.95] tracking-[-0.06em] text-[#11283d]">
                Trade rare-earth-bearing scrap into local circular supply.
              </h1>
              <p className="mt-5 max-w-[42rem] text-[1.05rem] leading-8 text-[#445567] sm:text-[1.16rem]">
                Rare Earth Rescue connects suppliers, scrappers, and processors with verified
                industrial buyers across magnets, motors, HDD assemblies, and other rare-earth-bearing feedstock.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {["Verified industrial buyers", "Localized circular supply", "Structured execution"].map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full border border-[#d8cebd] bg-[rgba(255,252,247,0.86)] px-4 py-2 text-[0.72rem] font-extrabold uppercase tracking-[0.18em] text-[#5d6f62]"
                  >
                    {pill}
                  </span>
                ))}
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {heroPaths.map((path) => (
                  <Link
                    key={path.title}
                    to={path.href}
                    className="gsap-hero-path group rounded-[24px] border border-[#d8cfbf] bg-[rgba(255,252,247,0.8)] p-5 shadow-[0_18px_48px_rgba(46,41,31,0.05)] backdrop-blur transition duration-300 hover:-translate-y-1.5 hover:border-[#c89c57]/35 hover:bg-[rgba(255,255,255,0.92)]"
                  >
                    <span className="inline-flex rounded-full border border-[#ded5c6] px-3 py-1 text-[0.64rem] font-extrabold uppercase tracking-[0.22em] text-[#6f7b77]">
                      {path.badge}
                    </span>
                    <strong className="mt-4 block font-display text-[1.02rem] tracking-[-0.03em] text-[#11283d]">
                      {path.title}
                    </strong>
                    <p className="mt-2 text-sm leading-6 text-[#5b6c7c]">{path.body}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="gsap-hero-visual relative min-h-[620px] overflow-hidden rounded-[34px] border border-[#d9cfbf] bg-[linear-gradient(180deg,rgba(255,252,247,0.94),rgba(239,231,218,0.9))] shadow-[0_34px_90px_rgba(46,41,31,0.1)]">
              <div className="gsap-parallax absolute inset-0 opacity-[0.16]">
                <img
                  src="https://images.unsplash.com/photo-1513828742140-ccaa28f3eda0?auto=format&fit=crop&w=1600&q=80"
                  alt="Shiny metallic industrial material surface"
                  className="h-full w-full object-cover saturate-[0.7]"
                />
              </div>

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(207,167,83,0.18),transparent_22%),linear-gradient(180deg,rgba(255,252,247,0.95),rgba(236,226,211,0.88))]" />
              <div className="gsap-grid-shift absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(17,40,61,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(17,40,61,0.06)_1px,transparent_1px)] [background-size:38px_38px]" />

              <div className="gsap-hero-signal absolute left-6 top-6 z-10 max-w-[22rem] rounded-[24px] border border-[#cc9f64]/30 bg-[linear-gradient(135deg,rgba(255,248,239,0.95),rgba(255,255,255,0.84))] p-5 text-[#11283d] shadow-[0_18px_50px_rgba(31,40,31,0.12)]">
                <span className="inline-flex rounded-full bg-[#f0e4d0] px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[#9a7337]">
                  Commodity pulse
                </span>
                <strong className="mt-3 block font-display text-[1.08rem] tracking-[-0.03em]">
                  NdPr oxide index: $57.8/kg
                </strong>
                <p className="mt-2 text-sm leading-7 text-[#566777]">
                  Three-day move: +4.2% as magnet demand tightened across transport and defense supply.
                </p>
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-24 top-20 z-[1]">
                <svg viewBox="0 0 800 680" className="h-full w-full">
                  <path
                    className="gsap-map-line"
                    d="M94 204c46-38 89-58 126-58 42 0 82 16 120 48 33 28 71 42 114 42 29 0 69-8 122-26 52-18 100-24 144-18"
                    fill="none"
                    stroke="rgba(17,40,61,0.18)"
                    strokeWidth="1.4"
                  />
                  <path
                    className="gsap-map-line"
                    d="M144 360c44-28 80-42 108-42 32 0 67 14 106 42 38 28 78 42 118 42 33 0 72-10 120-30 46-18 88-24 128-18"
                    fill="none"
                    stroke="rgba(17,40,61,0.18)"
                    strokeWidth="1.4"
                  />
                  <path
                    className="gsap-map-line"
                    d="M226 512c26-22 50-34 72-34 25 0 53 10 82 30 32 22 64 34 96 34 31 0 68-10 110-32 41-20 81-28 120-24"
                    fill="none"
                    stroke="rgba(17,40,61,0.18)"
                    strokeWidth="1.4"
                  />
                  {[
                    { cx: 172, cy: 238, fill: "#c59a4f" },
                    { cx: 286, cy: 330, fill: "#c59a4f" },
                    { cx: 446, cy: 284, fill: "#3f7d6f" },
                    { cx: 596, cy: 228, fill: "#c59a4f" },
                    { cx: 522, cy: 470, fill: "#3f7d6f" },
                    { cx: 332, cy: 520, fill: "#c59a4f" },
                  ].map((node, index) => (
                    <g key={`${node.cx}-${node.cy}`}>
                      <circle cx={node.cx} cy={node.cy} r={index % 2 === 0 ? 8 : 10} fill={node.fill} />
                      <circle cx={node.cx} cy={node.cy} r="12" fill="none" stroke={node.fill} strokeOpacity="0.24">
                        <animate attributeName="r" values="10;20;10" dur="3.8s" begin={`${index * 0.25}s`} repeatCount="indefinite" />
                        <animate attributeName="stroke-opacity" values="0.35;0;0.35" dur="3.8s" begin={`${index * 0.25}s`} repeatCount="indefinite" />
                      </circle>
                    </g>
                  ))}
                </svg>
              </div>

              <div className="absolute bottom-6 left-6 right-6 z-10 grid gap-3 lg:grid-cols-2">
                {heroCards.map((card) => (
                  <article
                    key={card.title}
                    className="gsap-hero-card gsap-float-card rounded-[24px] border border-[#d9cfbf] bg-[rgba(255,252,247,0.88)] p-4 text-[#11283d] shadow-[0_20px_45px_rgba(31,40,31,0.08)] backdrop-blur"
                  >
                    <span className="inline-flex rounded-full bg-[#edf4ef] px-3 py-1 text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#315e53]">
                      {card.badge}
                    </span>
                    <strong className="mt-3 block font-display text-[1rem] tracking-[-0.03em]">
                      {card.title}
                    </strong>
                    <p className="mt-2 text-sm leading-7 text-[#5b6c7c]">{card.body}</p>
                  </article>
                ))}
              </div>

              <div className="absolute bottom-6 left-6 z-10 flex max-w-[26rem] flex-wrap gap-2 pr-4 text-[0.76rem] font-semibold text-[#6a7782]">
                {["Houston", "Ontario", "Illinois", "Indiana", "Monterrey"].map((city) => (
                  <span key={city} className="rounded-full border border-[#dacfbf] bg-white/80 px-3 py-1.5">
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="why-this-matters" className="shell section-gap">
          <SectionHeading
            eyebrow="Why this matters"
            title="Rare earth metals sit inside critical equipment, but the scrap flows around them are still opaque."
            body="Nd, Pr, Dy, and Tb-bearing magnets often sit inside motors, HDD assemblies, robotics, industrial machinery, and e-waste fractions. The material is valuable, fragmented, and strategically under-coordinated just as geopolitical pressure is pushing buyers to build more local, resilient supply."
          />

          <div className="mt-12 grid gap-8 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
            <div className="grid gap-5">
              <article className="gsap-reveal overflow-hidden rounded-[30px] border border-[#dccfbe] bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(247,239,227,0.92))] p-7 shadow-[0_24px_80px_rgba(46,41,31,0.08)]">
                <span className="badge">Supply concentration</span>
                <strong className="mt-4 block max-w-[24ch] font-display text-[1.5rem] tracking-[-0.04em] text-[#11283d]">
                  Downstream rare earth processing remains highly concentrated.
                </strong>
                <p className="mt-3 text-base leading-8 text-[#586879]">
                  Local recycling and aggregation is one of the fastest ways to create secondary supply
                  without waiting for new virgin capacity.
                </p>

                <div className="mt-8 grid gap-4">
                  {[
                    { label: "China-led processing base", value: "~90%", width: "90%", tone: "bg-[#c59a4f]" },
                    {
                      label: "North America recovery buildout",
                      value: "~6%",
                      width: "6%",
                      tone: "bg-[#4f7f6f]",
                    },
                    { label: "Europe and other regions", value: "~4%", width: "4%", tone: "bg-[#c9827e]" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between gap-4 text-sm font-semibold text-[#33495d]">
                        <span>{item.label}</span>
                        <strong>{item.value}</strong>
                      </div>
                      <div className="mt-2 h-3 rounded-full bg-[#efe8dc]">
                        <div className={`h-3 rounded-full ${item.tone}`} style={{ width: item.width }} />
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <div className="grid gap-5 md:relative md:block md:min-h-[34rem]">
                {articleCards.map((article) => (
                  <a
                    key={article.title}
                    href={article.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`gsap-reveal gsap-float-card group w-full overflow-hidden rounded-[30px] border border-[#dacfbf] bg-[rgba(255,252,247,0.9)] shadow-[0_24px_70px_rgba(46,41,31,0.08)] transition duration-300 hover:-translate-y-1.5 hover:border-[#315e53]/24 md:absolute md:max-w-[24rem] ${
                      article.badge === "Government signal"
                        ? "md:left-0 md:top-0 md:-rotate-[3deg]"
                        : "md:bottom-0 md:right-0 md:rotate-[2.5deg]"
                    }`}
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,40,61,0.06),rgba(17,40,61,0.58))]" />
                      <div className="absolute left-5 top-5">
                        <span className="inline-flex rounded-full border border-white/20 bg-white/12 px-3 py-1 text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-white backdrop-blur">
                          {article.badge}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <strong className="block font-display text-[1.08rem] tracking-[-0.03em] text-[#11283d]">
                        {article.title}
                      </strong>
                      <p className="mt-2 text-sm leading-6 text-[#5d6c79]">{article.body}</p>
                      <span className="mt-4 block text-[0.8rem] font-semibold text-[#8a7b65]">{article.meta}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {issues.map((issue) => (
                <article
                  key={issue.title}
                  className="gsap-reveal rounded-[28px] border border-[#dccfbe] bg-[rgba(255,252,247,0.9)] p-6 shadow-[0_20px_60px_rgba(46,41,31,0.06)] transition duration-300 hover:-translate-y-1.5 hover:border-[#bf9956]/25"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#f3e7d3] font-display text-sm font-bold tracking-[-0.02em] text-[#9a7337]">
                    {issue.index}
                  </span>
                  <h3 className="mt-5 heading-3">{issue.title}</h3>
                  <p className="mt-3 text-base leading-8 text-[#5d6c79]">{issue.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="metrics" className="shell section-gap">
          <SectionHeading
            eyebrow="Credibility and traction"
            title="The network is already shaped around the categories and counterparties that matter."
          />

          <div className="mt-10 grid gap-8 sm:grid-cols-2 xl:grid-cols-5">
            {metrics.map((metric) => (
              <article key={metric.label} className="gsap-reveal">
                <span
                  className="gsap-count block bg-[linear-gradient(180deg,#173550_0%,#b48637_100%)] bg-clip-text font-display text-[clamp(3rem,5vw,5rem)] leading-none tracking-[-0.08em] text-transparent"
                  data-value={metric.value}
                  data-prefix={metric.prefix ?? ""}
                  data-suffix={metric.suffix}
                >
                  0
                </span>
                <span className="mt-3 block max-w-[12rem] text-sm font-semibold uppercase tracking-[0.16em] text-[#7b7367]">
                  {metric.label}
                </span>
              </article>
            ))}
          </div>

          <div className="gsap-reveal mt-10 overflow-hidden rounded-[999px] border border-[#ddcfbc] bg-[rgba(255,252,247,0.74)] py-3 shadow-[0_16px_40px_rgba(46,41,31,0.04)]">
            <div className="gsap-ribbon-track flex min-w-max items-center gap-3 px-4">
              {[...ribbonItems, ...ribbonItems].map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="whitespace-nowrap rounded-full border border-[#d8cdbd] bg-white/80 px-4 py-2 text-sm font-semibold text-[#415364]"
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="gsap-ribbon-track mt-3 flex min-w-max items-center gap-3 px-4 opacity-75">
              {[...ribbonItems.slice().reverse(), ...ribbonItems.slice().reverse()].map((item, index) => (
                <span
                  key={`${item}-reverse-${index}`}
                  className="whitespace-nowrap rounded-full border border-[#d9d0c1] bg-[#f6efe3] px-4 py-2 text-sm font-semibold text-[#6f7b77]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="workflow" className="shell section-gap">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Marketplace workflow"
              title="One marketplace that works for recurring buyers and one-time suppliers."
            />

            <div className="gsap-reveal inline-flex rounded-full border border-[#d8cfbf] bg-white/80 p-1 shadow-[0_10px_30px_rgba(46,41,31,0.06)]">
              {[
                { key: "suppliers", label: "For Suppliers" },
                { key: "buyers", label: "For Buyers" },
              ].map((tab) => {
                const isActive = workflowAudience === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setWorkflowAudience(tab.key as "suppliers" | "buyers")}
                    className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                      isActive ? "bg-[#11283d] text-white" : "text-[#6a7782] hover:text-[#11283d]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative mt-10 overflow-hidden rounded-[34px] border border-[#dacfbf] bg-[linear-gradient(180deg,rgba(255,252,247,0.92),rgba(244,236,224,0.88))] p-6 shadow-[0_24px_80px_rgba(46,41,31,0.08)] md:p-8">
            <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(196,157,84,0.18),transparent_70%)] blur-2xl" />

            <AnimatePresence mode="wait">
              <motion.div key={workflowAudience} {...panelTransition}>
                <div className="grid gap-5 xl:grid-cols-4">
                  {workflowPanel.steps.map((step, index) => (
                    <article
                      key={step.title}
                      className="rounded-[26px] border border-[#ddd3c5] bg-[rgba(255,255,255,0.76)] p-5 shadow-[0_16px_40px_rgba(46,41,31,0.05)]"
                    >
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e8efe8] font-display text-sm font-bold text-[#315e53]">
                        {index + 1}
                      </span>
                      <strong className="mt-4 block font-display text-[1.05rem] tracking-[-0.03em] text-[#11283d]">
                        {step.title}
                      </strong>
                      <p className="mt-3 text-sm leading-7 text-[#5c6b79]">{step.body}</p>
                    </article>
                  ))}
                </div>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                  <Link className="button-primary" to={workflowPanel.cta}>
                    {workflowPanel.ctaLabel}
                  </Link>
                  <Link className="button-ghost" to={workflowPanel.secondary}>
                    {workflowPanel.secondaryLabel}
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        <section id="dashboard-preview" className="shell section-gap">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Sample dashboard"
              title="A cleaner operating layer for sourcing, bids, and settlement."
              body="The dashboard turns fragmented industrial scrap into something searchable, comparable, and commercially actionable."
            />

            <div className="gsap-reveal inline-flex rounded-full border border-[#d8cfbf] bg-white/80 p-1 shadow-[0_10px_30px_rgba(46,41,31,0.06)]">
              {[
                { key: "buyer", label: "Buyer Workspace" },
                { key: "supplier", label: "Supplier Workspace" },
              ].map((tab) => {
                const isActive = dashboardView === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setDashboardView(tab.key as "buyer" | "supplier")}
                    className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                      isActive ? "bg-[#11283d] text-white" : "text-[#6a7782] hover:text-[#11283d]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={dashboardView}
              {...panelTransition}
              className="mt-10 grid gap-5 xl:grid-cols-[minmax(0,0.24fr)_minmax(0,1fr)_minmax(0,0.24fr)]"
            >
              <div className="grid gap-5">
                {dashboardPanel.sideCards.map((card) => (
                  <HomeLinkCard key={card.title} {...card} />
                ))}
              </div>

              <div className="rounded-[34px] border border-[#d8cfbf] bg-[linear-gradient(180deg,rgba(255,252,247,0.94),rgba(244,236,224,0.88))] p-6 shadow-[0_28px_80px_rgba(46,41,31,0.08)]">
                <div className="flex flex-col gap-4 border-b border-[#e0d7c9] pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <span className="badge">{dashboardPanel.badge}</span>
                  <Link className="button-ghost" to="/dashboard">
                    Open full dashboard preview
                  </Link>
                </div>

                <div className="mt-6 flex items-end gap-2 rounded-[22px] border border-[#ddd4c7] bg-white/70 p-4">
                  {[38, 52, 64, 58, 76, 72, 90, 84, 98, 88, 104, 112].map((height, index) => (
                    <span
                      key={`dashboard-bar-${height}-${index}`}
                      className={`gsap-dashboard-bar w-full rounded-t-full ${
                        index % 3 === 0 ? "bg-[#c59a4f]" : index % 2 === 0 ? "bg-[#739b8d]" : "bg-[#d9d0c3]"
                      }`}
                      style={{ height }}
                    />
                  ))}
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {dashboardPanel.widgets.map((widget, index) => (
                    <article
                      key={widget.label}
                      className="rounded-[26px] border border-[#ddd4c7] bg-white/76 p-5 shadow-[0_14px_36px_rgba(46,41,31,0.05)]"
                    >
                      <span className="text-[0.7rem] font-extrabold uppercase tracking-[0.18em] text-[#7e7669]">
                        {widget.label}
                      </span>
                      <strong className="mt-4 block font-display text-[1.8rem] tracking-[-0.04em] text-[#11283d]">
                        {widget.value}
                      </strong>
                      {index === 1 ? (
                        <div className="mt-4 grid grid-cols-4 gap-2">
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((square) => (
                            <span
                              key={square}
                              className={`h-6 rounded-md ${
                                [1, 5, 9].includes(square)
                                  ? "bg-[#c59a4f]"
                                  : [3, 4, 6, 11].includes(square)
                                    ? "bg-[#79a190]"
                                    : "bg-[#e6dece]"
                              }`}
                            />
                          ))}
                        </div>
                      ) : <p className="mt-3 text-sm leading-6 text-[#5c6b79]">{widget.body}</p>}
                    </article>
                  ))}
                </div>
              </div>

              <div className="grid gap-5">
                {dashboardPanel.oppositeCards.map((card) => (
                  <HomeLinkCard key={card.title} {...card} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        <section id="service-stack" className="shell section-gap">
          <SectionHeading
            eyebrow="Service stack and why us"
            title="The infrastructure stack behind quality-assured material flow."
            body="Classification, pricing, verification, and execution reinforce one another over time."
          />

          <div className="mt-10 grid gap-5 lg:grid-cols-5">
            {serviceModules.map((module) =>
              module.action === "modal" ? (
                <button
                  key={module.title}
                  type="button"
                  onClick={() => setIsPricingModalOpen(true)}
                  className="gsap-reveal group rounded-[28px] border border-[#d8cfbf] bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(244,236,224,0.88))] p-6 text-left shadow-[0_22px_64px_rgba(46,41,31,0.06)] transition duration-300 hover:-translate-y-1.5 hover:border-[#315e53]/25"
                >
                  <span className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#9a7337]">
                    {module.index}
                  </span>
                  <div className="gsap-service-line mt-4 h-[3px] w-full rounded-full bg-[linear-gradient(90deg,#c59a4f_0%,#7aa292_100%)]" />
                  <strong className="mt-5 block font-display text-[1.12rem] tracking-[-0.03em] text-[#11283d]">
                    {module.title}
                  </strong>
                  <p className="mt-3 text-sm leading-6 text-[#5d6c79]">{module.body}</p>
                </button>
              ) : (
                <Link
                  key={module.title}
                  to={module.href ?? "/contact"}
                  className="gsap-reveal group rounded-[28px] border border-[#d8cfbf] bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(244,236,224,0.88))] p-6 shadow-[0_22px_64px_rgba(46,41,31,0.06)] transition duration-300 hover:-translate-y-1.5 hover:border-[#315e53]/25"
                >
                  <span className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#9a7337]">
                    {module.index}
                  </span>
                  <div className="gsap-service-line mt-4 h-[3px] w-full rounded-full bg-[linear-gradient(90deg,#c59a4f_0%,#7aa292_100%)]" />
                  <strong className="mt-5 block font-display text-[1.12rem] tracking-[-0.03em] text-[#11283d]">
                    {module.title}
                  </strong>
                  <p className="mt-3 text-sm leading-6 text-[#5d6c79]">{module.body}</p>
                </Link>
              )
            )}
          </div>

          <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="gsap-reveal relative min-h-[420px] overflow-hidden rounded-[34px] border border-[#d8cfbf] bg-[linear-gradient(180deg,rgba(255,252,247,0.94),rgba(245,236,221,0.92))] shadow-[0_24px_80px_rgba(46,41,31,0.07)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(196,157,84,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(110,152,121,0.2),transparent_32%)]" />
              <div className="absolute left-1/2 top-1/2 z-10 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#dccfbe] bg-white/90 font-display text-[1rem] font-bold tracking-[-0.03em] text-[#11283d] shadow-[0_16px_36px_rgba(46,41,31,0.08)]">
                Moat flywheel
              </div>
              {[
                { title: "Classification", sub: "Better labels", pos: "left-[12%] top-[14%]" },
                { title: "Listings", sub: "Cleaner discovery", pos: "right-[15%] top-[16%]" },
                { title: "Pricing", sub: "Better signals", pos: "right-[8%] top-[42%]" },
                { title: "Trust", sub: "Less friction", pos: "right-[16%] bottom-[14%]" },
                { title: "Transactions", sub: "More completed deals", pos: "left-[14%] bottom-[14%]" },
                { title: "Data", sub: "Feedback into intelligence", pos: "left-[7%] top-[44%]" },
              ].map((node) => (
                <div
                  key={node.title}
                  className={`gsap-float-card absolute ${node.pos} max-w-[10rem] rounded-[22px] border border-[#ddd2c4] bg-white/80 p-4 shadow-[0_14px_36px_rgba(46,41,31,0.05)]`}
                >
                  <strong className="block font-display text-[0.98rem] tracking-[-0.03em] text-[#11283d]">
                    {node.title}
                  </strong>
                  <span className="mt-1 block text-xs leading-6 text-[#657583]">{node.sub}</span>
                </div>
              ))}
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 700 420" aria-hidden="true">
                <path d="M190 115c46-40 99-60 162-60 61 0 118 20 171 60" fill="none" stroke="rgba(17,40,61,0.18)" strokeWidth="1.4" />
                <path d="M538 136c34 38 50 80 50 128 0 48-16 93-50 132" fill="none" stroke="rgba(17,40,61,0.18)" strokeWidth="1.4" />
                <path d="M520 316c-46 38-103 58-168 58-63 0-118-20-165-58" fill="none" stroke="rgba(17,40,61,0.18)" strokeWidth="1.4" />
                <path d="M170 296c-34-40-52-85-52-136 0-49 18-90 52-126" fill="none" stroke="rgba(17,40,61,0.18)" strokeWidth="1.4" />
              </svg>
            </div>

            <div className="grid gap-5 md:grid-cols-3 xl:grid-cols-1">
              {flywheelNotes.map((note) => (
                <article
                  key={note.title}
                  className="gsap-reveal rounded-[28px] border border-[#d8cfbf] bg-[rgba(255,252,247,0.9)] p-6 shadow-[0_18px_56px_rgba(46,41,31,0.06)]"
                >
                  <strong className="block font-display text-[1.06rem] tracking-[-0.03em] text-[#11283d]">
                    {note.title}
                  </strong>
                  <p className="mt-3 text-sm leading-6 text-[#5d6c79]">{note.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="final-cta" className="shell section-gap">
          <div className="gsap-reveal rounded-[34px] border border-[#d8cfbf] bg-[linear-gradient(135deg,rgba(255,252,247,0.96),rgba(241,234,218,0.9))] p-8 shadow-[0_28px_90px_rgba(46,41,31,0.08)] lg:flex lg:items-center lg:justify-between lg:gap-8">
            <div className="max-w-3xl">
              <p className="eyebrow">Start transacting with more confidence</p>
              <h2 className="heading-2 max-w-[17ch]">
                List feedstock, become a verified recycler, or request a demo.
              </h2>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap lg:mt-0 lg:justify-end">
              <Link className="button-primary" to="/supplier-onboarding">
                List Your Feedstock
              </Link>
              <Link className="button-secondary" to="/recycler-onboarding">
                Become a Verified Recycler
              </Link>
              <Link className="button-secondary" to="/contact">
                Request a Demo
              </Link>
            </div>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {isPricingModalOpen ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#102233]/45 px-4 py-10 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-3xl rounded-[32px] border border-[#d8cfbf] bg-[linear-gradient(180deg,rgba(255,252,247,0.98),rgba(244,236,224,0.95))] p-8 shadow-[0_32px_100px_rgba(13,19,28,0.26)]"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex flex-col gap-5 border-b border-[#e1d8cb] pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span className="badge">Pricing intelligence</span>
                  <h3 className="mt-4 heading-3">How marketplace pricing becomes more reliable over time.</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPricingModalOpen(false)}
                  className="button-ghost !justify-start sm:!justify-center"
                >
                  Close
                </button>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: "Classification first",
                    body: "Feedstock form, contamination, magnet chemistry, and packaging detail set the initial pricing lane.",
                  },
                  {
                    title: "Bid spread visibility",
                    body: "Supplier engagement and recycler demand create cleaner signals around market-clearing value.",
                  },
                  {
                    title: "Execution feedback",
                    body: "Assays, settlement outcomes, and logistics learnings feed back into future pricing confidence.",
                  },
                ].map((item) => (
                  <article
                    key={item.title}
                    className="rounded-[24px] border border-[#ddd3c5] bg-white/80 p-5 shadow-[0_16px_36px_rgba(46,41,31,0.05)]"
                  >
                    <strong className="block font-display text-[1rem] tracking-[-0.03em] text-[#11283d]">
                      {item.title}
                    </strong>
                    <p className="mt-3 text-sm leading-7 text-[#5c6b79]">{item.body}</p>
                  </article>
                ))}
              </div>

              <div className="mt-6 rounded-[24px] border border-[#ddd3c5] bg-[rgba(255,255,255,0.76)] p-5">
                <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr_1.2fr]">
                  {comparisonRows.map((row) => (
                    <div key={row.label} className="contents">
                      <div className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#7c7569]">
                        {row.label}
                      </div>
                      <div className="text-sm leading-7 text-[#566777]">{row.oneTime}</div>
                      <div className="text-sm leading-7 text-[#566777]">{row.subscription}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
