"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoginSchema, type LoginInput } from "@/lib/validations/auth.schema";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Credenciales incorrectas. Verifica tu email y contraseña.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      toast.error("Error al iniciar sesión. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-card" style={{ padding: "40px", width: "100%", maxWidth: "400px" }}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "28px" }}>
          <div
            style={{
              width: "28px", height: "28px", borderRadius: "8px",
              background: "linear-gradient(135deg, #4B7CF3, #6366F1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "14px",
            }}
          >
            🔗
          </div>
          <span style={{ fontWeight: 700, fontSize: "16px", color: "#1a1a2e" }}>
            Snap<span style={{ color: "#4B7CF3" }}>URL</span>
          </span>
        </div>
      </Link>

      <h1 style={{ margin: "0 0 6px", fontSize: "24px", fontWeight: 700, color: "#1a1a2e" }}>
        Welcome back
      </h1>
      <p style={{ margin: "0 0 28px", fontSize: "14px", color: "#6b7280" }}>
        Sign in to continue to your account
      </p>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Email */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>
            Email address
          </label>
          <input
            id="login-email"
            {...register("email")}
            type="email"
            placeholder="name@example.com"
            className="input-base"
            style={{ borderColor: errors.email ? "#ef4444" : undefined }}
          />
          {errors.email && (
            <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#ef4444" }}>{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <label style={{ fontSize: "13px", fontWeight: 500, color: "#374151" }}>Password</label>
            <Link href="/forgot-password" style={{ fontSize: "12px", color: "#4B7CF3", textDecoration: "none" }}>
              Forgot password?
            </Link>
          </div>
          <div style={{ position: "relative" }}>
            <input
              id="login-password"
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
          {errors.password && (
            <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#ef4444" }}>{errors.password.message}</p>
          )}
        </div>

        <button
          id="login-submit-btn"
          type="submit"
          className="btn-primary"
          disabled={isLoading}
          style={{ width: "100%", marginTop: "8px", padding: "12px" }}
        >
          {isLoading ? "Iniciando sesión..." : "Sign In"}
        </button>
      </form>

      <p style={{ textAlign: "center", margin: "24px 0 0", fontSize: "14px", color: "#6b7280" }}>
        Don&apos;t have an account?{" "}
        <Link href="/register" style={{ color: "#4B7CF3", fontWeight: 500, textDecoration: "none" }}>
          Sign up
        </Link>
      </p>
    </div>
  );
}
