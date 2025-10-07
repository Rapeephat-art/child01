// src/controllers/attendance.controller.js
import { pool } from '../config/db.js';

function todayStr() {
  const d = new Date();
  return d.toISOString().slice(0,10); // YYYY-MM-DD
}

/**
 * GET /api/attendance/init?date=YYYY-MM-DD&period=เช้า|กลางวัน
 * - สร้าง session ถ้ายังไม่มี
 * - คืนรายชื่อเด็กทั้งหมดในศูนย์เดียวกับครู + สถานะที่เคยบันทึก (ถ้ามี)
 */
export async function initAttendance(req, res) {
  try {
    const teacherId = req.user?.id;
    if (!teacherId) return res.status(401).json({ message: 'Unauthenticated' });

    const date = req.query.date || todayStr();
    const period = req.query.period === 'กลางวัน' ? 'กลางวัน' : 'เช้า';

    // 1) เอา center ของครู
    const [trows] = await pool.query(
      'SELECT center_id FROM teachers WHERE teacher_id=? LIMIT 1',
      [teacherId]
    );
    if (!trows.length) return res.status(404).json({ message: 'ไม่พบข้อมูลครู' });
    const centerId = trows[0].center_id;

    // 2) สร้าง/ดึง session
    const [s1] = await pool.query(
      'SELECT * FROM attendance_sessions WHERE date=? AND period=? AND teacher_id=? LIMIT 1',
      [date, period, teacherId]
    );
    let sessionId;
    if (s1.length) {
      sessionId = s1[0].session_id;
    } else {
      const [ins] = await pool.query(
        'INSERT INTO attendance_sessions (date, period, teacher_id) VALUES (?,?,?)',
        [date, period, teacherId]
      );
      sessionId = ins.insertId;
    }

    // 3) รายชื่อเด็กทั้งหมดในศูนย์เดียวกัน (เรียงตามชื่อ)
    const [kids] = await pool.query(
      `SELECT child_id, prefix, first_name, last_name, nickname, gender
       FROM children
       WHERE center_id=? 
       ORDER BY first_name, last_name`,
      [centerId]
    );

    // 4) สถานะที่เคยบันทึก
    const [rec] = await pool.query(
      'SELECT child_id, status, note FROM attendance_records WHERE session_id=?',
      [sessionId]
    );
    const map = new Map(rec.map(r => [r.child_id, r]));

    const rows = kids.map(k => ({
      child_id: k.child_id,
      name: `${k.prefix ?? ''}${k.first_name} ${k.last_name}`.trim(),
      nickname: k.nickname || '',
      status: map.get(k.child_id)?.status || 'มา',
      note: map.get(k.child_id)?.note || ''
    }));

    res.json({ session: { session_id: sessionId, date, period }, rows });
  } catch (err) {
    console.error('ATTEND INIT ERR', err);
    res.status(500).json({ message: 'โหลดรายชื่อเด็กไม่สำเร็จ' });
  }
}

/**
 * POST /api/attendance/:sessionId/bulk
 * body: { items: [{child_id, status, note}] }
 * - upsert ตาม unique(session_id, child_id)
 */
export async function saveBulkAttendance(req, res) {
  try {
    const teacherId = req.user?.id;
    if (!teacherId) return res.status(401).json({ message: 'Unauthenticated' });

    const { sessionId } = req.params;
    const { items } = req.body || {};
    if (!Array.isArray(items) || !items.length) {
      return res.status(422).json({ message: 'ไม่มีข้อมูลสำหรับบันทึก' });
    }

    const values = [];
    for (const it of items) {
      values.push([sessionId, it.child_id, it.status || 'มา', it.note || null]);
    }

    // upsert ทีละก้อน
    await pool.query(
      `INSERT INTO attendance_records (session_id, child_id, status, note)
       VALUES ?
       ON DUPLICATE KEY UPDATE status=VALUES(status), note=VALUES(note)`,
      [values]
    );

    res.json({ ok: true, count: items.length });
  } catch (err) {
    console.error('ATTEND SAVE ERR', err);
    res.status(500).json({ message: 'บันทึกไม่สำเร็จ' });
  }
}
