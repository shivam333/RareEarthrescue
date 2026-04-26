export type AuthRole = "recycler" | "supplier";
export type PlanSlug = "one-time-order" | "subscription";
export type AuthPlanType = "free" | "subscription";
export type PlanBulletTone = "positive" | "negative";
export type PlanBullet = {
  text: string;
  tone: PlanBulletTone;
};

export type PlanVariant = {
  shortLabel: string;
  title: string;
  summary: string;
  bullets: PlanBullet[];
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
  priceLabel?: string;
  summary: string;
  cta: string;
  featured?: boolean;
  planType?: AuthPlanType;
  variants?: Record<AuthRole, PlanVariant>;
  bullets?: PlanBullet[];
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
    priceLabel: "Per transaction",
    summary: "Target one opportunity with guided execution and minimal commitment.",
    cta: "Start one-time access",
    planType: "free",
    variants: {
      recycler: {
        shortLabel: "Recycler",
        title: "One-time procurement path",
        summary: "Bid on one qualified lot without committing to recurring marketplace access.",
        bullets: [
          { text: "Access live feedstock listings", tone: "positive" },
          { text: "Place bids on targeted lots", tone: "positive" },
          { text: "Assay and composition visibility", tone: "positive" },
          { text: "1% shipment handling fee", tone: "negative" },
          { text: "Due diligence packs at $79 each", tone: "negative" },
          { text: "No smart commodity analytics", tone: "negative" },
        ],
        detailTitle: "Use one-time access when a recycler needs a specific lot without stepping into a recurring sourcing program.",
        detailSummary:
          "Built for buyers testing Rare Earth Rescue, filling a near-term plant need, or securing a single opportunity with structured visibility but lighter platform depth.",
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
        summary: "Move a single sell-side lot through a guided workflow with lighter tooling.",
        bullets: [
          { text: "Run up to 3 live bidding workflows at a time", tone: "positive" },
          { text: "No commodity intelligence or bidding tools", tone: "negative" },
          { text: "Manual BOM and composition entry", tone: "negative" },
          { text: "Guided pickup assignment", tone: "negative" },
        ],
        detailTitle: "Use one-time access when a supplier wants to test the market with a single lot or one-off disposal event.",
        detailSummary:
          "Built for scrappers, dismantlers, ITAD operators, and industrial salvage teams that need a structured sale without ongoing subscription tools.",
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
    priceLabel: "$599 / month",
    summary: "Unlock recurring access, richer intelligence, and deeper workflow support.",
    cta: "Create subscription account",
    featured: true,
    planType: "subscription",
    variants: {
      recycler: {
        shortLabel: "Recycler",
        title: "Recurring procurement path",
        summary: "Built for buyers who need steady discovery, direct pricing, and repeat sourcing depth.",
        bullets: [
          { text: "Access the feedstock recommender", tone: "positive" },
          { text: "Access live listings and closed auction events", tone: "positive" },
          { text: "Assay and composition visibility", tone: "positive" },
          { text: "No handling fee", tone: "positive" },
          { text: "10 free due diligence packs", tone: "positive" },
          { text: "Commodity analytics and supply hotspots", tone: "positive" },
        ],
        detailTitle: "Subscription fits when recycler utilization depends on repeat sourcing and better market visibility.",
        detailSummary:
          "This path supports refiners, magnet recyclers, and recovery operators that need recurring access to fragmented supply, closed-event opportunities, and structured commercial workflows.",
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
        summary: "Built for sellers running repeat lots with better automation and market visibility.",
        bullets: [
          { text: "Post live feedstock opportunities and active catalogs", tone: "positive" },
          { text: "Commodity intelligence and sales analytics", tone: "positive" },
          { text: "BOM and composition autofill from images and existing data", tone: "positive" },
          { text: "Schedule pickups directly", tone: "positive" },
        ],
        detailTitle: "Subscription is built for suppliers generating repeat recovery opportunities and wanting a faster, more informed sell-side workflow.",
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
    priceLabel: "Custom engagement",
    summary:
      "Tailored support for managed sourcing, structured sell-side programs, and multi-site commercial workflows.",
    cta: "Talk to our team",
    bullets: [
      { text: "Custom commercial models", tone: "positive" },
      { text: "Cross-region logistics coordination", tone: "positive" },
      { text: "Batch consolidation and workflow design", tone: "positive" },
      { text: "High-touch onboarding and advisory", tone: "positive" },
      { text: "Tailored support for multi-site operators", tone: "positive" },
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
