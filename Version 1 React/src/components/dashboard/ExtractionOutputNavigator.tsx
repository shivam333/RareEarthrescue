import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const outputProfiles = [
  {
    match: ["ndpr", "ndfeb", "magnet", "rare earth"],
    title: "Magnet-rich recovery targets",
    summary: "Best matched with feedstock that already concentrates permanent magnets.",
    chips: ["Whole HDD with magnet", "Only magnets", "EV traction motors"],
    href: "/dashboard/live/hdd",
    cta: "Open HDD board",
  },
  {
    match: ["smco", "specialty", "high temp"],
    title: "Specialty magnet pathways",
    summary: "Look for specialty industrial and actuator-heavy streams where chemistry is narrower.",
    chips: ["Robotic arm actuators", "MRI subassemblies", "Industrial servo motors"],
    href: "/dashboard/live/other-items",
    cta: "Open specialty board",
  },
  {
    match: ["copper", "steel", "aluminum"],
    title: "Motor-heavy output recovery",
    summary: "Rotor and motor streams are strongest where copper and steel recovery matter alongside magnets.",
    chips: ["Hybrid traction motors", "Accessory BLDC", "Wind turbine motors"],
    href: "/dashboard/live/auto-motors",
    cta: "Open motor board",
  },
];

const feedstockProfiles = [
  {
    match: ["hdd", "hard drive", "drive"],
    title: "HDD extraction profile",
    summary: "HDD-origin lots are strongest for magnet recovery plus clean ferrous and aluminum fractions.",
    chips: ["NdPr magnet material", "Aluminum", "Steel"],
    href: "/dashboard/live/hdd",
    cta: "Open HDD board",
  },
  {
    match: ["ev", "traction", "hybrid", "motor"],
    title: "Traction motor extraction profile",
    summary: "Motor-heavy streams support rare-earth recovery plus meaningful copper and electrical steel value.",
    chips: ["NdPr magnet material", "Copper", "Electrical steel"],
    href: "/dashboard/live/auto-motors",
    cta: "Open auto motor board",
  },
  {
    match: ["mri", "imaging", "hospital"],
    title: "MRI system extraction profile",
    summary: "MRI machines can yield magnet-bearing subassemblies alongside copper and stainless-heavy fractions.",
    chips: ["NdPr alloy", "Copper", "Stainless steel"],
    href: "/dashboard/live/mri",
    cta: "Open MRI board",
  },
];

type NavigatorMode = "output" | "feedstock";

type NavigatorCardProps = {
  mode: NavigatorMode;
};

const navigatorCopy: Record<
  NavigatorMode,
  {
    eyebrow: string;
    title: string;
    body: string;
    inputLabel: string;
    placeholder: string;
    buttonLabel: string;
    emptyHint: string;
    profiles: typeof outputProfiles;
  }
> = {
  output: {
    eyebrow: "Output navigator",
    title: "Start from the metal you want out.",
    body: "Type the output you recover and get the best-fit scrap lanes to bid against.",
    inputLabel: "Desired output",
    placeholder: "NdPr magnets, SmCo, copper-rich motors, aluminum...",
    buttonLabel: "Recommend feedstock",
    emptyHint: "Examples: NdPr, SmCo, copper, electrical steel",
    profiles: outputProfiles,
  },
  feedstock: {
    eyebrow: "Feedstock navigator",
    title: "Start from the scrap you can process.",
    body: "Tell us the scrap you can break down and we will surface the outputs you can recover most efficiently.",
    inputLabel: "Processable feedstock",
    placeholder: "HDDs, EV traction motors, MRI systems, robotic arms...",
    buttonLabel: "Reveal output profile",
    emptyHint: "Examples: HDDs, traction motors, MRI systems",
    profiles: feedstockProfiles,
  },
};

function findProfile(input: string, profiles: typeof outputProfiles) {
  const value = input.toLowerCase();
  return (
    profiles.find((profile) => profile.match.some((keyword) => value.includes(keyword))) ??
    profiles[0]
  );
}

export function ExtractionOutputNavigator({ mode }: NavigatorCardProps) {
  const config = navigatorCopy[mode];
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const activeProfile = useMemo(() => {
    if (!submittedQuery.trim()) return null;
    return findProfile(submittedQuery, config.profiles);
  }, [config.profiles, submittedQuery]);

  return (
    <article className="relative overflow-hidden rounded-[30px] border border-[#DCE3EF] bg-white/88 p-5 shadow-[0_20px_56px_rgba(46,41,31,0.06)]">
      <div className="absolute right-[-2rem] top-[-2rem] h-20 w-20 rounded-full bg-[radial-gradient(circle,rgba(217,196,122,0.18),transparent_72%)] blur-2xl" />
      <div className="absolute bottom-[-2rem] left-[-2rem] h-20 w-20 rounded-full bg-[radial-gradient(circle,rgba(54,84,163,0.14),transparent_72%)] blur-2xl" />

      <div className="relative z-10">
        <p className="eyebrow !mb-0">{config.eyebrow}</p>
        <h3 className="mt-2 font-display text-[1.28rem] leading-[1.02] tracking-[-0.05em] text-[#0F1115]">
          {config.title}
        </h3>
        <p className="mt-2 text-[0.88rem] leading-6 text-[#6D7484]">{config.body}</p>

        <label className="mt-4 block text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#6D7484]">
          {config.inputLabel}
        </label>
        <textarea
          className="mt-2 min-h-[88px] w-full rounded-[20px] border border-[#DCE3EF] bg-[#F6F8FC] px-4 py-3 text-[0.95rem] text-[#0F1115] outline-none transition focus:border-[#253B80]"
          placeholder={config.placeholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="button-primary !px-4 !py-2.5 !text-[0.72rem]"
            onClick={() => setSubmittedQuery(query)}
          >
            {config.buttonLabel}
          </button>
          <button
            type="button"
            className="button-ghost !px-4 !py-2.5 !text-[0.72rem]"
            onClick={() => {
              setQuery("");
              setSubmittedQuery("");
            }}
          >
            Reset
          </button>
        </div>

        <p className="mt-3 text-[0.76rem] leading-6 text-[#6D7484]">{config.emptyHint}</p>

        {activeProfile ? (
          <div className="mt-4 rounded-[22px] border border-[#DCE3EF] bg-[#F6F8FC] p-4">
            <strong className="block font-display text-[1.02rem] tracking-[-0.03em] text-[#0F1115]">
              {activeProfile.title}
            </strong>
            <p className="mt-2 text-[0.86rem] leading-6 text-[#6D7484]">{activeProfile.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {activeProfile.chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-[#DCE3EF] bg-white px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#253B80]"
                >
                  {chip}
                </span>
              ))}
            </div>
            <Link
              to={activeProfile.href}
              className="mt-4 inline-flex text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#253B80] transition hover:text-[#C8AA48]"
            >
              {activeProfile.cta}
            </Link>
          </div>
        ) : null}
      </div>
    </article>
  );
}
