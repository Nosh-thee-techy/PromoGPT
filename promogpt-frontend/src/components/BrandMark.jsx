// src/components/BrandMark.jsx
import React from "react";

export default function BrandMark({ size = "md", stacked = false }) {
  const sizes = { sm: "48px", md: "64px", lg: "96px" };
  const fontSizes = { sm: "1rem", md: "1.25rem", lg: "1.6rem" };
  const circle = {
    width: sizes[size] ?? sizes.md,
    height: sizes[size] ?? sizes.md,
    borderRadius: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 30px rgba(76,29,149,0.18)",
    background: "linear-gradient(135deg,#4C1D95 0%, #7C3AED 100%)",
  };

  return (
    <div
      style={{
        display: "flex",
        gap: stacked ? 8 : 12,
        alignItems: "center",
        flexDirection: stacked ? "column" : "row",
      }}
    >
      <div style={circle}>
        {/* stylized P + upward stroke to hint growth */}
        <svg width="40" height="40" viewBox="0 0 64 64" fill="none" aria-hidden>
          <defs>
            <linearGradient id="g" x1="0" x2="1">
              <stop offset="0" stopColor="#FFD24D" />
              <stop offset="1" stopColor="#FACC15" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="64" height="64" rx="12" fill="transparent" />
          <path d="M20 42 C20 30, 34 30, 34 38 C34 44, 26 46, 44 46" stroke="url(#g)" strokeWidth="4" strokeLinecap="round" fill="none" />
          <circle cx="44" cy="18" r="7" fill="url(#g)" />
        </svg>
      </div>

      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span style={{ fontWeight: 700, fontSize: fontSizes[size] ?? fontSizes.md, color: "#0F172A" }}>
          PromoGPT
        </span>
        <small style={{ color: "rgba(15,23,42,0.6)", fontSize: 12, marginTop: 2 }}>
          AI marketing for growth
        </small>
      </div>
    </div>
  );
}
