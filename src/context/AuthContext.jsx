import { createContext, useContext, useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const AuthContext = createContext({
  user: null,
  token: null,
  loading: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("ai-saas-auth");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed.user);
      setToken(parsed.token);
    }
  }, []);

  const persist = (payload) => {
    setUser(payload.user);
    setToken(payload.token);
    localStorage.setItem("ai-saas-auth", JSON.stringify(payload));
  };

  const authCall = async (path, body) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Authentication failed");
      persist({ user: data.user, token: data.token });
    } finally {
      setLoading(false);
    }
  };

  const login = (payload) => authCall("/api/auth/login", payload);
  const register = (payload) => authCall("/api/auth/register", payload);

  const logout = () => {
    localStorage.removeItem("ai-saas-auth");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
