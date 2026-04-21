export type AuthRole = "recycler" | "supplier";
export type PlanSlug = "one-time-order" | "subscription";
export type AuthPlanType = "free" | "subscription";

export type PlanVariant = {
  shortLabel: string;
  title: string;
  summary: string;
  bullets: string[];
  detailTitle: string;
  detailSummary: string;
  bestFor: string[];
  workflow: { title: string; copy: string }[];
};

export type PlanCardConfig = {
  id: "one-time-order" | "subscription" | "enterprise";
  shortLabel: string;
  title: string;
  progression: string;
  summary: string;
  cta: string;
  featured?: boolean;
  planType?: AuthPlanType;
  variants?: Record<AuthRole, PlanVariant>;
  bullets?: string[];
};

export const roleLabels: Record<AuthRole, string> = {
  recycler: "Recycler",
  supplier: "Supplier",
};

export const planCards: PlanCardConfig[] = [
  {
    id: "one-time-order",
    shortLabel: "Start fast",
    title: "One-Time Order",
    progression: "Best for a first transaction",
    summary: "Move a targeted lot with guided execution and low commitment.",
    cta: "Start one-time access",
    planType: "free",
    variants: {
      recycler: {
        shortLabel: "Recycler",
        title: "One-time procurement path",
        summary: "Bid on a targeted opportunity with guided execution and delivery support.",
        bullets: [
          "Place bids on targeted opportunities",
          "Guided delivery coordination",
          "Critical delivery support available",
          "Assay and composition visibility",
          "Managed logistics with handling fee",
          "No live marketplace or commodity intelligence access",
        ],
        detailTitle: "Use one-time access when a recycler needs a specific lot without committing to a recurring workflow.",
        detailSummary:
          "This path is built for buyers testing Rare Earth Rescue, filling a near-term plant need, or securing a single opportunity that still requires technical and logistics support.",
        bestFor: [
          "A focused procurement need with defined tonnage or chemistry",
          "A first transaction before moving into recurring sourcing",
          "Teams that want structured delivery support without a subscription",
        ],
        workflow: [
          {
            title: "Review a targeted lot",
            copy: "See the opportunity, assess assay context, and confirm whether the feedstock fits your recovery line.",
          },
          {
            title: "Place a guided bid",
            copy: "Submit pricing and delivery intent with support around timing, handling, and buyer coordination.",
          },
          {
            title: "Coordinate delivery",
            copy: "Rare Earth Rescue supports freight coordination and critical delivery oversight for the transaction.",
          },
          {
            title: "Close and learn",
            copy: "Complete the order, evaluate fit, and decide whether repeat activity warrants subscription access.",
          },
        ],
      },
      supplier: {
        shortLabel: "Supplier",
        title: "One-time sell-side path",
        summary: "Post a single opportunity and move it through a guided sale workflow.",
        bullets: [
          "Post a live feedstock opportunity",
          "Guided pickup assignment",
          "Payment after sale confirmation",
          "Manual BOM and composition entry",
          "Managed logistics with handling fee",
          "No commodity intelligence or bidding tools",
        ],
        detailTitle: "Use one-time access when a supplier wants to test the market with a single lot or a one-off disposal event.",
        detailSummary:
          "This path is built for scrappers, dismantlers, ITAD operators, and industrial salvage teams that need a structured sale without committing to a recurring program.",
        bestFor: [
          "A first transaction through Rare Earth Rescue",
          "A one-off lot of rare-earth-bearing scrap that needs specialist buyers",
          "Teams that prefer guided execution before moving into recurring sell-side programs",
        ],
        workflow: [
          {
            title: "Post the opportunity",
            copy: "Upload the lot with media, quantity, source notes, and any available composition information.",
          },
          {
            title: "Validate technical detail",
            copy: "Use a guided workflow to capture BOM, magnet-bearing components, and handling assumptions.",
          },
          {
            title: "Match and assign pickup",
            copy: "Rare Earth Rescue routes the opportunity, coordinates buyer engagement, and supports pickup planning.",
          },
          {
            title: "Confirm sale and payment",
            copy: "Settlement follows sale confirmation with managed logistics and transaction-level support.",
          },
        ],
      },
    },
  },
  {
    id: "subscription",
    shortLabel: "Scale repeat activity",
    title: "Subscription",
    progression: "Recommended for repeat operators",
    summary: "Unlock recurring access, stronger intelligence, and deeper workflow support.",
    cta: "Create subscription account",
    featured: true,
    planType: "subscription",
    variants: {
      recycler: {
        shortLabel: "Recycler",
        title: "Recurring procurement path",
        summary: "Designed for buyers who need steady discovery, direct pricing, and repeat sourcing workflows.",
        bullets: [
          "Access live feedstock listings",
          "Submit buy prices directly",
          "Commodity analytics and supply hotspots",
          "Fixed feedstock supply contracts",
          "No handling fee",
          "Designed for recurring procurement workflows",
        ],
        detailTitle: "Subscription is the right fit when recycler utilization depends on repeat sourcing and better market visibility.",
        detailSummary:
          "This path supports refiners, magnet recyclers, and recovery operators that need recurring access to fragmented supply, pricing signals, and structured commercial workflows.",
        bestFor: [
          "Facilities that need repeat feedstock visibility to avoid idle capacity",
          "Procurement teams that want direct pricing and recurring supplier relationships",
          "Operators ready to move from one-off bids into ongoing sourcing programs",
        ],
        workflow: [
          {
            title: "Monitor live supply",
            copy: "Track active listings, supply hotspots, and category-specific opportunities through the marketplace.",
          },
          {
            title: "Engage directly",
            copy: "Submit buy prices, negotiate commercial terms, and move faster on qualified opportunities.",
          },
          {
            title: "Build repeat flow",
            copy: "Move beyond one-off orders into recurring supplier relationships and fixed feedstock arrangements.",
          },
          {
            title: "Operate with intelligence",
            copy: "Use commodity context and category trends to support planning, pricing, and plant utilization.",
          },
        ],
      },
      supplier: {
        shortLabel: "Supplier",
        title: "Recurring sell-side path",
        summary: "Best for sellers running repeat lots, faster operations, and more structured buyer engagement.",
        bullets: [
          "Run up to 3 live bidding workflows",
          "Schedule pickups directly",
          "Access commodity intelligence",
          "No handling fee",
          "Faster post-sale payment flow",
          "BOM and composition autofill from images and existing data",
          "Managed recurring contracts",
        ],
        detailTitle: "Subscription is built for suppliers who generate repeat recovery opportunities and want a faster, more informed sell-side workflow.",
        detailSummary:
          "This path supports operators moving regular lots and needing stronger listing tools, less manual entry, and better visibility into pricing and buyer demand.",
        bestFor: [
          "Suppliers listing multiple rare-earth-bearing opportunities over time",
          "Teams that want faster payment flow and less manual listing work",
          "Operators ready to run repeat bidding workflows and structured contracts",
        ],
        workflow: [
          {
            title: "Launch recurring listings",
            copy: "Run multiple live workflows at once with better structure around categories, lots, and buyer response.",
          },
          {
            title: "Automate technical detail",
            copy: "Use BOM and composition autofill from images and prior listing data to reduce manual work.",
          },
          {
            title: "Schedule operations directly",
            copy: "Coordinate pickups faster, move into repeat contracts, and reduce transaction friction.",
          },
          {
            title: "Scale with market context",
            copy: "Use commodity intelligence and buyer signals to guide how and when material goes to market.",
          },
        ],
      },
    },
  },
  {
    id: "enterprise",
    shortLabel: "Move into tailored services",
    title: "Custom Enterprise Solutions",
    progression: "For complex operators and programs",
    summary:
      "Tailored support for managed sourcing, structured sell-side programs, and multi-site commercial workflows.",
    cta: "Talk to our team",
    bullets: [
      "Managed sourcing or sell-side programs",
      "Custom commercial models",
      "Cross-region logistics coordination",
      "Batch consolidation and workflow design",
      "High-touch onboarding and advisory",
      "Tailored support for multi-site operators",
    ],
  },
];

export const comparisonHelperItems = [
  {
    id: "one-time",
    question: "When should I start with one-time?",
    answer:
      "Start here when the goal is to move a single opportunity quickly, test the network, or handle a targeted procurement or sale without committing to recurring access.",
  },
  {
    id: "subscription",
    question: "When should I move to subscription?",
    answer:
      "Move to subscription when recovery activity becomes repeatable, when your team needs recurring visibility, or when better intelligence and lower friction start to matter every month.",
  },
  {
    id: "enterprise",
    question: "Do I need enterprise solutions?",
    answer:
      "Choose enterprise support when operating complexity increases across sites, regions, logistics lanes, or custom commercial structures that need a tailored program.",
  },
];

export const planRouteMap: Record<PlanSlug, AuthPlanType> = {
  "one-time-order": "free",
  subscription: "subscription",
};

export function getPlanDetailPath(plan: PlanSlug, role: AuthRole) {
  return `/plans/${plan}/${role}`;
}

export function getPlanCardBySlug(plan: PlanSlug) {
  return planCards.find((card) => card.id === plan);
}
