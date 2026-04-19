import { animate } from "framer-motion";
import { useEffect, useState } from "react";

type CountUpStatProps = {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
};

export function CountUpStat({ value, label, suffix = "", prefix = "" }: CountUpStatProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [value]);

  return (
    <div className="panel metric">
      <span className="metric-value">
        {prefix}
        {displayValue.toLocaleString()}
        {suffix}
      </span>
      <span className="metric-label">{label}</span>
    </div>
  );
}
