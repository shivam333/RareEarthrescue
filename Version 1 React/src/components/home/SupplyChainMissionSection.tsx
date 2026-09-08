import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BadgeCheck,
  CarFront,
  ChartNoAxesColumnIncreasing,
  CircuitBoard,
  Cpu,
  Factory,
  HardDrive,
  Magnet,
  Radar,
  RefreshCw,
  ShieldCheck,
  TriangleAlert,
  Workflow,
  Wrench,
  type LucideIcon,
} from "lucide-react";

type Stage = {
  id: string;
  eyebrow: string;
  title: string;
  microcopy: string;
};

type NetworkNodeProps = {
  label: string;
  detail?: string;
  icon: LucideIcon;
  x: string;
  y: string;
  tone?: "gold" | "rust" | "green" | "neutral";
  compact?: boolean;
};

const stages: Stage[] = [
  {
    id: "foreign",
    eyebrow: "Current problem",
    title: "Foreign dependence",
    microcopy: "Critical minerals remain exposed to foreign supply risk.",
  },
  {
    id: "fragility",
    eyebrow: "System constraint",
    title: "Supply chain fragility",
    microcopy:
      "Supply disruptions create risk for defense, data centers, electronics, and advanced manufacturing.",
  },
  {
    id: "resource",
    eyebrow: "Domestic opportunity",
    title: "Hidden domestic resource",
    microcopy:
      "Valuable rare-earth-bearing scrap already exists domestically — but it is fragmented.",
  },
  {
    id: "exchange",
    eyebrow: "Coordination layer",
    title: "Rare Earth Rescue",
    microcopy: "RER creates the sourcing, qualification, pricing, and logistics layer.",
  },
  {
    id: "circular",
    eyebrow: "Resilient end state",
    title: "Circular recovery network",
    microcopy:
      "Recycling is the fastest path to a more self-reliant rare earth supply chain.",
  },
];

const missionCards = [
  {
    title: "Verified Counterparties",
    detail: "Qualified supply and demand",
    icon: ShieldCheck,
  },
  {
    title: "Clearer Market Signals",
    detail: "Material, price and capacity data",
    icon: ChartNoAxesColumnIncreasing,
  },
  {
    title: "Domestic Circularity",
    detail: "Recovered value stays in motion",
    icon: RefreshCw,
  },
] as const;

function NetworkNode({
  label,
  detail,
  icon: Icon,
  x,
  y,
  tone = "neutral",
  compact = false,
}: NetworkNodeProps) {
  return (
    <div
      className={`rer-network-node rer-network-node--${tone}${compact ? " rer-network-node--compact" : ""}`}
      style={{ left: x, top: y }}
    >
      <span className="rer-network-node__icon">
        <Icon aria-hidden="true" />
      </span>
      <span className="rer-network-node__copy">
        <strong>{label}</strong>
        {detail ? <small>{detail}</small> : null}
      </span>
    </div>
  );
}

function UsMap({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`rer-us-map ${className}`}
      viewBox="0 0 620 420"
      fill="none"
    >
      <path
        d="M75 145 92 126 116 112 145 110 173 115 205 109 233 114 262 126 298 125 330 118 365 116 396 122 430 122 462 118 491 123 516 133 544 139 567 153 584 174 589 196 582 209 568 214 554 225 545 235 527 238 512 250 509 266 494 276 482 292 456 302 427 310 398 313 367 322 336 327 308 322 280 325 250 336 223 342 193 338 168 329 144 320 123 302 106 289 91 271 83 251 76 227 73 204 67 180Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M235 124C261 146 284 171 307 208" />
      <path d="M375 118C402 149 435 185 510 241" />
      <path d="M152 287C242 260 344 253 493 278" />
    </svg>
  );
}

