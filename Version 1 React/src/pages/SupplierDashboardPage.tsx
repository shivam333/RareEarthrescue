import { motion } from "framer-motion";
import ReactECharts from "echarts-for-react";
import { Link } from "react-router-dom";
import { DashboardRoleSwitch } from "../components/dashboard/DashboardRoleSwitch";
import { MarketplaceIntelligenceSection } from "../components/dashboard/MarketplaceIntelligenceSection";
import { AppImage } from "../components/ui/AppImage";
import { dashboardMaterialTiles } from "../data/dashboardMarketplaceData";
import { DashboardMode } from "../lib/accountRole";
import { pageEnter } from "../lib/motion";

const pageMotionProps = {
  variants: pageEnter,
  initial: "hidden" as const,
  animate: "visible" as const,
  exit: "exit" as const,
};

const supplierMetrics = [
  {
    label: "Value created over floor",
    value: "$184K",
    change: "+16.4% this month",
    tone: "text-[#253B80]",
    glow: "from-[#253B80]/12 via-[#253B80]/4 to-transparent",
  },
  {
    label: "Current active listings",
    value: "18",
    change: "6 closing this week",
    tone: "text-[#0F1115]",
    glow: "from-[#C8AA48]/16 via-[#C8AA48]/6 to-transparent",
  },
  {
    label: "Buyer reach in motion",
    value: "42",
    change: "verified recycler conversations",
    tone: "text-[#0F1115]",
    glow: "from-[#79A190]/16 via-[#79A190]/6 to-transparent",
  },
];

const supplierActions = [
  {
    title: "Update listed catalogue",
    body: "Refresh photos, documentation, and available lots already in market.",
    cta: "Open catalogue",
    href: "/supplier-onboarding",
    variant: "secondary" as const,
  },
  {
    title: "Make a new listing",
    body: "Launch a new sell-side lane with floor pricing, quantity, and lot timing.",
    cta: "Create listing",
    href: "/dashboard/supplier/create-bid",
    variant: "primary" as const,
  },
];

const listingRows = [
  {
    title: "Whole HDD assemblies",
    premium: "+14.2%",
    floor: "$2.12/kg",
    current: "$2.42/kg",
    status: "7 bids live",
  },
  {
    title: "Hybrid traction motors",
    premium: "+11.6%",
    floor: "$3.48/kg",
    current: "$3.89/kg",
    status: "Buyer review open",
  },
  {
    title: "Industrial servo motors",
    premium: "+9.4%",
    floor: "$2.76/kg",
    current: "$3.02/kg",
    status: "Closing in 3 days",
  },
];

function supplierValueTrendOption() {
  return {
    animationDuration: 900,
    grid: { left: 10, right: 10, top: 18, bottom: 8, containLabel: true },
    xAxis: {
      type: "category",
      boundaryGap: false,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: "#6D7484", fontSize: 11 },
      data: ["W1", "W2", "W3", "W4", "W5", "W6"],
    },
    yAxis: {
      type: "value",
      splitLine: { lineStyle: { color: "rgba(109,116,132,0.08)" } },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
    },
    series: [
      {
        type: "line",
        smooth: true,
        data: [42, 58, 64, 91, 116, 184],
        symbol: "none",
        lineStyle: { width: 3.5, color: "#253B80" },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(37,59,128,0.22)" },
              { offset: 1, color: "rgba(37,59,128,0.02)" },
            ],
          },
        },
      },
    ],
    tooltip: { trigger: "axis" },
  };
}

function supplierCategoryMixOption() {
  return {
    animationDuration: 900,
    tooltip: { trigger: "item" },
    series: [
      {
        type: "pie",
        radius: ["52%", "76%"],
        center: ["50%", "48%"],
        avoidLabelOverlap: true,
        label: { show: false },
        data: [
          { value: 32, name: "HDD", itemStyle: { color: "#253B80" } },
          { value: 24, name: "Auto", itemStyle: { color: "#C8AA48" } },
          { value: 19, name: "Industrial", itemStyle: { color: "#79A190" } },
          { value: 14, name: "MRI", itemStyle: { color: "#11283D" } },
          { value: 11, name: "Other", itemStyle: { color: "#D8E3F0" } },
        ],
      },
    ],
  };
}

