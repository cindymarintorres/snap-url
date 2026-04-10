"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { type ActionResult, type AnalyticsSummary, type DashboardStats, type LinkDTO } from "@/types";

function buildLinkDTO(
  link: {
    id: string;
    slug: string;
    originalUrl: string;
    title: string | null;
    isActive: boolean;
    passwordHash: string | null;
    expiresAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    _count: { clicks: number };
  }
): LinkDTO {
  return {
    id: link.id,
    slug: link.slug,
    originalUrl: link.originalUrl,
    title: link.title,
    isActive: link.isActive,
    hasPassword: link.passwordHash !== null,
    expiresAt: link.expiresAt,
    createdAt: link.createdAt,
    updatedAt: link.updatedAt,
    clickCount: link._count.clicks,
    shortUrl: `${process.env.NEXT_PUBLIC_APP_URL}/r/${link.slug}`,
  };
}

export async function getLinkAnalytics(
  linkId: string
): Promise<ActionResult<AnalyticsSummary>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "No autorizado" };
    }

    const link = await prisma.link.findUnique({
      where: { id: linkId, userId: session.user.id },
      select: { id: true },
    });

    if (!link) {
      return { success: false, error: "Link no encontrado" };
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [totalClicks, clicksToday, clicksThisWeek, rawClicksByDay, topReferers] =
      await Promise.all([
        prisma.click.count({ where: { linkId } }),
        prisma.click.count({ where: { linkId, clickedAt: { gte: todayStart } } }),
        prisma.click.count({ where: { linkId, clickedAt: { gte: weekStart } } }),
        prisma.click.findMany({
          where: { linkId, clickedAt: { gte: thirtyDaysAgo } },
          select: { clickedAt: true },
          orderBy: { clickedAt: "asc" },
        }),
        prisma.click.groupBy({
          by: ["referer"],
          where: { linkId },
          _count: { referer: true },
          orderBy: { _count: { referer: "desc" } },
          take: 5,
        }),
      ]);

    // Agrupar clicks por día (últimos 30 días)
    const clicksByDayMap = new Map<string, number>();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split("T")[0];
      clicksByDayMap.set(key, 0);
    }
    for (const click of rawClicksByDay) {
      const key = click.clickedAt.toISOString().split("T")[0];
      clicksByDayMap.set(key, (clicksByDayMap.get(key) ?? 0) + 1);
    }
    const clicksByDay = Array.from(clicksByDayMap.entries()).map(([date, clicks]) => ({
      date,
      clicks,
    }));

    const daysWithData = clicksByDay.filter((d) => d.clicks > 0).length || 1;
    const avgClicksPerDay = Math.round(totalClicks / daysWithData);

    const referers = topReferers.map((r) => ({
      referer: r.referer && r.referer.length > 0 ? r.referer : "Directo",
      count: r._count.referer,
    }));

    return {
      success: true,
      data: {
        totalClicks,
        clicksToday,
        clicksThisWeek,
        avgClicksPerDay,
        clicksByDay,
        topReferers: referers,
      },
    };
  } catch (error) {
    console.error("[getLinkAnalytics]", error);
    return { success: false, error: "Error interno del servidor" };
  }
}

export async function getDashboardStats(): Promise<ActionResult<DashboardStats>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "No autorizado" };
    }

    const userId = session.user.id;
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalLinks,
      activeLinks,
      protectedLinks,
      totalClicksAgg,
      recentLinksRaw,
      rawClicksLast7,
    ] = await Promise.all([
      prisma.link.count({ where: { userId } }),
      prisma.link.count({ where: { userId, isActive: true } }),
      prisma.link.count({
        where: { userId, NOT: { passwordHash: null } },
      }),
      prisma.click.count({
        where: { link: { userId } },
      }),
      prisma.link.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          slug: true,
          originalUrl: true,
          title: true,
          isActive: true,
          passwordHash: true,
          expiresAt: true,
          createdAt: true,
          updatedAt: true,
          _count: { select: { clicks: true } },
        },
      }),
      prisma.click.findMany({
        where: { link: { userId }, clickedAt: { gte: sevenDaysAgo } },
        select: { clickedAt: true },
      }),
    ]);

    // Clicks por día (últimos 7 días)
    const clicksByDayMap = new Map<string, number>();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split("T")[0];
      clicksByDayMap.set(key, 0);
    }
    for (const click of rawClicksLast7) {
      const key = click.clickedAt.toISOString().split("T")[0];
      clicksByDayMap.set(key, (clicksByDayMap.get(key) ?? 0) + 1);
    }
    const clicksLast7Days = Array.from(clicksByDayMap.entries()).map(([date, clicks]) => ({
      date,
      clicks,
    }));

    return {
      success: true,
      data: {
        totalLinks,
        totalClicks: totalClicksAgg,
        activeLinks,
        protectedLinks,
        recentLinks: recentLinksRaw.map(buildLinkDTO),
        clicksLast7Days,
      },
    };
  } catch (error) {
    console.error("[getDashboardStats]", error);
    return { success: false, error: "Error interno del servidor" };
  }
}
