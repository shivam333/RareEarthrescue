import { motion } from "framer-motion";
import { useMemo, useState } from "react";

type IntelligenceMode = "recycler" | "supplier";
type TimeframeKey = "week" | "month" | "ytd";

type TrendPoint = {
  label: string;
  value: number;
};

type TimeframeSnapshot = {
  quantity: string;
  amount: string;
  subtitle: string;
  trend: TrendPoint[];
};

type SpreadDatum = {
  label: string;
  value: number;
};

type ProductDatum = {
  name: string;
  subtext: string;
  momentum: string;
};

type NetworkNode = {
  label: string;
  x: number;
  y: number;
  tone: "gold" | "green" | "blue";
};

type IntelligenceConfig = {
  eyebrow: string;
  title: string;
  body: string;
  decisionLabel: string;
  recommendedMaterial: string;
  recommendationReason: string;
  confidence: string;
  commoditySignals: string[];
  spreadData: SpreadDatum[];
  hotProducts: ProductDatum[];
  mapTitle: string;
  mapBody: string;
  nodes: NetworkNode[];
  networkNotes: string[];
  snapshots: Record<TimeframeKey, TimeframeSnapshot>;
};

const timeframes: { id: TimeframeKey; label: string }[] = [
  { id: "week", label: "1 Week" },
  { id: "month", label: "Current Month" },
  { id: "ytd", label: "YTD" },
];

const intelligenceByMode: Record<IntelligenceMode, IntelligenceConfig> = {
  recycler: {
    eyebrow: "Marketplace intelligence",
    title: "Use live market signals to decide what to bid, where to source, and how aggressively to price.",
    body:
      "This view surfaces commodity-driven buying opportunities, bid spread behavior, regional sourcing pressure, and your current transaction velocity.",
    decisionLabel: "Best material to bid now",
    recommendedMaterial: "NdFeB magnet scrap",
    recommendationReason:
      "Stable NdPr floors, firmer copper pricing, and better verification density are keeping cleaner magnet lots commercially attractive this week.",
    confidence: "82% bid confidence",
    commoditySignals: ["Copper +4.1%", "Steel freight easing", "NdPr spread stable"],
    spreadData: [
      { label: "HDD", value: 5.8 },
      { label: "Auto", value: 8.7 },
      { label: "Industrial", value: 6.4 },
      { label: "MRI", value: 9.2 },
      { label: "Other", value: 7.1 },
    ],
    hotProducts: [
      {
        name: "Extracted HDD magnet assemblies",
        subtext: "Fast-moving verified lots with assay-ready buyer packs.",
        momentum: "19 active bids",
      },
      {
        name: "Hybrid traction motor feedstock",
        subtext: "Higher copper carry with cleaner teardown assumptions.",
        momentum: "14 active bids",
      },
      {
        name: "Industrial servo motor units",
        subtext: "Bid tension improving where composition data is tighter.",
        momentum: "11 active bids",
      },
    ],
    mapTitle: "Hot supply and demand areas",
    mapBody:
      "Current recycler pull is strongest across the Great Lakes, Texas Triangle, and Ontario corridors where feedstock density and logistics reliability intersect.",
    nodes: [
      { label: "Illinois", x: 118, y: 86, tone: "green" },
      { label: "Texas", x: 92, y: 136, tone: "gold" },
      { label: "Ontario", x: 152, y: 74, tone: "blue" },
      { label: "Georgia", x: 154, y: 136, tone: "gold" },
      { label: "Alberta", x: 74, y: 58, tone: "green" },
    ],
    networkNotes: ["Great Lakes dismantling", "Ontario motor recovery", "Texas ITAD magnet lanes"],
    snapshots: {
      week: {
        quantity: "28.4 MT",
        amount: "$1.18M",
        subtitle: "Bid volume closed in the last 7 days",
        trend: [
          { label: "Mon", value: 22 },
          { label: "Tue", value: 31 },
          { label: "Wed", value: 29 },
          { label: "Thu", value: 38 },
          { label: "Fri", value: 35 },
          { label: "Sat", value: 41 },
        ],
      },
      month: {
        quantity: "142 MT",
        amount: "$5.92M",
        subtitle: "Current month transacted or staged recycler volume",
        trend: [
          { label: "W1", value: 72 },
          { label: "W2", value: 96 },
          { label: "W3", value: 118 },
          { label: "W4", value: 142 },
        ],
      },
      ytd: {
        quantity: "1,486 MT",
        amount: "$58.6M",
        subtitle: "Year-to-date recycler activity tied to active procurement workflows",
        trend: [
          { label: "Q1", value: 322 },
          { label: "Q2", value: 708 },
          { label: "Q3", value: 1092 },
          { label: "Q4", value: 1486 },
        ],
      },
    },
  },
  supplier: {
    eyebrow: "Marketplace intelligence",
    title: "Read pricing pressure, buyer pull, and regional demand before you list or stage your next lot.",
    body:
      "This intelligence layer helps suppliers decide which materials are hottest, where buyer activity is concentrating, and how current transaction flow is shaping pricing.",
    decisionLabel: "Best material to list now",
    recommendedMaterial: "EV and hybrid traction motors",
    recommendationReason:
      "Recycler utilization is strongest where copper recovery and magnet extraction stack together, pushing more buyer attention into verified traction-motor lanes.",
    confidence: "76% list confidence",
    commoditySignals: ["Copper +4.1%", "Motor demand firm", "Bid spreads widening"],
    spreadData: [
      { label: "HDD", value: 4.6 },
      { label: "Auto", value: 9.4 },
      { label: "Industrial", value: 7.2 },
      { label: "MRI", value: 6.8 },
      { label: "Other", value: 5.9 },
    ],
    hotProducts: [
      {
        name: "Whole traction motor lots",
        subtext: "Highest buyer attention when quantity and teardown quality are documented.",
        momentum: "Top supplier lane",
      },
      {
        name: "Magnet-only HDD assemblies",
        subtext: "Cleaner, smaller lots continue to clear quickly with specialists.",
        momentum: "Fast close rate",
      },
      {
        name: "Industrial servo motor batches",
        subtext: "Premium where composition and source family are described well.",
        momentum: "11 buyer saves",
      },
    ],
    mapTitle: "Hot buyer pull areas",
    mapBody:
      "Verified recycler demand is heaviest across the Midwest, Ontario, and Southeast, with faster response rates when suppliers stage lots closer to those corridors.",
    nodes: [
      { label: "Michigan", x: 128, y: 82, tone: "blue" },
      { label: "Ontario", x: 152, y: 72, tone: "gold" },
      { label: "North Carolina", x: 164, y: 134, tone: "green" },
      { label: "Texas", x: 94, y: 138, tone: "gold" },
      { label: "California", x: 42, y: 122, tone: "green" },
    ],
    networkNotes: ["Midwest processor pull", "Ontario contract buyers", "Southeast logistics advantage"],
    snapshots: {
      week: {
        quantity: "19.6 MT",
        amount: "$0.84M",
        subtitle: "Supplier-side volume awarded in the last 7 days",
        trend: [
          { label: "Mon", value: 14 },
          { label: "Tue", value: 17 },
          { label: "Wed", value: 24 },
          { label: "Thu", value: 28 },
          { label: "Fri", value: 26 },
          { label: "Sat", value: 31 },
        ],
      },
      month: {
        quantity: "118 MT",
        amount: "$4.41M",
        subtitle: "Current month supplier sell-side throughput",
        trend: [
          { label: "W1", value: 38 },
          { label: "W2", value: 64 },
          { label: "W3", value: 86 },
          { label: "W4", value: 118 },
        ],
      },
      ytd: {
        quantity: "1,124 MT",
        amount: "$42.8M",
        subtitle: "Year-to-date supplier transaction flow across staged recovery programs",
        trend: [
          { label: "Q1", value: 244 },
          { label: "Q2", value: 536 },
          { label: "Q3", value: 822 },
          { label: "Q4", value: 1124 },
        ],
      },
    },
  },
};

function getTrendPath(points: TrendPoint[]) {
  if (!points.length) return "";

  const maxValue = Math.max(...points.map((point) => point.value));
  const minValue = Math.min(...points.map((point) => point.value));
  const range = Math.max(maxValue - minValue, 1);

  return points
    .map((point, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * 100;
      const y = 76 - ((point.value - minValue) / range) * 54;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

function toneClasses(tone: NetworkNode["tone"]) {
  if (tone === "green") return "fill-[#6e9879]";
  if (tone === "blue") return "fill-[#264862]";
  return "fill-[#b88b3c]";
}

export function MarketplaceIntelligenceSection({ mode }: { mode: IntelligenceMode }) {
  const [timeframe, setTimeframe] = useState<TimeframeKey>("month");
  const config = intelligenceByMode[mode];
  const snapshot = config.snapshots[timeframe];
  const trendPath = useMemo(() => getTrendPath(snapshot.trend), [snapshot.trend]);
  const maxSpread = Math.max(...config.spreadData.map((item) => item.value));

  return (
    <section className="shell pb-16 pt-8">
      <motion.article
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.5 }}
        className="rounded-[34px] border border-[#d9cfbf] bg-[linear-gradient(180deg,rgba(255,252,247,0.97),rgba(244,236,224,0.92))] p-6 shadow-[0_28px_80px_rgba(46,41,31,0.08)] lg:p-8"
      >
        <div className="flex flex-col gap-5 border-b border-[#e0d7c9] pb-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-4xl">
            <p className="eyebrow !mb-0">{config.eyebrow}</p>
            <h2 className="mt-2 max-w-[18ch] font-display text-[clamp(2rem,3.2vw,3.25rem)] leading-[0.95] tracking-[-0.06em] text-[#11283d]">
              {config.title}
            </h2>
            <p className="mt-4 max-w-[52rem] text-[0.98rem] leading-8 text-[#556576]">{config.body}</p>
          </div>

          <div className="inline-flex w-fit items-center rounded-full border border-[#d8cfbf] bg-white/82 p-1 shadow-[0_16px_36px_rgba(46,41,31,0.05)]">
            {timeframes.map((option) => {
              const isActive = timeframe === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setTimeframe(option.id)}
                  className={`rounded-full px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] transition ${
                    isActive
                      ? "bg-[#173550] text-white shadow-[0_10px_26px_rgba(23,53,80,0.18)]"
                      : "text-[#6d7680] hover:bg-[#f3ecdf] hover:text-[#173550]"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
          <div className="grid gap-6">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
              <article className="rounded-[28px] border border-[#ddd4c7] bg-white/82 p-5 shadow-[0_18px_42px_rgba(46,41,31,0.05)]">
                <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]">
                  {config.decisionLabel}
                </span>
                <strong className="mt-3 block font-display text-[1.7rem] leading-[1.02] tracking-[-0.05em] text-[#11283d]">
                  {config.recommendedMaterial}
                </strong>
                <p className="mt-4 text-[0.94rem] leading-7 text-[#556576]">{config.recommendationReason}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {config.commoditySignals.map((signal) => (
                    <span
                      key={signal}
                      className="rounded-full border border-[#ddd4c7] bg-[rgba(245,238,226,0.86)] px-3 py-2 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#173550]"
                    >
                      {signal}
                    </span>
                  ))}
                </div>
                <div className="mt-5 inline-flex rounded-full bg-[linear-gradient(145deg,#b88b3c,#9f742c)] px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_12px_28px_rgba(184,139,60,0.2)]">
                  {config.confidence}
                </div>
              </article>

              <article className="rounded-[28px] border border-[#ddd4c7] bg-white/82 p-5 shadow-[0_18px_42px_rgba(46,41,31,0.05)]">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]">
                      Transaction tracker
                    </span>
                    <strong className="mt-2 block font-display text-[1.7rem] tracking-[-0.05em] text-[#11283d]">
                      {snapshot.quantity}
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]">
                      Transacted amount
                    </span>
                    <strong className="mt-2 block font-display text-[1.55rem] tracking-[-0.05em] text-[#173550]">
                      {snapshot.amount}
                    </strong>
                  </div>
                </div>
                <p className="mt-3 text-[0.88rem] leading-7 text-[#6a756f]">{snapshot.subtitle}</p>
                <div className="mt-5 overflow-hidden rounded-[24px] border border-[#e4dbcd] bg-[linear-gradient(180deg,rgba(249,245,238,0.95),rgba(255,255,255,0.9))] p-4">
                  <svg viewBox="0 0 100 80" className="h-40 w-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id={`trend-${mode}`} x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={mode === "recycler" ? "#173550" : "#6e9879"} stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M 0 80 L 0 76" fill="none" />
                    {snapshot.trend.map((point, index) => {
                      const x = (index / Math.max(snapshot.trend.length - 1, 1)) * 100;
                      return (
                        <g key={point.label}>
                          <line x1={x} x2={x} y1="12" y2="76" stroke="rgba(23,53,80,0.08)" strokeDasharray="3 5" />
                          <text x={x} y="79" textAnchor="middle" className="fill-[#8a7b65] text-[4px] font-bold uppercase tracking-[0.18em]">
                            {point.label}
                          </text>
                        </g>
                      );
                    })}
                    <path d={`${trendPath} L 100 80 L 0 80 Z`} fill={`url(#trend-${mode})`} />
                    <path
                      d={trendPath}
                      fill="none"
                      stroke={mode === "recycler" ? "#173550" : "#6e9879"}
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </article>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <article className="rounded-[28px] border border-[#ddd4c7] bg-white/82 p-5 shadow-[0_18px_42px_rgba(46,41,31,0.05)]">
                <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]">
                  Average bid spread by category
                </span>
                <div className="mt-5 space-y-4">
                  {config.spreadData.map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between gap-4 text-[0.84rem] leading-6 text-[#556576]">
                        <span>{item.label}</span>
                        <span className="font-bold text-[#173550]">{item.value}%</span>
                      </div>
                      <div className="mt-2 h-2.5 rounded-full bg-[#efe7da]">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(item.value / maxSpread) * 100}%` }}
                          viewport={{ once: true, amount: 0.3 }}
                          transition={{ duration: 0.5 }}
                          className={`h-full rounded-full ${
                            item.value === maxSpread
                              ? "bg-[linear-gradient(145deg,#b88b3c,#9f742c)]"
                              : "bg-[linear-gradient(145deg,#173550,#2d5677)]"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-[28px] border border-[#ddd4c7] bg-white/82 p-5 shadow-[0_18px_42px_rgba(46,41,31,0.05)]">
                <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]">
                  Hot {mode === "recycler" ? "products" : "listing lanes"}
                </span>
                <div className="mt-5 grid gap-4">
                  {config.hotProducts.map((product, index) => (
                    <div
                      key={product.name}
                      className="rounded-[22px] border border-[#e3dacd] bg-[linear-gradient(180deg,rgba(250,246,239,0.95),rgba(255,255,255,0.9))] p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <strong className="font-display text-[1.06rem] leading-[1.02] tracking-[-0.04em] text-[#11283d]">
                          {product.name}
                        </strong>
                        <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#8d6d39]">
                          0{index + 1}
                        </span>
                      </div>
                      <p className="mt-3 text-[0.88rem] leading-7 text-[#556576]">{product.subtext}</p>
                      <span className="mt-3 inline-flex rounded-full border border-[#ddd4c7] bg-white/82 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#173550]">
                        {product.momentum}
                      </span>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </div>

          <article className="rounded-[28px] border border-[#ddd4c7] bg-white/82 p-5 shadow-[0_18px_42px_rgba(46,41,31,0.05)]">
            <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]">
              {config.mapTitle}
            </span>
            <strong className="mt-3 block font-display text-[1.45rem] leading-[1.02] tracking-[-0.04em] text-[#11283d]">
              North American recovery corridors
            </strong>
            <p className="mt-3 text-[0.94rem] leading-7 text-[#556576]">{config.mapBody}</p>

            <div className="mt-5 overflow-hidden rounded-[24px] border border-[#e4dbcd] bg-[linear-gradient(180deg,rgba(249,245,238,0.95),rgba(255,255,255,0.9))] p-4">
              <svg viewBox="0 0 220 170" className="h-[280px] w-full" preserveAspectRatio="xMidYMid meet">
                <path
                  d="M24 94C42 67 65 48 88 38c22-10 44-14 63-10 15 3 27 11 39 23 13 14 18 31 15 50-4 18-17 31-38 38-21 8-44 10-71 7-29-4-52-15-68-35-9-11-11-27-3-43Z"
                  fill="rgba(247,241,232,0.96)"
                  stroke="rgba(146,128,95,0.26)"
                  strokeWidth="1.4"
                />
                <path d="M38 105C74 70 110 67 164 88" fill="none" stroke="rgba(23,53,80,0.18)" strokeWidth="2" strokeLinecap="round" />
                <path d="M64 124C100 84 144 82 184 96" fill="none" stroke="rgba(184,139,60,0.18)" strokeWidth="2" strokeLinecap="round" />
                <path d="M82 54C116 66 136 92 162 126" fill="none" stroke="rgba(110,152,121,0.18)" strokeWidth="2" strokeLinecap="round" />

                {config.nodes.map((node, index) => (
                  <g key={node.label}>
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r="4.6"
                      className={toneClasses(node.tone)}
                      initial={{ opacity: 0.5, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: [1, 1.28, 1] }}
                      viewport={{ once: false, amount: 0.2 }}
                      transition={{ duration: 2.4, delay: index * 0.16, repeat: Infinity, repeatDelay: 0.8 }}
                    />
                    <circle cx={node.x} cy={node.y} r="10" fill="transparent" stroke="rgba(184,139,60,0.22)" strokeWidth="1" />
                  </g>
                ))}

                <motion.circle
                  cx="86"
                  cy="101"
                  r="3"
                  fill="#173550"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1, x: [0, 44, 91], y: [0, -13, -4] }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 0.6 }}
                />
                <motion.circle
                  cx="64"
                  cy="124"
                  r="3"
                  fill="#b88b3c"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1, x: [0, 51, 102], y: [0, -25, -28] }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 3.4, repeat: Infinity, repeatDelay: 0.8 }}
                />
              </svg>
            </div>

            <div className="mt-5 grid gap-3">
              {config.networkNotes.map((note) => (
                <div
                  key={note}
                  className="rounded-[20px] border border-[#e3dacd] bg-[rgba(251,247,239,0.9)] px-4 py-3 text-[0.82rem] font-bold uppercase tracking-[0.14em] text-[#173550]"
                >
                  {note}
                </div>
              ))}
            </div>
          </article>
        </div>
      </motion.article>
    </section>
  );
}