export function SupplierDashboardPage({
  showModeSwitch = false,
  activeMode = "supplier",
  onModeChange,
}: {
  showModeSwitch?: boolean;
  activeMode?: DashboardMode;
  onModeChange?: (mode: DashboardMode) => void;
}) {
  const modeSwitch = showModeSwitch && onModeChange ? (
    <div className="mb-8 flex flex-col gap-4 rounded-[30px] border border-[#DCE3EF] bg-white/72 p-5 shadow-[0_20px_56px_rgba(46,41,31,0.06)] lg:flex-row lg:items-center lg:justify-between">
      <div>
        <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
          Account mode
        </span>
        <p className="mt-2 max-w-[34rem] text-[0.94rem] leading-7 text-[#6D7484]">
          Switch between recycler procurement workflows and supplier sell-side operations from the same account.
        </p>
      </div>
      <DashboardRoleSwitch activeMode={activeMode} onChange={onModeChange} />
    </div>
  ) : null;

  return (
    <motion.main className="page bg-transparent" {...pageMotionProps}>
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(121,161,144,0.18),transparent_26%),radial-gradient(circle_at_92%_0%,rgba(210,175,103,0.16),transparent_24%),linear-gradient(180deg,#FFFFFF_0%,#F6F8FC_58%,#F6F8FC_100%)] pb-16 pt-28">
        <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(17,40,61,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(17,40,61,0.04)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="shell relative z-10">
          {modeSwitch}

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.08fr)_430px]">
            <div className="space-y-6">
              <motion.section
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="overflow-hidden rounded-[34px] border border-[#DCE3EF] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(247,248,252,0.92))] p-6 shadow-[0_28px_80px_rgba(46,41,31,0.08)]"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-[34rem]">
                    <p className="eyebrow">Supplier dashboard</p>
                    <h1 className="max-w-[12ch] font-display text-[clamp(2.8rem,4.4vw,4.7rem)] leading-[0.94] tracking-[-0.065em] text-[#0F1115]">
                      Run verified sell-side programs with tighter commercial control.
                    </h1>
                    <p className="mt-4 max-w-[38rem] text-[0.98rem] leading-7 text-[#6D7484]">
                      Track listing performance, protect floor pricing, and move buyer-ready lots into live bidding without slowing documentation.
                    </p>
                  </div>

                  <div className="grid min-w-[230px] gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    {supplierActions.map((action, index) => (
                      <motion.article
                        key={action.title}
                        initial={{ opacity: 0, x: 14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.45, delay: 0.08 + index * 0.08 }}
                        className="rounded-[26px] border border-[#DCE3EF] bg-white/84 p-4"
                      >
                        <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                          Action
                        </span>
                        <strong className="mt-3 block font-display text-[1.15rem] leading-tight tracking-[-0.04em] text-[#0F1115]">
                          {action.title}
                        </strong>
                        <p className="mt-2 text-[0.88rem] leading-6 text-[#6D7484]">{action.body}</p>
                        <Link
                          to={action.href}
                          className={`mt-4 inline-flex rounded-full px-4 py-2 text-[0.76rem] font-bold uppercase tracking-[0.14em] transition ${
                            action.variant === "primary"
                              ? "bg-[#253B80] text-white hover:bg-[#11283D]"
                              : "border border-[#DCE3EF] text-[#0F1115] hover:border-[#253B80] hover:text-[#253B80]"
                          }`}
                        >
                          {action.cta}
                        </Link>
                      </motion.article>
                    ))}
                  </div>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  {supplierMetrics.map((metric, index) => (
                    <motion.article
                      key={metric.label}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: 0.16 + index * 0.05 }}
                      className="relative overflow-hidden rounded-[28px] border border-[#DCE3EF] bg-white/88 p-5"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${metric.glow}`} />
                      <div className="relative">
                        <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                          {metric.label}
                        </span>
                        <strong className={`mt-3 block font-display text-[2.15rem] tracking-[-0.06em] ${metric.tone}`}>
                          {metric.value}
                        </strong>
                        <p className="mt-2 text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[#6D7484]">
                          {metric.change}
                        </p>
                      </div>
                    </motion.article>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_320px]">
                  <motion.article
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.22 }}
                    className="rounded-[30px] border border-[#DCE3EF] bg-[linear-gradient(180deg,rgba(255,252,247,0.92),rgba(249,244,236,0.86))] p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                          Bid premium trend
                        </span>
                        <strong className="mt-2 block font-display text-[1.5rem] tracking-[-0.05em] text-[#0F1115]">
                          Premium captured above listing floors
                        </strong>
                      </div>
                      <span className="rounded-full border border-[#DCE3EF] bg-white/78 px-3 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#253B80]">
                        Last 6 weeks
                      </span>
                    </div>
                    <div className="mt-4 overflow-hidden rounded-[24px] bg-white/74 p-2">
                      <ReactECharts
                        option={supplierValueTrendOption()}
                        style={{ height: 220 }}
                        opts={{ renderer: "svg" }}
                      />
                    </div>
                  </motion.article>

                  <motion.article
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.28 }}
                    className="rounded-[30px] border border-[#DCE3EF] bg-[linear-gradient(180deg,rgba(255,252,247,0.92),rgba(249,244,236,0.86))] p-5"
                  >
                    <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                      Listing mix
                    </span>
                    <strong className="mt-2 block font-display text-[1.5rem] tracking-[-0.05em] text-[#0F1115]">
                      Open catalogue by family
                    </strong>
                    <div className="mt-4 overflow-hidden rounded-[24px] bg-white/74 p-2">
                      <ReactECharts
                        option={supplierCategoryMixOption()}
                        style={{ height: 220 }}
                        opts={{ renderer: "svg" }}
                      />
                    </div>
                    <div className="mt-4 grid gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-[#6D7484]">
                      <div className="flex items-center justify-between">
                        <span>HDD and drives</span>
                        <span className="text-[#253B80]">32%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Motor lanes</span>
                        <span className="text-[#253B80]">43%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Medical and other</span>
                        <span className="text-[#253B80]">25%</span>
                      </div>
                    </div>
                  </motion.article>
                </div>

                <motion.article
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.34 }}
                  className="mt-6 rounded-[30px] border border-[#DCE3EF] bg-white/86 p-5"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                      <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                        Live sell-side lanes
                      </span>
                      <strong className="mt-2 block font-display text-[1.48rem] tracking-[-0.05em] text-[#0F1115]">
                        Listings currently outperforming their opening floor
                      </strong>
                    </div>
                    <Link
                      to="/dashboard/supplier/create-bid"
                      className="inline-flex text-[0.76rem] font-bold uppercase tracking-[0.14em] text-[#253B80] transition hover:text-[#C8AA48]"
                    >
                      Launch another live bid
                    </Link>
                  </div>

                  <div className="mt-5 space-y-3">
                    {listingRows.map((row, index) => (
                      <motion.div
                        key={row.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.38, delay: 0.4 + index * 0.06 }}
                        className="grid gap-3 rounded-[22px] border border-[#E4EAF2] bg-[rgba(255,252,247,0.86)] px-4 py-4 lg:grid-cols-[minmax(0,1.25fr)_repeat(3,minmax(0,0.5fr))]"
                      >
                        <div>
                          <strong className="block font-display text-[1.08rem] tracking-[-0.04em] text-[#0F1115]">
                            {row.title}
                          </strong>
                          <p className="mt-1 text-[0.76rem] font-semibold uppercase tracking-[0.16em] text-[#6D7484]">
                            {row.status}
                          </p>
                        </div>
                        <div>
                          <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[#6D7484]">
                            Premium
                          </span>
                          <p className="mt-2 font-display text-[1.15rem] tracking-[-0.04em] text-[#253B80]">{row.premium}</p>
                        </div>
                        <div>
                          <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[#6D7484]">
                            Floor
                          </span>
                          <p className="mt-2 font-display text-[1.15rem] tracking-[-0.04em] text-[#0F1115]">{row.floor}</p>
                        </div>
                        <div>
                          <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[#6D7484]">
                            Best live bid
                          </span>
                          <p className="mt-2 font-display text-[1.15rem] tracking-[-0.04em] text-[#0F1115]">{row.current}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.article>
              </motion.section>
            </div>

            <div className="grid gap-6">
              <motion.section
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.52, delay: 0.08 }}
                className="flex min-h-[400px] flex-col rounded-[34px] border border-[#DCE3EF] bg-white/84 p-5 shadow-[0_28px_80px_rgba(46,41,31,0.08)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                    Supply families
                  </span>
                  <span className="rounded-full border border-[#DCE3EF] bg-[#F8FAFD] px-3 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#253B80]">
                    5 active lanes
                  </span>
                </div>

                <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
                  {dashboardMaterialTiles.map((tile, index) => (
                    <motion.article
                      key={tile.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.36, delay: 0.14 + index * 0.05 }}
                      className="overflow-hidden rounded-[24px] border border-[#DCE3EF] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(247,241,232,0.84))] transition hover:-translate-y-1 hover:border-[#253B80]/30"
                    >
                      <Link
                        to={`/dashboard/supplier/create-bid?family=${tile.id}`}
                        className="grid gap-4 p-3 md:grid-cols-[108px_minmax(0,1fr)]"
                      >
                        <AppImage src={tile.image} alt={tile.title} className="h-24 w-full rounded-[20px] object-cover" />
                        <div className="flex flex-col justify-center">
                          <strong className="block font-display text-[1.08rem] tracking-[-0.04em] text-[#0F1115]">
                            {tile.title}
                          </strong>
                          <p className="mt-2 text-[0.86rem] leading-6 text-[#6D7484]">{tile.subtitle}</p>
                          <span className="mt-3 inline-flex text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#253B80]">
                            Prepare listing
                          </span>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.52, delay: 0.16 }}
                className="relative flex min-h-[400px] flex-col justify-between overflow-hidden rounded-[34px] border border-[#DCE3EF] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(239,244,252,0.92))] p-5 shadow-[0_28px_80px_rgba(46,41,31,0.08)]"
              >
                <div className="absolute right-[-36px] top-[-36px] h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(37,59,128,0.16),transparent_68%)]" />
                <div className="absolute bottom-[-32px] left-[-18px] h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(200,170,72,0.22),transparent_70%)]" />
                <div className="relative">
                  <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                    Start a live bid
                  </span>
                  <strong className="mt-3 block max-w-[14ch] font-display text-[2.1rem] leading-[0.96] tracking-[-0.06em] text-[#0F1115]">
                    Launch a new sell-side event from a buyer-ready lot.
                  </strong>
                  <p className="mt-4 max-w-[24rem] text-[0.92rem] leading-7 text-[#6D7484]">
                    Set your floor price, stage quantity, attach documentation, and open a controlled bidding lane for verified recyclers.
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {[
                      ["Floor price", "Protected opening level"],
                      ["Lot quantity", "Bid-ready tonnage"],
                      ["Bid timing", "Open and close window"],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-[20px] border border-[#DCE3EF] bg-white/84 px-4 py-4">
                        <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[#6D7484]">
                          {label}
                        </span>
                        <p className="mt-2 text-[0.84rem] leading-6 text-[#0F1115]">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative mt-8 flex flex-wrap items-center gap-3">
                  <Link className="button-primary" to="/dashboard/supplier/create-bid">
                    Open create bid
                  </Link>
                  <Link
                    className="inline-flex text-[0.76rem] font-bold uppercase tracking-[0.14em] text-[#253B80] transition hover:text-[#C8AA48]"
                    to="/supplier-onboarding"
                  >
                    Update listed catalogue
                  </Link>
                </div>
              </motion.section>
            </div>
          </div>
        </div>
      </section>

      <MarketplaceIntelligenceSection mode="supplier" />
    </motion.main>
  );
}
