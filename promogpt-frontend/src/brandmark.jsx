// src/components/BrandMark.jsx
import React from "react";

export default function BrandMark({ size = "md", stacked = false }) {
  const classes = ["brand-mark", `brand-mark--${size}`];
  if (stacked) classes.push("brand-mark--stacked");
  return (
    <div className={classes.join(" ")}>
      <span className="brand-mark__icon" role="img" aria-label="PromoGPT logo">
        🦁
      </span>
      <span className="brand-mark__text">PromoGPT</span>
    </div>
  );
}
