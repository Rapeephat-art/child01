// src/controllers/enroll.controller.js
import { pool } from '../config/db.js';
import { Router } from 'express';
import { authRequired, requireTeacher } from '../middleware/auth.js';
import * as enroll from '../controllers/enroll.controller.js';
/**
 * ดึงพาธไฟล์จาก req.files ตามชื่อ field
 * ส่งกลับเป็นพาธที่เสิร์ฟได้ผ่าน /uploads เช่น /uploads/2025-...-abc.pdf
 */
function getFilePath(req, field) {
  const f = req?.files?.[field]?.[0];
  if (!f) return null;
  return `/api/uploads/${f.filename}`; // จากเดิม /uploads/...
}

export async function create(req, res) {
  try {
    const u = req.user;

    // ====== ฟิลด์หลักที่ใช้แสดงทันที ======
    const {
      prefix,
      first_name,
      last_name,
      nickname,
      gender,
      citizen_id,
      birth_date,
      parent_phone,
      note,

      // ====== ฟิลด์ที่เพิ่มในฟอร์มทั้งหมด (จะเก็บลง extra_json) ======
      age_group,
      weight_kg,
      height_cm,

      // ที่อยู่เด็ก ทะเบียนบ้าน
      child_home_house_no,
      child_home_village,
      child_home_street,
      child_home_subdistrict,
      child_home_district,
      child_home_province,
      child_home_postal,

      // ที่อยู่เด็ก ปัจจุบัน
      child_cur_house_no,
      child_cur_village,
      child_cur_street,
      child_cur_subdistrict,
      child_cur_district,
      child_cur_province,
      child_cur_postal,

      // บิดา
      father_prefix,
      father_first_name,
      father_last_name,
      father_citizen_id,
      father_job,
      father_income,
      father_house_no,
      father_village,
      father_street,
      father_subdistrict,
      father_district,
      father_province,
      father_postal,

      // มารดา
      mother_prefix,
      mother_first_name,
      mother_last_name,
      mother_citizen_id,
      mother_job,
      mother_income,
      mother_house_no,
      mother_village,
      mother_street,
      mother_subdistrict,
      mother_district,
      mother_province,
      mother_postal,

      // ผู้อุปการะ/ดูแล
      caregiver_relation,
      caregiver_job,
      caregiver_income,

      // ผู้รับส่งเด็ก
      pickup_name,
      pickup_relation,
      pickup_phone,

      // สุขภาพ
      health_accidents_history,
      health_chronic_disease,
      health_behavior_issue,
      health_food_allergy,
      health_drug_allergy,
      vaccine_status,
    } = req.body || {};

    // ตรวจขั้นต่ำ
    if (!first_name || !last_name) {
      return res.status(422).json({ message: 'กรอกชื่อ-สกุลของเด็ก' });
    }

    // ====== เก็บไฟล์แนบ ======
    const files_json = {
      // ช่องเดิมในหน้า (ถ้ามี)
      document: getFilePath(req, 'document'),

      // ช่องที่เพิ่มแยกตามชนิด
      map_file: getFilePath(req, 'map_file'),                         // แผนที่บ้านของนักเรียน
      birth_cert_file: getFilePath(req, 'birth_cert_file'),           // สำเนาสูติบัตร
      child_house_reg_file: getFilePath(req, 'child_house_reg_file'), // ทะเบียนบ้านเด็ก
      father_id_file: getFilePath(req, 'father_id_file'),             // บัตรประชาชน บิดา
      father_house_reg_file: getFilePath(req, 'father_house_reg_file'), // ทะเบียนบ้าน บิดา
      mother_id_file: getFilePath(req, 'mother_id_file'),             // บัตรประชาชน มารดา
      mother_house_reg_file: getFilePath(req, 'mother_house_reg_file')  // ทะเบียนบ้าน มารดา
    };

    // ====== เก็บรายละเอียดอื่น ๆ ลง JSON เดียว ======
    const extra_json = {
      age_group,
      weight_kg,
      height_cm,

      child_home: {
        house_no: child_home_house_no,
        village: child_home_village,
        street: child_home_street,
        subdistrict: child_home_subdistrict,
        district: child_home_district,
        province: child_home_province,
        postal: child_home_postal,
      },
      child_current: {
        house_no: child_cur_house_no,
        village: child_cur_village,
        street: child_cur_street,
        subdistrict: child_cur_subdistrict,
        district: child_cur_district,
        province: child_cur_province,
        postal: child_cur_postal,
      },

      father: {
        prefix: father_prefix,
        first_name: father_first_name,
        last_name: father_last_name,
        citizen_id: father_citizen_id,
        job: father_job,
        income: father_income,
        address: {
          house_no: father_house_no,
          village: father_village,
          street: father_street,
          subdistrict: father_subdistrict,
          district: father_district,
          province: father_province,
          postal: father_postal,
        },
      },

      mother: {
        prefix: mother_prefix,
        first_name: mother_first_name,
        last_name: mother_last_name,
        citizen_id: mother_citizen_id,
        job: mother_job,
        income: mother_income,
        address: {
          house_no: mother_house_no,
          village: mother_village,
          street: mother_street,
          subdistrict: mother_subdistrict,
          district: mother_district,
          province: mother_province,
          postal: mother_postal,
        },
      },

      caregiver: {
        relation: caregiver_relation, // father | mother | both | relative
        job: caregiver_job,
        income: caregiver_income,
      },

      pickup: {
        name: pickup_name,
        relation: pickup_relation,
        phone: pickup_phone,
      },

      health: {
        accidents_history: health_accidents_history,
        chronic_disease: health_chronic_disease,
        behavior_issue: health_behavior_issue,
        food_allergy: health_food_allergy,
        drug_allergy: health_drug_allergy,
        vaccine_status, // complete | incomplete
      },
    };

    // ====== บันทึก ======
    const [r] = await pool.query(
      `INSERT INTO enrollments
       (parent_id, prefix, first_name, last_name, nickname, gender, citizen_id, birth_date,
        parent_phone, note, extra_json, files_json, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'รอการอนุมัติ')`,
      [
        u?.type === 'parent' ? u.id : null,
        prefix || null,
        first_name,
        last_name,
        nickname || null,
        gender || null,
        citizen_id || null,
        birth_date || null,
        parent_phone || null,
        note || null,
        JSON.stringify(extra_json),
        JSON.stringify(files_json),
      ]
    );

    res.status(201).json({
      enrollment_id: r.insertId,
      message: 'ส่งคำขอแล้ว',
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'บันทึกคำขอไม่สำเร็จ' });
  }
}

