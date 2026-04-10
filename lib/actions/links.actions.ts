"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/utils/hash";
import { generateUniqueSlug } from "@/lib/utils/slug";
import { sanitizeUrl } from "@/lib/utils/url";
import { CreateLinkSchema, UpdateLinkSchema } from "@/lib/validations/link.schema";
import { type ActionResult, type LinkDTO } from "@/types";

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

const LINK_SELECT = {
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
} as const;

export async function createLink(
  rawData: unknown
): Promise<ActionResult<{ id: string; slug: string }>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "No autorizado" };
    }

    const parsed = CreateLinkSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const safeUrl = sanitizeUrl(parsed.data.originalUrl);
    if (!safeUrl) {
      return { success: false, error: "URL no permitida" };
    }

    const slug = await generateUniqueSlug();
    const passwordHash = parsed.data.password
      ? await hashPassword(parsed.data.password)
      : null;

    const link = await prisma.link.create({
      data: {
        slug,
        originalUrl: safeUrl,
        title: parsed.data.title ?? null,
        passwordHash,
        expiresAt: parsed.data.expiresAt ?? null,
        userId: session.user.id,
      },
      select: { id: true, slug: true },
    });

    revalidatePath("/dashboard/links");
    revalidatePath("/dashboard");

    return { success: true, data: link };
  } catch (error) {
    console.error("[createLink]", error);
    return { success: false, error: "Error interno del servidor" };
  }
}

export async function updateLink(
  id: string,
  rawData: unknown
): Promise<ActionResult<LinkDTO>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "No autorizado" };
    }

    const existing = await prisma.link.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing || existing.userId !== session.user.id) {
      return { success: false, error: "No tienes permiso para editar este link" };
    }

    const parsed = UpdateLinkSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const safeUrl = sanitizeUrl(parsed.data.originalUrl);
    if (!safeUrl) {
      return { success: false, error: "URL no permitida" };
    }

    const passwordHash = parsed.data.password
      ? await hashPassword(parsed.data.password)
      : undefined;

    const link = await prisma.link.update({
      where: { id },
      data: {
        originalUrl: safeUrl,
        title: parsed.data.title ?? null,
        expiresAt: parsed.data.expiresAt ?? null,
        isActive: parsed.data.isActive,
        ...(passwordHash !== undefined && { passwordHash }),
      },
      select: LINK_SELECT,
    });

    revalidatePath("/dashboard/links");
    revalidatePath("/dashboard");

    return { success: true, data: buildLinkDTO(link) };
  } catch (error) {
    console.error("[updateLink]", error);
    return { success: false, error: "Error interno del servidor" };
  }
}

export async function deleteLink(id: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "No autorizado" };
    }

    const existing = await prisma.link.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing || existing.userId !== session.user.id) {
      return { success: false, error: "No tienes permiso para eliminar este link" };
    }

    await prisma.link.delete({ where: { id } });

    revalidatePath("/dashboard/links");
    revalidatePath("/dashboard");

    return { success: true, data: undefined };
  } catch (error) {
    console.error("[deleteLink]", error);
    return { success: false, error: "Error interno del servidor" };
  }
}

export async function toggleLinkActive(id: string): Promise<ActionResult<{ isActive: boolean }>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "No autorizado" };
    }

    const existing = await prisma.link.findUnique({
      where: { id },
      select: { userId: true, isActive: true },
    });

    if (!existing || existing.userId !== session.user.id) {
      return { success: false, error: "No tienes permiso para modificar este link" };
    }

    const updated = await prisma.link.update({
      where: { id },
      data: { isActive: !existing.isActive },
      select: { isActive: true },
    });

    revalidatePath("/dashboard/links");
    revalidatePath("/dashboard");

    return { success: true, data: updated };
  } catch (error) {
    console.error("[toggleLinkActive]", error);
    return { success: false, error: "Error interno del servidor" };
  }
}

export async function getUserLinks(): Promise<ActionResult<LinkDTO[]>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "No autorizado" };
    }

    const links = await prisma.link.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: LINK_SELECT,
    });

    return { success: true, data: links.map(buildLinkDTO) };
  } catch (error) {
    console.error("[getUserLinks]", error);
    return { success: false, error: "Error interno del servidor" };
  }
}

export async function getLinkById(id: string): Promise<ActionResult<LinkDTO>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "No autorizado" };
    }

    const link = await prisma.link.findUnique({
      where: { id, userId: session.user.id },
      select: LINK_SELECT,
    });

    if (!link) {
      return { success: false, error: "Link no encontrado" };
    }

    return { success: true, data: buildLinkDTO(link) };
  } catch (error) {
    console.error("[getLinkById]", error);
    return { success: false, error: "Error interno del servidor" };
  }
}
