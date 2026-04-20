export type DashboardSourceId =
  | "hdd"
  | "auto-motors"
  | "industrial-motors"
  | "mri";

export type DashboardMaterialTile = {
  id: DashboardSourceId;
  title: string;
  subtitle: string;
  image: string;
  accent: string;
  href: string;
};

export type DashboardLotSize = "small" | "mid" | "large";
export type DashboardLocationFilter = "usa" | "canada" | "europe" | "asia";

export type DashboardBidListing = {
  id: string;
  sourceId: DashboardSourceId;
  material: string;
  category: string;
  location: string;
  quantity: string;
  openingBid: string;
  concentration: string;
  verification: string;
  purityNotes: string;
  availability: string;
  lotSize: DashboardLotSize;
  locationFilter: DashboardLocationFilter;
};

export type DashboardSourceContent = {
  eyebrow: string;
  title: string;
  body: string;
  scrapTypes: string[];
};

export const dashboardMaterialTiles: DashboardMaterialTile[] = [
  {
    id: "hdd",
    title: "Hard Disc Drives",
    subtitle: "Whole HDDs, magnet assemblies, damaged drives, and shredded e-waste fractions",
    image:
      "https://images.unsplash.com/photo-1591799265444-d66432b91588?auto=format&fit=crop&w=1400&q=80",
    accent: "from-[#18344c]/80 via-[#18344c]/30 to-transparent",
    href: "/marketplace?source=hdd",
  },
  {
    id: "auto-motors",
    title: "Auto Motors",
    subtitle: "EV and hybrid traction motors, rotor packs, and e-bike motor recovery streams",
    image:
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1400&q=80",
    accent: "from-[#345b50]/80 via-[#345b50]/30 to-transparent",
    href: "/marketplace?source=auto-motors",
  },
  {
    id: "industrial-motors",
    title: "Industrial Motors",
    subtitle: "BLDC, servo, hub, and wind turbine motor systems from industrial environments",
    image:
      "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=1400&q=80",
    accent: "from-[#8f6d38]/78 via-[#8f6d38]/24 to-transparent",
    href: "/marketplace?source=industrial-motors",
  },
  {
    id: "mri",
    title: "MRI Machines",
    subtitle: "Whole-system recovery pathways for hospital, imaging-center, and deinstalled MRI assets",
    image:
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1400&q=80",
    accent: "from-[#203244]/78 via-[#203244]/24 to-transparent",
    href: "/marketplace?source=mri",
  },
];

export const dashboardSourceContent: Record<DashboardSourceId, DashboardSourceContent> = {
  hdd: {
    eyebrow: "HDD marketplace",
    title: "Hard disc drive recovery streams with repeatable magnet-bearing fractions.",
    body:
      "These lots are designed for buyers sourcing HDD-origin rare-earth-bearing scrap with tighter verification, repeatability, and more structured concentration context.",
    scrapTypes: [
      "Whole HDDs with magnet assemblies",
      "Only extracted magnets",
      "Bent / damaged HDDs",
      "Shredded HDD fractions",
      "Optical cables with Gr.",
    ],
  },
  "auto-motors": {
    eyebrow: "Auto motor marketplace",
    title: "Automotive motor lots tied to transport electrification and small-format mobility.",
    body:
      "These listings focus on motor systems where magnet access, teardown readiness, and composition consistency matter most to recycler utilization.",
    scrapTypes: [
      "EV traction motors",
      "Hybrid traction motors",
      "E-bike motors",
    ],
  },
  "industrial-motors": {
    eyebrow: "Industrial motor marketplace",
    title: "Industrial motor scrap categories spanning automation, appliances, and power systems.",
    body:
      "This view groups industrial-origin motor streams that often require specialized recovery logic, from smaller BLDC units to larger servo and wind systems.",
    scrapTypes: [
      "Accessory BLDC motors (fans / pumps)",
      "E-bike hub motor",
      "Small appliance BLDC",
      "Industrial servo motors",
      "Wind turbine motors",
    ],
  },
  mri: {
    eyebrow: "MRI marketplace",
    title: "MRI recovery lots built around system type, deinstallation readiness, and verification.",
    body:
      "These lots help buyers and recovery teams evaluate MRI-derived material flows with more clarity around system configuration and recovery assumptions.",
    scrapTypes: [
      "Closed-bore superconducting MRI systems",
      "Open MRI systems",
      "Extremity MRI machines",
      "1.5T and 3T hospital imaging units",
    ],
  },
};

