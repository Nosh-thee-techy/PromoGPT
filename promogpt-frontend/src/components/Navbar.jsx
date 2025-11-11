import React from "react";
import { useNavigate } from "react-router-dom";
import BrandMark from "./BrandMark";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar__left" onClick={() => navigate("/")}>
        <BrandMark size="sm" />
      </div>
      <div className="navbar__right">
        <button className="link-button" onClick={() => navigate("/login")}>Login</button>
        <button className="btn btn--primary" onClick={() => navigate("/signup")}>Get Started</button>
      </div>
    </nav>
  );
}
