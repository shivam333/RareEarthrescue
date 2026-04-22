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
    badge: "Strategy report",
    title: "McKinsey: Powering the energy transition’s motor: Circular rare earth elements",
    body: "McKinsey frames postconsumer rare earth magnet scrap as an emerging supply pool, especially as EVs, wind turbines, MRIs, and industrial motors reach end of life.",
    meta: "McKinsey | July 24, 2025",
    href: "https://www.mckinsey.com/industries/metals-and-mining/our-insights/powering-the-energy-transitions-motor-circular-rare-earth-elements",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80",
  },
  {
    badge: "Policy signal",
    title: "White House Section 232 action on processed critical minerals",
    body: "The White House tied processed critical minerals directly to national security and resilient domestic manufacturing, reinforcing the strategic case for local circular recovery.",
    meta: "The White House | April 15, 2025",
    href: "https://www.whitehouse.gov/presidential-actions/2025/04/ensuring-national-security-and-economic-resilience-through-section-232-actions-on-processed-critical-minerals-and-derivative-products/?query-11-page=3",
    image:
      "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?auto=format&fit=crop&w=1400&q=80",
  },
  {
    badge: "Technology research",
    title: "Sorting rare earth magnet motors for recycling without opening the motors",
    body: "Scientific Reports describes a two-step screening method that improves how operators identify REE-bearing motors before teardown and unnecessary labor cost.",
    meta: "Scientific Reports | April 10, 2025",
    href: "https://www.nature.com/articles/s41598-025-94667-x",
    image:
      "https://images.unsplash.com/photo-1581091870622-2cf1f3c71f54?auto=format&fit=crop&w=1400&q=80",
  },
  {
    badge: "Funding and scale-up",
    title: "DOE announces $134 million to strengthen rare earth element supply chains",
    body: "DOE is explicitly backing commercial pathways that recover and refine rare earths from unconventional feedstocks including e-waste, tailings, and industrial residues.",
    meta: "U.S. Department of Energy | December 1, 2025",
    href: "https://www.energy.gov/articles/energy-department-announces-134-million-funding-strengthen-rare-earth-element-supply",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80",
  },
  {
    badge: "E-scrap tech",
    title: "DOE E-SCRAP Prize winners push critical material recovery from electronics waste",
    body: "DOE’s electronics-scrap program highlights how HDDs, devices, and embedded magnets are becoming a more serious rare earth recovery stream.",
    meta: "U.S. Department of Energy | January 8, 2025",
    href: "https://www.energy.gov/node/4848137",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
  },
];
