import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { DashboardRoleSwitch } from "../components/dashboard/DashboardRoleSwitch";
import { LiveBiddingDashboard } from "../components/dashboard/LiveBiddingDashboard";
import { MarketplaceIntelligenceSection } from "../components/dashboard/MarketplaceIntelligenceSection";
import { MaterialTileGrid } from "../components/dashboard/MaterialTileGrid";
import { dashboardBidListings, dashboardMaterialTiles } from "../data/dashboardMarketplaceData";
import { DashboardMode } from "../lib/accountRole";
import { pageEnter } from "../lib/motion";

const pageMotionProps = {
  variants: pageEnter,
  initial: "hidden" as const,
  animate: "visible" as const,
  exit: "exit" as const,
};

export function RecyclerDashboardPage({
  showModeSwitch = false,
  activeMode = "recycler",
  onModeChange,
}: {
  showModeSwitch?: boolean;
  activeMode?: DashboardMode;
  onModeChange?: (mode: DashboardMode) => void;
}) {
  const modeSwitch = showModeSwitch && onModeChange ? (
    <div className="mb-8 flex flex-col gap-4 rounded-[30px] border border-[#d7cebf] bg-white/72 p-5 shadow-[0_20px_56px_rgba(46,41,31,0.06)] lg:flex-row lg:items-center lg:justify-between">
      <div>
        <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]">
          Account mode
        </span>
        <p className="mt-2 max-w-[34rem] text-[0.94rem] leading-7 text-[#556576]">
          This workspace has access to both supplier and recycler tools. Switch views without leaving the session.
        </p>
      </div>
      <DashboardRoleSwitch activeMode={activeMode} onChange={onModeChange} />
    </div>
  ) : null;

  return (
    <motion.main className="page bg-transparent" {...pageMotionProps}>
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(210,175,103,0.16),transparent_24%),radial-gradient(circle_at_88%_12%,rgba(121,161,144,0.16),transparent_30%),linear-gradient(180deg,#fbf7ef_0%,#f4ebdb_56%,#f5efe4_100%)] pb-12 pt-28">
        <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(17,40,61,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(17,40,61,0.05)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="absolute left-[-6rem] top-[-2rem] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(201,159,76,0.2),transparent_68%)] blur-3xl" />
        <div className="absolute right-[-5rem] top-[6rem] h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(110,152,121,0.18),transparent_70%)] blur-3xl" />

        <div className="shell relative z-10">
          {modeSwitch}

          <div className="max-w-4xl">
            <p className="eyebrow">Recycler dashboard</p>
            <h1 className="max-w-[12ch] font-display text-[clamp(3rem,5.2vw,5.2rem)] leading-[0.95] tracking-[-0.06em] text-[#11283d]">
              Open live category boards built for rare earth recovery buyers.
            </h1>
            <p className="mt-5 max-w-[46rem] text-[1.04rem] leading-8 text-[#4b5b69]">
              Start from a feedstock family, open the live bidding table only when you are ready,
              and use recommendation tools to target the right lots before you price a bid.
            </p>
          </div>

          <div className="mt-8">
            <MaterialTileGrid tiles={dashboardMaterialTiles} hrefMode="dashboard" />
          </div>
        </div>
      </section>

      <section className="shell section-gap pt-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.72fr)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.5 }}
          >
            <LiveBiddingDashboard listings={dashboardBidListings} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="space-y-4"
          >
            <div className="rounded-[30px] border border-[#d9cfbf] bg-white/84 p-5 shadow-[0_20px_56px_rgba(46,41,31,0.06)]">
              <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]">
                Quick actions
              </span>
              <div className="mt-4 flex flex-col gap-3">
                <Link className="button-ghost justify-center" to="/dashboard/checkout">
                  Review cart
                </Link>
                <Link className="button-ghost justify-center" to="/dashboard/live-bids">
                  Open full table
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <MarketplaceIntelligenceSection mode="recycler" />
    </motion.main>
  );
}
