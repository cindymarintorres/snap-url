import Link from "next/link";

export function Navbar() {
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        height: "64px",
        background: "rgba(255,255,255,0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ textDecoration: "none" }}>
        <span
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "#1a1a2e",
            letterSpacing: "-0.3px",
          }}
        >
          Snap<span style={{ color: "#4B7CF3" }}>URL</span>
        </span>
      </Link>

      {/* Auth buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Link
          href="/login"
          id="nav-login-btn"
          style={{
            padding: "8px 18px",
            fontSize: "14px",
            fontWeight: 500,
            color: "#374151",
            textDecoration: "none",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            background: "#fff",
            transition: "all 0.15s",
          }}
        >
          Login
        </Link>
        <Link
          href="/register"
          id="nav-signup-btn"
          className="btn-primary"
          style={{ padding: "8px 18px", fontSize: "14px" }}
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}
