import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const link = await prisma.link.findUnique({
    where: { slug },
    select: {
      id: true,
      originalUrl: true,
      isActive: true,
      expiresAt: true,
      passwordHash: true,
    },
  });

  if (!link || !link.isActive) {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  if (link.expiresAt && link.expiresAt < new Date()) {
    return NextResponse.redirect(new URL("/link-expired", request.url));
  }

  if (link.passwordHash) {
    const url = new URL(`/protected-gate/${slug}`, request.url);
    url.searchParams.set("auth", "true");
    return NextResponse.redirect(url);
  }

  // Registrar click de forma no-bloqueante
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const userAgent = request.headers.get("user-agent") ?? "";
  const referer = request.headers.get("referer") ?? "";

  prisma.click
    .create({ data: { linkId: link.id, visitorIp: ip, userAgent, referer } })
    .catch((err) => console.error("[click-register]", err));

  return NextResponse.redirect(link.originalUrl, { status: 307 });
}
