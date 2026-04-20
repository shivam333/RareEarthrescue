import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { DashboardBidListing } from "../../data/dashboardMarketplaceData";

function MaybeBlur({
  children,
  blurred,
}: {
  children: ReactNode;
  blurred?: boolean;
}) {
  return (
    <span className={blurred ? "inline-block select-none blur-[4.6px]" : undefined}>{children}</span>
  );
}

export function BidListingTable({
  listings,
  blurred = false,
  compact = false,
  showTechnicalColumns = false,
}: {
  listings: DashboardBidListing[];
  blurred?: boolean;
  compact?: boolean;
  showTechnicalColumns?: boolean;
}) {
  const columns = showTechnicalColumns
    ? [
        "Material",
        "Category",
        "Location",
        "Quantity",
        "Opening bid",
        "Concentration",
        "Verification",
        "Purity notes",
        "Availability",
        "Action",
      ]
    : ["Material", "Category", "Location", "Quantity", "Opening bid", "Purity notes", "Availability", "Action"];

  return (
    <div className="overflow-hidden rounded-[30px] border border-[#ddd4c7] bg-[rgba(255,252,247,0.84)] shadow-[0_20px_60px_rgba(46,41,31,0.07)]">
      <div className="overflow-x-auto">
        <table className={`w-full text-left ${showTechnicalColumns ? "min-w-[1380px]" : "min-w-[1100px]"}`}>
          <thead className="bg-[rgba(247,239,227,0.92)]">
            <tr className="border-b border-[#e6ddcf]">
              {columns.map((heading) => (
                <th
                  key={heading}
                  className={`px-5 py-4 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[#837865] ${
                    compact ? "first:w-[21rem]" : "first:w-[24rem]"
                  }`}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {listings.map((listing, index) => (
              <motion.tr
                key={listing.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                className="border-b border-[#ece4d8] last:border-b-0 hover:bg-[rgba(255,255,255,0.48)]"
              >
                <td className="px-5 py-5 align-top">
                  <div className="max-w-[20rem]">
                    <strong className="block font-display text-[1rem] leading-7 tracking-[-0.03em] text-[#11283d]">
                      <MaybeBlur blurred={blurred}>{listing.material}</MaybeBlur>
                    </strong>
                  </div>
                </td>
                <td className="px-5 py-5 text-[0.94rem] leading-7 text-[#5c6b79]">{listing.category}</td>
                <td className="px-5 py-5 text-[0.94rem] leading-7 text-[#5c6b79]">
                  <MaybeBlur blurred={blurred}>{listing.location}</MaybeBlur>
                </td>
                <td className="px-5 py-5 text-[0.94rem] font-semibold text-[#173550]">{listing.quantity}</td>
                <td className="px-5 py-5 text-[0.94rem] font-semibold text-[#8d6d39]">{listing.openingBid}</td>
                {showTechnicalColumns ? (
                  <>
                    <td className="px-5 py-5 text-[0.94rem] leading-7 text-[#5c6b79]">{listing.concentration}</td>
                    <td className="px-5 py-5 text-[0.94rem] leading-7 text-[#5c6b79]">{listing.verification}</td>
                  </>
                ) : null}
                <td className="px-5 py-5 text-[0.94rem] leading-7 text-[#5c6b79]">{listing.purityNotes}</td>
                <td className="px-5 py-5 text-[0.94rem] leading-7 text-[#5c6b79]">{listing.availability}</td>
                <td className="px-5 py-5">
                  <Link
                    className="inline-flex items-center rounded-full border border-[#d8cebd] bg-white/84 px-4 py-2 text-[0.76rem] font-bold uppercase tracking-[0.14em] text-[#173550] transition hover:-translate-y-0.5 hover:border-[#b38a4e] hover:text-[#0f2a40]"
                    to={`/listing/${listing.id}`}
                  >
                    Place bid
                  </Link>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
