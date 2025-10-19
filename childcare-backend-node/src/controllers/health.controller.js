// src/controllers/health.controller.js
import { pool } from '../config/db.js';

// ---------------------- รายชื่อเด็ก (สำหรับครู) ----------------------
export async function listChildren(req, res) {
  try {
    const me = req.user;
    if (me?.type !== 'teacher') {
      return res.status(403).json({ message: 'เฉพาะครูเท่านั้น' });
    }

    // บางฐานข้อมูลเด็กเก่า center_id อาจเป็น NULL
    // เงื่อนไขด้านล่างจะ "ไม่กรอง center" ถ้า teacher.center_id เป็น null/undefined
    const centerId = me.center_id ?? null;

    const [rows] = await pool.query(
      `
      SELECT child_id, prefix, first_name, last_name, nickname, gender, birth_date
      FROM children
      WHERE status = 'อนุมัติ'
        AND ( ? IS NULL OR center_id = ? )
      ORDER BY first_name ASC, last_name ASC, child_id ASC
      `,
      [centerId, centerId]
    );

    return res.json(rows);
  } catch (err) {
    console.error('[HEALTH] listChildren error:', err);
    return res.status(500).json({ message: 'โหลดรายชื่อเด็กไม่สำเร็จ' });
  }
}

// ---------------------- บันทึกเป็นชุด ----------------------
export async function saveBulk(req, res) {
  const conn = await pool.getConnection();
  try {
    const me = req.user;
    if (me?.type !== 'teacher') {
      conn.release();
      return res.status(403).json({ message: 'เฉพาะครูเท่านั้น' });
    }

    const {
      semester,
      academic_year,
      records = [], // [{child_id, weight_kg, height_cm, temp_c, hair, eyes, mouth, teeth, ears, nose, nails, skin}]
    } = req.body || {};

    if (!semester || !academic_year) {
      conn.release();
      return res.status(422).json({ message: 'กรอกภาคเรียนและปีการศึกษา' });
    }
    if (!Array.isArray(records) || records.length === 0) {
      conn.release();
      return res.status(422).json({ message: 'ไม่มีข้อมูลบันทึก' });
    }

    await conn.beginTransaction();

    // ลบของเดิมรอบนั้น ๆ (ออปชัน)
    const childIds = records.map(r => Number(r.child_id)).filter(Boolean);
    if (childIds.length) {
      await conn.query(
        `DELETE FROM health_records
         WHERE semester=? AND academic_year=? AND child_id IN (?)`,
        [semester, academic_year, childIds]
      );
    }

    // ใส่ของใหม่
    const now = new Date();
    const values = records.map(r => [
      r.child_id,
      me.id, // teacher_id
      r.weight_kg ?? null,
      r.height_cm ?? null,
      r.temp_c ?? null,
      r.hair ?? null,
      r.eyes ?? null,
      r.mouth ?? null,
      r.teeth ?? null,
      r.ears ?? null,
      r.nose ?? null,
      r.nails ?? null,
      r.skin ?? null,
      now,
      semester,
      academic_year,
    ]);

    await conn.query(
      `INSERT INTO health_records
       (child_id, teacher_id, weight_kg, height_cm, temp_c,
        hair, eyes, mouth, teeth, ears, nose, nails, skin,
        recorded_at, semester, academic_year)
       VALUES ?`,
      [values]
    );

    await conn.commit();
    conn.release();
    return res.json({ ok: true, message: 'บันทึกสำเร็จ' });
  } catch (err) {
    try { await conn.rollback(); } catch {}
    conn.release();
    console.error('[HEALTH] saveBulk error:', err);
    return res.status(500).json({ message: 'บันทึกไม่สำเร็จ' });
  }
}
