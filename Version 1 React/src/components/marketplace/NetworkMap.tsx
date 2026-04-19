export function NetworkMap() {
  return (
    <svg className="h-full w-full" viewBox="0 0 800 680" aria-hidden="true">
      <path
        className="map-stroke"
        d="M82 182c62-34 114-52 171-52 62 0 116 18 160 54 28 22 61 34 98 34 35 0 73-10 116-31 39-19 72-27 104-23"
      />
      <path
        className="map-stroke"
        d="M118 348c52-34 98-51 140-51 41 0 84 17 129 52 42 33 82 50 118 50 30 0 68-11 115-33 48-22 90-31 127-27"
      />
      <path
        className="map-stroke"
        d="M216 500c40-28 75-42 103-42 32 0 64 14 98 42 30 24 62 36 94 36 32 0 68-12 107-36 40-25 78-36 114-34"
      />
      <circle cx="148" cy="206" r="8" className="map-node" />
      <circle cx="252" cy="314" r="9" className="map-node" />
      <circle cx="432" cy="262" r="10" className="map-node-accent" />
      <circle cx="602" cy="196" r="9" className="map-node" />
      <circle cx="528" cy="462" r="10" className="map-node-accent" />
      <circle cx="300" cy="520" r="9" className="map-node" />
      <circle cx="148" cy="206" r="10" className="pulse-ring" />
      <circle cx="432" cy="262" r="10" className="pulse-ring" />
      <circle cx="528" cy="462" r="10" className="pulse-ring" />
    </svg>
  );
}
