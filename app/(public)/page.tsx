"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

export default function LandingPage() {
  const [url, setUrl] = useState("");

  function handleShorten(e: React.FormEvent) {
    e.preventDefault();
    if (url.trim()) {
      window.location.href = `/register?url=${encodeURIComponent(url)}`;
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />

      {/* Hero Section */}
      <main
        className="landing-gradient"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "100px 24px 60px",
          textAlign: "center",
        }}
      >
        {/* Headline */}
        <h1
          style={{
            fontSize: "clamp(40px, 7vw, 72px)",
            fontWeight: 800,
            color: "#1a1a2e",
            lineHeight: 1.1,
            letterSpacing: "-2px",
            margin: "0 0 20px",
          }}
        >
          Shorten. Share. Track.
        </h1>

        <p
          style={{
            fontSize: "17px",
            color: "#4b5563",
            lineHeight: 1.6,
            maxWidth: "480px",
            margin: "0 0 48px",
          }}
        >
          A comprehensive URL shortener and analytics platform
          <br />
          built for modern marketing.
        </p>

        {/* URL Input Card */}
        <div
          className="glass-card"
          style={{
            width: "100%",
            maxWidth: "560px",
            borderRadius: "16px",
            padding: "16px",
            marginBottom: "36px",
          }}
        >
          <form
            onSubmit={handleShorten}
            style={{ display: "flex", gap: "12px", alignItems: "center" }}
          >
            <input
              id="landing-url-input"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste a long URL..."
              style={{
                flex: 1,
                padding: "13px 18px",
                border: "none",
                outline: "none",
                fontSize: "15px",
                color: "#374151",
                background: "transparent",
                fontFamily: "inherit",
              }}
            />
            <button
              id="landing-shorten-btn"
              type="submit"
              className="btn-primary"
              style={{ padding: "13px 28px", fontSize: "15px", whiteSpace: "nowrap" }}
            >
              Shorten
            </button>
          </form>
        </div>

        {/* Feature badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "32px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {[
            { icon: "🔗", label: "Instant Shortening" },
            { icon: "📊", label: "Detailed Analytics" },
            { icon: "🛡️", label: "Secure & Reliable" },
          ].map(({ icon, label }) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                color: "#4b5563",
                fontWeight: 500,
              }}
            >
              <span style={{ fontSize: "16px" }}>{icon}</span>
              {label}
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
