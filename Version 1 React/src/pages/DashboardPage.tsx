import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MaterialTileGrid } from "../components/dashboard/MaterialTileGrid";
import {
  dashboardBidListings,
  dashboardMaterialTiles,
  dashboardSourceContent,
  DashboardSourceId,
} from "../data/dashboardMarketplaceData";
import { pageEnter } from "../lib/motion";

const pageMotionProps = {
  variants: pageEnter,
  initial: "hidden" as const,
  animate: "visible" as const,
  exit: "exit" as const,
};

const demandMappings = [
  {
    keywords: ["ndfeb", "ndpr", "magnet", "permanent magnet", "rare earth magnet"],
    title: "NdFeB and NdPr output demand",
    body:
      "Prioritize magnet-rich streams with tighter verification and repeat recovery logic.",
    sourceIds: ["hdd", "auto-motors", "industrial-motors"] as DashboardSourceId[],
    feedstocks: ["Whole HDDs with magnets", "EV traction motors", "Industrial servo motors"],
    bidHint: "Expect stronger bid tension on verified motor and HDD lots with cleaner extraction pathways.",
  },
  {
    keywords: ["samarium", "smco", "cobalt"],
    title: "SmCo and specialty magnet demand",
    body:
      "Target higher-spec industrial and specialty equipment where magnet chemistry is more specialized.",
    sourceIds: ["industrial-motors", "other-items", "mri"] as DashboardSourceId[],
    feedstocks: ["Industrial actuators", "Robotic arm assemblies", "MRI subassemblies"],
    bidHint: "Use diligence packs early because chemistry confirmation matters more than bulk volume.",
  },
  {
    keywords: ["copper", "winding", "electrical steel"],
    title: "Copper-rich motor recovery demand",
    body:
      "Focus on motor-heavy flows where copper recovery and magnet extraction happen together.",
    sourceIds: ["auto-motors", "industrial-motors"] as DashboardSourceId[],
    feedstocks: ["Hybrid traction motors", "Accessory BLDC motors", "Wind turbine motors"],
    bidHint: "Bid based on total recoverable value, not only rare-earth concentration.",
  },
  {
    keywords: ["dysprosium", "terbium", "high temperature"],
    title: "High-temperature magnet alloy demand",
    body:
      "Look toward transport and industrial magnet systems that need higher thermal stability.",
    sourceIds: ["auto-motors", "industrial-motors", "mri"] as DashboardSourceId[],
    feedstocks: ["EV traction motors", "Industrial servo motors", "MRI machine components"],
    bidHint: "Favor listings with stronger verification and tighter batch documentation.",
  },
];

const extractionMappings = [
  {
    keywords: ["hdd", "hard drive", "data center", "drive"],
    title: "HDD extraction profile",
    metals: ["NdPr magnet material", "Steel", "Aluminum", "Copper"],
    output:
      "HDD-origin lots are strongest for magnet recovery plus clean ferrous and aluminum fractions.",
    sourceId: "hdd" as DashboardSourceId,
  },
  {
    keywords: ["ev", "hybrid", "traction motor", "e-bike", "auto motor"],
    title: "Automotive motor extraction profile",
    metals: ["NdPr magnet material", "Copper", "Electrical steel", "Aluminum"],
    output:
      "Motor-heavy streams can support both rare-earth recovery and meaningful copper value capture.",
    sourceId: "auto-motors" as DashboardSourceId,
  },
  {
    keywords: ["servo", "industrial", "bldc", "wind", "pump", "fan"],
    title: "Industrial motor extraction profile",
    metals: ["NdFeB / specialty magnet fractions", "Copper", "Steel", "Electronic subcomponents"],
    output:
      "Industrial systems usually vary more by model, so technical matching and teardown assumptions matter.",
    sourceId: "industrial-motors" as DashboardSourceId,
  },
  {
    keywords: ["mri", "medical", "imaging"],
    title: "MRI and imaging extraction profile",
    metals: ["Specialty magnet alloys", "Copper", "Aluminum", "High-value component metals"],
    output:
      "MRI-derived streams can carry concentrated value, but they depend heavily on configuration and deinstallation quality.",
    sourceId: "mri" as DashboardSourceId,
  },
  {
    keywords: ["robot", "robotic", "lab", "actuator", "automation"],
    title: "Other embedded magnet systems",
    metals: ["Magnet subassemblies", "Copper", "Aluminum", "Precision component alloys"],
    output:
      "Robotics and lab equipment create smaller but often attractive magnet-bearing recovery opportunities.",
    sourceId: "other-items" as DashboardSourceId,
  },
];

