// src/components/DashboardOverview.jsx
import React from "react";
import BusinessCreationForm from "./BusinessCreationForm";

export default function DashboardOverview({ businesses = [], loading, selectedBusinessSlug, onSelectBusiness, onReload }) {
  return (
    <section className="panel panel--overview">
      <header className="panel__header">
        <h2 className="panel__title">Your PromoGPT workspace</h2>
        <p className="panel__subtitle">Major actions and workspace quick links.</p>
      </header>

      <div className="overview-grid">
        <article className="overview-card">
          <h3 className="overview-card__title">Agent status</h3>
          <p className="overview-card__body">CampaignGenerator will read cleaned product & sales data and create campaign kits.</p>
        </article>

        <article className="overview-card">
          <h3 className="overview-card__title">Active workspace</h3>
          {loading ? (
            <p>Loading business profiles…</p>
          ) : businesses.length ? (
            <>
              <select value={selectedBusinessSlug} onChange={(e) => onSelectBusiness(e.target.value)} className="form__input">
                {businesses.map((b) => <option key={b.slug || b.id} value={b.slug}>{b.name} · {b.industry}</option>)}
              </select>
              <ul className="overview-card__list">
                {businesses.map((b) => <li key={b.slug}>{b.name} · {b.industry}</li>)}
              </ul>
            </>
          ) : (
            <p>Add your first business to get started.</p>
          )}
          <BusinessCreationForm onCreated={onReload} />
        </article>
      </div>
    </section>
  );
}
