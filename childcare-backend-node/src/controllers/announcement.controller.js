// src/controllers/announcement.controller.js
import { pool } from "../config/db.js";
import fs from "fs";

// ✅ ดึงประกาศทั้งหมด
export async function getAll(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM announcements ORDER BY posted_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("โหลดประกาศไม่สำเร็จ:", err);
    res.status(500).json({ message: "โหลดข้อมูลไม่สำเร็จ", error: err });
  }
}

// ✅ เพิ่มประกาศใหม่
export async function create(req, res) {
  try {
    const { title, body, semester, academic_year } = req.body;

    // รวม path รูปภาพ (คั่นด้วย comma)
    const image_urls =
      req.files?.map((f) => `/uploads/${f.filename}`).join(",") || null;

    // ✅ เพิ่มข้อมูลลง DB
    const [result] = await pool.query(
      `INSERT INTO announcements 
        (teacher_id, title, body, semester, academic_year, posted_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [req.user.user_id, title, body, semester, academic_year]
    );

    res.json({
      message: "✅ เพิ่มประกาศสำเร็จ",
      id: result.insertId,
    });
  } catch (err) {
    console.error("เพิ่มประกาศไม่สำเร็จ:", err);
    res.status(500).json({ message: "เพิ่มประกาศไม่สำเร็จ", error: err });
  }
}

// ✅ ลบประกาศ
export async function remove(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM announcements WHERE announcement_id = ?",
      [req.params.id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "ไม่พบข้อมูล" });

    const ann = rows[0];
    if (ann.image_urls) {
      ann.image_urls.split(",").forEach((img) => {
        fs.unlink(`.${img}`, () => {});
      });
    }

    await pool.query("DELETE FROM announcements WHERE announcement_id = ?", [
      req.params.id,
    ]);

    res.json({ message: "ลบประกาศสำเร็จ" });
  } catch (err) {
    console.error("ลบประกาศไม่สำเร็จ:", err);
    res.status(500).json({ message: "ลบประกาศไม่สำเร็จ", error: err });
  }
}
