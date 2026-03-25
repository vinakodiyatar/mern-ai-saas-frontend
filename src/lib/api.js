const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export const api = {
  async auth(path, payload) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Auth failed");
    return data;
  },

  async generate(token, payload) {
    const res = await fetch(`${API_BASE}/api/ai/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Generation failed");
    return data;
  },

  async history(token) {
    const res = await fetch(`${API_BASE}/api/ai/history`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    return res.json();
  },

  exportUrl(id, type) {
    return `${API_BASE}/api/ai/export/${id}/${type}`;
  },

  streamUrl(query) {
    return `${API_BASE}/api/ai/stream?${query}`;
  },
};
