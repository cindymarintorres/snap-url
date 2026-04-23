"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ResetPasswordSchema, type ResetPasswordInput } from "@/lib/validations/auth.schema";
import { resetPassword } from "@/lib/actions/auth.actions";
import { Eye, EyeOff, Check } from "lucide-react";

type Props = { token: string };

export function ResetPasswordForm({ token }: Props) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { token },
  });

  const password = watch("password", "");

  const requirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains one number", met: /[0-9]/.test(password) },
    { label: "Contains one uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains one symbol", met: /[^a-zA-Z0-9]/.test(password) },
  ];

  async function onSubmit(data: ResetPasswordInput) {
    setIsLoading(true);
    try {
      const result = await resetPassword(data);
      if (result.success) {
        toast.success("Contraseña restablecida. Inicia sesión con tu nueva contraseña.");
        router.push("/login");
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Error al restablecer la contraseña.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-card" style={{ padding: "40px", width: "100%", maxWidth: "420px" }}>
      <h1 style={{ margin: "0 0 8px", fontSize: "22px", fontWeight: 700, color: "#1a1a2e" }}>
        Set new password
      </h1>
      <p style={{ margin: "0 0 28px", fontSize: "14px", color: "#6b7280", lineHeight: 1.5 }}>
        Your new password must be different to previously used passwords.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <input {...register("token")} type="hidden" />

        {/* New Password */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>
            New Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="reset-password"
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              className="input-base"
              style={{ paddingRight: "44px", borderColor: errors.password ? "#ef4444" : undefined }}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: "4px" }}>
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>
            Confirm New Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="reset-confirm-password"
              {...register("confirmPassword")}
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm new password"
              className="input-base"
              style={{ paddingRight: "44px", borderColor: errors.confirmPassword ? "#ef4444" : undefined }}
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: "4px" }}>
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#ef4444" }}>{errors.confirmPassword.message}</p>}
        </div>

        {/* Requirements */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {requirements.map(({ label, met }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "16px", height: "16px", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: met ? "#22c55e" : "transparent",
                  border: met ? "none" : "1.5px solid #d1d5db",
                  transition: "all 0.2s",
                  flexShrink: 0,
                }}
              >
                {met && <Check size={10} color="white" strokeWidth={3} />}
              </div>
              <span style={{ fontSize: "13px", color: met ? "#16a34a" : "#6b7280" }}>{label}</span>
            </div>
          ))}
        </div>

        <button
          id="reset-submit-btn"
          type="submit"
          className="btn-primary"
          disabled={isLoading}
          style={{ width: "100%", padding: "12px" }}
        >
          {isLoading ? "Restableciendo..." : "Reset password"}
        </button>
      </form>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Link href="/login" style={{ fontSize: "14px", color: "#4B7CF3", textDecoration: "none", fontWeight: 500 }}>
          Back to login
        </Link>
      </div>
    </div>
  );
}
