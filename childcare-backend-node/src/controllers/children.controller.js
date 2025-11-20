// src/controllers/children.controller.js
import { pool } from '../config/db.js';

/**
 * GET /api/children
 * - คืนรายชื่อเด็ก (ฟิลด์หลักครบสำหรับตาราง)
 * - ถ้าเป็นครู: เห็นเด็กในศูนย์เดียวกัน + เด็กที่ยังไม่มี center_id (NULL)
 */
export async function index(req, res) {
  try {
    let sql =
      `SELECT child_id, center_id,
              prefix, first_name, last_name, nickname,
              gender, citizen_id, birth_date, status,
              parent_id, father_id, mother_id
         FROM children`;
    const params = [];

    if (req.user?.type === 'teacher') {
      sql += ` WHERE (center_id = ? OR center_id IS NULL)`;
      params.push(req.user.center_id ?? null);
    }

    sql += ` ORDER BY first_name, last_name`;

    const [rows] = await pool.query(sql, params);
    return res.json(rows || []);
  } catch (e) {
    console.error('[children.index] error:', e);
    return res.status(500).json({ message: 'โหลดรายชื่อเด็กไม่สำเร็จ' });
  }
}

/** helper: รวมข้อมูลบิดา/มารดา/ผู้ปกครองหลักเป็นอาเรย์เดียว */
async function fetchParentsForChild(conn, childRow) {
  const parents = [];

  // บิดา (relation_id = 1)
  if (childRow.father_id) {
    const [[bp1]] = await conn.query(
      `SELECT bp.bio_parent_id, bp.prefix, bp.first_name, bp.last_name,
              bp.citizen_id, bp.phone, bp.marital_status,
              bp.religion_id, bp.job_id, bp.income, bp.status
         FROM bio_parents bp
        WHERE bp.bio_parent_id=? LIMIT 1`,
      [childRow.father_id]
    );
    if (bp1) {
      parents.push({
        bio_parent_id: bp1.bio_parent_id,
        relation_id: 1,
        relation_name: 'บิดา',
        prefix: bp1.prefix, first_name: bp1.first_name, last_name: bp1.last_name,
        citizen_id: bp1.citizen_id, phone: bp1.phone, marital_status: bp1.marital_status,
        religion_id: bp1.religion_id, job_id: bp1.job_id, income: bp1.income,
        status: bp1.status,
      });
    }
  }

  // มารดา (relation_id = 2)
  if (childRow.mother_id) {
    const [[bp2]] = await conn.query(
      `SELECT bp.bio_parent_id, bp.prefix, bp.first_name, bp.last_name,
              bp.citizen_id, bp.phone, bp.marital_status,
              bp.religion_id, bp.job_id, bp.income, bp.status
         FROM bio_parents bp
        WHERE bp.bio_parent_id=? LIMIT 1`,
      [childRow.mother_id]
    );
    if (bp2) {
      parents.push({
        bio_parent_id: bp2.bio_parent_id,
        relation_id: 2,
        relation_name: 'มารดา',
        prefix: bp2.prefix, first_name: bp2.first_name, last_name: bp2.last_name,
        citizen_id: bp2.citizen_id, phone: bp2.phone, marital_status: bp2.marital_status,
        religion_id: bp2.religion_id, job_id: bp2.job_id, income: bp2.income,
        status: bp2.status,
      });
    }
  }

  // ผู้ปกครองหลักจากตาราง parents (relation_id = 3) — แสดงผล
  if (childRow.parent_id) {
    const [[p]] = await conn.query(
      `SELECT parent_id, prefix, first_name, last_name, phone, status
         FROM parents
        WHERE parent_id=? LIMIT 1`,
      [childRow.parent_id]
    );
    if (p) {
      parents.push({
        bio_parent_id: `parent-${p.parent_id}`, // คีย์สังเคราะห์สำหรับ React
        relation_id: 3,
        relation_name: 'ผู้ปกครอง',
        prefix: p.prefix ?? null,
        first_name: p.first_name ?? null,
        last_name: p.last_name ?? null,
        citizen_id: null,
        phone: p.phone ?? null,
        marital_status: null,
        religion_id: null,
        job_id: null,
        income: null,
        status: p.status ?? null,
      });
    }
  }

  return parents;
}

/**
 * GET /api/children/:id
 * - คืน { child, parents }
 */
