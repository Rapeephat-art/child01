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

  useEffect(() => { refreshMe(); }, []);

  async function login(username, password) {
    try {
      // เน้นให้แน่ใจว่า cookie ถูกส่ง/รับ
      await api.post(
        "/auth/login",
        { username, password },
        { withCredentials: true }
      );
      await refreshMe();
    } catch (err) {
      // โยน error กลับไปให้ Login.jsx แสดงข้อความจาก backend ได้
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
