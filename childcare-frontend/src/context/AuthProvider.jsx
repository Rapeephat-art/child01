// src/context/AuthProvider.jsx
import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const Ctx = createContext();
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refreshMe() {
    try {
      const { data } = await api.get("/me", { withCredentials: true });
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshMe();
  }, []);

  // ✅ แก้ตรงนี้
  async function login(username, password) {
    try {
      const res = await api.post(
        "/auth/login",
        { username, password },
        { withCredentials: true }
      );

      const loggedUser = res.data?.user || null;

      if (loggedUser) {
        setUser(loggedUser);
        return loggedUser; // ส่ง user กลับไปให้ Login.jsx ใช้ตัดสินใจ redirect
      }

      // เผื่อกรณี backend ไม่ส่ง user กลับมา
      await refreshMe();
      return null;
    } catch (err) {
      throw err;
    }
  }

  async function logout() {
    await api.post("/auth/logout", {}, { withCredentials: true });
    setUser(null);
  }

  return (
    <Ctx.Provider value={{ user, loading, login, logout }}>
      {children}
    </Ctx.Provider>
  );
}