export async function show(req, res) {
  const id = req.params.id;
  const conn = await pool.getConnection();
  try {
    const [[child]] = await conn.query(
      `SELECT child_id, center_id,
              prefix, first_name, last_name, nickname,
              gender, citizen_id, birth_date, status,
              parent_id, father_id, mother_id
         FROM children
        WHERE child_id=? LIMIT 1`,
      [id]
    );
    if (!child) return res.status(404).json({ message: 'ไม่พบข้อมูล' });

    // ครูดูได้เฉพาะเด็กในศูนย์เดียวกัน หรือเด็ก center_id IS NULL
    if (
      req.user?.type === 'teacher' &&
      req.user?.center_id &&
      child.center_id !== req.user.center_id &&
      child.center_id !== null
    ) {
      return res.status(403).json({ message: 'ไม่มีสิทธิ์เข้าถึงข้อมูลเด็กนอกศูนย์' });
    }

    const parents = await fetchParentsForChild(conn, child);
    return res.json({ child, parents });
  } catch (e) {
    console.error('[children.show] error:', e);
    return res.status(500).json({ message: 'โหลดข้อมูลไม่สำเร็จ' });
  } finally {
    conn.release();
  }
}

/**
 * POST /api/children
 * - เพิ่มเด็กใหม่ (ถ้าเป็นครูจะผูกศูนย์ให้)
 */
export async function store(req, res) {
  try {
    const {
      prefix, first_name, last_name, nickname,
      gender, citizen_id, birth_date, status,
    } = req.body || {};
    if (!first_name || !last_name) {
      return res.status(422).json({ message: 'กรอกชื่อและนามสกุล' });
    }

    const centerId =
      (req.user?.type === 'teacher' && req.user?.center_id) ? req.user.center_id : null;

    const [ins] = await pool.query(
      `INSERT INTO children
        (center_id, prefix, first_name, last_name, nickname,
         gender, citizen_id, birth_date, status)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [
        centerId, prefix || null, first_name, last_name, nickname || null,
        gender || null, citizen_id || null, birth_date || null, status || null,
      ]
    );

    const [[row]] = await pool.query(
      `SELECT child_id, center_id,
              prefix, first_name, last_name, nickname,
              gender, citizen_id, birth_date, status
         FROM children
        WHERE child_id=? LIMIT 1`,
      [ins.insertId]
    );
    return res.status(201).json(row);
  } catch (e) {
    console.error('[children.store] error:', e);
    return res.status(500).json({ message: 'บันทึกไม่สำเร็จ' });
  }
}

/**
 * PUT /api/children/:id
 * รองรับ 2 รูปแบบ body:
 * 1) แบบเก่า (flat child fields)
 * 2) แบบใหม่ { child: {...}, parents: [...] }
 *
 * - จัดการเฉพาะ บิดา/มารดา (relation_id 1/2) กับตาราง bio_parents
 * - ผู้ปกครองหลัก (จากตาราง parents) แสดงผลได้ แต่ยังไม่แก้ผ่าน endpoint นี้
 */
export async function update(req, res) {
  const id = req.params.id;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // มีเด็กไหม + สิทธิ์ศูนย์
    const [[exist]] = await conn.query(
      `SELECT child_id, center_id, father_id, mother_id, parent_id
         FROM children WHERE child_id=? LIMIT 1`,
      [id]
    );
    if (!exist) {
      await conn.rollback();
      return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    }
    if (
      req.user?.type === 'teacher' &&
      req.user?.center_id &&
      exist.center_id !== req.user.center_id &&
      exist.center_id !== null
    ) {
      await conn.rollback();
      return res.status(403).json({ message: 'ไม่มีสิทธิ์แก้ไขเด็กนอกศูนย์' });
    }

    const isNewShape = typeof req.body?.child === 'object' || Array.isArray(req.body?.parents);
    const childPayload = isNewShape ? (req.body.child || {}) : req.body;

    // --- อัปเดตข้อมูลเด็ก ---
    const {
      prefix, first_name, last_name, nickname,
      gender, citizen_id, birth_date, status,
    } = childPayload || {};

    await conn.query(
      `UPDATE children SET
         prefix     = COALESCE(?, prefix),
         first_name = COALESCE(?, first_name),
         last_name  = COALESCE(?, last_name),
         nickname   = COALESCE(?, nickname),
         gender     = COALESCE(?, gender),
         citizen_id = COALESCE(?, citizen_id),
         birth_date = COALESCE(?, birth_date),
         status     = COALESCE(?, status)
       WHERE child_id=?`,
      [
        prefix ?? null, first_name ?? null, last_name ?? null, nickname ?? null,
        gender ?? null, citizen_id ?? null, birth_date ?? null, status ?? null,
        id,
      ]
    );

    // --- อัปเดตพ่อ/แม่ ถ้ามี parents ---
    if (isNewShape && Array.isArray(req.body.parents)) {
      const latestByRel = new Map(); // relation_id (1/2) -> obj ล่าสุด
      for (const p of req.body.parents) {
        if (p && (p.relation_id === 1 || p.relation_id === 2)) {
          latestByRel.set(p.relation_id, p);
        }
      }

      async function handleBioParent(rel, fieldName /* 'father_id'|'mother_id' */) {
        const p = latestByRel.get(rel);
        if (!p) return;

        // ถอดความผูก
        if (p._delete && p.bio_parent_id) {
          await conn.query(`UPDATE children SET ${fieldName}=NULL WHERE child_id=?`, [id]);
          // (ไม่ลบแถวใน bio_parents เพื่อความปลอดภัยข้อมูล)
          return;
        }

        if (p.bio_parent_id) {
          // update
          await conn.query(
            `UPDATE bio_parents SET
               relation_id   = COALESCE(?, relation_id),
               prefix        = COALESCE(?, prefix),
               first_name    = COALESCE(?, first_name),
               last_name     = COALESCE(?, last_name),
               citizen_id    = COALESCE(?, citizen_id),
               phone         = COALESCE(?, phone),
               marital_status= COALESCE(?, marital_status),
               religion_id   = COALESCE(?, religion_id),
               job_id        = COALESCE(?, job_id),
               income        = COALESCE(?, income),
               status        = COALESCE(?, status)
             WHERE bio_parent_id=?`,
            [
              p.relation_id ?? rel,
              p.prefix ?? null,
              p.first_name ?? null,
              p.last_name ?? null,
              p.citizen_id ?? null,
              p.phone ?? null,
              p.marital_status ?? null,
              p.religion_id ?? null,
              p.job_id ?? null,
              p.income ?? null,
              p.status ?? null,
              p.bio_parent_id,
            ]
          );
          await conn.query(`UPDATE children SET ${fieldName}=? WHERE child_id=?`, [p.bio_parent_id, id]);
          return;
        }

        // insert ใหม่ (ถ้ามีข้อมูลสำคัญ)
        if ((p.first_name && p.last_name) || p.citizen_id || p.phone) {
          const [ins] = await conn.query(
            `INSERT INTO bio_parents
               (relation_id, prefix, first_name, last_name, citizen_id, phone,
                marital_status, religion_id, job_id, income, status)
             VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
            [
              p.relation_id ?? rel,
              p.prefix ?? null,
              p.first_name ?? null,
              p.last_name ?? null,
              p.citizen_id ?? null,
              p.phone ?? null,
              p.marital_status ?? null,
              p.religion_id ?? null,
              p.job_id ?? null,
              p.income ?? null,
              p.status ?? null,
            ]
          );
          await conn.query(`UPDATE children SET ${fieldName}=? WHERE child_id=?`, [ins.insertId, id]);
        }
      }

      await handleBioParent(1, 'father_id');
      await handleBioParent(2, 'mother_id');
    }

    // ดึงข้อมูลล่าสุดกลับ
    const [[child]] = await conn.query(
      `SELECT child_id, center_id,
              prefix, first_name, last_name, nickname,
              gender, citizen_id, birth_date, status,
              parent_id, father_id, mother_id
         FROM children WHERE child_id=? LIMIT 1`,
      [id]
    );
    const parents = await fetchParentsForChild(conn, child);

    await conn.commit();
    return res.json({ child, parents });
  } catch (e) {
    await conn.rollback();
    console.error('[children.update] error:', e);
    return res.status(500).json({ message: 'แก้ไขไม่สำเร็จ' });
  } finally {
    conn.release();
  }
}

