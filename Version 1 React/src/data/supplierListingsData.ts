export type SupplierActiveListing = {
  id: string;
  title: string;
  family: string;
  subcategory: string;
  quantity: string;
  floorPrice: string;
  bestBid: string;
  status: string;
  bidCount: number;
  updated: string;
};

export const supplierActiveListings: SupplierActiveListing[] = [
  {
    id: "supplier-hdd-whole-assemblies",
    title: "Whole HDD assemblies",
    family: "Hard Disc Drives",
    subcategory: "Whole HDDs",
    quantity: "18.4 MT",
    floorPrice: "$2.12/kg",
    bestBid: "$2.42/kg",
    status: "7 bids live",
    bidCount: 7,
    updated: "Updated 2 hours ago",
  },
  {
    id: "supplier-hybrid-traction",
    title: "Hybrid traction motors",
    family: "EV and Hybrid Motors",
    subcategory: "Hybrid motors",
    quantity: "11.2 MT",
    floorPrice: "$3.48/kg",
    bestBid: "$3.89/kg",
    status: "Buyer review open",
    bidCount: 5,
    updated: "Updated this morning",
  },
  {
    id: "supplier-industrial-servo",
    title: "Industrial servo motors",
    family: "Industrial Motors",
    subcategory: "Industrial-grade servo motors",
    quantity: "9.6 MT",
    floorPrice: "$2.76/kg",
    bestBid: "$3.02/kg",
    status: "Closing in 3 days",
    bidCount: 4,
    updated: "Updated yesterday",
  },
  {
    id: "supplier-mri-15t",
    title: "1.5T MRI systems",
    family: "MRI Machines",
    subcategory: "1.5T MRI systems",
    quantity: "3 units",
    floorPrice: "$46,000/unit",
    bestBid: "$51,500/unit",
    status: "Due diligence open",
    bidCount: 2,
    updated: "Updated 1 day ago",
  },
  {
    id: "supplier-robotic-actuators",
    title: "Robotic arm actuators",
    family: "Other Magnet Sources",
    subcategory: "Robotic arm actuators",
    quantity: "6.8 MT",
    floorPrice: "$4.05/kg",
    bestBid: "$4.38/kg",
    status: "3 bidders active",
    bidCount: 3,
    updated: "Updated 3 hours ago",
  },
];
