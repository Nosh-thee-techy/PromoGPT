// src/pages/dashboard/CreateContent.jsx
import React, { useState } from "react";
import api from "../../api";

export default function CreateContent() {
  const [goal, setGoal] = useState("");
  const [tone, setTone] = useState("friendly");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function handleGenerate(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      // Example payload - backend endpoint should accept this
      const payload = { goal, tone };
      const res = await api.post("/business/me/generate/", payload).catch((r) => r);
      // if backend not present, show mock result
      if (!res || res.status >= 400) {
        setResult({
          title: "Weekend Special: 20% off!",
          captions: [
            "Flash sale — 20% off on all items this weekend. Visit us today!",
            "This weekend only: Buy one get 20% off. Limited stock!",
          ],
        });
      } else {
        setResult(res.data);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel">
      <h2>Create content</h2>
      <p className="muted">Tell the AI what you want — get ready-to-publish assets.</p>

      <form className="generate-form" onSubmit={handleGenerate}>
        <label>
          Campaign goal
          <input required value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g. Promote weekend sale" />
        </label>

        <label>
          Tone
          <select value={tone} onChange={(e) => setTone(e.target.value)}>
            <option value="friendly">Friendly</option>
            <option value="urgent">Urgent</option>
            <option value="professional">Professional</option>
          </select>
        </label>

        <button className="btn btn--primary" type="submit" disabled={loading}>
          {loading ? "Generating…" : "Generate"}
        </button>
      </form>

      {result && (
        <div className="result">
          <h3>{result.title}</h3>
          <div>
            {result.captions?.map((c, i) => (
              <div key={i} className="result__item">
                <p>{c}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
