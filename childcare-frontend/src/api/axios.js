// src/api/axios.js
import axios from 'axios';

const ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5174').replace(/\/+$/, ''); // ไม่มี / ปิดท้าย

const api = axios.create({
  baseURL: `${ORIGIN}/api`,   // << ใส่ /api ที่นี่ที่เดียว
  withCredentials: true,
});

export default api;
