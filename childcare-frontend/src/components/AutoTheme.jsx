// src/components/AutoTheme.jsx
import { useEffect } from "react";

/**
 * เลือกธีมอัตโนมัติตาม "วันในเดือน" (1..31) แล้ว modulo จำนวนธีมที่มี
 * ถ้าผู้ใช้เคยเลือกเอง (เก็บใน localStorage: cc-theme) จะใช้ค่านั้นแทน
 * ธีมที่รองรับ: theme-blue, theme-pink, theme-mint, theme-sun
 */
const THEMES = ["theme-blue", "theme-pink", "theme-mint", "theme-sun"];

export default function AutoTheme() {
  useEffect(() => {
    const html = document.documentElement;

    // ถ้ามีค่าที่ผู้ใช้เคยเลือกเอง ให้ยึดค่านั้น
    const saved = localStorage.getItem("cc-theme");
    const themeToUse =
      saved && THEMES.includes(saved)
        ? saved
        : THEMES[(new Date().getDate() - 1) % THEMES.length];

    // ล้าง class เดิม แล้วใส่ธีมใหม่
    THEMES.forEach((t) => html.classList.remove(t));
    html.classList.add(themeToUse);

    // เพิ่มพื้นหลังลายน่ารักให้ทั้งหน้า (ใช้คลาส bg-dots ในไฟล์ CSS ที่คุณให้มา)
    document.body.classList.add("bg-dots");
  }, []);

  return null; // ไม่ render อะไร แค่มา set theme
}
