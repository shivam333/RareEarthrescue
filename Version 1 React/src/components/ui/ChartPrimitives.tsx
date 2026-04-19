type LineChartProps = {
  points: number[];
};

export function LineChart({ points }: LineChartProps) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const stepX = 320 / (points.length - 1);

  const normalized = points.map((point, index) => {
    const scaled = 160 - ((point - min) / Math.max(max - min, 1)) * 110;
    return `${index * stepX},${scaled}`;
  });

  const area = `0,180 ${normalized.join(" ")} 320,180`;

  return (
    <svg className="chart" viewBox="0 0 320 180" aria-hidden="true">
      <polygon className="chart-fill" points={area} />
      <polyline className="chart-line" points={normalized.join(" ")} />
    </svg>
  );
}

type BarChartProps = {
  points: number[];
};

export function BarChart({ points }: BarChartProps) {
  const max = Math.max(...points);

  return (
    <svg className="chart" viewBox="0 0 320 180" aria-hidden="true">
      <line className="chart-axis" x1="0" y1="150" x2="320" y2="150" />
      {points.map((point, index) => {
        const height = (point / max) * 102;
        return (
          <rect
            key={index}
            className="chart-bar"
            x={20 + index * 58}
            y={150 - height}
            width="34"
            height={height}
            rx="5"
          />
        );
      })}
    </svg>
  );
}

export function MapMini() {
  return (
    <svg className="chart" viewBox="0 0 320 180" aria-hidden="true">
      <path className="map-stroke" d="M32 70c28-14 53-21 74-21 20 0 41 7 63 21 20 13 42 19 66 19 20 0 42-6 67-19" />
      <path className="map-stroke" d="M48 118c24-13 46-19 67-19 17 0 36 6 56 18 20 13 42 19 66 19 18 0 40-5 66-16" />
      <circle className="map-node" cx="86" cy="70" r="6" />
      <circle className="map-node-accent" cx="164" cy="118" r="7" />
      <circle className="map-node" cx="262" cy="74" r="6" />
      <circle className="pulse-ring" cx="164" cy="118" r="7" />
    </svg>
  );
}
