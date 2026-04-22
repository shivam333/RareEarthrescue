import { ReactNode, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
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

const columnHelper = createColumnHelper<DashboardBidListing>();

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
  const columns = useMemo<ColumnDef<DashboardBidListing, any>[]>(() => {
    const base: ColumnDef<DashboardBidListing, any>[] = [
      columnHelper.accessor("material", {
        header: "Material",
        cell: ({ row }) => (
          <div className="max-w-[20rem]">
            <strong className="block font-display text-[1rem] leading-7 tracking-[-0.03em] text-[#11283d]">
              <MaybeBlur blurred={blurred}>{row.original.material}</MaybeBlur>
            </strong>
          </div>
        ),
      }),
      columnHelper.accessor("category", {
        header: "Category",
        cell: (info) => <span className="text-[0.94rem] leading-7 text-[#5c6b79]">{info.getValue()}</span>,
      }),
      columnHelper.accessor("location", {
        header: "Location",
        cell: (info) => (
          <span className="text-[0.94rem] leading-7 text-[#5c6b79]">
            <MaybeBlur blurred={blurred}>{info.getValue()}</MaybeBlur>
          </span>
        ),
      }),
      columnHelper.accessor("quantity", {
        header: "Quantity",
        cell: (info) => <span className="text-[0.94rem] font-semibold text-[#173550]">{info.getValue()}</span>,
      }),
      columnHelper.accessor("openingBid", {
        header: "Opening bid",
        cell: (info) => <span className="text-[0.94rem] font-semibold text-[#8d6d39]">{info.getValue()}</span>,
      }),
    ];

    const technical: ColumnDef<DashboardBidListing, any>[] = showTechnicalColumns
      ? [
          columnHelper.accessor("concentration", {
            header: "Concentration",
            cell: (info) => <span className="text-[0.94rem] leading-7 text-[#5c6b79]">{info.getValue()}</span>,
          }),
          columnHelper.accessor("verification", {
            header: "Verification",
            cell: (info) => <span className="text-[0.94rem] leading-7 text-[#5c6b79]">{info.getValue()}</span>,
          }),
        ]
      : [];

    const tail: ColumnDef<DashboardBidListing, any>[] = [
      columnHelper.accessor("purityNotes", {
        header: "Purity notes",
        cell: (info) => <span className="text-[0.94rem] leading-7 text-[#5c6b79]">{info.getValue()}</span>,
      }),
      columnHelper.accessor("availability", {
        header: "Availability",
        cell: (info) => <span className="text-[0.94rem] leading-7 text-[#5c6b79]">{info.getValue()}</span>,
      }),
      columnHelper.display({
        id: "action",
        header: "Action",
        cell: ({ row }) => (
          <Link
            className="inline-flex items-center rounded-full border border-[#d8cebd] bg-white/84 px-4 py-2 text-[0.76rem] font-bold uppercase tracking-[0.14em] text-[#173550] transition hover:-translate-y-0.5 hover:border-[#b38a4e] hover:text-[#0f2a40]"
            to={`/listing/${row.original.id}`}
          >
            Place bid
          </Link>
        ),
      }),
    ];

    return [...base, ...technical, ...tail];
  }, [blurred, showTechnicalColumns]);

  const table = useReactTable({
    data: listings,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-[30px] border border-[#ddd4c7] bg-[rgba(255,252,247,0.84)] shadow-[0_20px_60px_rgba(46,41,31,0.07)]">
      <div className="overflow-x-auto">
        <table className={`w-full text-left ${showTechnicalColumns ? "min-w-[1380px]" : "min-w-[1100px]"}`}>
          <thead className="bg-[rgba(247,239,227,0.92)]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-[#e6ddcf]">
                {headerGroup.headers.map((header, index) => (
                  <th
                    key={header.id}
                    className={`px-5 py-4 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[#837865] ${
                      index === 0 ? (compact ? "w-[21rem]" : "w-[24rem]") : ""
                    }`}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.35, delay: index * 0.03 }}
                className="border-b border-[#ece4d8] last:border-b-0 hover:bg-[rgba(255,255,255,0.48)]"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-5 py-5 align-top">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
