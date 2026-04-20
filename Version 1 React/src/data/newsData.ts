export type NewsCard = {
  badge: string;
  title: string;
  body: string;
  meta: string;
  image: string;
  href?: string;
};

export type CommodityTicker = {
  label: string;
  venue: string;
  value: string;
  move: string;
  tone: string;
  note: string;
};

export const commodityTickers: CommodityTicker[] = [
  {
    label: "Copper cathode",
    venue: "COMEX benchmark",
    value: "$4.38/lb",
    move: "+1.2%",
    tone: "text-[#2f7c62]",
    note: "Tighter fabrication demand and steadier North American buying.",
  },
  {
    label: "HRC steel",
    venue: "Midwest index",
    value: "$812/st",
    move: "+0.6%",
    tone: "text-[#2f7c62]",
    note: "Mill lead times remain constructive for industrial scrap pricing.",
  },
  {
    label: "NdPr oxide",
    venue: "RER market desk",
    value: "$57.8/kg",
    move: "+4.2%",
    tone: "text-[#9a7337]",
    note: "Magnet feedstock sentiment remains strongest in transport and robotics.",
  },
];

export const articleCards: NewsCard[] = [
  {
    badge: "Public announcement",
    title: "White House proclamation on processed critical minerals imports",
    body: "Recent federal signaling ties processed critical mineral dependence directly to industrial resilience and domestic capacity priorities.",
    meta: "Policy signal | The White House",
    href: "https://www.whitehouse.gov/presidential-actions/2026/01/adjusting-imports-of-processed-critical-minerals-and-their-derivative-products-into-the-united-states/",
    image:
      "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?auto=format&fit=crop&w=1400&q=80",
  },
  {
    badge: "REO market note",
    title: "NdPr pricing remains the signal most recyclers watch",
    body: "Rare earth oxide movements continue to shape bid behavior for magnet-bearing motors, HDD assemblies, and intermediate magnet scrap.",
    meta: "Market intelligence | Rare Earth Rescue",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80",
  },
  {
    badge: "Industry article",
    title: "Sorting rare earth motors without opening them",
    body: "Newer sorting methods are improving how operators identify REE-bearing motor streams before teardown, helping recovery economics.",
    meta: "Technology signal | Scientific Reports",
    href: "https://www.nature.com/articles/s41598-025-94667-x",
    image:
      "https://images.unsplash.com/photo-1581091870622-2cf1f3c71f54?auto=format&fit=crop&w=1400&q=80",
  },
  {
    badge: "Customer perspective",
    title: "“We were likely underpricing magnet-bearing scrap before specialist demand was visible.”",
    body: "Recovery operators use better buyer visibility to separate valuable rare-earth-bearing material from generic mixed industrial scrap.",
    meta: "Operator feedback | Recovery partner",
    image:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80",
  },
];
