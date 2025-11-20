// src/controllers/auth.controller.js
import { pool } from '../config/db.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const COOKIE_NAME = 'token';
const COOKIE_OPTS = { httpOnly: true, sameSite: 'lax', secure: false, path: '/' };

// ---------- REGISTER ----------
export async function register(req, res) {
  try {
    const { username, first_name, last_name, password } = req.body || {};

    if (!username || !password || !first_name || !last_name) {
      return res
        .status(422)
        .json({ message: 'กรอกชื่อผู้ใช้ ชื่อ นามสกุล และรหัสผ่านให้ครบ' });
    }
    if (String(password).length < 6) {
      return res
        .status(422)
        .json({ message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' });
    }

    // กันชื่อซ้ำใน teachers / parents
    const [[teachDup]] = await pool.query(
      'SELECT 1 AS ok FROM teachers WHERE username=? LIMIT 1',
      [username]
    );
    const [[parentDup]] = await pool.query(
      'SELECT 1 AS ok FROM parents WHERE username=? LIMIT 1',
      [username]
    );
    if (teachDup || parentDup) {
      return res.status(409).json({ message: 'ชื่อผู้ใช้นี้ถูกใช้แล้ว' });
    }

    // 1) สร้าง parent
    const [ins] = await pool.query(
      `INSERT INTO parents (username, password, first_name, last_name)
       VALUES (?, ?, ?, ?)`,
      [username, password, first_name, last_name]
    );

    const newParentId = ins.insertId;

    // เซ็ตค่า default เพิ่มเติม (เผื่อใช้)
    try {
      await pool.query(
        `UPDATE parents
            SET role_id    = COALESCE(role_id, 2),
                status     = COALESCE(NULLIF(status,''), 'อนุมัติ'),
                created_at = COALESCE(created_at, NOW())
          WHERE parent_id = ?`,
        [newParentId]
      );
    } catch (w) {
      console.warn('WARN(register): set defaults failed:', w?.message || w);
    }

    // 2) ดึง parent กลับมา (เอาไว้ประกอบ user object)
    const [[p]] = await pool.query(
      `SELECT parent_id, username, first_name, last_name, role_id
         FROM parents WHERE parent_id=?`,
      [newParentId]
    );

    // 3) เพิ่ม user สำหรับล็อกอินในตาราง users ด้วย
    //    เพื่อให้ /auth/login (ที่ใช้ตาราง users) หาเจอ
    await pool.query(
      `INSERT INTO users (username, password, role, center_id, teacher_id, parent_id, created_by)
       VALUES (?, ?, 'parent', NULL, NULL, ?, NULL)`,
      [p.username, password, p.parent_id]
    );

    const user = {
      id: p.parent_id,
      type: 'parent',
      username: p.username,
      name: `${p.first_name ?? ''} ${p.last_name ?? ''}`.trim(),
      role: 'parent',
      role_id: p.role_id,
    };

    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
    res.cookie(COOKIE_NAME, token, COOKIE_OPTS);

    return res.status(201).json({
      user,
      message: 'สมัครสมาชิกสำเร็จ',
    });
  } catch (e) {
    console.error('REGISTER ERROR:', e);
    res
      .status(500)
      .json({ message: 'สมัครสมาชิกไม่สำเร็จ', code: e.code });
  }
}

// ---------- LOGIN ----------
export async function login(req, res) {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res
        .status(422)
        .json({ message: 'username & password required' });
    }

    console.log('[LOGIN] username =', username);

    const [rows] = await pool.query(
      `SELECT 
          u.user_id,
          u.username,
          u.password,
          u.role,
          u.center_id,
          u.teacher_id,
          u.parent_id,
          t.first_name AS teacher_first_name,
          t.last_name  AS teacher_last_name,
          p.first_name AS parent_first_name,
          p.last_name  AS parent_last_name
       FROM users u
       LEFT JOIN teachers t ON u.teacher_id = t.teacher_id
       LEFT JOIN parents  p ON u.parent_id  = p.parent_id
       WHERE u.username = ?
       LIMIT 1`,
      [username]
    );

    if (!rows.length) {
      return res.status(401).json({ message: 'ไม่พบผู้ใช้' });
    }

    const u = rows[0];

    // ตอนนี้ยังไม่ hash password: เทียบตรง ๆ
    if (String(password) !== String(u.password)) {
      return res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
    }

    // ----- เตรียม object user ตาม role -----
    let user;

    if (u.role === 'admin') {
      user = {
        id: u.user_id,
        type: 'admin',
        username: u.username,
        name: 'ผู้ดูแลระบบ',
        role: u.role,
        center_id: u.center_id ?? null,
      };
    } else if (u.role === 'teacher') {
      if (!u.teacher_id) {
        return res
          .status(500)
          .json({ message: 'teacher_id not found for this user' });
      }
      user = {
        id: u.teacher_id,
        type: 'teacher',
        username: u.username,
        name:
          `${u.teacher_first_name ?? ''} ${u.teacher_last_name ?? ''}`.trim() ||
          u.username,
        role: u.role,
        center_id: u.center_id ?? null,
      };
    } else if (u.role === 'parent') {
      if (!u.parent_id) {
        return res
          .status(500)
          .json({ message: 'parent_id not found for this user' });
      }
      user = {
        id: u.parent_id,
        type: 'parent',
        username: u.username,
        name:
          `${u.parent_first_name ?? ''} ${u.parent_last_name ?? ''}`.trim() ||
          u.username,
        role: u.role,
      };
    } else {
      user = {
        id: u.user_id,
        type: u.role || 'user',
        username: u.username,
        name: u.username,
        role: u.role,
        center_id: u.center_id ?? null,
      };
    }

    // 👇 ใส่ user ทั้งก้อนลงใน token (payload จะมี id + type พอดีกับ auth.js ที่ query DB)
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
    res.cookie(COOKIE_NAME, token, COOKIE_OPTS);

    return res.json({ user });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    return res.status(err.status || 500).json({
      message: 'Login failed (server)',
      code: err.code || undefined,
    });
  }
}

// ---------- ME ----------
export async function me(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthenticated' });
  }
  return res.json(req.user);
}

// ---------- LOGOUT ----------
export async function logout(_req, res) {
  res.clearCookie(COOKIE_NAME, { path: '/' });
  res.json({ message: 'ออกจากระบบแล้ว' });
}
