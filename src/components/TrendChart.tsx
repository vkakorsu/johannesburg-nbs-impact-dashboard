import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface Point {
  period: string;
  value: number;
}

interface Props {
  data: Point[];
  color?: string;
  unit?: string;
  label?: string;
}

// Lightweight communication chart, not an analytics tool. Clear axes, one
// series, high contrast, and a plain tooltip suited to non technical readers.
export default function TrendChart({ data, color = "#3B7EA1", unit = "", label = "" }: Props) {
  if (!data || data.length === 0) {
    return (
      <p className="rounded-sm bg-paper-warm px-3 py-6 text-center text-sm text-charcoal/60">
        Time series data will be added from the SUNCASA data catalogue.
      </p>
    );
  }

  return (
    <figure className="w-full">
      {label && <figcaption className="mb-2 text-sm font-medium text-charcoal/80">{label}</figcaption>}
      <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}>
            <CartesianGrid stroke="rgba(28,28,26,0.08)" vertical={false} />
            <XAxis
              dataKey="period"
              tick={{ fill: "#33322E", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(28,28,26,0.2)" }}
            />
            <YAxis
              tick={{ fill: "#33322E", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={44}
            />
            <Tooltip
              formatter={(value: number) => [`${value} ${unit}`.trim(), label || "Value"]}
              contentStyle={{
                background: "#F7F5EF",
                border: "1px solid rgba(28,28,26,0.14)",
                borderRadius: 4,
                fontSize: 13,
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2.4}
              dot={{ r: 3, fill: color }}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}