export async function myList(req, res) {
  try {
    if (req.user?.type === 'parent') {
      const [rows] = await pool.query(
        `SELECT enrollment_id, first_name, last_name, nickname, status, created_at
         FROM enrollments
         WHERE parent_id=?
         ORDER BY enrollment_id DESC`,
        [req.user.id]
      );
      return res.json(rows);
    }
    return res.json([]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'ดึงข้อมูลไม่สำเร็จ' });
  }
}

export async function listPending(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT enrollment_id, first_name, last_name, nickname, gender, birth_date,
              parent_phone, status, created_at
       FROM enrollments
       WHERE status='รอการอนุมัติ'
       ORDER BY enrollment_id ASC`
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'ดึงข้อมูลไม่สำเร็จ' });
  }
}

export async function approve(req, res) {
  const conn = await pool.getConnection();
  try {
    const id = req.params.id;
    const teacher = req.user;
    if (teacher?.type !== 'teacher') {
      return res.status(403).json({ message: 'เฉพาะครูเท่านั้น' });
    }

    await conn.beginTransaction();

    const [rows] = await conn.query(
      `SELECT * FROM enrollments WHERE enrollment_id=? FOR UPDATE`,
      [id]
    );
    if (!rows.length) {
      await conn.rollback();
      return res.status(404).json({ message: 'ไม่พบคำขอ' });
    }
    const e = rows[0];
    if (e.status !== 'รอการอนุมัติ') {
      await conn.rollback();
      return res.status(409).json({ message: 'คำขอนี้ถูกดำเนินการแล้ว' });
    }

    // สร้างเด็กใน children
    const [ins] = await conn.query(
      `INSERT INTO children
       (center_id, prefix, first_name, last_name, nickname, gender, citizen_id, birth_date,
        parent_id, teacher1_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'อนุมัติ')`,
      [
        teacher.center_id || e.center_id || 1,
        e.prefix,
        e.first_name,
        e.last_name,
        e.nickname,
        e.gender,
        e.citizen_id,
        e.birth_date,
        e.parent_id,
        teacher.id,
      ]
    );

    await conn.query(
      `UPDATE enrollments
       SET status='อนุมัติ', approved_by=?, center_id=?, child_id=?
       WHERE enrollment_id=?`,
      [teacher.id, teacher.center_id || 1, ins.insertId, id]
    );

    await conn.commit();
    res.json({ message: 'อนุมัติแล้ว', child_id: ins.insertId });
  } catch (e) {
    await conn.rollback();
    console.error(e);
    res.status(500).json({ message: 'อนุมัติไม่สำเร็จ' });
  } finally {
    conn.release();
  }

}
// ====== เพิ่มฟังก์ชันดูรายละเอียดคำขอ (ครู) ======
export async function detail(req, res) {
  try {
    const id = req.params.id;

    const [rows] = await pool.query(
      `SELECT *
         FROM enrollments
        WHERE enrollment_id=?`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ message: 'ไม่พบคำขอ' });

    const e = rows[0];

    // แปลง JSON ให้พร้อมใช้
    let files_json = null;
    let extra_json = null;
    try { files_json = e.files_json ? JSON.parse(e.files_json) : null; } catch {}
    try { extra_json = e.extra_json ? JSON.parse(e.extra_json) : null; } catch {}

    res.json({
      ...e,
      files_json,
      extra_json,
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'ดึงรายละเอียดคำขอไม่สำเร็จ' });
  }
}
