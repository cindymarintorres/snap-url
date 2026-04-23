"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(217 91% 60%)",
  "hsl(262 80% 60%)",
  "hsl(145 65% 48%)",
  "hsl(38 92% 50%)",
];

type Props = {
  data: Array<{ referer: string; count: number }>;
};

export function ReferersPieChart({ data }: Props) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        Sin datos de referers aún.
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: d.referer,
    value: d.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          dataKey="value"
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
          formatter={(value) => [value ?? 0, "Clicks"]}
        />
        <Legend
          formatter={(value) => (
            <span style={{ fontSize: "12px" }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