function ForeignDependenceScene() {
  return (
    <div className="rer-scene rer-scene--foreign" aria-hidden="true">
      <svg className="rer-scene-lines" viewBox="0 0 760 500" fill="none">
        <circle className="rer-world-orbit" cx="125" cy="248" r="150" />
        <ellipse className="rer-world-orbit rer-world-orbit--inner" cx="125" cy="248" rx="66" ry="150" />
        <path className="rer-world-orbit" d="M-10 208c86 34 184 35 270 1M-8 294c89-31 183-32 268 0" />
        <path className="rer-route rer-route--gold" d="M95 118C218 86 304 109 468 223" />
        <path className="rer-route rer-route--rust rer-route--delay" d="M78 246C236 245 321 229 471 240" />
        <path className="rer-route rer-route--gold rer-route--delay-2" d="M104 370C242 392 342 324 487 258" />
        <path className="rer-route-ghost" d="M178 76C307 47 431 86 574 164" />
      </svg>
      <UsMap className="rer-us-map--foreign" />
      <div className="rer-map-label rer-map-label--us">United States</div>
      <NetworkNode label="Global mining" detail="External source" icon={Radar} x="13%" y="17%" tone="gold" compact />
      <NetworkNode label="Separation" detail="Foreign processing" icon={Factory} x="13%" y="44%" tone="rust" compact />
      <NetworkNode label="Magnet supply" detail="Import corridor" icon={Magnet} x="15%" y="72%" tone="gold" compact />
      <div className="rer-target-pulse" />
      <div className="rer-data-tag rer-data-tag--imports">
        <span>Import exposure</span>
        <strong>HIGH</strong>
      </div>
    </div>
  );
}

function FragilityScene() {
  return (
    <div className="rer-scene rer-scene--fragility" aria-hidden="true">
      <svg className="rer-scene-lines" viewBox="0 0 760 500" fill="none">
        <path className="rer-route-ghost" d="M40 249H720" />
        <path className="rer-route rer-route--rust" d="M48 249H300" />
        <path className="rer-route rer-route--broken" d="M461 249H714" />
        <path className="rer-constraint-line" d="M326 149v200M434 149v200" />
        <path className="rer-warning-wave" d="M332 249h19l12-31 25 65 18-34h24" />
      </svg>
      <NetworkNode label="Imported material" detail="Single-point exposure" icon={Magnet} x="16%" y="42%" tone="rust" />
      <div className="rer-bottleneck">
        <span className="rer-bottleneck__icon"><TriangleAlert /></span>
        <strong>CONSTRAINED</strong>
        <small>Foreign supply interruption</small>
      </div>
      <NetworkNode label="Defense" icon={ShieldCheck} x="72%" y="16%" tone="neutral" compact />
      <NetworkNode label="Data centers" icon={HardDrive} x="72%" y="36%" tone="neutral" compact />
      <NetworkNode label="Electronics" icon={Cpu} x="72%" y="56%" tone="neutral" compact />
      <NetworkNode label="Manufacturing" icon={Factory} x="72%" y="76%" tone="neutral" compact />
      <div className="rer-data-tag rer-data-tag--risk">
        <span>Downstream risk</span>
        <strong>4 SECTORS</strong>
      </div>
    </div>
  );
}

function DomesticResourceScene() {
  return (
    <div className="rer-scene rer-scene--resource" aria-hidden="true">
      <UsMap className="rer-us-map--resource" />
      <svg className="rer-scene-lines" viewBox="0 0 760 500" fill="none">
        <path className="rer-fragment-line" d="M122 168L258 122M258 122l145 73M403 195l194-55M403 195l-117 143M286 338l255 23" />
        <circle className="rer-scan-ring" cx="382" cy="248" r="96" />
        <circle className="rer-scan-ring rer-scan-ring--delay" cx="382" cy="248" r="154" />
      </svg>
      <NetworkNode label="HDDs" icon={HardDrive} x="11%" y="25%" tone="gold" compact />
      <NetworkNode label="EV motors" icon={CarFront} x="31%" y="15%" tone="green" compact />
      <NetworkNode label="Industrial motors" icon={Wrench} x="56%" y="30%" tone="rust" compact />
      <NetworkNode label="Electronics" icon={CircuitBoard} x="30%" y="68%" tone="rust" compact />
      <NetworkNode label="Magnet assemblies" icon={Magnet} x="67%" y="72%" tone="gold" compact />
      <div className="rer-data-tag rer-data-tag--fragmented">
        <span>Domestic inventory</span>
        <strong>FRAGMENTED</strong>
      </div>
    </div>
  );
}

