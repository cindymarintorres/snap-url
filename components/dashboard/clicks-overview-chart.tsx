"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  data: Array<{ date: string; clicks: number }>;
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("es", { weekday: "short" });
}

export function ClicksOverviewChart({ data }: Props) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
        Sin clicks en los últimos 7 días.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
        <defs>
          <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
          labelFormatter={(label: unknown) => formatDate(String(label))}
          formatter={(value) => [value ?? 0, "Clicks"]}
        />
        <Area
          type="monotone"
          dataKey="clicks"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          fill="url(#clicksGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
