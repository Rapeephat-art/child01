// controllers/announcement.controller.js
import db from "../models/index.js";
import fs from "fs";

const Announcement = db.announcement;

// ✅ ดึงประกาศทั้งหมด
export async function getAll(req, res) {
  try {
    const data = await Announcement.findAll({ order: [["created_at", "DESC"]] });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "โหลดข้อมูลไม่สำเร็จ", error: err });
  }
}

// ✅ เพิ่มประกาศ
export async function create(req, res) {
  try {
    const { title, detail, semester, year } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const newAnn = await Announcement.create({
      title,
      detail,
      semester,
      year,
      image_url,
      created_by: req.user.user_id,
    });

    res.json({ message: "เพิ่มประกาศสำเร็จ", announcement: newAnn });
  } catch (err) {
    res.status(500).json({ message: "เพิ่มประกาศไม่สำเร็จ", error: err });
  }
}

// ✅ ลบประกาศ
export async function remove(req, res) {
  try {
    const ann = await Announcement.findByPk(req.params.id);
    if (!ann) return res.status(404).json({ message: "ไม่พบข้อมูล" });

    if (ann.image_url) fs.unlink(`.${ann.image_url}`, () => {});
    await ann.destroy();

    res.json({ message: "ลบสำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: "ลบไม่สำเร็จ", error: err });
  }
}
