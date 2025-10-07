// src/controllers/health.controller.js
import { pool } from '../config/db.js';

/**
 * POST /api/health/records/bulk
 * body: { records: [{ child_id, hair, eyes, mouth, teeth, ears, nose, nails, skin }] }
 * - บันทึก recorded_at = NOW()
 * - ใส่ teacher_id จาก token
 */
export async function saveBulk(req, res) {
  try {
    if (!Array.isArray(req.body?.records) || req.body.records.length === 0) {
      return res.status(422).json({ message: 'records required' });
    }
    if (req.user?.type !== 'teacher') {
      return res.status(403).json({ message: 'เฉพาะครูเท่านั้น' });
    }

    const teacherId = req.user.id;
    const now = new Date(); // ใช้ NOW() ฝั่ง MySQL ก็ได้
    const values = [];

    for (const r of req.body.records) {
      if (!r?.child_id) continue;

      const v = [
        r.child_id,
        teacherId,
        r.weight_kg ?? null,
        r.height_cm ?? null,
        toScore(r.hair),
        toScore(r.eyes),
        toScore(r.mouth),
        toScore(r.teeth),
        toScore(r.ears),
        toScore(r.nose),
        toScore(r.nails),
        toScore(r.skin),
      ];
      values.push(v);
    }

    if (values.length === 0) {
      return res.status(422).json({ message: 'no valid rows' });
    }

    // บันทึกเป็นแถวใหม่ทั้งหมด (ตามที่หน้า UI ใช้อยู่ตอนนี้)
    // ตาราง health_records:  child_id, teacher_id, weight_kg, height_cm, hair, eyes, mouth, teeth, ears, nose, nails, skin, recorded_at
    const sql = `
      INSERT INTO health_records
        (child_id, teacher_id, weight_kg, height_cm,
         hair, eyes, mouth, teeth, ears, nose, nails, skin, recorded_at)
      VALUES ?
    `;

    await pool.query(sql, [values.map(v => [...v, now])]);

    return res.json({ ok: true, saved: values.length });
  } catch (e) {
    console.error('[health.saveBulk] error:', e);
    return res.status(500).json({ message: 'บันทึกไม่สำเร็จ' });
  }
}

// แปลงคะแนนให้เหลือ 1/2/3 หรือ null
function toScore(x) {
  if (x === null || x === undefined || x === '') return null;
  const n = Number(x);
  return [1, 2, 3].includes(n) ? n : null;
}

/* ตัวอย่าง endpoint สำหรับดึงย้อนหลังรายวัน (เผื่อใช้ต่อ)
export async function listByDate(req, res) {
  try {
    const { date } = req.query; // YYYY-MM-DD
    if (!date) return res.status(422).json({ message: 'date required' });

    const [rows] = await pool.query(
      `SELECT r.*, c.first_name, c.last_name, c.nickname
         FROM health_records r
         JOIN children c ON c.child_id = r.child_id
        WHERE DATE(r.recorded_at) = ?`,
      [date]
    );
    res.json(rows || []);
  } catch (e) {
    console.error('[health.listByDate] error:', e);
    res.status(500).json({ message: 'โหลดข้อมูลไม่สำเร็จ' });
  }
}
*/
