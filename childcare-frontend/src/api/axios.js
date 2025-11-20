// src/api/axios.js
import axios from "axios";

const ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:5174").replace(/\/+$/, "");

// baseURL มี /api เอาไว้
const api = axios.create({
  baseURL: `${ORIGIN}/api`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Normalize: ป้องกันกรณีมี "/api/api/..." โดยไม่ตั้งใจ
api.interceptors.request.use((config) => {
  if (!config) return config;
  // หาก config.url เป็นแบบ "/api/..." หรือ "api/..." ให้ตรวจและปรับไม่ให้ซ้อน
  try {
    // ภายใต้กรณี config.url อาจมี query string
    let url = config.url || "";
    // หาก url เริ่มด้วย "/api/" และ baseURL ลงท้ายด้วย "/api", จะเกิด /api/api/
    // แปลง "/api/api/" => "/api/"
    url = url.replace(/\/api\/api\//g, "/api/");
    // แปลง "/api/api" ที่อาจอยู่ตอนท้ายด้วย
    url = url.replace(/\/api\/api$/g, "/api");
    config.url = url;
  } catch (e) {
    // ignore
  }

  // ใส่ Authorization header จาก localStorage (ถ้ามี)
  try {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (e) {
    // ignore
  }

  return config;
}, (err) => Promise.reject(err));

export default api;
