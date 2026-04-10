"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ForgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations/auth.schema";
import { forgotPassword } from "@/lib/actions/auth.actions";
import { KeyRound, ChevronLeft } from "lucide-react";

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordInput) {
    setIsLoading(true);
    try {
      await forgotPassword(data);
      setSent(true);
    } catch {
      toast.error("Error al procesar la solicitud.");
    } finally {
      setIsLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="auth-card" style={{ padding: "40px", width: "100%", maxWidth: "380px", textAlign: "center" }}>
        <div style={{ fontSize: "40px", marginBottom: "16px" }}>📧</div>
        <h2 style={{ margin: "0 0 12px", fontSize: "20px", fontWeight: 700 }}>Revisa tu email</h2>
        <p style={{ margin: "0 0 24px", fontSize: "14px", color: "#6b7280", lineHeight: 1.6 }}>
          Si tu email está registrado, recibirás un enlace para restablecer tu contraseña.
        </p>
        <Link href="/login" style={{ fontSize: "14px", color: "#4B7CF3", textDecoration: "none", fontWeight: 500 }}>
          Volver al inicio de sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="auth-card" style={{ padding: "40px", width: "100%", maxWidth: "380px" }}>
      {/* Icon */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(75,124,243,0.1), rgba(99,102,241,0.1))",
          }}
        >
          <KeyRound size={24} color="#4B7CF3" />
        </div>
      </div>

      <h1 style={{ margin: "0 0 8px", fontSize: "22px", fontWeight: 700, color: "#1a1a2e", textAlign: "center" }}>
        Forgot password?
      </h1>
      <p style={{ margin: "0 0 28px", fontSize: "14px", color: "#6b7280", textAlign: "center", lineHeight: 1.5 }}>
        No worries, we&apos;ll send you reset instructions.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>
            Email
          </label>
          <input
            id="forgot-email"
            {...register("email")}
            type="email"
            placeholder="e.g. john.doe@example.com"
            className="input-base"
            style={{ borderColor: errors.email ? "#ef4444" : undefined }}
          />
          {errors.email && <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#ef4444" }}>{errors.email.message}</p>}
        </div>

        <button
          id="forgot-submit-btn"
          type="submit"
          className="btn-primary"
          disabled={isLoading}
          style={{ width: "100%", padding: "12px" }}
        >
          {isLoading ? "Enviando..." : "Reset password"}
        </button>
      </form>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Link
          href="/login"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px", color: "#6b7280", textDecoration: "none" }}
        >
          <ChevronLeft size={14} /> Back to log in
        </Link>
      </div>
    </div>
  );
}
