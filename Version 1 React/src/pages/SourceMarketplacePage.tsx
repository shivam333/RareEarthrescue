import { motion } from "framer-motion";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { BidListingTable } from "../components/dashboard/BidListingTable";
import { MotionItem, MotionSection } from "../components/ui/Motion";
import {
  dashboardBidListings,
  dashboardSourceContent,
  DashboardSourceId,
} from "../data/dashboardMarketplaceData";
import { pageEnter } from "../lib/motion";
import { toAppRelativeUrl } from "../lib/site";

const pageMotionProps = {
  variants: pageEnter,
  initial: "hidden" as const,
  animate: "visible" as const,
  exit: "exit" as const,
};

function isDashboardSourceId(value: string | undefined): value is DashboardSourceId {
  return Boolean(value && value in dashboardSourceContent);
}

export function SourceMarketplacePage() {
  const { sourceId } = useParams<{ sourceId: string }>();
  const activeSource: DashboardSourceId = isDashboardSourceId(sourceId) ? sourceId : "hdd";
  const sourceContent = dashboardSourceContent[activeSource];
  const sourceListings = useMemo(
    () => dashboardBidListings.filter((listing) => listing.sourceId === activeSource),
    [activeSource]
  );

  return (
    <motion.main className="page" {...pageMotionProps}>
      <section className="shell section-gap pt-10 lg:pt-14">
        <MotionSection className="table-shell">
          <MotionItem className="rounded-[34px] border border-[#d8cfbf] bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(244,236,224,0.9))] p-6 shadow-[0_28px_80px_rgba(46,41,31,0.08)] lg:p-8">
            <div className="flex flex-col gap-4 border-b border-[#e0d7c9] pb-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-4xl">
                <p className="eyebrow mb-0">{sourceContent.eyebrow}</p>
                <h1 className="mt-2 font-display text-[2rem] leading-[0.98] tracking-[-0.06em] text-[#11283d] sm:text-[2.35rem] lg:text-[2.8rem]">
                  {sourceContent.title}
                </h1>
                <p className="mt-3 max-w-3xl text-[1rem] leading-7 text-[#5a6a78]">
                  {sourceContent.body}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full border border-[#ddd4c7] bg-white/82 px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#173550]">
                  {sourceListings.length} active listings
                </span>
                <span className="rounded-full border border-[#ddd4c7] bg-white/82 px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#173550]">
                  Verified concentration signals
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-3 lg:grid-cols-5">
              {sourceContent.scrapTypes.map((scrapType) => (
                <div
                  key={scrapType}
                  className="rounded-[22px] border border-[#ddd4c7] bg-white/78 px-4 py-4 text-center text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-[#5f6d79]"
                >
                  {scrapType}
                </div>
              ))}
            </div>

            <div className="mt-6">
              <BidListingTable
                listings={sourceListings}
                showTechnicalColumns
                actionLabel="Open secure view"
                getDetailHref={(listing) =>
                  `/sign-in?redirect_url=${encodeURIComponent(
                    toAppRelativeUrl(`/dashboard/live/${listing.sourceId}/listing/${listing.id}`)
                  )}`
                }
              />
            </div>
          </MotionItem>
        </MotionSection>
      </section>
    </motion.main>
  );
}
