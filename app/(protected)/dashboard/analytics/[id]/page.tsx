import { notFound } from "next/navigation";
import { getLinkAnalytics, } from "@/lib/actions/analytics.actions";
import { getLinkById } from "@/lib/actions/links.actions";
import { AnalyticsStatCard } from "@/components/analytics/analytics-stat-card";
import { ClicksBarChart } from "@/components/analytics/clicks-bar-chart";
import { ReferersPieChart } from "@/components/analytics/referers-pie-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MousePointerClickIcon, CalendarIcon, TrendingUpIcon, ZapIcon } from "lucide-react";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AnalyticsPage({ params }: Props) {
  const { id } = await params;

  const [linkResult, analyticsResult] = await Promise.all([
    getLinkById(id),
    getLinkAnalytics(id),
  ]);

  if (!linkResult.success) notFound();

  const link = linkResult.data;
  const analytics = analyticsResult.success ? analyticsResult.data : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">
          <span className="font-mono text-primary">/r/{link.slug}</span>
          {link.title && ` — ${link.title}`}
        </p>
      </div>

      {!analyticsResult.success && (
        <p className="text-sm text-destructive">Error: {analyticsResult.error}</p>
      )}

      {analytics && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <AnalyticsStatCard
              title="Total clicks"
              value={analytics.totalClicks}
              icon={MousePointerClickIcon}
            />
            <AnalyticsStatCard
              title="Hoy"
              value={analytics.clicksToday}
              icon={CalendarIcon}
            />
            <AnalyticsStatCard
              title="Últimos 7 días"
              value={analytics.clicksThisWeek}
              icon={TrendingUpIcon}
            />
            <AnalyticsStatCard
              title="Promedio / día"
              value={analytics.avgClicksPerDay}
              icon={ZapIcon}
            />
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Clicks últimos 30 días</CardTitle>
              </CardHeader>
              <CardContent>
                <ClicksBarChart data={analytics.clicksByDay} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top referers</CardTitle>
              </CardHeader>
              <CardContent>
                <ReferersPieChart data={analytics.topReferers} />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
