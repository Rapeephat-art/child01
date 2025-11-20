const db = require("../config/db");

async function getAnnouncements(req, res, next) {
  try {
    const [rows] = await db.query("SELECT id, title, body, created_at FROM announcements WHERE is_public=1 ORDER BY created_at DESC LIMIT ?", [parseInt(req.query.limit)||5]);
    res.json(rows);
  } catch (err) { next(err); }
}

async function getStats(req, res, next) {
  try {
    const [[c]] = await db.query("SELECT COUNT(*) AS total FROM children");
    // ตัวอย่าง: คำนวณที่ว่าง = capacity - enrolled (ปรับตาม schema จริง)
    const seatsAvailable = null; // หรือคิวรีเพิ่มเมื่อมีคอลัมน์ capacity/enrolled
    res.json({ totalChildren: c.total||0, seatsAvailable });
  } catch (err) { next(err); }
}

async function postEnroll(req, res, next) {
  try {
    const { first_name, last_name, birthdate, guardian_name, guardian_phone } = req.body;
    // ใส่ validation เบื้องต้น
    if (!first_name || !guardian_phone) return res.status(400).json({ message: "ข้อมูลไม่ครบ" });
    const [r] = await db.query(
      "INSERT INTO enroll_requests (first_name, last_name, birthdate, guardian_name, guardian_phone, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
      [first_name, last_name, birthdate, guardian_name, guardian_phone]
    );
    res.status(201).json({ id: r.insertId });
  } catch (err) { next(err); }
}

module.exports = { getAnnouncements, getStats, postEnroll };
