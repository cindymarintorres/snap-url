"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Link2,
  BarChart2,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/links", label: "Links", icon: Link2 },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

type Props = {
  userName?: string | null;
  userEmail?: string | null;
  userAvatar?: string | null;
};

export function AppSidebar({ userName, userEmail, userAvatar }: Props) {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: "240px",
        minWidth: "240px",
        background: "#1E2334",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "24px 20px 20px" }}>
        <Link href="/dashboard" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px", height: "32px", borderRadius: "8px",
              background: "linear-gradient(135deg, #4B7CF3, #6366F1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "16px",
            }}
          >
            🔗
          </div>
          <span style={{ fontWeight: 700, fontSize: "17px", color: "#ffffff", letterSpacing: "-0.3px" }}>
            Snap<span style={{ color: "#7c9ef8" }}>URL</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "8px 12px", display: "flex", flexDirection: "column", gap: "2px" }}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              id={`sidebar-${label.toLowerCase()}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 12px",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#ffffff" : "rgba(255,255,255,0.6)",
                background: isActive
                  ? "rgba(75,124,243,0.25)"
                  : "transparent",
                transition: "all 0.15s",
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User info + logout */}
      <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", marginBottom: "4px" }}>
          <div
            style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: userAvatar ? `url(${userAvatar})` : "linear-gradient(135deg, #4B7CF3, #6366F1)",
              backgroundSize: "cover",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "13px", color: "white", fontWeight: 600, flexShrink: 0,
            }}
          >
            {!userAvatar && (userName?.[0]?.toUpperCase() ?? "U")}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {userName ?? "Usuario"}
            </p>
          </div>
        </div>

        <button
          id="sidebar-logout-btn"
          onClick={() => signOut({ callbackUrl: "/login" })}
          style={{
            display: "flex", alignItems: "center", gap: "10px",
            width: "100%", padding: "10px 12px", borderRadius: "8px",
            border: "none", background: "transparent", cursor: "pointer",
            fontSize: "14px", color: "rgba(255,255,255,0.5)",
            transition: "all 0.15s", textAlign: "left",
          }}
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </aside>
  );
}
