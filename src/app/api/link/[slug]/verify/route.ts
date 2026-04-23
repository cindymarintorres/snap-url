import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/utils/hash";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const password: string = body.password ?? "";

    if (!password) {
      return NextResponse.json({ success: false, error: "Contraseña requerida" }, { status: 400 });
    }

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
      return NextResponse.json({ success: false, error: "Link no encontrado" }, { status: 404 });
    }

    if (link.expiresAt && link.expiresAt < new Date()) {
      return NextResponse.json({ success: false, error: "Link expirado" }, { status: 410 });
    }

    if (!link.passwordHash) {
      return NextResponse.json({ success: true, url: link.originalUrl });
    }

    const isValid = await verifyPassword(password, link.passwordHash);
    if (!isValid) {
      return NextResponse.json({ success: false, error: "Contraseña incorrecta" }, { status: 401 });
    }

    // Registrar click
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    const userAgent = request.headers.get("user-agent") ?? "";
    const referer = request.headers.get("referer") ?? "";

    prisma.click
      .create({ data: { linkId: link.id, visitorIp: ip, userAgent, referer } })
      .catch((err) => console.error("[click-register-gate]", err));

    return NextResponse.json({ success: true, url: link.originalUrl });
  } catch (error) {
    console.error("[verify-password-gate]", error);
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 });
  }
}
