import { motion } from "motion/react";
import ReactECharts from "echarts-for-react";
import {
  ShadCard,
  ShadCardContent,
  ShadCardDescription,
  ShadCardHeader,
  ShadCardTitle,
} from "../ui/ShadCard";

type InsightListPoint = {
  label: string;
  value: string;
};

type InsightCard =
  | {
      value: string;
      label: string;
      type: "line";
    }
  | {
      value: string;
      label: string;
      type: "bar";
    }
  | {
      value: string;
      label: string;
      type: "list";
      points: InsightListPoint[];
    }
  | {
      value: string;
      label: string;
      type: "map";
    };

function lineOption() {
  return {
    animationDuration: 900,
    grid: { left: 10, right: 10, top: 16, bottom: 10, containLabel: true },
    xAxis: {
      type: "category",
      show: false,
      boundaryGap: false,
      data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    },
    yAxis: { type: "value", show: false },
    series: [
      {
        type: "line",
        smooth: true,
        data: [168, 158, 136, 122, 96, 82],
        symbol: "none",
        lineStyle: { width: 3.5, color: "#b88b31" },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(184,139,49,0.22)" },
              { offset: 1, color: "rgba(184,139,49,0.02)" },
            ],
          },
        },
      },
    ],
  };
}

function barOption() {
  return {
    animationDuration: 900,
    grid: { left: 10, right: 10, top: 12, bottom: 10, containLabel: true },
    xAxis: {
      type: "category",
      show: false,
      data: ["W1", "W2", "W3", "W4", "W5"],
    },
    yAxis: { type: "value", show: false },
    series: [
      {
        type: "bar",
        data: [54, 76, 96, 108, 86],
        barWidth: 28,
        itemStyle: {
          color: "#9caf81",
          borderRadius: [8, 8, 0, 0],
        },
      },
    ],
  };
}

function flowMapOption() {
  return {
    animationDuration: 900,
    grid: { left: 0, right: 0, top: 0, bottom: 0 },
    xAxis: { min: 0, max: 100, show: false },
    yAxis: { min: 0, max: 60, show: false },
    series: [
      {
        type: "lines",
        coordinateSystem: "cartesian2d",
        polyline: true,
        data: [
          { coords: [[10, 38], [28, 44], [48, 33], [70, 31], [88, 38]] },
          { coords: [[18, 20], [34, 28], [52, 22], [72, 24], [90, 19]] },
        ],
        lineStyle: {
          color: "rgba(201, 188, 165, 0.9)",
          width: 2.2,
          curveness: 0.18,
        },
        effect: {
          show: true,
          symbolSize: 5,
          color: "#b88b3c",
          trailLength: 0.08,
          constantSpeed: 22,
        },
      },
      {
        type: "effectScatter",
        coordinateSystem: "cartesian2d",
        data: [
          [28, 39, 1],
          [49, 23, 1],
          [75, 37, 1],
        ],
        rippleEffect: { scale: 3.4, brushType: "stroke" },
        itemStyle: {
          color: (params: { dataIndex: number }) =>
            params.dataIndex === 1 ? "#92aa74" : "#c1933b",
        },
        symbolSize: 10,
      },
    ],
  };
}

export function ExecutiveInsightsGrid({ cards }: { cards: InsightCard[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45, delay: index * 0.06 }}
        >
          <ShadCard className="h-full border-[#e2d8c9] bg-[linear-gradient(180deg,rgba(255,252,247,0.92),rgba(249,244,236,0.86))]">
            <ShadCardHeader className="pb-4">
              <div className="text-[2.6rem] font-display leading-none tracking-[-0.08em] text-[#11283d] sm:text-[3.1rem]">
                {card.value}
              </div>
              <ShadCardDescription className="text-[0.76rem] font-bold uppercase tracking-[0.22em] text-[#8b7d6a]">
                {card.label}
              </ShadCardDescription>
            </ShadCardHeader>
            <ShadCardContent>
              {card.type === "line" ? (
                <div className="overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,rgba(250,246,238,0.86),rgba(246,239,227,0.72))] p-2">
                  <ReactECharts option={lineOption()} style={{ height: 170 }} opts={{ renderer: "svg" }} />
                </div>
              ) : null}

              {card.type === "bar" ? (
                <div className="overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,rgba(250,246,238,0.86),rgba(246,239,227,0.72))] p-2">
                  <ReactECharts option={barOption()} style={{ height: 170 }} opts={{ renderer: "svg" }} />
                </div>
              ) : null}

              {card.type === "list" ? (
                <div className="grid gap-3">
                  {card.points.map((point, pointIndex) => (
                    <motion.div
                      key={point.label}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ duration: 0.35, delay: pointIndex * 0.06 }}
                      className="flex items-center justify-between rounded-[18px] bg-[#eef2ec] px-4 py-3 text-[0.92rem] text-[#5a6a78]"
                    >
                      <span>{point.label}</span>
                      <strong className="font-semibold text-[#173550]">{point.value}</strong>
                    </motion.div>
                  ))}
                </div>
              ) : null}

              {card.type === "map" ? (
                <div className="overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,rgba(250,246,238,0.86),rgba(246,239,227,0.72))] p-2">
                  <ReactECharts option={flowMapOption()} style={{ height: 170 }} opts={{ renderer: "svg" }} />
                </div>
              ) : null}
            </ShadCardContent>
          </ShadCard>
        </motion.div>
      ))}
    </div>
  );
}
