"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getMe, logout as logoutAPI } from "@/app/lib/authService";
import { getUserOrders } from "@/app/lib/orderService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, name, email } | null
  const [loading, setLoading] = useState(true); // true until first /api/auth/me resolves
  const [orders, setOrders] = useState([]);

  // ── on mount: ask the server "am I logged in?" ───────
  // CORRECT:
  useEffect(() => {
    getMe()
      .then((u) => {
        setUser(u);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // ── fetch orders whenever user changes ────────────────
  const fetchOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      return;
    }
    try {
      const list = await getUserOrders();
      setOrders(list);
    } catch {
      setOrders([]);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ── logout: clear cookie then wipe local state ────────
  const logout = async () => {
    await logoutAPI();
    setUser(null);
    setOrders([]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile: user,
        loading,
        orders,
        logout,
        fetchOrders,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
