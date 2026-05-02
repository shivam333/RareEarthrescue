import { motion } from "framer-motion";
import ReactECharts from "echarts-for-react";
import { Link } from "react-router-dom";
import { DashboardRoleSwitch } from "../components/dashboard/DashboardRoleSwitch";
import { MarketplaceIntelligenceSection } from "../components/dashboard/MarketplaceIntelligenceSection";
import { supplierActiveListings } from "../data/supplierListingsData";
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
    href: undefined,
  },
  {
    label: "Current active listings",
    value: "18",
    change: "Open listed stock",
    tone: "text-[#0F1115]",
    glow: "from-[#C8AA48]/16 via-[#C8AA48]/6 to-transparent",
    href: "/dashboard/supplier/listings",
  },
  {
    label: "Buyer reach in motion",
    value: "42",
    change: "Verified recycler conversations",
    tone: "text-[#0F1115]",
    glow: "from-[#79A190]/16 via-[#79A190]/6 to-transparent",
    href: undefined,
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
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(121,161,144,0.18),transparent_26%),radial-gradient(circle_at_92%_0%,rgba(210,175,103,0.16),transparent_24%),linear-gradient(180deg,#FFFFFF_0%,#F6F8FC_58%,#F6F8FC_100%)] pb-14 pt-28">
        <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(17,40,61,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(17,40,61,0.04)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="shell relative z-10">
          {modeSwitch}

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_380px]">
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="rounded-[34px] border border-[#DCE3EF] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(247,248,252,0.92))] p-6 shadow-[0_28px_80px_rgba(46,41,31,0.08)]"
            >
              <div className="max-w-[44rem]">
                <p className="eyebrow">Supplier dashboard</p>
                <h1 className="max-w-[11ch] font-display text-[clamp(2.8rem,4.4vw,4.7rem)] leading-[0.94] tracking-[-0.065em] text-[#0F1115]">
                  Run verified sell-side programs with tighter commercial control.
                </h1>
                <p className="mt-4 max-w-[38rem] text-[0.98rem] leading-7 text-[#6D7484]">
                  Track pricing performance, watch active stock, and open new buyer-ready listings without slowing documentation.
                </p>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {supplierMetrics.map((metric, index) => {
                  const content = (
                    <motion.article
                      key={metric.label}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: 0.14 + index * 0.05 }}
                      className={`relative overflow-hidden rounded-[28px] border border-[#DCE3EF] bg-white/88 p-5 ${
                        metric.href ? "transition hover:-translate-y-1 hover:border-[#253B80]/30" : ""
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${metric.glow}`} />
                      <div className="relative">
                        <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                          {metric.label}
                        </span>
                        <strong className={`mt-3 block font-display text-[2.15rem] tracking-[-0.06em] ${metric.tone}`}>
                          {metric.value}
                        </strong>
                        <p className="mt-2 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-[#6D7484]">
                          {metric.change}
                        </p>
                      </div>
                    </motion.article>
                  );

                  return metric.href ? (
                    <Link key={metric.label} to={metric.href}>
                      {content}
                    </Link>
                  ) : (
                    content
                  );
                })}
              </div>
            </motion.section>

            <motion.aside
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="space-y-4"
            >
              <section className="relative overflow-hidden rounded-[34px] border border-[#DCE3EF] bg-[linear-gradient(180deg,rgba(37,59,128,0.98),rgba(17,40,61,0.96))] p-6 text-white shadow-[0_32px_90px_rgba(37,59,128,0.24)]">
                <div className="absolute right-[-42px] top-[-42px] h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.14),transparent_68%)]" />
                <div className="absolute bottom-[-36px] left-[-24px] h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(200,170,72,0.24),transparent_72%)]" />
                <div className="relative">
                  <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-white/72">
                    Primary action
                  </span>
                  <strong className="mt-4 block max-w-[11ch] font-display text-[2.6rem] leading-[0.92] tracking-[-0.065em]">
                    Create a new live listing.
                  </strong>
                  <p className="mt-4 max-w-[20rem] text-[0.96rem] leading-7 text-white/76">
                    Build supply from the structured database, set pricing, and stage one or multiple lots into market.
                  </p>
                  <Link
                    className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-4 text-[0.86rem] font-bold uppercase tracking-[0.16em] text-[#253B80] transition hover:bg-[#F8FAFD]"
                    to="/dashboard/supplier/create-bid"
                  >
                    Create listing
                  </Link>
                </div>
              </section>

              <section className="rounded-[28px] border border-[#DCE3EF] bg-white/86 p-5 shadow-[0_24px_70px_rgba(46,41,31,0.07)]">
                <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                  Catalogue action
                </span>
                <strong className="mt-3 block font-display text-[1.24rem] tracking-[-0.04em] text-[#0F1115]">
                  Update listed catalogue
                </strong>
                <p className="mt-2 text-[0.9rem] leading-6 text-[#6D7484]">
                  Refresh photos, documentation, and available lot data already live with buyers.
                </p>
                <Link
                  className="mt-4 inline-flex rounded-full border border-[#DCE3EF] px-4 py-2 text-[0.76rem] font-bold uppercase tracking-[0.14em] text-[#0F1115] transition hover:border-[#253B80] hover:text-[#253B80]"
                  to="/supplier-onboarding"
                >
                  Open catalogue
                </Link>
              </section>
            </motion.aside>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.14fr)_340px]">
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="rounded-[30px] border border-[#DCE3EF] bg-white/86 p-5 shadow-[0_24px_70px_rgba(46,41,31,0.07)]"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                    Active listing preview
                  </span>
                  <strong className="mt-2 block font-display text-[1.46rem] tracking-[-0.05em] text-[#0F1115]">
                    Listed stock currently live with buyers
                  </strong>
                </div>
                <Link
                  to="/dashboard/supplier/listings"
                  className="inline-flex text-[0.76rem] font-bold uppercase tracking-[0.14em] text-[#253B80] transition hover:text-[#C8AA48]"
                >
                  View all active listings
                </Link>
              </div>

              <div className="mt-5 space-y-3">
                {supplierActiveListings.slice(0, 3).map((listing, index) => (
                  <motion.article
                    key={listing.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.18 + index * 0.05 }}
                    className="grid gap-3 rounded-[22px] border border-[#E4EAF2] bg-[rgba(255,252,247,0.9)] px-4 py-4 lg:grid-cols-[minmax(0,1.15fr)_repeat(4,minmax(0,0.42fr))]"
                  >
                    <div>
                      <strong className="block font-display text-[1.08rem] tracking-[-0.04em] text-[#0F1115]">
                        {listing.title}
                      </strong>
                      <p className="mt-1 text-[0.82rem] leading-6 text-[#6D7484]">
                        {listing.family} | {listing.subcategory}
                      </p>
                    </div>
                    <div>
                      <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[#6D7484]">
                        Quantity
                      </span>
                      <p className="mt-2 font-display text-[1rem] tracking-[-0.04em] text-[#0F1115]">{listing.quantity}</p>
                    </div>
                    <div>
                      <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[#6D7484]">
                        Floor
                      </span>
                      <p className="mt-2 font-display text-[1rem] tracking-[-0.04em] text-[#0F1115]">{listing.floorPrice}</p>
                    </div>
                    <div>
                      <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[#6D7484]">
                        Best bid
                      </span>
                      <p className="mt-2 font-display text-[1rem] tracking-[-0.04em] text-[#253B80]">{listing.bestBid}</p>
                    </div>
                    <div>
                      <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[#6D7484]">
                        Status
                      </span>
                      <p className="mt-2 text-[0.76rem] font-bold uppercase tracking-[0.14em] text-[#253B80]">{listing.status}</p>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="rounded-[30px] border border-[#DCE3EF] bg-[linear-gradient(180deg,rgba(255,252,247,0.92),rgba(249,244,236,0.86))] p-5 shadow-[0_24px_70px_rgba(46,41,31,0.07)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
                    Bid premium trend
                  </span>
                  <strong className="mt-2 block font-display text-[1.4rem] tracking-[-0.05em] text-[#0F1115]">
                    Premium captured above floor
                  </strong>
                </div>
                <span className="rounded-full border border-[#DCE3EF] bg-white/78 px-3 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#253B80]">
                  Last 6 weeks
                </span>
              </div>
              <div className="mt-4 overflow-hidden rounded-[24px] bg-white/74 p-2">
                <ReactECharts option={supplierValueTrendOption()} style={{ height: 240 }} opts={{ renderer: "svg" }} />
              </div>
            </motion.section>
          </div>
        </div>
      </section>

      <MarketplaceIntelligenceSection mode="supplier" />
    </motion.main>
  );
}
