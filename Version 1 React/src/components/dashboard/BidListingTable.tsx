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

function parsePricePerKg(listing: DashboardBidListing) {
  const match = listing.pricePerTon.match(/[\d,]+(?:\.\d+)?/);
  const perTon = match ? Number(match[0].replace(/,/g, "")) : 0;
  return perTon / 1000;
}

function cleanLotQuantity(quantity: string) {
  return quantity.replace(/\s*per lot/i, "");
}

export function BidListingTable({
  listings,
  blurred = false,
  compact = false,
  showTechnicalColumns = false,
  dashboardBidMode = false,
  getDetailHref,
  actionLabel = "View details",
  quantityInputs,
  onQuantityChange,
  getPlaceBidHref,
}: {
  listings: DashboardBidListing[];
  blurred?: boolean;
  compact?: boolean;
  showTechnicalColumns?: boolean;
  dashboardBidMode?: boolean;
  getDetailHref?: (listing: DashboardBidListing) => string;
  actionLabel?: string;
  quantityInputs?: Record<string, string>;
  onQuantityChange?: (listingId: string, nextValue: string) => void;
  getPlaceBidHref?: (listing: DashboardBidListing, quantityTons: string) => string;
}) {
  const isInteractiveBidTable = Boolean(quantityInputs && onQuantityChange && getPlaceBidHref);
  const isDashboardBidTable = dashboardBidMode && Boolean(getPlaceBidHref);

  const columns = useMemo<ColumnDef<DashboardBidListing, any>[]>(() => {
    const base: ColumnDef<DashboardBidListing, any>[] = [
      columnHelper.accessor("material", {
        header: "Material",
        cell: ({ row }) => (
          <div className="max-w-[20rem]">
            {getDetailHref ? (
              <Link
                to={getDetailHref(row.original)}
                className="block transition hover:text-[#8d6d39]"
              >
                <strong className="block font-display text-[1rem] leading-7 tracking-[-0.03em] text-[#11283d]">
                  <MaybeBlur blurred={blurred}>{row.original.material}</MaybeBlur>
                </strong>
              </Link>
            ) : (
              <strong className="block font-display text-[1rem] leading-7 tracking-[-0.03em] text-[#11283d]">
                <MaybeBlur blurred={blurred}>{row.original.material}</MaybeBlur>
              </strong>
            )}
            {isInteractiveBidTable ? (
              <span className="mt-2 block text-[0.76rem] font-semibold uppercase tracking-[0.12em] text-[#8a7b65]">
                Available lot: {cleanLotQuantity(row.original.quantity)}
              </span>
            ) : null}
          </div>
        ),
      }),
      columnHelper.accessor("category", {
        header: "Category",
        cell: (info) => <span className="text-[0.94rem] leading-7 text-[#5c6b79]">{info.getValue()}</span>,
      }),
      ...(!isDashboardBidTable
        ? [
            columnHelper.accessor("location", {
              header: "Location",
              cell: (info) => (
                <span className="text-[0.94rem] leading-7 text-[#5c6b79]">
                  <MaybeBlur blurred={blurred}>{info.getValue()}</MaybeBlur>
                </span>
              ),
            }),
          ]
        : []),
    ];

    const bidColumns: ColumnDef<DashboardBidListing, any>[] = isInteractiveBidTable
      ? [
          columnHelper.display({
            id: "bidQuantity",
            header: "Bid quantity",
            cell: ({ row }) => (
              <div className="min-w-[9rem]">
                <label className="sr-only" htmlFor={`qty-${row.original.id}`}>
                  Bid quantity in tons
                </label>
                <div className="rounded-[18px] border border-[#ddd4c7] bg-white/84 px-3 py-2">
                  <input
                    id={`qty-${row.original.id}`}
                    inputMode="decimal"
                    type="text"
                    value={quantityInputs?.[row.original.id] ?? ""}
                    onChange={(event) => onQuantityChange?.(row.original.id, event.target.value)}
                    className="w-full border-0 bg-transparent text-[0.95rem] font-semibold text-[#173550] outline-none"
                    placeholder="0.00"
                  />
                  <span className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#8a7b65]">
                    Tons
                  </span>
                </div>
              </div>
            ),
          }),
          columnHelper.display({
            id: "openingBidPerKg",
            header: "Opening bid",
            cell: ({ row }) => (
              <span className="text-[0.94rem] font-semibold text-[#8d6d39]">
                ${parsePricePerKg(row.original).toFixed(2)} / kg
              </span>
            ),
          }),
        ]
      : isDashboardBidTable
        ? [
            columnHelper.display({
              id: "availableLots",
              header: "Available lot",
              cell: ({ row }) => (
                <span className="text-[0.94rem] font-semibold text-[#173550]">
                  {row.original.availableLots} lot{row.original.availableLots === 1 ? "" : "s"}
                </span>
              ),
            }),
            columnHelper.display({
              id: "minimumLotSize",
              header: "Minimum lot size",
              cell: ({ row }) => (
                <span className="text-[0.94rem] font-semibold text-[#173550]">
                  {cleanLotQuantity(row.original.quantity)}
                </span>
              ),
            }),
            columnHelper.display({
              id: "openingBidPerKg",
              header: "Opening bid",
              cell: ({ row }) => (
                <span className="text-[0.94rem] font-semibold text-[#8d6d39]">
                  ${parsePricePerKg(row.original).toFixed(2)} / kg
                </span>
              ),
            }),
          ]
      : [
          columnHelper.accessor("quantity", {
            header: "Quantity",
            cell: (info) => (
              <span className="text-[0.94rem] font-semibold text-[#173550]">{info.getValue()}</span>
            ),
          }),
          columnHelper.accessor("openingBid", {
            header: "Opening bid",
            cell: (info) => (
              <span className="text-[0.94rem] font-semibold text-[#8d6d39]">{info.getValue()}</span>
            ),
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
      ...(!isInteractiveBidTable && !isDashboardBidTable
        ? [
            columnHelper.accessor("purityNotes", {
              header: "Purity notes",
              cell: (info) => <span className="text-[0.94rem] leading-7 text-[#5c6b79]">{info.getValue()}</span>,
            }),
            columnHelper.accessor("availability", {
              header: "Availability",
              cell: (info) => <span className="text-[0.94rem] leading-7 text-[#5c6b79]">{info.getValue()}</span>,
            }),
          ]
        : []),
      ...(isInteractiveBidTable
        ? [
            columnHelper.display({
              id: "totalBid",
              header: "Total bid",
              cell: ({ row }) => {
                const quantityTons = Number(quantityInputs?.[row.original.id] ?? 0);
                const totalBid = quantityTons * 1000 * parsePricePerKg(row.original);

                return (
                  <div>
                    <strong className="block text-[0.98rem] tracking-[-0.02em] text-[#11283d]">
                      ${Number.isFinite(totalBid) ? totalBid.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "0.00"}
                    </strong>
                    <span className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#8a7b65]">
                      Calculated total
                    </span>
                  </div>
                );
              },
            }),
          ]
        : []),
      columnHelper.display({
        id: "action",
        header: "Action",
        cell: ({ row }) => {
          const detailHref = getDetailHref
            ? getDetailHref(row.original)
            : `/listing/${row.original.id}`;
          const actionHref = isInteractiveBidTable
            ? getPlaceBidHref?.(row.original, quantityInputs?.[row.original.id] ?? "0.00") ??
              detailHref
            : getPlaceBidHref
              ? getPlaceBidHref(row.original, "0.00")
              : detailHref;

          return isDashboardBidTable ? (
            <div className="flex flex-col items-start gap-2">
              <Link
                className="inline-flex items-center rounded-full border border-[#d8cebd] bg-white/84 px-4 py-2 text-[0.76rem] font-bold uppercase tracking-[0.14em] text-[#173550] transition hover:-translate-y-0.5 hover:border-[#b38a4e] hover:text-[#0f2a40]"
                to={actionHref}
              >
                {actionLabel}
              </Link>
              <Link
                className="text-[0.76rem] font-bold uppercase tracking-[0.14em] text-[#8d6d39] transition hover:text-[#173550]"
                to={detailHref}
              >
                View details
              </Link>
            </div>
          ) : (
            <Link
              className="inline-flex items-center rounded-full border border-[#d8cebd] bg-white/84 px-4 py-2 text-[0.76rem] font-bold uppercase tracking-[0.14em] text-[#173550] transition hover:-translate-y-0.5 hover:border-[#b38a4e] hover:text-[#0f2a40]"
              to={actionHref}
            >
              {actionLabel}
            </Link>
          );
        },
      }),
    ];

    return [...base, ...bidColumns, ...technical, ...tail];
  }, [
    actionLabel,
    dashboardBidMode,
    blurred,
    getDetailHref,
    getPlaceBidHref,
    isDashboardBidTable,
    isInteractiveBidTable,
    onQuantityChange,
    quantityInputs,
    showTechnicalColumns,
  ]);

  const table = useReactTable({
    data: listings,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-[30px] border border-[#ddd4c7] bg-[rgba(255,252,247,0.84)] shadow-[0_20px_60px_rgba(46,41,31,0.07)]">
      <div className="overflow-x-auto">
        <table
          className={`w-full text-left ${
            isInteractiveBidTable || isDashboardBidTable
              ? "min-w-[1420px]"
              : showTechnicalColumns
                ? "min-w-[1380px]"
                : "min-w-[1100px]"
          }`}
        >
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