function ExchangeLayerScene() {
  return (
    <div className="rer-scene rer-scene--exchange" aria-hidden="true">
      <svg className="rer-scene-lines" viewBox="0 0 760 500" fill="none">
        <path className="rer-route rer-route--green" d="M136 126C252 126 273 213 344 232" />
        <path className="rer-route rer-route--gold rer-route--delay" d="M136 250H340" />
        <path className="rer-route rer-route--rust rer-route--delay-2" d="M136 375C252 375 273 286 344 267" />
        <path className="rer-route rer-route--gold" d="M416 232C487 213 508 126 624 126" />
        <path className="rer-route rer-route--green rer-route--delay" d="M420 250H624" />
        <path className="rer-route rer-route--gold rer-route--delay-2" d="M416 267C487 286 508 375 624 375" />
      </svg>
      <span className="rer-column-label rer-column-label--left">Domestic suppliers</span>
      <span className="rer-column-label rer-column-label--right">Qualified recyclers</span>
      <NetworkNode label="ITAD + HDD" icon={HardDrive} x="14%" y="16%" tone="green" compact />
      <NetworkNode label="Motor scrap" icon={Wrench} x="14%" y="42%" tone="gold" compact />
      <NetworkNode label="Magnet lots" icon={Magnet} x="14%" y="68%" tone="rust" compact />
      <div className="rer-exchange-hub">
        <span className="rer-exchange-hub__mark"><Workflow /></span>
        <small>Market infrastructure</small>
        <strong>Rare Earth<br />Rescue</strong>
        <div className="rer-exchange-hub__services">
          <span>Source</span><span>Qualify</span><span>Price</span><span>Move</span>
        </div>
      </div>
      <NetworkNode label="Magnet-to-magnet" icon={RefreshCw} x="76%" y="16%" tone="gold" compact />
      <NetworkNode label="Hydrometallurgy" icon={Factory} x="76%" y="42%" tone="green" compact />
      <NetworkNode label="Separation" icon={Radar} x="76%" y="68%" tone="gold" compact />
    </div>
  );
}

function CircularNetworkScene() {
  return (
    <div className="rer-scene rer-scene--circular" aria-hidden="true">
      <UsMap className="rer-us-map--circular" />
      <svg className="rer-scene-lines" viewBox="0 0 760 500" fill="none">
        <defs>
          <marker id="rer-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0l10 5-10 5z" fill="#d3a245" />
          </marker>
        </defs>
        <path className="rer-circular-route" markerEnd="url(#rer-arrow)" d="M270 103C460 20 645 135 625 283" />
        <path className="rer-circular-route rer-circular-route--delay" markerEnd="url(#rer-arrow)" d="M625 283C603 444 373 484 233 394" />
        <path className="rer-circular-route rer-circular-route--delay-2" markerEnd="url(#rer-arrow)" d="M233 394C61 281 98 143 270 103" />
      </svg>
      <NetworkNode label="Defense" icon={ShieldCheck} x="22%" y="10%" tone="gold" compact />
      <NetworkNode label="Data centers" icon={HardDrive} x="72%" y="27%" tone="green" compact />
      <NetworkNode label="Advanced manufacturing" icon={Factory} x="63%" y="75%" tone="gold" compact />
      <NetworkNode label="EV + mobility" icon={CarFront} x="11%" y="70%" tone="green" compact />
      <div className="rer-circular-core">
        <span className="rer-circular-core__icon"><RefreshCw /></span>
        <small>Recovered rare earths</small>
        <strong>Back into<br />U.S. industry</strong>
        <span className="rer-circular-core__status"><BadgeCheck /> Domestic loop active</span>
      </div>
    </div>
  );
}