function normalizeQuery(value: string) {
  return value.trim().toLowerCase();
}

function buildDemandRecommendations(query: string) {
  const normalized = normalizeQuery(query);

  if (!normalized) return demandMappings.slice(0, 3);

  const matches = demandMappings.filter((item) =>
    item.keywords.some((keyword) => normalized.includes(keyword))
  );

  return (matches.length ? matches : demandMappings).slice(0, 3);
}

function buildExtractionRecommendations(query: string) {
  const normalized = normalizeQuery(query);

  if (!normalized) return extractionMappings.slice(0, 3);

  const matches = extractionMappings.filter((item) =>
    item.keywords.some((keyword) => normalized.includes(keyword))
  );

  return (matches.length ? matches : extractionMappings).slice(0, 3);
}

export function DashboardPage() {
  const [desiredOutput, setDesiredOutput] = useState("");
  const [scrapInput, setScrapInput] = useState("");
  const [demandRecommendations, setDemandRecommendations] = useState(() =>
    buildDemandRecommendations("")
  );
  const [extractionRecommendations, setExtractionRecommendations] = useState(() =>
    buildExtractionRecommendations("")
  );

  const ribbonCards = useMemo(
    () =>
      dashboardMaterialTiles.map((tile) => ({
        id: tile.id,
        title: tile.title,
        href: tile.dashboardHref,
        listings: dashboardBidListings.filter((listing) => listing.sourceId === tile.id).length,
        description: dashboardSourceContent[tile.id].scrapTypes[0],
      })),
    []
  );

  return (
    <motion.main className="page bg-transparent" {...pageMotionProps}>
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(210,175,103,0.16),transparent_24%),radial-gradient(circle_at_88%_12%,rgba(121,161,144,0.16),transparent_30%),linear-gradient(180deg,#fbf7ef_0%,#f4ebdb_56%,#f5efe4_100%)] pb-12 pt-28">
        <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(17,40,61,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(17,40,61,0.05)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="absolute left-[-6rem] top-[-2rem] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(201,159,76,0.2),transparent_68%)] blur-3xl" />
        <div className="absolute right-[-5rem] top-[6rem] h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(110,152,121,0.18),transparent_70%)] blur-3xl" />

        <div className="shell relative z-10">
          <div className="max-w-4xl">
            <p className="eyebrow">Recycler dashboard</p>
            <h1 className="max-w-[12ch] font-display text-[clamp(3rem,5.2vw,5.2rem)] leading-[0.95] tracking-[-0.06em] text-[#11283d]">
              Open live category boards built for rare earth recovery buyers.
            </h1>
            <p className="mt-5 max-w-[46rem] text-[1.04rem] leading-8 text-[#4b5b69]">
              Start from a feedstock family, open the live bidding table only when you are ready,
              and use recommendation tools to target the right lots before you price a bid.
            </p>
          </div>

          <div className="mt-8">
            <MaterialTileGrid tiles={dashboardMaterialTiles} hrefMode="dashboard" />
          </div>
        </div>
      </section>

      <section className="shell section-gap pt-8">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-[34px] border border-[#d9cfbf] bg-[linear-gradient(180deg,rgba(255,252,247,0.95),rgba(244,236,224,0.9))] p-6 shadow-[0_28px_80px_rgba(46,41,31,0.08)]"
        >
          <div className="flex flex-col gap-4 border-b border-[#e0d7c9] pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="eyebrow !mb-0">Live bidding ribbon</p>
              <h2 className="mt-2 font-display text-[2rem] leading-[0.98] tracking-[-0.05em] text-[#11283d]">
                Open the live bidding table only when you want to work a specific feedstock stream.
              </h2>
              <p className="mt-3 max-w-[42rem] text-[0.98rem] leading-7 text-[#5a6a78]">
                Each ribbon card opens the category-specific live bidding table with current lots,
                staged ordering, and detail views for that scrap family.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="rounded-full border border-[#ddd4c7] bg-white/84 px-4 py-2 text-[0.74rem] font-bold uppercase tracking-[0.14em] text-[#173550]">
                {dashboardBidListings.length} total live lots
              </span>
              <Link className="button-ghost" to="/dashboard/checkout">
                Review cart
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-5">
            {ribbonCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.42, delay: index * 0.05 }}
              >
                <Link
                  to={card.href}
                  className="group flex h-full flex-col rounded-[26px] border border-[#d9cfbf] bg-white/84 p-5 shadow-[0_20px_56px_rgba(46,41,31,0.06)] transition duration-300 hover:-translate-y-1.5 hover:border-[#b38a4e]"
                >
                  <span className="inline-flex w-fit rounded-full border border-[#ddd4c7] bg-[#f7f0e3] px-3 py-1 text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#8d6d39]">
                    {card.listings} listings
                  </span>
                  <strong className="mt-4 block font-display text-[1.18rem] leading-[1.02] tracking-[-0.04em] text-[#11283d]">
                    {card.title}
                  </strong>
                  <p className="mt-3 text-[0.88rem] leading-7 text-[#5b6c7c]">{card.description}</p>
                  <span className="mt-5 text-[0.76rem] font-bold uppercase tracking-[0.14em] text-[#173550]">
                    Open live bidding table
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.article>
      </section>

      <section className="shell pb-16">
        <div className="grid gap-6 xl:grid-cols-2">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.52 }}
            className="rounded-[34px] border border-[#d9cfbf] bg-[rgba(255,252,247,0.94)] p-6 shadow-[0_24px_72px_rgba(46,41,31,0.07)]"
          >
            <p className="eyebrow !mb-0">Output navigator</p>
            <h2 className="mt-2 font-display text-[1.9rem] leading-[1.02] tracking-[-0.05em] text-[#11283d]">
              Tell us the metal or material you want out, and we will point you toward the best feedstock.
            </h2>
            <p className="mt-3 text-[0.96rem] leading-7 text-[#5a6a78]">
              Enter outputs like `NdPr`, `NdFeB magnets`, `SmCo`, `copper-rich motors`, or
              `high-temperature magnet alloy`.
            </p>

            <div className="mt-5 rounded-[28px] border border-[#e0d7c9] bg-white/78 p-5">
              <label
                htmlFor="desired-output"
                className="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]"
              >
                Desired output
              </label>
              <textarea
                id="desired-output"
                value={desiredOutput}
                onChange={(event) => setDesiredOutput(event.target.value)}
                placeholder="Example: NdPr-rich magnet scrap for repeat buying"
                className="mt-3 min-h-[128px] w-full rounded-[24px] border border-[#ddd4c7] bg-[#fbf7ef] px-4 py-4 text-[0.98rem] leading-7 text-[#173550] outline-none"
              />
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setDemandRecommendations(buildDemandRecommendations(desiredOutput))}
                  className="rounded-full bg-[linear-gradient(145deg,#b88b3c,#9f742c)] px-5 py-3 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_14px_34px_rgba(184,139,60,0.22)] transition hover:-translate-y-0.5"
                >
                  Generate feedstock matches
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDesiredOutput("");
                    setDemandRecommendations(buildDemandRecommendations(""));
                  }}
                  className="rounded-full border border-[#cabfae] bg-white/84 px-5 py-3 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-[#173550]"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              {demandRecommendations.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[24px] border border-[#e0d7c9] bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(247,241,232,0.84))] p-5"
                >
                  <strong className="block font-display text-[1.18rem] tracking-[-0.04em] text-[#11283d]">
                    {item.title}
                  </strong>
                  <p className="mt-3 text-[0.94rem] leading-7 text-[#556576]">{item.body}</p>
                  <p className="mt-3 text-[0.84rem] leading-6 text-[#8a7b65]">{item.bidHint}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.feedstocks.map((feedstock) => (
                      <span
                        key={feedstock}
                        className="rounded-full border border-[#ddd4c7] bg-white/82 px-3 py-2 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#173550]"
                      >
                        {feedstock}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {item.sourceIds.map((sourceId) => (
                      <Link
                        key={`${item.title}-${sourceId}`}
                        to={`/dashboard/live/${sourceId}`}
                        className="text-[0.76rem] font-bold uppercase tracking-[0.14em] text-[#8d6d39] transition hover:text-[#173550]"
                      >
                        Open {dashboardSourceContent[sourceId].eyebrow}
                      </Link>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.52, delay: 0.06 }}
            className="rounded-[34px] border border-[#d9cfbf] bg-[rgba(255,252,247,0.94)] p-6 shadow-[0_24px_72px_rgba(46,41,31,0.07)]"
          >
            <p className="eyebrow !mb-0">Extraction navigator</p>
            <h2 className="mt-2 font-display text-[1.9rem] leading-[1.02] tracking-[-0.05em] text-[#11283d]">
              Tell us the scrap you can process, and we will show the metals you can likely extract.
            </h2>
            <p className="mt-3 text-[0.96rem] leading-7 text-[#5a6a78]">
              Enter scrap types like `HDD`, `EV motors`, `industrial servo motors`, `MRI systems`,
              or `robotic actuators`.
            </p>

            <div className="mt-5 rounded-[28px] border border-[#e0d7c9] bg-white/78 p-5">
              <label
                htmlFor="scrap-input"
                className="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]"
              >
                Scrap you can recycle
              </label>
              <textarea
                id="scrap-input"
                value={scrapInput}
                onChange={(event) => setScrapInput(event.target.value)}
                placeholder="Example: We can dismantle EV traction motors and mixed BLDC units"
                className="mt-3 min-h-[128px] w-full rounded-[24px] border border-[#ddd4c7] bg-[#fbf7ef] px-4 py-4 text-[0.98rem] leading-7 text-[#173550] outline-none"
              />
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setExtractionRecommendations(buildExtractionRecommendations(scrapInput))}
                  className="rounded-full bg-[linear-gradient(145deg,#173550,#264862)] px-5 py-3 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_14px_34px_rgba(23,53,80,0.18)] transition hover:-translate-y-0.5"
                >
                  Reveal extraction outputs
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setScrapInput("");
                    setExtractionRecommendations(buildExtractionRecommendations(""));
                  }}
                  className="rounded-full border border-[#cabfae] bg-white/84 px-5 py-3 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-[#173550]"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              {extractionRecommendations.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[24px] border border-[#e0d7c9] bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(247,241,232,0.84))] p-5"
                >
                  <strong className="block font-display text-[1.18rem] tracking-[-0.04em] text-[#11283d]">
                    {item.title}
                  </strong>
                  <p className="mt-3 text-[0.94rem] leading-7 text-[#556576]">{item.output}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.metals.map((metal) => (
                      <span
                        key={metal}
                        className="rounded-full border border-[#ddd4c7] bg-white/82 px-3 py-2 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#173550]"
                      >
                        {metal}
                      </span>
                    ))}
                  </div>
                  <Link
                    to={`/dashboard/live/${item.sourceId}`}
                    className="mt-4 inline-flex text-[0.76rem] font-bold uppercase tracking-[0.14em] text-[#8d6d39] transition hover:text-[#173550]"
                  >
                    Open matching live marketplace
                  </Link>
                </article>
              ))}
            </div>
          </motion.article>
        </div>
      </section>
    </motion.main>
  );
}
