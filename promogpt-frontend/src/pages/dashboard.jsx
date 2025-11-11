// src/pages/Dashboard.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import BrandMark from "../components/BrandMark";
import UploadSection from "../components/UploadSection";
import CampaignsSection from "../components/CampaignsSection";
import DashboardOverview from "../components/DashboardOverview";
import api from "../api";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusinessSlug, setSelectedBusinessSlug] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upload");
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchBusinesses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/users/business/");
      const data = res.data || [];
      setBusinesses(data);
      if (data.length && !selectedBusinessSlug) setSelectedBusinessSlug(data[0].slug);
    } catch (err) {
      // ignore - show empty state
    } finally {
      setLoading(false);
    }
  }, [selectedBusinessSlug]);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <BrandMark size="sm" />
        <div className="app-shell__header-actions">
          <div className="app-shell__welcome">
            <p>Karibu, <strong>{user?.first_name}</strong></p>
            <p className="app-shell__helper">Track uploads, monitor the agent, and launch campaigns.</p>
          </div>
          <button className="btn btn--ghost" onClick={logout}>Logout</button>
        </div>
      </header>

      <main className="app-shell__main">
        <DashboardOverview
          businesses={businesses}
          loading={loading}
          selectedBusinessSlug={selectedBusinessSlug}
          onSelectBusiness={setSelectedBusinessSlug}
          onReload={fetchBusinesses}
        />

        <div className="tablist" role="tablist">
          <button className={activeTab === "upload" ? "tablist__button is-active" : "tablist__button"} onClick={() => setActiveTab("upload")}>📤 Upload</button>
          <button className={activeTab === "campaigns" ? "tablist__button is-active" : "tablist__button"} onClick={() => setActiveTab("campaigns")}>🚀 Campaigns</button>
        </div>

        {activeTab === "upload" && <UploadSection business={businesses.find(b => b.slug === selectedBusinessSlug)} onUploadComplete={() => setRefreshKey(k => k + 1)} />}
        {activeTab === "campaigns" && <CampaignsSection business={businesses.find(b => b.slug === selectedBusinessSlug)} refreshKey={refreshKey} />}
      </main>
    </div>
  );
}
