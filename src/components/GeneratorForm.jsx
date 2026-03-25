import { useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function GeneratorForm({ onResult, onInfo, onError, onRemaining }) {
  const { token } = useAuth();
  const [moduleType, setModuleType] = useState("seo");
  const [inputs, setInputs] = useState({ keyword: "", url: "", product: "", audience: "" });
  const [busy, setBusy] = useState(false);
  const [streaming, setStreaming] = useState(false);

  const updateInput = (field, value) => setInputs((prev) => ({ ...prev, [field]: value }));

  const run = async () => {
    if (!token) return;
    setBusy(true);
    onError(null);
    onInfo(null);
    onResult(null);
    try {
      const payload =
        moduleType === "seo"
          ? { moduleType, keyword: inputs.keyword, url: inputs.url }
          : { moduleType, keyword: inputs.keyword, product: inputs.product, audience: inputs.audience };

      const data = await api.generate(token, payload);
      onResult({ ...data.result, provider: data.provider });
      onRemaining(data.remaining);
      onInfo(`Generated with ${data.provider.toUpperCase()}`);
    } catch (err) {
      onError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const stream = async () => {
    if (!token) return;
    onResult(null);
    onError(null);
    onInfo("Streaming...");
    setStreaming(true);

    const params = new URLSearchParams(
      moduleType === "seo"
        ? { moduleType, keyword: inputs.keyword, url: inputs.url || "" }
        : {
            moduleType,
            keyword: inputs.keyword || "",
            product: inputs.product,
            audience: inputs.audience || "",
          }
    ).toString();

    // Append token as query param for EventSource (cannot set headers)
    const url = api.streamUrl(params) + `&token=${encodeURIComponent(token)}`;
    const ev = new EventSource(url);
    let buffer = "";

    ev.onmessage = (evt) => {
      buffer += evt.data;
      onResult({ raw: buffer });
    };

    ev.addEventListener("provider", (e) => onInfo(`Provider: ${e.data}`));

    ev.addEventListener("done", (e) => {
      try {
        const parsed = JSON.parse(e.data);
        onRemaining(parsed.remaining);
      } catch {}
      ev.close();
      setStreaming(false);
    });

    ev.addEventListener("error", () => {
      onError("Stream error or connection closed");
      ev.close();
      setStreaming(false);
    });
  };

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none text-white";

  return (
    <div className="rounded-2xl bg-white/5 p-6 shadow-xl ring-1 ring-white/10 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Generate content</h2>
        <div className="flex gap-2 rounded-full bg-white/10 p-1 text-sm">
          <button
            className={`rounded-full px-3 py-1 transition ${
              moduleType === "seo" ? "bg-white text-slate-900 font-semibold" : "text-slate-200"
            }`}
            onClick={() => setModuleType("seo")}
          >
            SEO
          </button>
          <button
            className={`rounded-full px-3 py-1 transition ${
              moduleType === "ads" ? "bg-white text-slate-900 font-semibold" : "text-slate-200"
            }`}
            onClick={() => setModuleType("ads")}
          >
            Google Ads
          </button>
        </div>
      </div>

      {moduleType === "seo" ? (
        <div className="space-y-3">
          <input
            className={inputClass}
            placeholder="Target keyword (required)"
            value={inputs.keyword}
            onChange={(e) => updateInput("keyword", e.target.value)}
          />
          <input
            className={inputClass}
            placeholder="Reference URL or topic (optional)"
            value={inputs.url}
            onChange={(e) => updateInput("url", e.target.value)}
          />
        </div>
      ) : (
        <div className="space-y-3">
          <input
            className={inputClass}
            placeholder="Product / service (required)"
            value={inputs.product}
            onChange={(e) => updateInput("product", e.target.value)}
          />
          <input
            className={inputClass}
            placeholder="Target audience"
            value={inputs.audience}
            onChange={(e) => updateInput("audience", e.target.value)}
          />
          <input
            className={inputClass}
            placeholder="Optional keyword (for reporting)"
            value={inputs.keyword}
            onChange={(e) => updateInput("keyword", e.target.value)}
          />
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={run}
          disabled={busy || streaming}
          className="w-full rounded-lg bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-emerald-300 disabled:opacity-50"
        >
          {busy ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Generating...
            </span>
          ) : (
            "Generate"
          )}
        </button>
        <button
          onClick={stream}
          disabled={busy || streaming}
          className="w-full rounded-lg border border-emerald-300 px-4 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-white/10 disabled:opacity-50"
        >
          {streaming ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Streaming...
            </span>
          ) : (
            "Stream"
          )}
        </button>
      </div>
    </div>
  );
}
