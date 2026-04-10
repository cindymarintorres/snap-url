"use server";

import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/utils/hash";
import { hoursFromNow } from "@/lib/utils/date";
import { sendEmail } from "@/lib/email/mailer";
import { resetPasswordTemplate } from "@/lib/email/templates/reset-password";
import {
  RegisterSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
} from "@/lib/validations/auth.schema";
import { type ActionResult } from "@/types";
import crypto from "crypto";

export async function registerUser(rawData: unknown): Promise<ActionResult> {
  try {
    const parsed = RegisterSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: "Ya existe una cuenta con este email." };
    }

    const passwordHash = await hashPassword(password);

    await prisma.user.create({
      data: { name, email, passwordHash },
    });

    return { success: true, data: undefined };
  } catch (error) {
    console.error("[registerUser]", error);
    return { success: false, error: "Error interno del servidor." };
  }
}

export async function forgotPassword(rawData: unknown): Promise<ActionResult> {
  try {
    const parsed = ForgotPasswordSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const { email } = parsed.data;
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true },
    });

    // Always respond the same (no user enumeration)
    if (!user) return { success: true, data: undefined };

    const token = crypto.randomBytes(32).toString("hex");
    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: hoursFromNow(1),
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
    await sendEmail({
      to: user.email,
      subject: "Restablecer contraseña — SnapURL",
      html: resetPasswordTemplate({ userName: user.name ?? "Usuario", resetUrl }),
    });

    return { success: true, data: undefined };
  } catch (error) {
    console.error("[forgotPassword]", error);
    return { success: true, data: undefined }; // No revelar errores internos
  }
}

export async function resetPassword(rawData: unknown): Promise<ActionResult> {
  try {
    const parsed = ResetPasswordSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const { token, password } = parsed.data;

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      select: { id: true, userId: true, expiresAt: true, usedAt: true },
    });

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
      return { success: false, error: "El enlace es inválido o ha expirado." };
    }

    const passwordHash = await hashPassword(password);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return { success: true, data: undefined };
  } catch (error) {
    console.error("[resetPassword]", error);
    return { success: false, error: "Error interno del servidor." };
  }
}
