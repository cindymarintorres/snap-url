import { Card, CardContent } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
};

export function AnalyticsStatCard({ title, value, subtitle, icon: Icon, trend }: Props) {
  const trendColor =
    trend === "up"
      ? "text-green-600"
      : trend === "down"
        ? "text-red-500"
        : "text-muted-foreground";

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tabular-nums">{value}</p>
            {subtitle && (
              <p className={`text-xs ${trendColor}`}>{subtitle}</p>
            )}
          </div>
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
