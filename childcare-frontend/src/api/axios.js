// src/api/axios.js
import axios from "axios";

const ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:5174").replace(/\/+$/, "");

// ถ้าเป็น dev (vite) ให้ใช้ proxy -> baseURL = '/api'
// ถ้าเป็น production ให้ใช้ ORIGIN/api
const baseURL = import.meta.env.DEV ? '/api' : `${ORIGIN}/api`;

const api = axios.create({
  baseURL,
  withCredentials: true, // ต้องเปิดเพื่อส่ง cookie
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (!config) return config;

  // ป้องกัน /api/api/ กรณีใส่ url ซ้อนกัน
  try {
    let url = config.url || "";
    url = url.replace(/\/api\/api\//g, "/api/");
    url = url.replace(/\/api\/api$/g, "/api");
    config.url = url;
  } catch (e) {
    // ignore
  }

  // **แนะนำ**: อย่าใส่ Authorization โดยอัตโนมัติถ้าคุณใช้ cookie เป็นหลัก
  // ถ้าต้องการใช้ Bearer token ให้เปิดบรรทัดด้านล่างและแน่ใจว่า token ถูกจัดการอย่างถูกต้อง
  /*
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
  */

  return config;
}, (err) => Promise.reject(err));

export default api;
