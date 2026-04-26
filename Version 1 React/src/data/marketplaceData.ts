export type Listing = {
  id: string;
  title: string;
  category: string;
  quantity: string;
  location: string;
  form: string;
  sellerType: string;
  sellerName: string;
  verification: string;
  availableDate: string;
  price: string;
  concentration: string;
  notes: string;
  logistics: string;
  assay: string;
  sourceIndustry: string;
  images: string[];
};

export type PricingWidget =
  | {
      label: string;
      value: string;
      type: "line";
      series: number[];
    }
  | {
      label: string;
      value: string;
      type: "bar";
      series: number[];
    }
  | {
      label: string;
      value: string;
      type: "list";
      points: { label: string; value: string }[];
    }
  | {
      label: string;
      value: string;
      type: "map";
    };

export const navItems = [
  { label: "Home", href: "/" },
  { label: "Our Offerings", href: "/our-offerings" },
  { label: "About", href: "/about" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
];

export const heroStats = [
  { value: 420, label: "verified suppliers" },
  { value: 165, label: "recycler buyers" },
  { value: 12, label: "feedstock categories" },
  { value: 84, label: "USD millions matched volume" },
  { value: 23, label: "countries served" },
];

export const problemCards = [
  {
    index: "01",
    title: "Fragmented feedstock supply",
    copy: "Rare-earth-bearing scrap is spread across scrapyards, dismantlers, ITAD firms, e-waste networks, and industrial processors.",
  },
  {
    index: "02",
    title: "Inconsistent characterization",
    copy: "Valuable material is frequently under-described, inconsistently graded, or buried inside mixed industrial and e-waste streams.",
  },
  {
    index: "03",
    title: "Procurement inefficiency",
    copy: "Recyclers and refiners struggle to discover steady supply, while suppliers lack transparent access to specialist buyers.",
  },
  {
    index: "04",
    title: "Strategic urgency",
    copy: "Critical mineral circularity is becoming central to supply-chain resilience, magnet demand growth, and industrial policy.",
  },
];

export const workflowTabs = {
  suppliers: [
    {
      step: "1",
      title: "Upload feedstock",
      copy: "List material, quantity, photos, packaging, location, and composition estimates in a structured workflow.",
    },
    {
      step: "2",
      title: "Add technical context",
      copy: "Capture source industry, form factor, assay status, contamination notes, and logistics assumptions.",
    },
    {
      step: "3",
      title: "Receive bids or matches",
      copy: "Verified recyclers engage through procurement requests, bids, or sourcing conversations tied to the lot.",
    },
    {
      step: "4",
      title: "Coordinate transaction",
      copy: "Move into logistics, documentation, and order management with better visibility and reduced friction.",
    },
  ],
  recyclers: [
    {
      step: "1",
      title: "Search and filter supply",
      copy: "Source by material type, quantity, geography, verification level, and expected concentration profile.",
    },
    {
      step: "2",
      title: "Review quality signals",
      copy: "Assess assays, source industry, form factor, contamination notes, and seller credibility before bidding.",
    },
    {
      step: "3",
      title: "Submit bid or request",
      copy: "Send price, procurement conditions, logistics requirements, and preferred batch assumptions.",
    },
    {
      step: "4",
      title: "Track delivery and settlement",
      copy: "Follow lots through pickup, chain of custody, delivery, and final settlement with document support.",
    },
  ],
};

export const feedstockCategories = [
  {
    title: "NdFeB magnets",
    subtitle: "High-value magnet feedstock",
    content: [
      "Typical rare earth content: NdPr-bearing magnet fractions",
      "Common source industries: EVs, robotics, HDDs, wind systems",
      "Form factors: loose magnets, assemblies, swarf, offcuts",
      "Processing note: coatings, adhesives, and mixed grades matter",
    ],
  },
  {
    title: "SmCo magnets",
    subtitle: "Specialty magnetic materials",
    content: [
      "Typical source industries: aerospace, sensors, industrial controls",
      "Form factors: broken magnets, manufacturing scrap, precision offcuts",
      "Quality variability: batch purity and contamination can vary sharply",
      "Processing note: lower volume but strategically important",
    ],
  },
  {
    title: "Electric motors",
    subtitle: "Embedded magnet supply",
    content: [
      "Source industries: automotive, appliances, industrial equipment",
      "Form factors: whole motor, rotor, stator, dismantled fractions",
      "Quality variability: magnet accessibility and copper crossover",
      "Processing note: commercial value depends on teardown readiness",
    ],
  },
  {
    title: "Hard disk drives",
    subtitle: "Repeatable e-waste streams",
    content: [
      "Source industries: ITAD, data center decommissioning, e-waste aggregation",
      "Form factors: assemblies, depopulated units, mixed HDD fractions",
      "Quality variability: adhesives, plating, mixed device streams",
      "Processing note: often attractive for repeat procurement programs",
    ],
  },
  {
    title: "Automotive traction motors",
    subtitle: "High-interest EV category",
    content: [
      "Source industries: auto dismantling, warranty recovery, salvage",
      "Form factors: whole unit, rotor packs, dismantled magnets",
      "Quality variability: OEM mix, extraction complexity, batch consistency",
      "Processing note: one of the most strategically watched categories",
    ],
  },
  {
    title: "Industrial sludge / powders / fines",
    subtitle: "Intermediate materials",
    content: [
      "Source industries: magnet manufacturing, polishing, filtration",
      "Form factors: sludge, powders, fines, captured particulate",
      "Quality variability: moisture and contamination are critical",
      "Processing note: assay-backed procurement is typically required",
    ],
  },
];

export const listings: Listing[] = [
  {
    id: "ndfeb-texas-18mt",
    title: "NdFeB Magnet Scrap - 18 MT - Texas, USA",
    category: "NdFeB magnets",
    quantity: "18 MT",
    location: "Houston, Texas, USA",
    form: "Loose magnets and extracted assemblies",
    sellerType: "Auto dismantler",
    sellerName: "Lone Star Circular Metals",
    verification: "Seller + assay verified",
    availableDate: "Immediate",
    price: "Indicative price on request",
    concentration: "NdPr-rich permanent magnet fraction",
    notes: "Traction motor derived, palletized, repeat batch potential.",
    logistics: "Pickup coordination available",
    assay: "Third-party laboratory assay uploaded",
    sourceIndustry: "Automotive traction motors",
    images: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1581092335397-9fa341108f98?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: "traction-ontario-42units",
    title: "Mixed Traction Motor Feedstock - 42 units - Ontario, Canada",
    category: "Traction motors",
    quantity: "42 units",
    location: "Ontario, Canada",
    form: "Whole motors",
    sellerType: "Auto dismantler",
    sellerName: "Northern EV Recovery",
    verification: "Business verified",
    availableDate: "10 days",
    price: "Request bid",
    concentration: "Mixed traction motor profiles",
    notes: "Mixed OEM streams from dismantling operations.",
    logistics: "Freight support available",
    assay: "Composition estimate provided",
    sourceIndustry: "EV salvage and dismantling",
    images: [
      "https://images.unsplash.com/photo-1581092919535-7146ff1a5902?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581092160618-17f72f9d0d8c?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: "hdd-illinois-65mt",
    title: "HDD Magnet Assemblies - 6.5 MT - Illinois, USA",
    category: "Hard disk drives",
    quantity: "6.5 MT",
    location: "Illinois, USA",
    form: "Sorted HDD magnet assemblies",
    sellerType: "ITAD firm",
    sellerName: "Midwest Data Recovery Exchange",
    verification: "Photo validated",
    availableDate: "Immediate",
    price: "Indicative bid range available",
    concentration: "Repeatable HDD-derived magnet content",
    notes: "Recurring monthly availability from decommissioning programs.",
    logistics: "Regional consolidation offered",
    assay: "Historical assay references available",
    sourceIndustry: "ITAD and e-waste aggregation",
    images: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: "motor-germany-24mt",
    title: "Shredded Motor Fraction with REE-bearing Magnets - 24 MT - Germany",
    category: "Motor shred fraction",
    quantity: "24 MT",
    location: "Hamburg, Germany",
    form: "Shredded fraction",
    sellerType: "Industrial scrap processor",
    sellerName: "Rhine Industrial Materials",
    verification: "Seller verified",
    availableDate: "2 weeks",
    price: "Request bid",
    concentration: "Estimated REE-bearing mixed shred output",
    notes: "Assay requested; batch photos and shred source notes provided.",
    logistics: "Cross-border support available",
    assay: "Pending",
    sourceIndustry: "Industrial motors and downstream sorting",
    images: [
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581092160607-ee22731f1d53?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: "smco-japan-21mt",
    title: "SmCo Magnet Manufacturing Scrap - 2.1 MT - Japan",
    category: "SmCo magnets",
    quantity: "2.1 MT",
    location: "Nagoya, Japan",
    form: "Manufacturing offcuts",
    sellerType: "Magnet manufacturing scrap generator",
    sellerName: "Tokai Magnet Components",
    verification: "Assay verified",
    availableDate: "30 days",
    price: "Indicative range available",
    concentration: "Tight composition band",
    notes: "Premium specialty scrap with narrow variance and batch traceability.",
    logistics: "Export documentation support",
    assay: "Full lab package available",
    sourceIndustry: "Precision magnet manufacturing",
    images: [
      "https://images.unsplash.com/photo-1581092334394-2f5adab4c31d?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=900&q=80",
    ],
  },
];

export const pricingWidgets: PricingWidget[] = [
  {
    label: "monthly listed tonnage",
    value: "142 MT",
    series: [154, 148, 132, 118, 110, 94, 78, 70, 58],
    type: "line" as const,
  },
  {
    label: "average bid spread",
    value: "8.7%",
    series: [60, 78, 94, 102, 86],
    type: "bar" as const,
  },
  {
    label: "top demanded categories",
    value: "NdFeB",
    points: [
      { label: "NdFeB magnet scrap", value: "31 bids" },
      { label: "Traction motor feedstock", value: "26 bids" },
      { label: "HDD magnet assemblies", value: "19 bids" },
    ],
    type: "list" as const,
  },
  {
    label: "active listings by region",
    value: "North America",
    type: "map" as const,
  },
];

export const trustItems = [
  "Verified buyer and seller onboarding",
  "KYC and business verification",
  "Material classification standards",
  "Assay and sampling support",
  "Photo and document validation",
  "Chain-of-custody visibility",
  "Sustainability and traceability reporting",
];

export const logisticsSteps = [
  { title: "Listing", copy: "Structured upload, media package, composition notes, and lot readiness." },
  { title: "Pickup", copy: "Freight coordination, pickup scheduling, and cross-border sourcing support." },
  { title: "Delivery", copy: "Batch consolidation, documentation, and receiving workflows." },
  { title: "Settlement", copy: "Secure payment, milestone terms, contracting, and order management." },
];

export const participantTabs = [
  {
    id: "auto",
    label: "Auto dismantlers",
    title: "Auto dismantlers",
    painPoint: "EV traction motors and embedded magnets are often sold without enough buyer-specific context.",
    value: "Structured listing templates and direct access to specialist recyclers increase pricing confidence.",
    useCase: "List 42 mixed traction motors and route them to verified buyers with motor-specific sourcing profiles.",
  },
  {
    id: "ewaste",
    label: "E-waste recyclers",
    title: "E-waste recyclers",
    painPoint: "HDD assemblies and magnet-bearing electronics are frequently aggregated too generically.",
    value: "Repeat listing workflows and category-aware discovery improve buyer fit and repeat demand.",
    useCase: "Offer recurring HDD magnet assembly lots from decommissioning programs with photo validation and historical assays.",
  },
  {
    id: "motor",
    label: "Motor recyclers",
    title: "Motor recyclers",
    painPoint: "Motor-derived fractions vary materially by source industry, dismantling stage, and contamination level.",
    value: "Assay-linked metadata and saved search logic reduce procurement waste and improve targeting.",
    useCase: "Save searches for REE-bearing shred fractions with logistics support and minimum lot thresholds.",
  },
  {
    id: "oem",
    label: "OEM procurement",
    title: "OEM procurement teams",
    painPoint: "Secondary rare earth sourcing lacks visibility, consistency, and traceable market access.",
    value: "Marketplace intelligence and verified secondary flows support resilience and ESG sourcing narratives.",
    useCase: "Track regional availability of magnet scrap and benchmark secondary procurement pathways by category.",
  },
];

export const testimonials = [
  {
    quote:
      "Rare Earth Rescue gave us a serious route to specialist buyers for HDD and magnet-bearing e-waste streams we used to sell too generically.",
    name: "Evan Clark",
    role: "Operations Director, Midwest ITAD Network",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
  },
  {
    quote:
      "The value is not just discovery. It is the structure around assay data, logistics assumptions, and verified counterparties.",
    name: "Maya Sato",
    role: "Procurement Lead, Magnet Recycling Company",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
  },
  {
    quote:
      "For industrial sustainability teams, secondary rare earth sourcing becomes much more actionable when the data and counterparties are organized.",
    name: "Northline Manufacturing",
    role: "Circularity Program Manager, Industrial OEM",
    image: "https://logo.clearbit.com/siemens.com",
  },
  {
    quote:
      "The platform helps us translate fragmented motor and magnet supply into a real procurement pipeline rather than an unstructured inbox.",
    name: "Daniel Reyes",
    role: "Commercial Lead, Rare Earth Processor",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
  },
];

export const partnerLogos = ["Partner Recycler", "OEM Network", "ITAD Group", "Scrap Alliance"];

export const supplierSteps = [
  {
    title: "Company profile",
    copy: "Business identity, facilities, and operating footprint.",
  },
  {
    title: "Material streams",
    copy: "Categories handled, form factors, and listing readiness.",
  },
  {
    title: "Compliance",
    copy: "Verification, documents, and primary commercial contacts.",
  },
  {
    title: "Go live",
    copy: "Review and activate your first listing.",
  },
];

export const recyclerSteps = [
  {
    title: "Business verification",
    copy: "Company, permits, compliance, and procurement team setup.",
  },
  {
    title: "Capability profile",
    copy: "Materials handled, process fit, and contamination thresholds.",
  },
  {
    title: "Buying preferences",
    copy: "Regions, quantities, logistics assumptions, and assay standards.",
  },
  {
    title: "Marketplace access",
    copy: "Saved searches, watchlists, and sourcing alerts.",
  },
];

export const dashboardViews = {
  supplier: [
    {
      title: "Active listings",
      value: "14",
      items: [
        { label: "NdFeB magnet scrap", value: "4 lots" },
        { label: "Motor feedstock", value: "6 lots" },
        { label: "HDD assemblies", value: "4 lots" },
      ],
    },
    {
      title: "Bids received",
      value: "31",
      chart: [140, 136, 126, 106, 98, 86, 74, 66, 54],
    },
    {
      title: "Lots in diligence",
      value: "8",
      items: [
        { label: "Assay review pending", value: "3" },
        { label: "Logistics quote requested", value: "2" },
        { label: "Contract review", value: "3" },
      ],
    },
  ],
  recycler: [
    {
      title: "Saved searches",
      value: "22",
      items: [
        { label: "NdFeB loose magnets", value: "North America" },
        { label: "Motor shred fractions", value: "Europe" },
        { label: "SmCo manufacturing scrap", value: "Global" },
      ],
    },
    {
      title: "Open bids",
      value: "11",
      items: [
        { label: "Average bid spread", value: "7.8%" },
        { label: "Highest urgency lot", value: "Texas NdFeB" },
        { label: "Cross-border shipments", value: "4" },
      ],
    },
    {
      title: "Watchlist tonnage",
      value: "93 MT",
      bars: [48, 64, 88, 98, 76],
    },
  ],
};
