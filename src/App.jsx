import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./context/AuthContext";
import { api } from "./lib/api";
import AuthCard from "./components/AuthCard";
import GeneratorForm from "./components/GeneratorForm";
import OutputPanel from "./components/OutputPanel";
import HistoryList from "./components/HistoryList";
import QuotaBadge from "./components/QuotaBadge";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  const { user, token, logout } = useAuth();
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [remaining, setRemaining] = useState(null);

  // fetching history 
  const fetchHistory = async () => {
    if (!token) return;
    const data = await api.history(token);
    setHistory(data);
  };

  // updating  quota & fetch history when user logs in
  useEffect(() => {
      console.log("User:", user);
  console.log("Role:", user?.role);
    if (user) {
      setRemaining((user.usageLimit || 5) - (user.usageCount || 0));
      fetchHistory();
    } else {
      setHistory([]);
      setResult(null);
      setRemaining(null);
    }
  }, [user]);

  const usageText = useMemo(() => {
    if (remaining === null || remaining === undefined) return "";
    return `${remaining} run${remaining !== 1 ? "s" : ""} left`;
  }, [remaining]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10 space-y-8">

        {/* Header */}
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-300 mb-1">
              ShoutnHike
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold">AI Marketing Studio</h1>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <QuotaBadge remaining={remaining} plan={user.plan} />
                <button
                  className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10 transition"
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            ) : (
              <span className="text-sm text-slate-300">Authenticate to start generating</span>
            )}
          </div>
        </header>

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">

          {/* Left column */}
          <div className="lg:col-span-2 space-y-4">
            {!user ? (
              // show login/register form first
              <AuthCard />
            ) : (
              // after login, show GeneratorForm
              <GeneratorForm
                onResult={(r) => {
                  setResult(r);
                  if (r) fetchHistory();
                }}
                onInfo={setInfo}
                onError={setError}
                onRemaining={setRemaining}
              />
            )}

            {/* Inline status messages */}
            {error && (
              <div className="rounded-lg bg-amber-400/10 border border-amber-300/20 px-4 py-3">
                <p className="text-sm text-amber-200">{error}</p>
              </div>
            )}
            {info && (
              <div className="rounded-lg bg-emerald-400/10 border border-emerald-300/20 px-4 py-3">
                <p className="text-sm text-emerald-200">{info}</p>
              </div>
            )}
            {usageText && user && (
              <p className="text-xs text-slate-400 px-1">Quota: {usageText}</p>
            )}
          </div>

          {/* Right column — output + history + admin */}
          {user && (
            <div className="lg:col-span-3 space-y-4">

              {/* Output panel */}
              <div className="rounded-2xl bg-white/5 p-6 shadow-xl ring-1 ring-white/10 min-h-[280px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Output</h3>
                  {result?.provider && (
                    <span className="rounded-full bg-emerald-300/20 px-3 py-1 text-xs text-emerald-100">
                      via {result.provider.toUpperCase()}
                    </span>
                  )}
                </div>
                <OutputPanel result={result} />
              </div>

              {/* History panel */}
              <div className="rounded-2xl bg-white/5 p-6 shadow-xl ring-1 ring-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">History</h3>
                  <span className="text-xs text-slate-400">{history.length} entries</span>
                </div>
                <HistoryList items={history} refresh={fetchHistory} />
              </div>

              {/* Admin panel */}
              {user.role === "admin" && <AdminPanel />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}