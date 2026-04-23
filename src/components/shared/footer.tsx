import Link from "next/link";

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid #f0f0f0",
        padding: "24px 32px",
        textAlign: "center",
        background: "rgba(255,255,255,0.6)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "32px",
          marginBottom: "12px",
          flexWrap: "wrap",
        }}
      >
        {["Features", "Pricing", "About", "Contact"].map((item) => (
          <Link
            key={item}
            href={`/${item.toLowerCase()}`}
            style={{
              fontSize: "13px",
              color: "#6b7280",
              textDecoration: "none",
              transition: "color 0.15s",
            }}
          >
            {item}
          </Link>
        ))}
      </div>
      <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af" }}>
        © 2024 SnapURL. All rights reserved.
      </p>
    </footer>
  );
}
