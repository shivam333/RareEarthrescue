import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ShadButton } from "../components/ui/ShadButton";
import { ShadTabs, ShadTabsContent, ShadTabsList, ShadTabsTrigger } from "../components/ui/ShadTabs";

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

const heroCommodityTickers = [
  { label: "Copper", value: "$4.38/lb", move: "+1.2%", tone: "text-[#2f7c62]" },
  { label: "ReO Index", value: "118.4", move: "+2.1%", tone: "text-[#8d6d39]" },
  { label: "NdFeB", value: "$57.8/kg", move: "+4.2%", tone: "text-[#2f7c62]" },
] as const;

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

const issueAccentStyles = [
  {
    icon: "bg-[#f0a36b]",
    iconText: "text-white",
    chip: "text-[#b5622e]",
  },
  {
    icon: "bg-[#69b9a8]",
    iconText: "text-white",
    chip: "text-[#3d8678]",
  },
  {
    icon: "bg-[#9a628f]",
    iconText: "text-white",
    chip: "text-[#8d4d7b]",
  },
  {
    icon: "bg-[#7066b0]",
    iconText: "text-white",
    chip: "text-[#655aa8]",
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

const usRecoveryNodes = [
  { cx: 92, cy: 170, fill: "#c59a4f", label: "Pacific Northwest" },
  { cx: 140, cy: 222, fill: "#3f7d6f", label: "California" },
  { cx: 245, cy: 194, fill: "#c59a4f", label: "Texas" },
  { cx: 318, cy: 156, fill: "#3f7d6f", label: "Upper Midwest" },
  { cx: 394, cy: 128, fill: "#c59a4f", label: "Great Lakes" },
  { cx: 468, cy: 144, fill: "#3f7d6f", label: "Mid-Atlantic" },
  { cx: 525, cy: 198, fill: "#c59a4f", label: "Southeast" },
] as const;

const workflowContent = {
  suppliers: {
    cta: "/get-started",
    ctaLabel: "Start onboarding",
    secondary: "/sign-in?mode=sign-up",
    secondaryLabel: "Prefer one-time access?",
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
    cta: "/get-started",
    ctaLabel: "Start onboarding",
    secondary: "/sign-in?mode=sign-up",
    secondaryLabel: "Prefer one-time access?",
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

      gsap.utils.toArray<HTMLElement>(".gsap-hero-ticker-track").forEach((track, index) => {
        gsap.fromTo(
          track,
          { xPercent: index % 2 === 0 ? 0 : -50 },
          {
            xPercent: index % 2 === 0 ? -50 : 0,
            duration: 16,
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
  return (
    <div ref={rootRef} className="bg-[#f7f1e6] text-[#11283d]">
      <main className="page bg-transparent">
        <section
          id="top"
          className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(210,175,103,0.24),transparent_24%),radial-gradient(circle_at_88%_12%,rgba(121,161,144,0.24),transparent_30%),linear-gradient(180deg,#fbf7ef_0%,#f4ebdb_48%,#f5efe4_100%)] pb-3 pt-24 lg:pb-4 lg:pt-28"
        >
          <div className="gsap-grid-shift absolute inset-0 opacity-[0.2] [background-image:linear-gradient(rgba(17,40,61,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(17,40,61,0.06)_1px,transparent_1px)] [background-size:32px_32px]" />
          <div className="gsap-orb absolute left-[-8rem] top-[-3rem] h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(201,159,76,0.28),transparent_70%)] blur-3xl" />
          <div className="gsap-orb absolute bottom-[-10rem] right-[-7rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(110,152,121,0.2),transparent_68%)] blur-3xl" />

          <div className="shell relative z-10 grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(500px,0.92fr)] lg:items-center">
            <div className="gsap-hero-copy pt-1">
              <div className="gsap-hero-logo mb-7 inline-flex h-24 w-24 items-center justify-center rounded-[2rem] border border-[#d8cfbf] bg-[rgba(255,252,247,0.88)] shadow-[0_18px_40px_rgba(46,41,31,0.08)] backdrop-blur">
                <svg viewBox="0 0 100 100" className="h-14 w-14 text-[#173550]">
                  <circle cx="50" cy="50" r="39" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M73 17l15 8-1 18-7-8" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 64L45 40l13 17 11-9 15 16" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <p className="eyebrow !text-[#7e7668]">Circular critical mineral supply chains built for North America</p>
              <h1 className="max-w-[12.5ch] font-display text-[clamp(3.1rem,5.4vw,5.6rem)] leading-[0.95] tracking-[-0.06em] text-[#11283d]">
                The Marketplace for America's Rare Earth Elements.
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

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
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

            <div className="gsap-hero-visual relative min-h-[520px] overflow-hidden rounded-[34px] border border-[#d9cfbf] bg-[linear-gradient(180deg,rgba(255,252,247,0.94),rgba(239,231,218,0.9))] shadow-[0_34px_90px_rgba(46,41,31,0.1)] lg:min-h-[540px]">
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

              <div className="absolute left-5 right-5 top-5 z-10 overflow-hidden rounded-full border border-[#ddd4c7] bg-white/84 px-3 py-2 shadow-[0_14px_32px_rgba(31,40,31,0.06)]">
                <div className="gsap-hero-ticker-track flex min-w-max items-center gap-6">
                  {[...heroCommodityTickers, ...heroCommodityTickers].map((ticker, index) => (
                    <div key={`${ticker.label}-${index}`} className="flex items-center gap-3 text-sm">
                      <span className="font-semibold uppercase tracking-[0.14em] text-[#7b7367]">{ticker.label}</span>
                      <span className="font-bold text-[#173550]">{ticker.value}</span>
                      <span className={`font-bold ${ticker.tone}`}>{ticker.move}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-[10rem] top-24 z-[1]">
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

              <div className="absolute bottom-5 left-5 right-5 z-10 grid gap-3 md:grid-cols-3">
                {heroCommodityTickers.map((ticker) => (
                  <div
                    key={ticker.label}
                    className="rounded-[22px] border border-[#ddd4c7] bg-white/84 p-4 shadow-[0_16px_36px_rgba(31,40,31,0.06)] backdrop-blur"
                  >
                    <span className="text-[0.66rem] font-extrabold uppercase tracking-[0.18em] text-[#7d7568]">
                      {ticker.label}
                    </span>
                    <div className="mt-3 flex items-end justify-between gap-3">
                      <strong className="font-display text-[1.15rem] tracking-[-0.03em] text-[#11283d]">
                        {ticker.value}
                      </strong>
                      <span className={`text-sm font-bold ${ticker.tone}`}>{ticker.move}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="why-this-matters" className="shell pt-4 lg:pt-6">
          <div className="grid items-start gap-10 xl:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)]">
            <div>
              <p className="eyebrow">Why this matters</p>
              <h2 className="max-w-[14ch] font-display text-[clamp(2.7rem,5.2vw,4.8rem)] leading-[0.94] tracking-[-0.07em] text-[#11283d]">
                Trade rare-earth-bearing scrap into a local U.S. circular supply.
              </h2>
              <p className="mt-5 max-w-[38rem] text-[1.03rem] leading-8 text-[#556576]">
                Rare Earth Rescue helps recyclers keep recovery lines utilized by sourcing fragmented
                feedstock more reliably, while helping scrappers, dismantlers, and ITAD operators
                uncover value in magnet-bearing equipment that is often sold too generically.
              </p>
              <p className="mt-4 max-w-[36rem] text-[0.98rem] leading-7 text-[#7a7468]">
                The result is a more resilient domestic recovery network built around verified
                counterparties, clearer material signals, and a stronger local circular economy.
              </p>

              <div className="mt-10 grid gap-8 md:grid-cols-2">
                {issues.map((issue, index) => {
                  const accent = issueAccentStyles[index % issueAccentStyles.length];

                  return (
                    <article key={issue.title} className="gsap-reveal flex items-start gap-5">
                      <span
                        className={`mt-1 inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] font-display text-[1rem] font-bold tracking-[-0.04em] shadow-[0_16px_36px_rgba(46,41,31,0.08)] ${accent.icon} ${accent.iconText}`}
                      >
                        {issue.index}
                      </span>
                      <div className="min-w-0">
                        <span
                          className={`text-[0.68rem] font-extrabold uppercase tracking-[0.18em] ${accent.chip}`}
                        >
                          Market friction
                        </span>
                        <h3 className="mt-2 font-display text-[1.35rem] leading-[1.02] tracking-[-0.045em] text-[#1b2430]">
                          {issue.title}
                        </h3>
                        <p className="mt-3 text-[0.97rem] leading-7 text-[#5d6c79]">{issue.body}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="gsap-reveal relative overflow-hidden rounded-[36px] border border-[#dccfbe] bg-[linear-gradient(180deg,rgba(255,252,247,0.97),rgba(244,236,223,0.95))] p-6 shadow-[0_28px_84px_rgba(46,41,31,0.08)] sm:p-8">
              <div className="gsap-network-drift absolute left-[12%] top-[8%] h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(201,159,76,0.15),transparent_68%)] blur-3xl" />
              <div className="gsap-network-drift absolute bottom-[10%] right-[10%] h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(110,152,121,0.16),transparent_70%)] blur-3xl" />

              <div className="relative z-10">
                <span className="badge">U.S. recovery network</span>
                <h3 className="mt-4 max-w-[18ch] font-display text-[1.75rem] leading-[1.02] tracking-[-0.05em] text-[#11283d]">
                  A live market layer that connects scattered scrap origin points with verified
                  recycler demand.
                </h3>
                <p className="mt-4 max-w-[34rem] text-[0.97rem] leading-7 text-[#556576]">
                  Nodes pulse where rare-earth-bearing scrap originates. Corridors tighten where
                  recycler demand is strongest. That coordination improves price discovery, lowers
                  idle capacity risk, and keeps more recovery activity onshore.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    {
                      label: "From export markets",
                      value: "98%",
                      width: "98%",
                      tone: "bg-[#c59a4f]",
                    },
                    {
                      label: "From local circular economy",
                      value: "<1%",
                      width: "1%",
                      tone: "bg-[#4f7f6f]",
                    },
                  ].map((item) => (
                    <article
                      key={item.label}
                      className="rounded-[20px] border border-[#ddd4c7] bg-white/82 px-4 py-3 shadow-[0_14px_30px_rgba(46,41,31,0.05)]"
                    >
                      <div className="flex items-center justify-between gap-3 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#7d7568]">
                        <span>{item.label}</span>
                        <strong className="text-[#11283d]">{item.value}</strong>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-[#efe8dc]">
                        <div className={`h-2 rounded-full ${item.tone}`} style={{ width: item.width }} />
                      </div>
                    </article>
                  ))}
                </div>

                <div className="relative mt-6 overflow-hidden rounded-[30px] border border-[#ddd4c7] bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(244,237,225,0.86))] p-4">
                  <svg viewBox="0 0 620 420" className="h-full w-full">
                    <path
                      d="M75 145 92 126 116 112 145 110 173 115 205 109 233 114 262 126 298 125 330 118 365 116 396 122 430 122 462 118 491 123 516 133 544 139 567 153 584 174 589 196 582 209 568 214 554 225 545 235 527 238 512 250 509 266 494 276 482 292 456 302 427 310 398 313 367 322 336 327 308 322 280 325 250 336 223 342 193 338 168 329 144 320 123 302 106 289 91 271 83 251 76 227 73 204 67 180Z"
                      fill="rgba(255,255,255,0.56)"
                      stroke="rgba(17,40,61,0.15)"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M235 124C261 146 284 171 307 208"
                      fill="none"
                      stroke="rgba(17,40,61,0.09)"
                      strokeWidth="1.4"
                    />
                    <path
                      d="M375 118C402 149 435 185 510 241"
                      fill="none"
                      stroke="rgba(17,40,61,0.09)"
                      strokeWidth="1.4"
                    />
                    <path
                      d="M152 287C242 260 344 253 493 278"
                      fill="none"
                      stroke="rgba(17,40,61,0.08)"
                      strokeWidth="1.4"
                    />

                    <path id="corridor-west" className="gsap-network-route" d="M140 260C174 248 207 233 245 214" fill="none" stroke="rgba(17,40,61,0.22)" strokeWidth="2.3" />
                    <path id="corridor-central" className="gsap-network-route" d="M245 214C277 200 303 188 332 166" fill="none" stroke="rgba(17,40,61,0.22)" strokeWidth="2.3" />
                    <path id="corridor-lakes" className="gsap-network-route" d="M332 166C359 152 383 144 412 139" fill="none" stroke="rgba(17,40,61,0.22)" strokeWidth="2.3" />
                    <path id="corridor-atlantic" className="gsap-network-route" d="M412 139C450 138 482 149 514 175" fill="none" stroke="rgba(17,40,61,0.22)" strokeWidth="2.3" />
                    <path id="corridor-south" className="gsap-network-route" d="M245 214C326 213 420 228 517 277" fill="none" stroke="rgba(17,40,61,0.22)" strokeWidth="2.3" />
                    <path id="corridor-northwest" className="gsap-network-route" d="M110 187C156 177 202 182 245 214" fill="none" stroke="rgba(17,40,61,0.18)" strokeWidth="2" />

                    {[
                      { x: 102, y: 186, label: "Pacific NW" },
                      { x: 140, y: 260, label: "California" },
                      { x: 245, y: 214, label: "Texas" },
                      { x: 332, y: 166, label: "Upper Midwest" },
                      { x: 412, y: 139, label: "Great Lakes" },
                      { x: 514, y: 175, label: "Mid-Atlantic" },
                      { x: 518, y: 278, label: "Southeast" },
                    ].map((label) => (
                      <text
                        key={label.label}
                        x={label.x}
                        y={label.y - 18}
                        textAnchor="middle"
                        className="fill-[#8a7b65] text-[9px] font-semibold uppercase tracking-[0.18em]"
                      >
                        {label.label}
                      </text>
                    ))}

                    {usRecoveryNodes.map((node, index) => (
                      <g key={`us-network-node-${node.cx}-${node.cy}`}>
                        <circle cx={node.cx} cy={node.cy + 56} r={index === 2 ? 9 : 7} fill={node.fill} />
                        <circle cx={node.cx} cy={node.cy + 56} r={index === 2 ? 16 : 12} fill="none" stroke={node.fill} strokeOpacity="0.24">
                          <animate attributeName="r" values={index === 2 ? "14;26;14" : "10;20;10"} dur="3.4s" begin={`${index * 0.24}s`} repeatCount="indefinite" />
                          <animate attributeName="stroke-opacity" values="0.3;0;0.3" dur="3.4s" begin={`${index * 0.24}s`} repeatCount="indefinite" />
                        </circle>
                      </g>
                    ))}

                    {[
                      { href: "#corridor-west", color: "#c59a4f", begin: "0s" },
                      { href: "#corridor-central", color: "#3f7d6f", begin: "0.6s" },
                      { href: "#corridor-lakes", color: "#173550", begin: "1.1s" },
                      { href: "#corridor-atlantic", color: "#c59a4f", begin: "1.7s" },
                      { href: "#corridor-south", color: "#3f7d6f", begin: "2.1s" },
                    ].map((particle) => (
                      <circle key={`${particle.href}-${particle.begin}`} r="3.8" fill={particle.color} opacity="0.9">
                        <animateMotion dur="4.8s" begin={particle.begin} repeatCount="indefinite" rotate="auto">
                          <mpath href={particle.href} />
                        </animateMotion>
                      </circle>
                    ))}
                  </svg>

                  <div className="pointer-events-none absolute inset-x-4 bottom-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-[18px] border border-[#ddd4c7] bg-white/84 px-4 py-3 shadow-[0_14px_30px_rgba(46,41,31,0.05)] backdrop-blur">
                      <span className="text-[0.58rem] font-extrabold uppercase tracking-[0.18em] text-[#7d7568]">
                        Source nodes
                      </span>
                      <p className="mt-2 text-[0.86rem] leading-6 text-[#556576]">
                        HDD recovery, traction motors, industrial salvage, and reverse logistics
                        programs feed the network.
                      </p>
                    </div>
                    <div className="rounded-[18px] border border-[#ddd4c7] bg-white/84 px-4 py-3 shadow-[0_14px_30px_rgba(46,41,31,0.05)] backdrop-blur">
                      <span className="text-[0.58rem] font-extrabold uppercase tracking-[0.18em] text-[#7d7568]">
                        Recycler pull
                      </span>
                      <p className="mt-2 text-[0.86rem] leading-6 text-[#556576]">
                        Verified buyer demand consolidates scattered lots into credible domestic
                        recovery corridors.
                      </p>
                    </div>
                  </div>
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

            <div className="gsap-reveal">
              <ShadTabs
                value={workflowAudience}
                onValueChange={(value) => setWorkflowAudience(value as "suppliers" | "buyers")}
              >
                <ShadTabsList>
                  <ShadTabsTrigger value="suppliers">For Suppliers</ShadTabsTrigger>
                  <ShadTabsTrigger value="buyers">For Buyers</ShadTabsTrigger>
                </ShadTabsList>
              </ShadTabs>
            </div>
          </div>

          <ShadTabs
            value={workflowAudience}
            onValueChange={(value) => setWorkflowAudience(value as "suppliers" | "buyers")}
            className="mt-10 block"
          >
            <ShadTabsContent value="suppliers">
              <div className="space-y-5">
                <div className="gsap-reveal rounded-[30px] border border-[#d8cfbf] bg-[linear-gradient(180deg,rgba(255,252,247,0.94),rgba(244,236,224,0.9))] p-6 shadow-[0_18px_52px_rgba(46,41,31,0.06)] lg:p-8">
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center">
                    <div>
                      <span className="badge">Supplier path</span>
                      <h3 className="mt-4 max-w-[16ch] font-display text-[1.75rem] leading-[1.02] tracking-[-0.05em] text-[#11283d]">
                        Move from first listing to repeat recovery flow without building the process alone.
                      </h3>
                      <p className="mt-4 max-w-[35rem] text-[0.97rem] leading-7 text-[#5c6b79]">
                        Start with a single opportunity, standardize composition detail, and route
                        material into a buyer network that can actually value rare-earth-bearing scrap.
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {[
                        "Structured lot intake",
                        "Verified buyer routing",
                        "Pickup and settlement visibility",
                      ].map((item) => (
                        <div
                          key={item}
                          className="rounded-[22px] border border-[#ddd3c5] bg-white/78 px-4 py-4 text-sm font-semibold leading-6 text-[#44505b] shadow-[0_14px_34px_rgba(46,41,31,0.05)]"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 xl:grid-cols-4">
                  {workflowContent.suppliers.steps.map((step, index) => (
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
                <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                  <ShadButton asChild>
                    <Link to={workflowContent.suppliers.cta}>{workflowContent.suppliers.ctaLabel}</Link>
                  </ShadButton>
                  <ShadButton asChild variant="secondary">
                    <Link to={workflowContent.suppliers.secondary}>{workflowContent.suppliers.secondaryLabel}</Link>
                  </ShadButton>
                </div>
              </div>
            </ShadTabsContent>
            <ShadTabsContent value="buyers">
              <div className="space-y-5">
                <div className="gsap-reveal rounded-[30px] border border-[#d8cfbf] bg-[linear-gradient(180deg,rgba(255,252,247,0.94),rgba(244,236,224,0.9))] p-6 shadow-[0_18px_52px_rgba(46,41,31,0.06)] lg:p-8">
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center">
                    <div>
                      <span className="badge">Buyer path</span>
                      <h3 className="mt-4 max-w-[16ch] font-display text-[1.75rem] leading-[1.02] tracking-[-0.05em] text-[#11283d]">
                        Turn fragmented feedstock into a recurring procurement workflow with better visibility.
                      </h3>
                      <p className="mt-4 max-w-[35rem] text-[0.97rem] leading-7 text-[#5c6b79]">
                        Review opportunities faster, refine sourcing requirements, and move from
                        targeted lots into repeat commercial relationships across the recovery network.
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {[
                        "Category-based discovery",
                        "Direct buy-side engagement",
                        "Contract-ready operating flow",
                      ].map((item) => (
                        <div
                          key={item}
                          className="rounded-[22px] border border-[#ddd3c5] bg-white/78 px-4 py-4 text-sm font-semibold leading-6 text-[#44505b] shadow-[0_14px_34px_rgba(46,41,31,0.05)]"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 xl:grid-cols-4">
                  {workflowContent.buyers.steps.map((step, index) => (
                    <article
                      key={step.title}
                      className="rounded-[26px] border border-[#ddd3c5] bg-[rgba(255,255,255,0.76)] p-5 shadow-[0_16px_40px_rgba(46,41,31,0.05)]"
                    >
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#eef2ec] font-display text-sm font-bold text-[#9a7337]">
                        {index + 1}
                      </span>
                      <strong className="mt-4 block font-display text-[1.05rem] tracking-[-0.03em] text-[#11283d]">
                        {step.title}
                      </strong>
                      <p className="mt-3 text-sm leading-7 text-[#5c6b79]">{step.body}</p>
                    </article>
                  ))}
                </div>
                <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                  <ShadButton asChild>
                    <Link to={workflowContent.buyers.cta}>{workflowContent.buyers.ctaLabel}</Link>
                  </ShadButton>
                  <ShadButton asChild variant="secondary">
                    <Link to={workflowContent.buyers.secondary}>{workflowContent.buyers.secondaryLabel}</Link>
                  </ShadButton>
                </div>
              </div>
            </ShadTabsContent>
          </ShadTabs>
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
