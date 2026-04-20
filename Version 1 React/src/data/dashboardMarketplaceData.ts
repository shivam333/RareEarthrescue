export type DashboardMaterialTile = {
  title: string;
  subtitle: string;
  image: string;
  accent: string;
};

export type DashboardLotSize = "small" | "mid" | "large";
export type DashboardScrapType = "hdd" | "ev-hybrid" | "industrial-motor" | "mri";
export type DashboardLocationFilter = "usa" | "canada" | "europe" | "asia";

export type DashboardBidListing = {
  id: string;
  material: string;
  category: string;
  location: string;
  quantity: string;
  openingBid: string;
  purityNotes: string;
  availability: string;
  lotSize: DashboardLotSize;
  scrapType: DashboardScrapType;
  locationFilter: DashboardLocationFilter;
};

export const dashboardMaterialTiles: DashboardMaterialTile[] = [
  {
    title: "Hard Disc Drives",
    subtitle: "Magnet assemblies, depopulated units, and recurring ITAD streams",
    image:
      "https://images.unsplash.com/photo-1591799265444-d66432b91588?auto=format&fit=crop&w=1400&q=80",
    accent: "from-[#18344c]/80 via-[#18344c]/30 to-transparent",
  },
  {
    title: "EV and Hybrid Motors",
    subtitle: "Traction motors, rotor packs, and high-value magnet-bearing systems",
    image:
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1400&q=80",
    accent: "from-[#345b50]/80 via-[#345b50]/30 to-transparent",
  },
  {
    title: "Industrial Motors",
    subtitle: "Robotics, automation equipment, and embedded industrial magnet systems",
    image:
      "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=1400&q=80",
    accent: "from-[#8f6d38]/78 via-[#8f6d38]/24 to-transparent",
  },
  {
    title: "MRI Machines",
    subtitle: "High-spec recovery pathways for medical and superconducting equipment",
    image:
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1400&q=80",
    accent: "from-[#203244]/78 via-[#203244]/24 to-transparent",
  },
];

export const dashboardBidListings: DashboardBidListing[] = [
  {
    id: "texas-hdd-assemblies",
    material: "Recovered HDD magnet assemblies",
    category: "Hard disc drives",
    location: "Texas, USA",
    quantity: "6.5 MT",
    openingBid: "$18,500",
    purityNotes: "Historic assay references available",
    availability: "Immediate",
    lotSize: "small",
    scrapType: "hdd",
    locationFilter: "usa",
  },
  {
    id: "ontario-traction-motors",
    material: "Mixed EV and hybrid traction motors",
    category: "EV and hybrid motors",
    location: "Ontario, Canada",
    quantity: "42 units",
    openingBid: "$42,000",
    purityNotes: "Composition estimate provided",
    availability: "10 days",
    lotSize: "large",
    scrapType: "ev-hybrid",
    locationFilter: "canada",
  },
  {
    id: "illinois-hdd-lot",
    material: "Depopulated HDD magnet lot",
    category: "Hard disc drives",
    location: "Illinois, USA",
    quantity: "4.8 MT",
    openingBid: "$13,900",
    purityNotes: "Sorted assemblies with traceable source notes",
    availability: "Immediate",
    lotSize: "small",
    scrapType: "hdd",
    locationFilter: "usa",
  },
  {
    id: "nagoya-smco-fraction",
    material: "Industrial motor magnet fraction",
    category: "Industrial motors",
    location: "Nagoya, Japan",
    quantity: "11.2 MT",
    openingBid: "$31,400",
    purityNotes: "Sampling complete, contamination notes included",
    availability: "3 weeks",
    lotSize: "mid",
    scrapType: "industrial-motor",
    locationFilter: "asia",
  },
  {
    id: "hamburg-shred-fraction",
    material: "Shredded motor concentrate with REE-bearing magnets",
    category: "Industrial motors",
    location: "Hamburg, Germany",
    quantity: "24 MT",
    openingBid: "$57,000",
    purityNotes: "Pending lab confirmation, batch photos uploaded",
    availability: "2 weeks",
    lotSize: "large",
    scrapType: "industrial-motor",
    locationFilter: "europe",
  },
  {
    id: "minnesota-mri-systems",
    material: "MRI deinstallation recovery lot",
    category: "MRI machines",
    location: "Minnesota, USA",
    quantity: "3 systems",
    openingBid: "$65,000",
    purityNotes: "Dismantling scope and recovery notes attached",
    availability: "14 days",
    lotSize: "mid",
    scrapType: "mri",
    locationFilter: "usa",
  },
  {
    id: "quebec-ev-rotor-pack",
    material: "Hybrid motor rotor pack inventory",
    category: "EV and hybrid motors",
    location: "Quebec, Canada",
    quantity: "9.4 MT",
    openingBid: "$24,800",
    purityNotes: "Verified teardown notes and pallet manifest",
    availability: "1 week",
    lotSize: "mid",
    scrapType: "ev-hybrid",
    locationFilter: "canada",
  },
  {
    id: "osaka-mri-shielding",
    material: "MRI equipment recovery bundle",
    category: "MRI machines",
    location: "Osaka, Japan",
    quantity: "2 systems",
    openingBid: "$48,500",
    purityNotes: "Buyer pre-inspection window available",
    availability: "21 days",
    lotSize: "mid",
    scrapType: "mri",
    locationFilter: "asia",
  },
];
