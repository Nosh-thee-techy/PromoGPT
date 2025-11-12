// src/pages/dashboard/Campaign.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiArrowLeft, FiCheckCircle } from "react-icons/fi";

export default function Campaign() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    goal: "",
    product: "",
    audience: "",
    tone: "",
    keywords: "",
  });

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Campaign Data:", form);
    navigate("/dashboard/generate", { state: { campaign: form } });
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">🎯 Create New Campaign</h1>

      {/* Progress Steps */}
      <div className="flex items-center gap-4 mb-8">
        {["Basic Info", "Audience & Tone", "Review"].map((label, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 ${i + 1 <= step ? "text-blue-600" : "text-gray-400"}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold border-2 ${
                i + 1 <= step ? "border-blue-600 bg-blue-100" : "border-gray-300"
              }`}
            >
              {i + 1 < step ? <FiCheckCircle /> : i + 1}
            </div>
            <span className="text-sm font-medium">{label}</span>
            {i < 2 && <div className="w-10 h-[2px] bg-gray-300 mx-2"></div>}
          </div>
        ))}
      </div>

      {/* Form Sections */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Step 1: Basic Info</h2>
            <input
              required
              placeholder="Campaign Name"
              value={form.name}
              onChange={update("name")}
              className="input w-full"
            />
            <select required value={form.goal} onChange={update("goal")} className="input w-full">
              <option value="">Select Goal</option>
              <option value="awareness">Brand Awareness</option>
              <option value="engagement">Customer Engagement</option>
              <option value="leads">Lead Generation</option>
              <option value="sales">Sales Boost</option>
            </select>
            <input
              placeholder="Target Product (optional)"
              value={form.product}
              onChange={update("product")}
              className="input w-full"
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Step 2: Audience & Tone</h2>
            <textarea
              required
              placeholder="Describe your target audience..."
              value={form.audience}
              onChange={update("audience")}
              className="input w-full h-24"
            />
            <select required value={form.tone} onChange={update("tone")} className="input w-full">
              <option value="">Select Tone</option>
              <option value="friendly">Friendly</option>
              <option value="professional">Professional</option>
              <option value="bold">Bold & Confident</option>
              <option value="playful">Playful</option>
            </select>
            <input
              placeholder="Keywords (comma separated)"
              value={form.keywords}
              onChange={update("keywords")}
              className="input w-full"
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Step 3: Review & Launch</h2>
            <div className="bg-gray-50 rounded-xl p-4 text-gray-700 space-y-2">
              <p><strong>Name:</strong> {form.name}</p>
              <p><strong>Goal:</strong> {form.goal}</p>
              <p><strong>Product:</strong> {form.product || "—"}</p>
              <p><strong>Audience:</strong> {form.audience}</p>
              <p><strong>Tone:</strong> {form.tone}</p>
              <p><strong>Keywords:</strong> {form.keywords}</p>
            </div>
            <p className="text-gray-500 text-sm">
              Once you confirm, we’ll generate campaign content tailored to this setup.
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {step > 1 ? (
            <button type="button" onClick={prevStep} className="btn border px-4 py-2 rounded-lg hover:bg-gray-100">
              <FiArrowLeft className="inline-block mr-1" /> Back
            </button>
          ) : (
            <span></span>
          )}
          {step < 3 ? (
            <button type="button" onClick={nextStep} className="btn bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Next <FiArrowRight className="inline-block ml-1" />
            </button>
          ) : (
            <button type="submit" className="btn bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              Launch Campaign
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
