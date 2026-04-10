import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = { title: "Crear cuenta" };

export default function RegisterPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8f9fb",
        padding: "24px",
      }}
    >
      {/* Logo */}
      <div style={{ position: "absolute", top: "24px", left: "32px" }}>
        <a href="/" style={{ textDecoration: "none", fontWeight: 700, fontSize: "16px", color: "#1a1a2e" }}>
          Snap<span style={{ color: "#4B7CF3" }}>URL</span>
        </a>
      </div>

      <RegisterForm />
    </div>
  );
}
