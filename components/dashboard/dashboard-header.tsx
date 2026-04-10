"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";

type Props = {
  userName?: string | null;
  userEmail?: string | null;
};

export function DashboardHeader({ userName, userEmail }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  // Build breadcrumb from pathname
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((seg, i) => ({
    label: seg.charAt(0).toUpperCase() + seg.slice(1),
    href: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));

  return (
    <header
      style={{
        height: "56px",
        borderBottom: "1px solid #f0f0f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        background: "#ffffff",
        flexShrink: 0,
      }}
    >
      {/* Breadcrumb */}
      <nav style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", color: "#6b7280" }}>
        <Link href="/dashboard" style={{ color: "#6b7280", textDecoration: "none", fontWeight: 500 }}>
          SnapURL
        </Link>
        {breadcrumbs.slice(1).map(({ label, href, isLast }) => (
          <span key={href} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <ChevronRight size={14} color="#9ca3af" />
            {isLast ? (
              <span style={{ color: "#1a1a2e", fontWeight: 600 }}>{label}</span>
            ) : (
              <Link href={href} style={{ color: "#6b7280", textDecoration: "none" }}>{label}</Link>
            )}
          </span>
        ))}
      </nav>

      {/* User dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger
          id="header-user-menu"
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "6px 12px", borderRadius: "20px",
            border: "1px solid #e5e7eb", background: "#fff",
            cursor: "pointer", fontSize: "14px", fontWeight: 500,
            color: "#374151", transition: "all 0.15s",
          }}
        >
          <div
            style={{
              width: "28px", height: "28px", borderRadius: "50%",
              background: "linear-gradient(135deg, #4B7CF3, #6366F1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "12px", color: "white", fontWeight: 600,
            }}
          >
            {userName?.[0]?.toUpperCase() ?? "U"}
          </div>
          {userName ?? "Usuario"}
          <ChevronDown size={14} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" style={{ minWidth: "180px" }}>
          <div style={{ padding: "8px 12px" }}>
            <p style={{ margin: 0, fontSize: "13px", fontWeight: 600 }}>{userName}</p>
            <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>{userEmail}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => router.push("/dashboard/settings")} 
            style={{ cursor: "pointer" }}
          >
            Configuración
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: "/login" })}
            style={{ cursor: "pointer", color: "#ef4444" }}
          >
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
