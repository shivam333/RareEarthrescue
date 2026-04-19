import { BarChart, LineChart, MapMini } from "../ui/ChartPrimitives";

type WidgetCardProps =
  | {
      value: string;
      label: string;
      type: "line";
      series: number[];
    }
  | {
      value: string;
      label: string;
      type: "bar";
      series: number[];
    }
  | {
      value: string;
      label: string;
      type: "list";
      points: { label: string; value: string }[];
    }
  | {
      value: string;
      label: string;
      type: "map";
    };

export function WidgetCard(props: WidgetCardProps) {
  return (
    <article className="widget panel float-hover">
      <span className="widget-value">{props.value}</span>
      <span className="widget-label">{props.label}</span>
      {props.type === "line" ? <LineChart points={props.series} /> : null}
      {props.type === "bar" ? <BarChart points={props.series} /> : null}
      {props.type === "map" ? <MapMini /> : null}
      {props.type === "list" ? (
        <div className="widget-list">
          {props.points.map((point) => (
            <div className="widget-list-item" key={point.label}>
              <span>{point.label}</span>
              <strong>{point.value}</strong>
            </div>
          ))}
        </div>
      ) : null}
    </article>
  );
}
