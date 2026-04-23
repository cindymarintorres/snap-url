export type LinkDTO = {
  id: string;
  slug: string;
  originalUrl: string;
  title: string | null;
  isActive: boolean;
  hasPassword: boolean;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  clickCount: number;
  shortUrl: string;
};

export type AnalyticsSummary = {
  totalClicks: number;
  clicksToday: number;
  clicksThisWeek: number;
  avgClicksPerDay: number;
  clicksByDay: Array<{ date: string; clicks: number }>;
  topReferers: Array<{ referer: string; count: number }>;
};

export type DashboardStats = {
  totalLinks: number;
  totalClicks: number;
  activeLinks: number;
  protectedLinks: number;
  recentLinks: LinkDTO[];
  clicksLast7Days: Array<{ date: string; clicks: number }>;
};

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };
