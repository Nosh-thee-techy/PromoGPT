// src/pages/dashboard/CreateContent.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FiSend, FiCopy, FiRefreshCw, FiSave } from "react-icons/fi";
import api from "../../api"; // if you have API integration

export default function CreateContent() {
  const location = useLocation();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);

  // Prefill from campaign data if passed
  useEffect(() => {
    if (location.state?.campaign) {
      const { name, goal, tone, product, audience, keywords } = location.state.campaign;
      const prefill = `Generate a ${tone} promotional post for a ${goal} campaign about ${product || "my product"}.
Target audience: ${audience}.
Include these keywords: ${keywords}.`;
      setPrompt(prefill);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setResults([]);

    try {
      // Simulate API response for now
      // Replace this with your backend API call
      setTimeout(() => {
        setResults([
          {
            id: 1,
            text: `🌟 Elevate your brand with ${location.state?.campaign?.product || "our latest product"}! Experience unmatched quality and innovation.`,
          },
          {
            id: 2,
            text: `🚀 Boost engagement with a creative ${location.state?.campaign?.goal || "marketing"} push that connects emotionally with your audience.`,
          },
        ]);
        setLoading(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while generating content.");
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard ✅");
  };

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="p-8 space-y-10">
      <h1 className="text-2xl font-bold text-gray-800">✨ AI Content Studio</h1>
      <p className="text-gray-500">
        Generate promotional content tailored to your campaign and brand.
      </p>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md space-y-6">
        <textarea
          required
          placeholder="Describe what you want to promote..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="input w-full h-36"
        />

        {/* File Upload */}
        <div className="flex items-center justify-between gap-4">
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileUpload}
            className="text-sm text-gray-600"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition"
          >
            <FiSend /> {loading ? "Generating..." : "Generate Content"}
          </button>
        </div>

        {error && <p className="text-red-600">{error}</p>}
      </form>

      {/* Loader */}
      {loading && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600 border-opacity-70"></div>
        </div>
      )}

      {/* Generated Results */}
      {!loading && results.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-700">🧠 Generated Ideas</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {results.map((r) => (
              <div
                key={r.id}
                className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition"
              >
                <p className="text-gray-800 whitespace-pre-line mb-4">{r.text}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleCopy(r.text)}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                  >
                    <FiCopy /> Copy
                  </button>
                  <button
                    onClick={() => alert("Saved to library ✅")}
                    className="flex items-center gap-1 text-sm text-green-600 hover:underline"
                  >
                    <FiSave /> Save
                  </button>
                  <button
                    onClick={() => alert("Regenerating...")}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:underline"
                  >
                    <FiRefreshCw /> Regenerate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
