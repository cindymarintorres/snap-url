"use client";

import { useState } from "react";
import { ProfileTab } from "@/components/dashboard/settings-profile-tab";

type User = {
  id: string;
  name: string | null;
  email: string;
  bio: string | null;
  avatarUrl: string | null;
};

const TABS = ["Profile", "Security", "Preferences"] as const;
type Tab = (typeof TABS)[number];

export function SettingsClient({ user }: { user: User }) {
  const [activeTab, setActiveTab] = useState<Tab>("Profile");

  return (
    <div style={{ maxWidth: "800px" }}>
      {/* Page title */}
      <h1 style={{ margin: "0 0 28px", fontSize: "28px", fontWeight: 700, color: "#1a1a2e" }}>
        User Settings
      </h1>

      {/* Tab navigation */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          padding: "4px",
          background: "#f3f4f6",
          borderRadius: "10px",
          width: "fit-content",
          marginBottom: "28px",
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            id={`settings-tab-${tab.toLowerCase()}`}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "8px 24px",
              borderRadius: "8px",
              border: "none",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.15s",
              background: activeTab === tab ? "#fff" : "transparent",
              color: activeTab === tab ? "#1a1a2e" : "#6b7280",
              boxShadow: activeTab === tab ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "Profile" && <ProfileTab user={user} />}

      {activeTab === "Security" && (
        <div
          style={{
            background: "#fff", borderRadius: "12px", padding: "32px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)", textAlign: "center", color: "#6b7280",
          }}
        >
          <p style={{ margin: 0 }}>🔒 Cambio de contraseña — próximamente</p>
        </div>
      )}

      {activeTab === "Preferences" && (
        <div
          style={{
            background: "#fff", borderRadius: "12px", padding: "32px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)", textAlign: "center", color: "#6b7280",
          }}
        >
          <p style={{ margin: 0 }}>⚙️ Preferencias — próximamente</p>
        </div>
      )}
    </div>
  );
}