/**
 * DELETE /api/children/:id
 */
export async function destroy(req, res) {
  try {
    const id = req.params.id;

    const [[exist]] = await pool.query(
      `SELECT child_id, center_id FROM children WHERE child_id=? LIMIT 1`,
      [id]
    );
    if (!exist) return res.status(404).json({ message: 'ไม่พบข้อมูล' });

    if (
      req.user?.type === 'teacher' &&
      req.user?.center_id &&
      exist.center_id !== req.user.center_id &&
      exist.center_id !== null
    ) {
      return res.status(403).json({ message: 'ไม่มีสิทธิ์ลบเด็กนอกศูนย์' });
    }

    await pool.query(`DELETE FROM children WHERE child_id=?`, [id]);
    return res.json({ ok: true });
  } catch (e) {
    console.error('[children.destroy] error:', e);
    return res.status(500).json({ message: 'ลบไม่สำเร็จ' });
  }
}
// ✅ GET /api/children/mine
// ดึงบุตรหลานของผู้ปกครองที่ล็อกอินอยู่
export async function getMyChildren(req, res) {
  try {
    // ต้องเป็นผู้ปกครองเท่านั้น
    if (!req.user || req.user.type !== 'parent') {
      return res.status(403).json({ message: 'เฉพาะผู้ปกครองเท่านั้น' });
    }

    const parentId = req.user.id; // id ของ parent มาจาก token

    const [rows] = await pool.query(
      `SELECT child_id, center_id,
              prefix, first_name, last_name, nickname,
              gender, citizen_id, birth_date, status,
              parent_id, father_id, mother_id
         FROM children
        WHERE parent_id = ?
        ORDER BY first_name, last_name`,
      [parentId]
    );

    return res.json(rows || []);
  } catch (e) {
    console.error('[children.getMyChildren] error:', e);
    return res
      .status(500)
      .json({ message: 'โหลดข้อมูลบุตรหลานไม่สำเร็จ' });
  }
}
