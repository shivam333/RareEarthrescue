import { motion } from "framer-motion";
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

const supplierStats = [
  { label: "Active sell-side lanes", value: "6" },
  { label: "Verified buyer matches", value: "21" },
  { label: "Ready lots this month", value: "14" },
];

const supplierPrograms = [
  {
    title: "Motor recovery program",
    body: "Prepare EV, hybrid, and industrial motor lots with buyer-ready packaging notes and pickup windows.",
    cta: "Open supplier onboarding",
    href: "/supplier-onboarding",
  },
  {
    title: "Assay and documentation",
    body: "Centralize photos, BOM context, and composition assumptions before recyclers start price discovery.",
    cta: "Talk to our team",
    href: "/contact",
  },
  {
    title: "Commercial workflow support",
    body: "Coordinate sell-side programs for repeat feedstock without rebuilding documents for every transaction.",
    cta: "Manage account details",
    href: "/dashboard/account",
  },
];

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
    <div className="mb-8 flex flex-col gap-4 rounded-[30px] border border-[#d7cebf] bg-white/72 p-5 shadow-[0_20px_56px_rgba(46,41,31,0.06)] lg:flex-row lg:items-center lg:justify-between">
      <div>
        <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]">
          Account mode
        </span>
        <p className="mt-2 max-w-[34rem] text-[0.94rem] leading-7 text-[#556576]">
          Switch between recycler procurement workflows and supplier sell-side operations from the same account.
        </p>
      </div>
      <DashboardRoleSwitch activeMode={activeMode} onChange={onModeChange} />
    </div>
  ) : null;

  return (
    <motion.main className="page bg-transparent" {...pageMotionProps}>
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(121,161,144,0.18),transparent_26%),radial-gradient(circle_at_92%_0%,rgba(210,175,103,0.16),transparent_24%),linear-gradient(180deg,#fcf8f1_0%,#f3eadb_58%,#f5efe4_100%)] pb-14 pt-28">
        <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(17,40,61,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(17,40,61,0.04)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="shell relative z-10">
          {modeSwitch}

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_460px]">
            <div>
              <p className="eyebrow">Supplier dashboard</p>
              <h1 className="max-w-[13ch] font-display text-[clamp(3rem,5vw,5rem)] leading-[0.95] tracking-[-0.06em] text-[#11283d]">
                Run verified sell-side programs for rare-earth-bearing scrap.
              </h1>
              <p className="mt-5 max-w-[46rem] text-[1.02rem] leading-8 text-[#4b5b69]">
                Organize feedstock by source family, tighten documentation before outreach, and prepare repeat lots for recycler demand without losing commercial control.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {supplierStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[26px] border border-[#d9cfbf] bg-white/82 px-5 py-5 shadow-[0_18px_42px_rgba(46,41,31,0.06)]"
                  >
                    <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]">
                      {stat.label}
                    </span>
                    <strong className="mt-2 block font-display text-[1.8rem] tracking-[-0.05em] text-[#11283d]">
                      {stat.value}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link className="button-primary" to="/supplier-onboarding">
                  Start supplier onboarding
                </Link>
                <Link className="button-secondary" to="/dashboard/account">
                  Manage account role
                </Link>
              </div>
            </div>

            <div className="rounded-[34px] border border-[#d8cfbf] bg-white/82 p-5 shadow-[0_28px_80px_rgba(46,41,31,0.08)]">
              <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]">
                Supply families
              </span>
              <div className="mt-4 grid gap-4">
                {dashboardMaterialTiles.slice(0, 3).map((tile) => (
                  <article
                    key={tile.id}
                    className="grid gap-4 rounded-[26px] border border-[#ddd4c7] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(247,241,232,0.84))] p-4 md:grid-cols-[132px_minmax(0,1fr)]"
                  >
                    <AppImage
                      src={tile.image}
                      alt={tile.title}
                      className="h-28 w-full rounded-[22px] object-cover"
                    />
                    <div>
                      <strong className="block font-display text-[1.22rem] tracking-[-0.04em] text-[#11283d]">
                        {tile.title}
                      </strong>
                      <p className="mt-2 text-[0.92rem] leading-7 text-[#556576]">{tile.subtitle}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <MarketplaceIntelligenceSection mode="supplier" />

      <section className="shell pb-16 pt-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {supplierPrograms.map((program, index) => (
            <motion.article
              key={program.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className="rounded-[30px] border border-[#d9cfbf] bg-[rgba(255,252,247,0.94)] p-6 shadow-[0_24px_70px_rgba(46,41,31,0.07)]"
            >
              <span className="badge">Supplier workflow</span>
              <strong className="mt-4 block font-display text-[1.4rem] leading-[1.02] tracking-[-0.04em] text-[#11283d]">
                {program.title}
              </strong>
              <p className="mt-4 text-[0.96rem] leading-7 text-[#556576]">{program.body}</p>
              <Link
                className="mt-6 inline-flex text-[0.78rem] font-bold uppercase tracking-[0.14em] text-[#8d6d39] transition hover:text-[#173550]"
                to={program.href}
              >
                {program.cta}
              </Link>
            </motion.article>
          ))}
        </div>
      </section>
    </motion.main>
  );
}