export const dashboardBidListings: DashboardBidListing[] = [
  {
    id: "hdd-whole-drive-texas",
    sourceId: "hdd",
    material: "Whole HDD lot with intact magnet assemblies",
    category: "Whole HDD with magnet",
    location: "Texas, USA",
    quantity: "8.2 MT",
    openingBid: "$21,000",
    concentration: "0.45-0.72% NdPr equivalent",
    verification: "Seller verified + photo validated",
    purityNotes: "Mixed enterprise and consumer units, pallet manifest included",
    availability: "Immediate",
    lotSize: "small",
    locationFilter: "usa",
  },
  {
    id: "hdd-magnet-only-illinois",
    sourceId: "hdd",
    material: "Extracted HDD magnet assemblies",
    category: "Only magnets",
    location: "Illinois, USA",
    quantity: "4.8 MT",
    openingBid: "$13,900",
    concentration: "1.2-1.8% NdPr equivalent",
    verification: "Assay-backed + source manifest",
    purityNotes: "Sorted assemblies with low mixed-metal carryover",
    availability: "Immediate",
    lotSize: "small",
    locationFilter: "usa",
  },
  {
    id: "hdd-damaged-ontario",
    sourceId: "hdd",
    material: "Bent and damaged HDD teardown lot",
    category: "Bent / damaged HDDs",
    location: "Ontario, Canada",
    quantity: "6.1 MT",
    openingBid: "$12,600",
    concentration: "0.38-0.61% NdPr equivalent",
    verification: "Business verified",
    purityNotes: "Physical damage documented, teardown notes attached",
    availability: "7 days",
    lotSize: "small",
    locationFilter: "canada",
  },
  {
    id: "hdd-shred-germany",
    sourceId: "hdd",
    material: "Shredded HDD magnet-bearing fraction",
    category: "Shredded HDDs",
    location: "Hamburg, Germany",
    quantity: "18 MT",
    openingBid: "$36,500",
    concentration: "0.22-0.44% recoverable REE content",
    verification: "Sampling complete",
    purityNotes: "Mixed shred source, downstream sorting notes provided",
    availability: "2 weeks",
    lotSize: "mid",
    locationFilter: "europe",
  },
  {
    id: "hdd-optical-japan",
    sourceId: "hdd",
    material: "Optical cables with Gr. recovery bundle",
    category: "Optical cables with Gr.",
    location: "Osaka, Japan",
    quantity: "5.3 MT",
    openingBid: "$14,400",
    concentration: "0.16-0.28% blended REE-bearing fraction",
    verification: "Photo validated",
    purityNotes: "Combined e-waste bundle with operator sort notes",
    availability: "3 weeks",
    lotSize: "small",
    locationFilter: "asia",
  },
  {
    id: "auto-ev-ontario",
    sourceId: "auto-motors",
    material: "EV traction motor inventory",
    category: "EV traction motors",
    location: "Ontario, Canada",
    quantity: "42 units",
    openingBid: "$42,000",
    concentration: "0.9-1.4% NdFeB-bearing magnet content",
    verification: "Verification pack uploaded",
    purityNotes: "Mixed OEM streams from dismantling operations",
    availability: "10 days",
    lotSize: "large",
    locationFilter: "canada",
  },
  {
    id: "auto-hybrid-quebec",
    sourceId: "auto-motors",
    material: "Hybrid traction motor rotor pack lot",
    category: "Hybrid traction motors",
    location: "Quebec, Canada",
    quantity: "9.4 MT",
    openingBid: "$24,800",
    concentration: "0.64-1.05% NdPr equivalent",
    verification: "Verified teardown notes",
    purityNotes: "Rotor and stator mix with pallet manifest attached",
    availability: "1 week",
    lotSize: "mid",
    locationFilter: "canada",
  },
  {
    id: "auto-ebike-california",
    sourceId: "auto-motors",
    material: "Recovered e-bike motor lot",
    category: "E-bike motors",
    location: "California, USA",
    quantity: "5.6 MT",
    openingBid: "$15,800",
    concentration: "0.42-0.78% rare-earth-bearing magnet content",
    verification: "Seller verified",
    purityNotes: "Disassembled units with controller separation complete",
    availability: "Immediate",
    lotSize: "small",
    locationFilter: "usa",
  },
  {
    id: "ind-bldc-ohio",
    sourceId: "industrial-motors",
    material: "Accessory BLDC motor recovery lot",
    category: "Accessory BLDC motors (fans / pumps)",
    location: "Ohio, USA",
    quantity: "7.1 MT",
    openingBid: "$17,900",
    concentration: "0.31-0.58% magnet-bearing fraction",
    verification: "Photo validated + source log",
    purityNotes: "Industrial HVAC and pump motor stream",
    availability: "Immediate",
    lotSize: "small",
    locationFilter: "usa",
  },
  {
    id: "ind-hub-portland",
    sourceId: "industrial-motors",
    material: "E-bike hub motor batch",
    category: "E-bike hub motor",
    location: "Oregon, USA",
    quantity: "4.4 MT",
    openingBid: "$11,600",
    concentration: "0.28-0.51% rare-earth-bearing magnet content",
    verification: "Business verified",
    purityNotes: "Wheel separation complete, batch photos attached",
    availability: "5 days",
    lotSize: "small",
    locationFilter: "usa",
  },
  {
    id: "ind-appliance-japan",
    sourceId: "industrial-motors",
    material: "Small appliance BLDC mixed stream",
    category: "Small appliance BLDC",
    location: "Nagoya, Japan",
    quantity: "11.2 MT",
    openingBid: "$31,400",
    concentration: "0.22-0.46% blended REE-bearing magnet content",
    verification: "Sampling complete",
    purityNotes: "Appliance-origin stream with contamination notes included",
    availability: "3 weeks",
    lotSize: "mid",
    locationFilter: "asia",
  },
  {
    id: "ind-servo-germany",
    sourceId: "industrial-motors",
    material: "Industrial servo motor magnet fraction",
    category: "Industrial servo motors",
    location: "Hamburg, Germany",
    quantity: "24 MT",
    openingBid: "$57,000",
    concentration: "0.61-1.08% NdPr equivalent",
    verification: "Assay pending, photos uploaded",
    purityNotes: "Servo-heavy shred source, downstream sorting notes provided",
    availability: "2 weeks",
    lotSize: "large",
    locationFilter: "europe",
  },
  {
    id: "ind-wind-texas",
    sourceId: "industrial-motors",
    material: "Wind turbine motor sub-assembly lot",
    category: "Wind turbine motors",
    location: "Texas, USA",
    quantity: "16.5 MT",
    openingBid: "$48,200",
    concentration: "0.54-0.96% recoverable REE content",
    verification: "Inspection window available",
    purityNotes: "Large-format motor components, heavy-lift logistics required",
    availability: "21 days",
    lotSize: "large",
    locationFilter: "usa",
  },
  {
    id: "mri-closed-minnesota",
    sourceId: "mri",
    material: "Closed-bore superconducting MRI lot",
    category: "Closed-bore superconducting MRI systems",
    location: "Minnesota, USA",
    quantity: "2 systems",
    openingBid: "$65,000",
    concentration: "0.18-0.37% recoverable REE-bearing sub-components",
    verification: "Dismantling scope attached",
    purityNotes: "Hospital deinstallation package with recovery notes",
    availability: "14 days",
    lotSize: "mid",
    locationFilter: "usa",
  },
  {
    id: "mri-open-arizona",
    sourceId: "mri",
    material: "Open MRI recovery package",
    category: "Open MRI systems",
    location: "Arizona, USA",
    quantity: "1 system",
    openingBid: "$34,500",
    concentration: "0.11-0.24% mixed magnet-bearing content",
    verification: "Seller verified",
    purityNotes: "Deinstalled unit with logistics staging complete",
    availability: "10 days",
    lotSize: "mid",
    locationFilter: "usa",
  },
  {
    id: "mri-extremity-uk",
    sourceId: "mri",
    material: "Extremity MRI equipment bundle",
    category: "Extremity MRI machines",
    location: "Birmingham, UK",
    quantity: "3 units",
    openingBid: "$28,700",
    concentration: "0.09-0.21% recoverable mixed content",
    verification: "Photo validated",
    purityNotes: "Clinical imaging units with documented deinstallation sequence",
    availability: "3 weeks",
    lotSize: "mid",
    locationFilter: "europe",
  },
  {
    id: "mri-highfield-japan",
    sourceId: "mri",
    material: "1.5T and 3T imaging unit recovery lot",
    category: "1.5T and 3T hospital imaging units",
    location: "Osaka, Japan",
    quantity: "2 systems",
    openingBid: "$48,500",
    concentration: "0.22-0.41% recoverable REE-bearing fractions",
    verification: "Buyer pre-inspection available",
    purityNotes: "High-field systems with service history summary attached",
    availability: "21 days",
    lotSize: "mid",
    locationFilter: "asia",
  },
];
