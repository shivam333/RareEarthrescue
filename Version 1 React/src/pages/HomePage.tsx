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

type LogoBadge = {
  name: string;
  src: string;
};

type NewsCard = {
  badge: string;
  title: string;
  body: string;
  meta: string;
  image: string;
  href?: string;
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

const ribbonLogos: LogoBadge[] = [
  {
    name: "Azure",
    src: "https://www.vectorlogo.zone/logos/microsoft_azure/microsoft_azure-icon.svg",
  },
  {
    name: "NVIDIA",
    src: "https://www.vectorlogo.zone/logos/nvidia/nvidia-icon.svg",
  },
  {
    name: "Dow",
    src: "https://logo.clearbit.com/dow.com",
  },
  {
    name: "REEcycle",
    src: "https://logo.clearbit.com/reecycle.com",
  },
  {
    name: "Vulcan",
    src: "https://logo.clearbit.com/vhm.com",
  },
  {
    name: "MP Materials",
    src: "https://logo.clearbit.com/mpmaterials.com",
  },
] as const;

const commodityTickers = [
  {
    label: "Copper",
    venue: "LME spot",
    value: "$9,486",
    move: "+1.8%",
    tone: "text-[#2f7c62]",
  },
  {
    label: "Steel",
    venue: "HRC Midwest",
    value: "$812",
    move: "+0.7%",
    tone: "text-[#2f7c62]",
  },
  {
    label: "Rare earth",
    venue: "NdPr oxide",
    value: "$57.8",
    move: "+4.2%",
    tone: "text-[#9a7337]",
  },
] as const;

const issues = [
  {
    index: "01",
    title: "Fragmented feedstock",
    body: "Recycler demand is real, but origin points are scattered across scrapyards, dismantlers, ITAD operators, and industrial salvage networks.",
  },
  {
    index: "02",
    title: "Opaque material quality",
    body: "Magnet chemistry, contamination, and recoverable content are often poorly described, making pricing and plant planning harder than they should be.",
  },
  {
    index: "03",
    title: "Hidden value pools",
    body: "Scrappers and dismantlers may be underpricing rare-earth-bearing equipment because specialist recycler demand is rarely visible at the point of sale.",
  },
  {
    index: "04",
    title: "Strategic urgency",
    body: "Domestic recovery matters more as electrification, robotics, electronics, and defense push critical mineral security higher on the industrial agenda.",
  },
] as const;

const articleCards: NewsCard[] = [
  {
    badge: "Public announcement",
    title: "White House proclamation on processed critical minerals imports",
    body: "Policy now links processed critical mineral dependence directly to domestic industrial resilience.",
    meta: "Source: The White House",
    href: "https://www.whitehouse.gov/presidential-actions/2026/01/adjusting-imports-of-processed-critical-minerals-and-their-derivative-products-into-the-united-states/",
    image:
      "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?auto=format&fit=crop&w=1400&q=80",
  },
  {
    badge: "REO market note",
    title: "NdPr pricing remains the signal feedstock operators watch most closely",
    body: "Rare earth oxide pricing continues to shape how recyclers assess magnet-bearing scrap and intermediate material demand.",
    meta: "Source: Rare Earth Rescue desk note",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80",
  },
  {
    badge: "Industry article",
    title: "Sorting rare earth motors without opening them",
    body: "Better sorting methods are making REE-bearing motor streams easier to identify before teardown and recovery.",
    meta: "Source: Scientific Reports",
    href: "https://www.nature.com/articles/s41598-025-94667-x",
    image:
      "https://images.unsplash.com/photo-1581091870622-2cf1f3c71f54?auto=format&fit=crop&w=1400&q=80",
  },
  {
    badge: "Customer testimonial",
    title: "“We were likely underpricing magnet-bearing scrap before we had specialist demand in view.”",
    body: "ITAD and dismantling operators use better buyer visibility to uncover value pools that were previously treated as generic mixed scrap.",
    meta: "Perspective from a recovery partner",
    image:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80",
  },
] as const;

const networkNodes = [
  { cx: 148, cy: 130, fill: "#c59a4f" },
  { cx: 212, cy: 182, fill: "#3f7d6f" },
  { cx: 308, cy: 202, fill: "#c59a4f" },
  { cx: 392, cy: 150, fill: "#3f7d6f" },
  { cx: 514, cy: 148, fill: "#c59a4f" },
  { cx: 464, cy: 266, fill: "#3f7d6f" },
] as const;

const marketChartBars = [42, 58, 52, 74, 69, 88, 84, 102, 94, 112, 108, 124] as const;

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

function LogoRibbonChip({ logo }: { logo: LogoBadge }) {
  return (
    <span className="inline-flex items-center justify-center px-5 py-2">
      <img
        src={logo.src}
        alt={logo.name}
        className="h-8 w-auto object-contain opacity-95 saturate-[1.05]"
        loading="lazy"
      />
    </span>
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
        ".gsap-network-route",
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

      gsap.to(".gsap-network-drift", {
        xPercent: 8,
        yPercent: -10,
        duration: 9,
        repeat: -1,
        yoyo: true,
        stagger: 0.8,
        ease: "sine.inOut",
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

      gsap.utils.toArray<HTMLElement>(".gsap-service-progress, .gsap-chart-line, .gsap-service-route").forEach((line, index) => {
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

      gsap.utils.toArray<HTMLElement>(".gsap-market-bar").forEach((bar, index) => {
        gsap.fromTo(
          bar,
          { scaleY: 0.28, transformOrigin: "bottom center" },
          {
            scaleY: 1,
            duration: 0.9,
            delay: index * 0.04,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".gsap-ticker-track").forEach((track, index) => {
        gsap.fromTo(
          track,
          { xPercent: index % 2 === 0 ? 0 : -50 },
          {
            xPercent: index % 2 === 0 ? -50 : 0,
            duration: 18,
            repeat: -1,
            ease: "none",
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
          className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(210,175,103,0.24),transparent_24%),radial-gradient(circle_at_88%_12%,rgba(121,161,144,0.24),transparent_30%),linear-gradient(180deg,#fbf7ef_0%,#f4ebdb_48%,#f5efe4_100%)] pb-8 pt-32 lg:pb-10"
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
              <div className="gsap-network-drift absolute left-[14%] top-[18%] h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(201,159,76,0.16),transparent_68%)] blur-2xl" />
              <div className="gsap-network-drift absolute right-[12%] top-[30%] h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(110,152,121,0.18),transparent_68%)] blur-3xl" />
              <div className="gsap-network-drift absolute bottom-[16%] left-[36%] h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(23,53,80,0.12),transparent_72%)] blur-2xl" />
              <div className="absolute inset-[12%_10%_18%] rounded-[32px] border border-white/30 opacity-60" />

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

              <div className="pointer-events-none absolute inset-x-0 bottom-[15rem] top-16 z-[1]">
                <svg viewBox="0 0 800 680" className="h-full w-full">
                  <path
                    className="gsap-network-route"
                    d="M94 204c46-38 89-58 126-58 42 0 82 16 120 48 33 28 71 42 114 42 29 0 69-8 122-26 52-18 100-24 144-18"
                    fill="none"
                    stroke="rgba(17,40,61,0.18)"
                    strokeWidth="1.4"
                  />
                  <path
                    className="gsap-network-route"
                    d="M144 360c44-28 80-42 108-42 32 0 67 14 106 42 38 28 78 42 118 42 33 0 72-10 120-30 46-18 88-24 128-18"
                    fill="none"
                    stroke="rgba(17,40,61,0.18)"
                    strokeWidth="1.4"
                  />
                  <path
                    className="gsap-network-route"
                    d="M226 512c26-22 50-34 72-34 25 0 53 10 82 30 32 22 64 34 96 34 31 0 68-10 110-32 41-20 81-28 120-24"
                    fill="none"
                    stroke="rgba(17,40,61,0.18)"
                    strokeWidth="1.4"
                  />
                  {networkNodes.map((node, index) => (
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

              <div className="absolute bottom-6 left-6 right-6 z-10">
                <article className="gsap-hero-card overflow-hidden rounded-[28px] border border-[#d9cfbf] bg-[rgba(255,252,247,0.9)] p-5 text-[#11283d] shadow-[0_22px_50px_rgba(31,40,31,0.08)] backdrop-blur">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <span className="inline-flex rounded-full bg-[#edf4ef] px-3 py-1 text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#315e53]">
                        Live commodity pulse
                      </span>
                      <strong className="mt-3 block font-display text-[1.1rem] tracking-[-0.03em]">
                        Trading signals across copper, steel, and rare earth inputs.
                      </strong>
                    </div>
                    <div className="overflow-hidden rounded-full border border-[#d9cfbf] bg-white/80 px-3 py-2">
                      <div className="gsap-ticker-track flex min-w-max items-center gap-5">
                        {[...commodityTickers, ...commodityTickers].map((ticker, index) => (
                          <div key={`${ticker.label}-${index}`} className="flex items-center gap-3 text-sm">
                            <span className="font-semibold uppercase tracking-[0.14em] text-[#7b7367]">{ticker.label}</span>
                            <span className="font-bold text-[#173550]">{ticker.value}</span>
                            <span className="text-[#6b7b86]">{ticker.venue}</span>
                            <span className={`font-bold ${ticker.tone}`}>{ticker.move}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,0.74fr)_minmax(0,1.26fr)]">
                    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                      {commodityTickers.map((ticker) => (
                        <div key={ticker.label} className="rounded-[22px] border border-[#ddd4c7] bg-white/76 p-4">
                          <span className="text-[0.66rem] font-extrabold uppercase tracking-[0.18em] text-[#7d7568]">
                            {ticker.venue}
                          </span>
                          <strong className="mt-2 block font-display text-[1.18rem] tracking-[-0.03em] text-[#11283d]">
                            {ticker.label}
                          </strong>
                          <div className="mt-2 flex items-end justify-between gap-3">
                            <span className="text-[1.08rem] font-bold text-[#173550]">{ticker.value}</span>
                            <span className={`text-sm font-bold ${ticker.tone}`}>{ticker.move}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-[24px] border border-[#ddd4c7] bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(245,238,226,0.88))] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[0.66rem] font-extrabold uppercase tracking-[0.18em] text-[#7d7568]">
                          Multi-market trend
                        </span>
                        <span className="rounded-full bg-[#edf4ef] px-3 py-1 text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#315e53]">
                          Simulated live feed
                        </span>
                      </div>
                      <div className="mt-4 h-28 overflow-hidden rounded-[22px] border border-[#e3dacd] bg-white/72 p-4">
                        <svg viewBox="0 0 440 140" className="h-full w-full">
                          <defs>
                            <linearGradient id="marketLine" x1="0%" x2="100%" y1="0%" y2="0%">
                              <stop offset="0%" stopColor="#c59a4f" />
                              <stop offset="100%" stopColor="#4f7f6f" />
                            </linearGradient>
                            <linearGradient id="marketFill" x1="0%" x2="0%" y1="0%" y2="100%">
                              <stop offset="0%" stopColor="rgba(79,127,111,0.28)" />
                              <stop offset="100%" stopColor="rgba(79,127,111,0.02)" />
                            </linearGradient>
                          </defs>
                          <path d="M0 116 36 106 72 110 108 92 144 98 180 84 216 72 252 78 288 58 324 66 360 46 396 52 440 26 440 140 0 140Z" fill="url(#marketFill)" />
                          <path className="gsap-chart-line" d="M0 116 36 106 72 110 108 92 144 98 180 84 216 72 252 78 288 58 324 66 360 46 396 52 440 26" fill="none" stroke="url(#marketLine)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx="440" cy="26" r="5" fill="#4f7f6f">
                            <animate attributeName="r" values="4;7;4" dur="2.4s" repeatCount="indefinite" />
                          </circle>
                        </svg>
                      </div>
                      <div className="mt-4 flex items-end gap-2">
                        {marketChartBars.map((height, index) => (
                          <span
                            key={`market-bar-${height}-${index}`}
                            className={`gsap-market-bar w-full rounded-t-full ${
                              index % 4 === 0 ? "bg-[#c59a4f]" : index % 3 === 0 ? "bg-[#4f7f6f]" : "bg-[#d9d0c3]"
                            }`}
                            style={{ height }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section id="why-this-matters" className="shell pt-4 lg:pt-6">
          <SectionHeading
            eyebrow="Why this matters"
            title="Rare earth metals sit inside critical equipment. Coordinating their recovery is now a U.S. supply chain priority."
            body="Rare earth-bearing magnets are embedded in motors, HDD assemblies, robotics, industrial equipment, and e-waste. Recyclers need steadier sourcing to keep facilities utilized. Scrappers, dismantlers, and ITAD operators need better visibility into the value of magnet-bearing scrap they may be overlooking. Rare Earth Rescue helps connect both sides of that bottleneck."
          />

          <div className="mt-8 grid items-start gap-8 xl:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
            <div className="grid gap-5">
              <div className="grid items-start gap-4 md:grid-cols-2">
                {issues.map((issue) => (
                  <article
                    key={issue.title}
                    className="gsap-reveal self-start rounded-[26px] border border-[#dccfbe] bg-[rgba(255,252,247,0.9)] p-5 shadow-[0_18px_52px_rgba(46,41,31,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[#bf9956]/25"
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f3e7d3] font-display text-[0.76rem] font-bold tracking-[-0.02em] text-[#9a7337]">
                        {issue.index}
                      </span>
                      <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#8c7b64]">
                        Market friction
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-[1.2rem] leading-[1.02] tracking-[-0.04em] text-[#11283d]">
                      {issue.title}
                    </h3>
                    <p className="mt-2.5 text-[0.95rem] leading-7 text-[#5d6c79]">{issue.body}</p>
                  </article>
                ))}
              </div>

              <div id="news" className="grid gap-4">
                <div className="gsap-reveal flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="eyebrow !mb-0">News</p>
                    <h3 className="font-display text-[1.45rem] leading-[1.02] tracking-[-0.04em] text-[#11283d]">
                      Articles, announcements, REO market notes, and customer perspective.
                    </h3>
                  </div>
                  <p className="max-w-[18rem] text-sm leading-6 text-[#5d6c79]">
                    A single stream for public signals, recovery intelligence, and market validation.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {articleCards.map((article) => {
                    const content = (
                      <>
                        <div className="relative h-44 overflow-hidden">
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
                          <strong className="block font-display text-[1.05rem] tracking-[-0.03em] text-[#11283d]">
                            {article.title}
                          </strong>
                          <p className="mt-2 text-sm leading-6 text-[#5d6c79]">{article.body}</p>
                          <span className="mt-4 block text-[0.8rem] font-semibold text-[#8a7b65]">{article.meta}</span>
                        </div>
                      </>
                    );

                    return article.href ? (
                      <a
                        key={article.title}
                        href={article.href}
                        target="_blank"
                        rel="noreferrer"
                        className="gsap-reveal group overflow-hidden rounded-[30px] border border-[#dacfbf] bg-[rgba(255,252,247,0.92)] shadow-[0_22px_60px_rgba(46,41,31,0.08)] transition duration-300 hover:-translate-y-1.5 hover:border-[#315e53]/24"
                      >
                        {content}
                      </a>
                    ) : (
                      <article
                        key={article.title}
                        className="gsap-reveal group overflow-hidden rounded-[30px] border border-[#dacfbf] bg-[rgba(255,252,247,0.92)] shadow-[0_22px_60px_rgba(46,41,31,0.08)] transition duration-300 hover:-translate-y-1.5 hover:border-[#315e53]/24"
                      >
                        {content}
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid gap-5">
              <div className="gsap-reveal relative overflow-hidden rounded-[34px] border border-[#dccfbe] bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(245,236,221,0.94))] p-6 shadow-[0_26px_80px_rgba(46,41,31,0.08)] sm:p-8">
                <div className="gsap-network-drift absolute left-[10%] top-[10%] h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(201,159,76,0.16),transparent_68%)] blur-3xl" />
                <div className="gsap-network-drift absolute bottom-[12%] right-[14%] h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(110,152,121,0.16),transparent_70%)] blur-3xl" />

                <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-[34rem]">
                    <span className="badge">North America network</span>
                    <strong className="mt-4 block font-display text-[1.45rem] tracking-[-0.04em] text-[#11283d]">
                      A recovery network connecting fragmented scrap origin points with verified recycler demand.
                    </strong>
                    <p className="mt-3 text-[0.98rem] leading-7 text-[#556576]">
                      Rare Earth Rescue helps recyclers source fragmented feedstock more reliably and helps scrappers, dismantlers, and ITAD operators identify and monetize rare-earth-bearing material that may otherwise trade below value.
                    </p>
                  </div>

                  <article className="rounded-[22px] border border-[#dccfbe] bg-[rgba(255,252,247,0.9)] px-4 py-3 shadow-[0_14px_34px_rgba(46,41,31,0.05)] lg:max-w-[15rem]">
                    <span className="text-[0.58rem] font-extrabold uppercase tracking-[0.18em] text-[#7d7568]">
                      Context only
                    </span>
                    <div className="mt-2.5 grid gap-2.5">
                      {[
                        { label: "China-led processing", value: "~90%", width: "90%", tone: "bg-[#c59a4f]" },
                        { label: "North America buildout", value: "~6%", width: "6%", tone: "bg-[#4f7f6f]" },
                        { label: "Other regions", value: "~4%", width: "4%", tone: "bg-[#c9827e]" },
                      ].map((item) => (
                        <div key={item.label}>
                          <div className="flex items-center justify-between gap-3 text-[0.7rem] font-semibold text-[#445567]">
                            <span>{item.label}</span>
                            <strong>{item.value}</strong>
                          </div>
                          <div className="mt-1.5 h-2 rounded-full bg-[#efe8dc]">
                            <div className={`h-2 rounded-full ${item.tone}`} style={{ width: item.width }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                </div>

                <div className="relative mt-6 overflow-hidden rounded-[30px] border border-[#ddd4c7] bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(244,237,225,0.84))] px-3 py-4 sm:px-5">
                  <svg viewBox="0 0 620 340" className="h-full w-full">
                    <path
                      d="M52 84 73 68 95 66 112 73 132 87 145 104 170 109 190 121 206 136 225 145 249 151 277 150 301 160 322 176 344 182 370 184 398 176 425 168 450 168 474 176 499 194 525 204 548 226 556 250 545 268 523 278 505 291 485 296 470 306 447 311 419 304 396 293 373 290 351 292 326 283 305 267 282 259 258 251 234 243 212 232 191 229 170 215 150 197 132 185 113 168 92 156 77 139 62 118 55 101Z"
                      fill="rgba(255,255,255,0.58)"
                      stroke="rgba(17,40,61,0.16)"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <path id="corridor-west" className="gsap-network-route" d="M205 124C237 134 274 149 308 170" fill="none" stroke="rgba(17,40,61,0.22)" strokeWidth="2.2" />
                    <path id="corridor-east" className="gsap-network-route" d="M308 170C367 162 426 155 487 160" fill="none" stroke="rgba(17,40,61,0.22)" strokeWidth="2.2" />
                    <path id="corridor-south" className="gsap-network-route" d="M308 170C348 196 385 224 423 257" fill="none" stroke="rgba(17,40,61,0.22)" strokeWidth="2.2" />
                    <path id="corridor-interior" className="gsap-network-route" d="M308 170C260 186 219 207 181 232" fill="none" stroke="rgba(17,40,61,0.22)" strokeWidth="2.2" />
                    <path id="corridor-north" className="gsap-network-route" d="M308 170C286 130 250 96 208 76" fill="none" stroke="rgba(17,40,61,0.22)" strokeWidth="2.2" />

                    {networkNodes.map((node, index) => (
                      <g key={`network-node-${node.cx}-${node.cy}`}>
                        <circle cx={node.cx} cy={node.cy} r={index === 2 ? 9 : 7} fill={node.fill} />
                        <circle cx={node.cx} cy={node.cy} r={index === 2 ? 16 : 12} fill="none" stroke={node.fill} strokeOpacity="0.24">
                          <animate attributeName="r" values={index === 2 ? "14;26;14" : "10;20;10"} dur="3.4s" begin={`${index * 0.24}s`} repeatCount="indefinite" />
                          <animate attributeName="stroke-opacity" values="0.3;0;0.3" dur="3.4s" begin={`${index * 0.24}s`} repeatCount="indefinite" />
                        </circle>
                      </g>
                    ))}

                    {[
                      { href: "#corridor-west", color: "#c59a4f", begin: "0s" },
                      { href: "#corridor-east", color: "#3f7d6f", begin: "0.7s" },
                      { href: "#corridor-south", color: "#173550", begin: "1.2s" },
                      { href: "#corridor-interior", color: "#c59a4f", begin: "1.8s" },
                    ].map((particle) => (
                      <circle key={`${particle.href}-${particle.begin}`} r="3.8" fill={particle.color} opacity="0.9">
                        <animateMotion dur="4.8s" begin={particle.begin} repeatCount="indefinite" rotate="auto">
                          <mpath href={particle.href} />
                        </animateMotion>
                      </circle>
                    ))}
                  </svg>
                </div>
              </div>
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
                  className="gsap-count block whitespace-nowrap bg-[linear-gradient(180deg,#173550_0%,#b48637_100%)] bg-clip-text font-display text-[clamp(2.7rem,4.6vw,4.9rem)] leading-none tracking-[-0.08em] text-transparent"
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

          <div className="gsap-reveal mt-10 overflow-hidden py-2">
            <div className="gsap-ribbon-track flex min-w-max items-center gap-12 px-2">
              {[...ribbonLogos, ...ribbonLogos].map((logo, index) => (
                <span key={`${logo.name}-${index}`} className="whitespace-nowrap">
                  <LogoRibbonChip logo={logo} />
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
            title="The infrastructure stack compounds into a moat around value creation."
            body="Each layer improves the next: cleaner classification sharpens pricing, better trust lowers friction, and repeat execution turns fragmented scrap into repeatable industrial supply."
          />

          <div className="gsap-reveal relative mt-10 overflow-hidden rounded-[34px] border border-[#d8cfbf] bg-[linear-gradient(180deg,rgba(255,252,247,0.94),rgba(245,236,221,0.92))] p-6 shadow-[0_24px_80px_rgba(46,41,31,0.07)] lg:p-8">
            <div className="absolute left-8 right-8 top-[4.8rem] hidden h-[3px] rounded-full bg-[rgba(221,212,199,0.9)] lg:block" />
            <div className="gsap-service-progress absolute left-8 right-8 top-[4.8rem] hidden h-[3px] rounded-full bg-[linear-gradient(90deg,#c59a4f_0%,#7aa292_55%,#173550_100%)] lg:block" />

            <div className="grid gap-5 lg:grid-cols-5">
              {serviceModules.map((module) => {
                const content = (
                  <>
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#ddcfbc] bg-white/82 font-display text-sm font-bold text-[#9a7337]">
                      {module.index}
                    </span>
                    <strong className="mt-5 block font-display text-[1.08rem] tracking-[-0.03em] text-[#11283d]">
                      {module.title}
                    </strong>
                    <p className="mt-3 text-sm leading-7 text-[#5d6c79]">{module.body}</p>
                  </>
                );

                return module.action === "modal" ? (
                  <button
                    key={module.title}
                    type="button"
                    onClick={() => setIsPricingModalOpen(true)}
                    className="gsap-float-card relative rounded-[28px] border border-[#d8cfbf] bg-[rgba(255,252,247,0.86)] p-6 text-left shadow-[0_18px_48px_rgba(46,41,31,0.06)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-[#315e53]/25"
                  >
                    {content}
                  </button>
                ) : (
                  <Link
                    key={module.title}
                    to={module.href ?? "/contact"}
                    className="gsap-float-card relative rounded-[28px] border border-[#d8cfbf] bg-[rgba(255,252,247,0.86)] p-6 shadow-[0_18px_48px_rgba(46,41,31,0.06)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-[#315e53]/25"
                  >
                    {content}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
            <div className="gsap-reveal relative min-h-[460px] overflow-hidden rounded-[34px] border border-[#d8cfbf] bg-[linear-gradient(180deg,rgba(255,252,247,0.94),rgba(245,236,221,0.92))] shadow-[0_24px_80px_rgba(46,41,31,0.07)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(196,157,84,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(110,152,121,0.2),transparent_32%)]" />
              <div className="absolute left-1/2 top-1/2 z-10 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#dccfbe] bg-white/92 px-5 text-center font-display text-[1.02rem] font-bold leading-5 tracking-[-0.03em] text-[#11283d] shadow-[0_16px_36px_rgba(46,41,31,0.08)]">
                Value creation engine
              </div>
              <div className="absolute inset-[72px] rounded-full border border-[#e0d7c9] opacity-80" />
              <div className="absolute inset-[110px] rounded-full border border-[#ebe3d7] opacity-70" />
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
                  className={`gsap-float-card absolute ${node.pos} max-w-[10rem] rounded-[22px] border border-[#ddd2c4] bg-white/84 p-4 shadow-[0_14px_36px_rgba(46,41,31,0.05)]`}
                >
                  <strong className="block font-display text-[0.98rem] tracking-[-0.03em] text-[#11283d]">
                    {node.title}
                  </strong>
                  <span className="mt-1 block text-xs leading-6 text-[#657583]">{node.sub}</span>
                </div>
              ))}
            </div>

            <div className="gsap-reveal rounded-[32px] border border-[#d8cfbf] bg-[rgba(255,252,247,0.82)] p-6 shadow-[0_18px_56px_rgba(46,41,31,0.06)]">
              <div className="space-y-6">
                {flywheelNotes.map((note, index) => (
                  <div
                    key={note.title}
                    className={`${index === 0 ? "" : "border-t border-[#e0d7c9] pt-6"}`}
                  >
                    <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <strong className="mt-2 block font-display text-[1.08rem] tracking-[-0.03em] text-[#11283d]">
                      {note.title}
                    </strong>
                    <p className="mt-3 text-sm leading-7 text-[#5d6c79]">{note.body}</p>
                  </div>
                ))}
              </div>
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
