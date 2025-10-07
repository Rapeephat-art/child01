// ช่วยแปลง path ที่ backend เซิร์ฟ เช่น "/uploads/xxx.pdf"
// ให้เป็น URL ที่เข้าถึงได้จาก frontend เสมอ
export function fileUrl(href) {
  if (!href) return "#";
  // ถ้าเป็น absolute URL แล้ว ก็ส่งกลับเลย
  if (/^https?:\/\//i.test(href)) return href;

  // ปิดให้ตรงกับ backend ที่เปิดไว้:
  // app.use('/uploads', express.static(uploadsPath));
  // app.use('/api/uploads', express.static(uploadsPath));
  //
  // เลือกใช้แบบ /api/uploads เพื่อเลี่ยงชน route อื่น ๆ
  if (href.startsWith("/uploads/")) {
    return `/api${href}`;
  }
  // เผื่อ backend เก็บไว้เป็นชื่อไฟล์อย่างเดียว
  return `/api/uploads/${href.replace(/^\/+/, "")}`;
}
