// src/components/UploadSection.jsx
import React, { useState } from "react";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";
import { getErrorMessage } from "../utils/error";

export default function UploadSection({ business, onUploadComplete }) {
  const { token } = useAuth();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const businessSlug = business?.slug;
  if (!businessSlug) {
    return (
      <section className="panel">
        <header><h2>Upload your business data</h2></header>
        <div className="panel__empty">
          <p>Add a workspace to enable uploads.</p>
        </div>
      </section>
    );
  }

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: "error", text: "Please select a CSV file." });
      return;
    }
    const fd = new FormData();
    fd.append("file", file);
    setUploading(true); setMessage({ type: "", text: "" });
    try {
      await api.post(`/business/${businessSlug}/products/upload/`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage({ type: "success", text: "Upload successful! Your data is being processed." });
      setFile(null);
      onUploadComplete?.();
    } catch (err) {
      setMessage({ type: "error", text: getErrorMessage(err.response?.data, "Upload failed.") });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card">
      <h2>Upload Your Business Data</h2>
      <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button className="btn btn--primary" onClick={handleUpload} disabled={uploading}>{uploading ? "Uploading…" : "Upload CSV"}</button>
      {message.text && <div className={`alert alert--${message.type}`}>{message.text}</div>}
    </div>
  );
}
