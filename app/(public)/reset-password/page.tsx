import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = { title: "Restablecer contraseña" };

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token } = await searchParams;

  if (!token) {
    redirect("/forgot-password");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        background: "#f0f0f0",
        padding: "40px",
      }}
    >
      {/* Logo */}
      <div style={{ position: "absolute", top: "24px", left: "32px" }}>
        <a href="/" style={{ textDecoration: "none", fontWeight: 700, fontSize: "16px", color: "#1a1a2e" }}>
          Snap<span style={{ color: "#4B7CF3" }}>URL</span>
        </a>
      </div>

      <ResetPasswordForm token={token} />
    </div>
  );
}