const sceneComponents = [
  ForeignDependenceScene,
  FragilityScene,
  DomesticResourceScene,
  ExchangeLayerScene,
  CircularNetworkScene,
];

export function SupplyChainMissionSection() {
  const [activeStage, setActiveStage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (isPaused || prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      setActiveStage((current) => (current + 1) % stages.length);
    }, 4300);

    return () => window.clearInterval(timer);
  }, [isPaused, prefersReducedMotion]);

  const ActiveScene = sceneComponents[activeStage];
  const activeCopy = stages[activeStage];

  return (
    <section id="mission" className="rer-mission-section" aria-labelledby="rer-mission-heading">
      <div className="rer-mission-section__texture" aria-hidden="true" />
      <div className="shell rer-mission-layout">
        <div className="rer-mission-copy gsap-reveal">
          <div className="rer-kicker">
            <span className="rer-kicker__rule" />
            <span>Mission 01</span>
            <span className="rer-kicker__muted">Critical mineral security</span>
          </div>

          <h2 id="rer-mission-heading">Building Domestic Rare Earth Resilience Through Recycling</h2>
          <p className="rer-mission-subheading">
            Build a circular economy and reliable domestic supply of rare-earth elements.
          </p>
          <p className="rer-mission-body">
            Rare Earth Rescue connects rare-earth-bearing scrap suppliers with qualified recyclers,
            helping recyclers keep recovery capacity utilized while enabling suppliers to realize
            the true value of end-of-life equipment.
          </p>

          <div className="rer-mission-statement">
            <span>Mission</span>
            <p>
              Build a resilient domestic recovery network through verified counterparties, clearer
              market signals, and a stronger local circular economy.
            </p>
          </div>

          <div className="rer-mission-cards" aria-label="Mission pillars">
            {missionCards.map(({ title, detail, icon: Icon }, index) => (
              <article key={title} className="rer-mission-card">
                <span className="rer-mission-card__number">0{index + 1}</span>
                <span className="rer-mission-card__icon"><Icon aria-hidden="true" /></span>
                <strong>{title}</strong>
                <small>{detail}</small>
              </article>
            ))}
          </div>
        </div>

        <div
          className="rer-supply-visual gsap-reveal"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
          }}
        >
          <div className="rer-supply-visual__header">
            <div>
              <span className="rer-live-indicator"><i /> Network transition model</span>
              <strong>U.S. RARE EARTH SUPPLY // SYSTEM VIEW</strong>
            </div>
            <div className="rer-stage-counter">
              <span>STAGE</span>
              <strong>0{activeStage + 1}</strong>
              <em>/ 05</em>
            </div>
          </div>

          <div className="rer-supply-visual__canvas">
            <div className="rer-coordinate rer-coordinate--top">45.0000° N</div>
            <div className="rer-coordinate rer-coordinate--side">101.0000° W</div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCopy.id}
                className="rer-scene-motion"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 10, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8, scale: 1.01 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <ActiveScene />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="rer-stage-copy" aria-live="polite">
            <span>{activeCopy.eyebrow}</span>
            <div>
              <strong>{activeCopy.title}</strong>
              <p>{activeCopy.microcopy}</p>
            </div>
          </div>

          <div className="rer-stage-nav" aria-label="Supply chain animation stages">
            {stages.map((stage, index) => (
              <button
                key={stage.id}
                type="button"
                className={index === activeStage ? "is-active" : ""}
                onClick={() => setActiveStage(index)}
                aria-label={`Show stage ${index + 1}: ${stage.title}`}
                aria-pressed={index === activeStage}
              >
                <span>0{index + 1}</span>
                <i><b /></i>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
