import { Card, CardContent } from "@/components/ui/card";
import { LinkIcon, MousePointerClickIcon, ShieldIcon, ZapIcon } from "lucide-react";
import { type DashboardStats } from "@/types";

type Props = {
  stats: DashboardStats;
};

const cards = (stats: DashboardStats) => [
  {
    id: "kpi-total-links",
    title: "Links totales",
    value: stats.totalLinks,
    icon: LinkIcon,
    color: "bg-blue-50 text-blue-600",
  },
  {
    id: "kpi-total-clicks",
    title: "Clicks totales",
    value: stats.totalClicks,
    icon: MousePointerClickIcon,
    color: "bg-violet-50 text-violet-600",
  },
  {
    id: "kpi-active-links",
    title: "Links activos",
    value: stats.activeLinks,
    icon: ZapIcon,
    color: "bg-green-50 text-green-600",
  },
  {
    id: "kpi-protected-links",
    title: "Con contraseña",
    value: stats.protectedLinks,
    icon: ShieldIcon,
    color: "bg-orange-50 text-orange-600",
  },
];

export function OverviewCards({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards(stats).map(({ id, title, value, icon: Icon, color }) => (
        <Card key={id} id={id}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{title}</p>
                <p className="text-3xl font-bold tabular-nums">{value}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
