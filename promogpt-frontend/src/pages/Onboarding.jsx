// src/pages/Onboarding.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    brandName: "",
    industry: "",
    tone: "",
    goals: "",
    website: "",
  });

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const nextStep = () => setStep((p) => p + 1);
  const prevStep = () => setStep((p) => p - 1);

  const handleFinish = (e) => {
    e.preventDefault();
    localStorage.setItem("brandProfile", JSON.stringify(form));
    navigate("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white w-full max-w-2xl p-10 rounded-2xl shadow-lg space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">
          🚀 Let’s set up your brand profile
        </h1>
        <Progress step={step} />

        {step === 1 && (
          <div className="space-y-4">
            <p className="text-gray-500">Tell us about your brand.</p>
            <input
              required
              placeholder="Brand Name"
              value={form.brandName}
              onChange={update("brandName")}
              className="input w-full"
            />
            <input
              required
              placeholder="Industry / Niche"
              value={form.industry}
              onChange={update("industry")}
              className="input w-full"
            />
            <button onClick={nextStep} className="btn btn--primary w-full">
              Next <FiArrowRight />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-gray-500">How would you describe your brand’s voice?</p>
            <select required value={form.tone} onChange={update("tone")} className="input w-full">
              <option value="">Select tone</option>
              <option value="friendly">Friendly & Approachable</option>
              <option value="professional">Professional & Expert</option>
              <option value="playful">Playful & Fun</option>
              <option value="bold">Bold & Ambitious</option>
            </select>
            <button onClick={nextStep} className="btn btn--primary w-full">
              Next <FiArrowRight />
            </button>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleFinish} className="space-y-4">
            <p className="text-gray-500">Your business goals help us tailor AI insights.</p>
            <textarea
              required
              placeholder="What do you want to achieve? (e.g. more leads, sales, visibility)"
              value={form.goals}
              onChange={update("goals")}
              className="input w-full h-24"
            />
            <input
              placeholder="Business Website (optional)"
              value={form.website}
              onChange={update("website")}
              className="input w-full"
            />
            <button type="submit" className="btn bg-green-600 text-white w-full">
              <FiCheckCircle /> Finish Setup
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Progress({ step }) {
  return (
    <div className="flex gap-2 justify-center mb-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`w-10 h-2 rounded-full ${i <= step ? "bg-blue-600" : "bg-gray-200"}`}
        ></div>
      ))}
    </div>
  );
}
