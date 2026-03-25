import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
export default function AuthCard() {
  const { login, register, loading } = useAuth();
    const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  const submit = async () => {
    setError(null);
    try {
      if (mode === "login") await login(form);
      else await register(form);
        //navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") submit();
  };

  return (
    <div className="rounded-2xl bg-white/5 p-6 shadow-xl ring-1 ring-white/10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          {mode === "login" ? "Login" : "Create account"}
        </h2>
        <button
          className="text-sm text-emerald-200 hover:text-white transition"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login" ? "Need an account?" : "Have an account?"}
        </button>
      </div>

      <div className="space-y-3">
        <input
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none"
          placeholder="email@example.com"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          onKeyDown={handleKeyDown}
        />
        <input
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none"
          placeholder="password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={submit}
          disabled={loading}
          className="w-full rounded-lg bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-emerald-300 disabled:opacity-50"
        >
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
        </button>
        {error && <p className="text-sm text-amber-200">{error}</p>}
      </div>
    </div>
  );
}
