// src/lib/fileUrl.js
export function fileUrl(p) {
  if (!p) return "";

  let path = String(p);

  // ตัดโดเมนทิ้ง ถ้า DB เก็บเป็น URL เต็ม
  path = path.replace(/^https?:\/\/[^/]+/i, "");

  // รองรับพาธเก่า /api/uploads/... → /uploads/...
  path = path.replace(/^\/?api\/uploads/i, "/uploads");

  // ลด // ซ้ำ
  path = path.replace(/\/{2,}/g, "/");

  // บังคับให้ขึ้นต้นด้วย /
  if (!path.startsWith("/")) path = `/${path}`;

  // ต้นทาง backend
  let origin = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
  if (!origin) {
    const { protocol, hostname, port } = window.location;
    // ถ้าเป็น vite frontend (5173) ให้เดา backend 5174
    const guessedPort = port === "5173" ? "5174" : port;
    origin = `${protocol}//${hostname}${guessedPort ? ":" + guessedPort : ""}`;
  }

  // กันเคสที่ตั้ง origin เป็น http://host:port/uploads
  origin = origin.replace(/\/+uploads\/?$/i, "").replace(/\/+$/, "");

  return `${origin}${path}`; // เช่น http://localhost:5174/uploads/xxx.pdf
}
