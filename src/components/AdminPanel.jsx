import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function AdminPanel() {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/overview`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Admin fetch failed");
      setData(json);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  return (
    <div className="rounded-2xl bg-white/5 p-6 shadow-xl ring-1 ring-white/10 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Admin Overview</h3>
        <button
          onClick={load}
          className="rounded-md border border-white/10 px-3 py-1 text-xs text-emerald-100 hover:bg-white/10 transition"
        >
          ↻ Refresh
        </button>
      </div>

      {loading && <p className="text-sm text-slate-300">Loading admin stats…</p>}
      {error && <p className="text-sm text-amber-200">{error}</p>}

      {data && !loading && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-emerald-300/10 p-3 text-center">
              <p className="text-2xl font-bold text-emerald-200">{data.totalUsers}</p>
              <p className="text-xs text-slate-300 mt-1">Total Users</p>
            </div>
            <div className="rounded-lg bg-emerald-300/10 p-3 text-center">
              <p className="text-2xl font-bold text-emerald-200">{data.totalGenerations}</p>
              <p className="text-xs text-slate-300 mt-1">Total Generations</p>
            </div>
          </div>

          {data.topUsers && data.topUsers.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-emerald-200 mb-2">
                Top Users by Generations
              </p>
              <ul className="space-y-1">
                {data.topUsers.map((u) => (
                  <li
                    key={u._id}
                    className="flex justify-between text-xs text-slate-200 rounded bg-white/5 px-3 py-1"
                  >
                    <span className="truncate text-slate-400 font-mono">{u._id}</span>
                    <span className="text-emerald-300 font-semibold ml-2">{u.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
