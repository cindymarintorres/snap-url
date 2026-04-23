"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RegisterSchema, type RegisterInput } from "@/lib/validations/auth.schema";
import { registerUser } from "@/lib/actions/auth.actions";
import { Eye, EyeOff } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
  });

  async function onSubmit(data: RegisterInput) {
    setIsLoading(true);
    try {
      const result = await registerUser(data);
      if (result.success) {
        toast.success("Cuenta creada exitosamente. ¡Inicia sesión!");
        router.push("/login");
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Error al crear la cuenta. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-card" style={{ padding: "40px", width: "100%", maxWidth: "420px" }}>
      <h1 style={{ margin: "0 0 28px", fontSize: "22px", fontWeight: 700, color: "#1a1a2e", textAlign: "center" }}>
        Create an account
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Full Name */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>
            Full Name
          </label>
          <input
            id="register-name"
            {...register("name")}
            type="text"
            placeholder="e.g. Jane Doe"
            className="input-base"
            style={{ borderColor: errors.name ? "#ef4444" : undefined }}
          />
          {errors.name && <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#ef4444" }}>{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>
            Email
          </label>
          <input
            id="register-email"
            {...register("email")}
            type="email"
            placeholder="name@example.com"
            className="input-base"
            style={{ borderColor: errors.email ? "#ef4444" : undefined }}
          />
          {errors.email && <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#ef4444" }}>{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>
            Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="register-password"
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="input-base"
              style={{ paddingRight: "44px", borderColor: errors.password ? "#ef4444" : undefined }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: "4px",
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#ef4444" }}>{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>
            Confirm Password
          </label>
          <input
            id="register-confirm-password"
            {...register("confirmPassword")}
            type="password"
            placeholder="••••••••"
            className="input-base"
            style={{ borderColor: errors.confirmPassword ? "#ef4444" : undefined }}
          />
          {errors.confirmPassword && <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#ef4444" }}>{errors.confirmPassword.message}</p>}
        </div>

        {/* Terms */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
          <input
            id="register-terms"
            {...register("terms")}
            type="checkbox"
            style={{ marginTop: "2px", accentColor: "#4B7CF3", cursor: "pointer" }}
          />
          <label htmlFor="register-terms" style={{ fontSize: "13px", color: "#6b7280", cursor: "pointer", lineHeight: 1.5 }}>
            I agree to the{" "}
            <Link href="/terms" style={{ color: "#4B7CF3", textDecoration: "none" }}>terms and conditions</Link>
          </label>
        </div>
        {errors.terms && <p style={{ margin: "-8px 0 0", fontSize: "12px", color: "#ef4444" }}>{errors.terms.message}</p>}

        <button
          id="register-submit-btn"
          type="submit"
          className="btn-primary"
          disabled={isLoading}
          style={{ width: "100%", padding: "12px", marginTop: "4px" }}
        >
          {isLoading ? "Creando cuenta..." : "Create Account"}
        </button>
      </form>

      <p style={{ textAlign: "center", margin: "24px 0 0", fontSize: "14px", color: "#6b7280" }}>
        Already have an account?{" "}
        <Link href="/login" style={{ color: "#4B7CF3", fontWeight: 500, textDecoration: "none" }}>
          Log in
        </Link>
      </p>
    </div>
  );
}
