import { Link } from "react-router-dom";
import { DashboardBidListing } from "../../data/dashboardMarketplaceData";
import { BidRow } from "./BidRow";

function bidCountForIndex(index: number) {
  return 4 + (index % 7);
}

export function LiveBiddingDashboard({
  listings,
}: {
  listings: DashboardBidListing[];
}) {
  const previewListings = listings.slice(0, 4);
  const activeBids = listings.length;
  const bidsReceived = listings.reduce((sum, _item, index) => sum + bidCountForIndex(index), 0);
  const hotFeedstock = listings.reduce<DashboardBidListing | null>((current, listing, index) => {
    if (!current) return listing;

    const currentIndex = listings.findIndex((item) => item.id === current.id);
    return bidCountForIndex(index) > bidCountForIndex(currentIndex) ? listing : current;
  }, null);

  return (
    <article className="rounded-[34px] border border-[#d9cfbf] bg-[linear-gradient(180deg,rgba(255,252,247,0.97),rgba(244,236,224,0.92))] p-6 shadow-[0_28px_80px_rgba(46,41,31,0.08)]">
      <div className="flex flex-col gap-4 border-b border-[#e0d7c9] pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="eyebrow !mb-0">Live bidding dashboard</p>
          <h2 className="mt-2 font-display text-[2rem] leading-[0.98] tracking-[-0.05em] text-[#11283d]">
            Live Bidding Dashboard
          </h2>
          <p className="mt-3 max-w-[42rem] text-[0.98rem] leading-7 text-[#5a6a78]">
            A live activity snapshot of rare-earth-bearing scrap opportunities currently open for bidding.
          </p>
        </div>

        <Link className="button-primary" to="/dashboard/live-bids">
          Open full table
        </Link>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[repeat(2,minmax(0,180px))_minmax(0,1fr)]">
        <StatCard label="Active Bids" value={`${activeBids}`} />
        <StatCard label="Bids Received" value={`${bidsReceived}`} />
        <div className="rounded-[24px] border border-[#d8cfbf] bg-[linear-gradient(135deg,rgba(233,244,235,0.92),rgba(247,241,232,0.9))] px-5 py-4">
          <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#315e53]">
            Hot Feedstock
          </span>
          <strong className="mt-2 block font-display text-[1.12rem] tracking-[-0.03em] text-[#11283d]">
            {hotFeedstock?.category ?? "NdFeB magnet scrap"}
          </strong>
          <p className="mt-2 text-[0.86rem] leading-6 text-[#556576]">
            Highest buyer activity right now across live listed opportunities.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-[28px] border border-[#ddd4c7] bg-white/78 px-5 py-2">
        {previewListings.map((listing, index) => (
          <BidRow key={listing.id} listing={listing} bidCount={bidCountForIndex(index)} compact />
        ))}
      </div>
    </article>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-[#ddd4c7] bg-white/82 px-5 py-4 shadow-[0_16px_36px_rgba(46,41,31,0.05)]">
      <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]">
        {label}
      </span>
      <strong className="mt-2 block font-display text-[1.6rem] tracking-[-0.04em] text-[#11283d]">
        {value}
      </strong>
    </div>
  );
}
