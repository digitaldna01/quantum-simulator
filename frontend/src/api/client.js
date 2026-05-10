// Resolved at build time. Empty string -> same-origin (Flask serves the SPA).
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export async function postJson(path, body, { signal } = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
  if (!response.ok) {
    throw new Error(`Request to ${path} failed: ${response.status}`);
  }
  return response.json();
}
