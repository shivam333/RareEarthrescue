import { motion } from "framer-motion";
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { LiveMarketplaceBoard } from "../components/dashboard/LiveMarketplaceBoard";
import {
  dashboardSourceContent,
  DashboardSourceId,
} from "../data/dashboardMarketplaceData";
import { useSupplierListingStore } from "../hooks/useSupplierListingStore";
import { pageEnter } from "../lib/motion";

const pageMotionProps = {
  variants: pageEnter,
  initial: "hidden" as const,
  animate: "visible" as const,
  exit: "exit" as const,
};

function isDashboardSourceId(value: string | undefined): value is DashboardSourceId {
  return Boolean(value && value in dashboardSourceContent);
}

export function LiveRecyclerDashboardPage() {
  const { sourceId } = useParams<{ sourceId: string }>();
  const activeSource: DashboardSourceId = isDashboardSourceId(sourceId) ? sourceId : "hdd";
  const sourceContent = dashboardSourceContent[activeSource];
  const { mergedMarketplaceListings } = useSupplierListingStore();
  const sourceListings = useMemo(
    () => mergedMarketplaceListings.filter((listing) => listing.sourceId === activeSource),
    [activeSource, mergedMarketplaceListings]
  );

  return (
    <motion.main className="page" {...pageMotionProps}>
      <section className="shell section-gap pt-10 lg:pt-14">
        <div className="rounded-[34px] border border-[#DCE3EF] bg-[linear-gradient(180deg,rgba(255,252,247,0.97),rgba(244,236,224,0.9))] p-6 shadow-[0_28px_80px_rgba(46,41,31,0.08)] lg:p-8">
          <div className="flex flex-col gap-4 border-b border-[#DCE3EF] pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <p className="eyebrow mb-0">{sourceContent.eyebrow}</p>
              <h1 className="mt-2 font-display text-[2rem] leading-[0.98] tracking-[-0.06em] text-[#0F1115] sm:text-[2.35rem] lg:text-[2.85rem]">
                {sourceContent.liveTitle}
              </h1>
              <p className="mt-4 max-w-[48rem] text-[1rem] leading-8 text-[#6D7484]">
                {sourceContent.liveBody}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link className="button-ghost" to="/dashboard">
                Back to recycler dashboard
              </Link>
              <span className="rounded-full border border-[#DCE3EF] bg-white/82 px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#253B80]">
                {sourceListings.length} live listings
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-3 lg:grid-cols-5">
            {sourceContent.scrapTypes.map((scrapType) => (
              <div
                key={scrapType}
                className="rounded-[22px] border border-[#DCE3EF] bg-white/78 px-4 py-4 text-center text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-[#6D7484]"
              >
                {scrapType}
              </div>
            ))}
          </div>

          <div className="mt-6">
            <LiveMarketplaceBoard listings={sourceListings} sourceId={activeSource} />
          </div>
        </div>
      </section>
    </motion.main>
  );
}
