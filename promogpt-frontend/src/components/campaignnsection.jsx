// src/components/CampaignsSection.jsx
import React, { useCallback, useEffect, useState } from "react";
import api from "../api";
import { getErrorMessage } from "../utils/error";

export default function CampaignsSection({ business, refreshKey }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const businessSlug = business?.slug;

  const fetchCampaigns = useCallback(async () => {
    if (!businessSlug) return;
    setLoading(true);
    try {
      const res = await api.get(`/business/${businessSlug}/campaigns/`);
      setCampaigns(res.data || []);
    } catch (err) {
      // show nothing
    } finally {
      setLoading(false);
    }
  }, [businessSlug]);

  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns, refreshKey]);

  if (!businessSlug) {
    return <section className="panel"><p>Create a workspace to generate campaigns.</p></section>;
  }

  return (
    <div className="card">
      <h2>Your Campaigns</h2>
      {loading ? <p>Loading…</p> : (
        campaigns.length ? campaigns.map(c => (
          <article className="campaign-card" key={c.id}>
            <h4>{c.goal}</h4>
            <div className="campaign-card__section">
              <small>Budget: KSh {Number(c.budget).toLocaleString("en-KE")}</small>
              <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(c.payload, null, 2)}</pre>
            </div>
          </article>
        )) : <p>No campaigns yet. Generate one from the form.</p>
      )}
    </div>
  );
}
