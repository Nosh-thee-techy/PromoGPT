// src/pages/Demo.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import BrandMark from "../components/BrandMark";

export default function Demo() {
  const navigate = useNavigate();
  return (
    <div className="page page--gradient page--centered">
      <div className="demo-card">
        <BrandMark size="lg" />
        <h2>Dashboard demo</h2>
        <p>Explore how the dashboard looks and works with sample data.</p>
        <div className="demo-card__actions">
          <button className="btn btn--primary" onClick={() => navigate("/signup")}>Create a free account</button>
          <button className="btn btn--ghost" onClick={() => navigate("/login")}>I already have access</button>
        </div>
      </div>
    </div>
  );
}
