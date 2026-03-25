import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function HistoryList({ items, refresh }) {
  const { token } = useAuth();

  const download = async (id, type) => {
    if (!token) return;
    const url = api.exportUrl(id, type);
    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `content-${id}.${type}`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
      {items.length === 0 && (
        <p className="text-sm text-slate-300">Nothing yet. Generate some content first.</p>
      )}
      {items.map((item) => (
        <div key={item._id} className="rounded-lg border border-white/10 bg-white/5 p-3">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="uppercase tracking-wide text-emerald-200 font-semibold">
              {item.module}
            </span>
            <span>{new Date(item.createdAt).toLocaleString()}</span>
          </div>
          <p className="text-sm font-semibold text-white mt-1">
            {item.keyword || item.result?.ads?.[0]?.headline1 || "—"}
          </p>
          <p className="text-xs text-slate-300">
            Provider:{" "}
            <span className="text-emerald-200 font-medium">
              {item.provider.toUpperCase()}
            </span>
          </p>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => download(item._id, "pdf")}
              className="rounded-md border border-white/10 px-3 py-1 text-xs text-emerald-100 hover:bg-white/10 transition"
            >
              ↓ PDF
            </button>
            <button
              onClick={() => download(item._id, "docx")}
              className="rounded-md border border-white/10 px-3 py-1 text-xs text-emerald-100 hover:bg-white/10 transition"
            >
              ↓ DOCX
            </button>
          </div>
        </div>
      ))}
      {items.length > 0 && (
        <button
          onClick={refresh}
          className="text-xs text-slate-400 hover:text-slate-200 transition mt-1"
        >
          ↻ Refresh history
        </button>
      )}
    </div>
  );
}
