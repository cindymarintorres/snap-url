import { getDashboardStats } from "@/lib/actions/analytics.actions";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import { ClicksOverviewChart } from "@/components/dashboard/clicks-overview-chart";
import { RecentLinksTable } from "@/components/dashboard/recent-links-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const result = await getDashboardStats();

  if (!result.success) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-destructive">Error al cargar estadísticas: {result.error}</p>
      </div>
    );
  }

  const stats = result.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Resumen de tu actividad en SnapURL.
        </p>
      </div>

      {/* KPI Cards */}
      <OverviewCards stats={stats} />

      {/* Chart y Recent Links */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Clicks últimos 7 días</CardTitle>
          </CardHeader>
          <CardContent>
            <ClicksOverviewChart data={stats.clicksLast7Days} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Links recientes</CardTitle>
          </CardHeader>
          <CardContent className="p-0 pb-0">
            <div className="px-4 pb-4">
              <RecentLinksTable links={stats.recentLinks} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla completa recientes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tus últimos 5 links</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="px-4 pb-4">
            <RecentLinksTable links={stats.recentLinks} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
