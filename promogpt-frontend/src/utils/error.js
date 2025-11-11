// src/utils/error.js
export function getErrorMessage(error, fallback = "Something went wrong.") {
  if (!error) return fallback;
  if (typeof error === "string") return error;
  if (Array.isArray(error)) return error[0] || fallback;
  const key = Object.keys(error || {})[0];
  const val = key ? error[key] : null;
  if (Array.isArray(val)) return val[0] || fallback;
  if (typeof val === "string") return val;
  return fallback;
}
