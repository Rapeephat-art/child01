// src/controllers/auth.controller.js
import { pool } from '../config/db.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const COOKIE_NAME = 'token';
const COOKIE_OPTS = { httpOnly: true, sameSite: 'lax', secure: false, path: '/' };

export async function register(req, res) {
  try {
    const { username, first_name, last_name, password } = req.body || {};

    if (!username || !password || !first_name || !last_name) {
      return res.status(422).json({ message: 'กรอกชื่อผู้ใช้ ชื่อ นามสกุล และรหัสผ่านให้ครบ' });
    }
    if (String(password).length < 6) {
      return res.status(422).json({ message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' });
    }

    // กันชื่อผู้ใช้ซ้ำทั้งครู/ผู้ปกครอง
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

    const [ins] = await pool.query(
      `INSERT INTO parents (username, password, first_name, last_name)
       VALUES (?, ?, ?, ?)`,
      [username, password, first_name, last_name]
    );

    // ค่า default ที่จำเป็น
    try {
      await pool.query(
        `UPDATE parents
            SET role_id    = COALESCE(role_id, 2),
                status     = COALESCE(NULLIF(status,''), 'อนุมัติ'),
                created_at = COALESCE(created_at, NOW())
          WHERE parent_id = ?`,
        [ins.insertId]
      );
    } catch (w) {
      console.warn('WARN(register): set defaults failed:', w?.message || w);
    }

    const [[p]] = await pool.query(
      `SELECT parent_id, username, first_name, last_name, role_id
         FROM parents WHERE parent_id=?`,
      [ins.insertId]
    );

    const token = jwt.sign(
      { id: p.parent_id, type: 'parent', role_id: p.role_id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.cookie(COOKIE_NAME, token, COOKIE_OPTS);

    return res.status(201).json({
      user: {
        id: p.parent_id,
        type: 'parent',
        username: p.username,
        name: `${p.first_name ?? ''} ${p.last_name ?? ''}`.trim(),
        role_id: p.role_id,
      },
      message: 'สมัครสมาชิกสำเร็จ',
    });
  } catch (e) {
    console.error('REGISTER ERROR:', e);
    res.status(500).json({ message: 'สมัครสมาชิกไม่สำเร็จ', code: e.code });
  }
}

export async function login(req, res) {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(422).json({ message: 'username & password required' });
    }

    console.log('[LOGIN] username =', username);

    // 1) ครู
    let trows;
    try {
      [trows] = await pool.query(
        `SELECT teacher_id, username, first_name, last_name, role_id, center_id, password
           FROM teachers WHERE username=? LIMIT 1`,
        [username]
      );
      console.log('[LOGIN] teachers rows =', trows.length);
    } catch (e) {
      console.error('[LOGIN] query teachers error:', e);
      e.status = 500;
      throw e;
    }

    if (trows.length) {
      const t = trows[0];
      // ตอนนี้ยังไม่ hash เปรียบเทียบตรง ๆ
      if (String(password) !== String(t.password)) {
        return res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
      }

      const token = jwt.sign(
        { id: t.teacher_id, type: 'teacher', role_id: t.role_id },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.cookie(COOKIE_NAME, token, COOKIE_OPTS);
      return res.json({
        user: {
          id: t.teacher_id,
          type: 'teacher',
          username: t.username,
          name: `${t.first_name ?? ''} ${t.last_name ?? ''}`.trim(),
          role_id: t.role_id,
          center_id: t.center_id,
        },
      });
    }

    // 2) ผู้ปกครอง
    let prows;
    try {
      [prows] = await pool.query(
        `SELECT parent_id, username, first_name, last_name, role_id, password
           FROM parents WHERE username=? LIMIT 1`,
        [username]
      );
      console.log('[LOGIN] parents rows =', prows.length);
    } catch (e) {
      console.error('[LOGIN] query parents error:', e);
      e.status = 500;
      throw e;
    }

    if (!prows.length) {
      return res.status(401).json({ message: 'ไม่พบผู้ใช้' });
    }

    const p = prows[0];
    if (String(password) !== String(p.password)) {
      return res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
    }

    const token = jwt.sign(
      { id: p.parent_id, type: 'parent', role_id: p.role_id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie(COOKIE_NAME, token, COOKIE_OPTS);
    return res.json({
      user: {
        id: p.parent_id,
        type: 'parent',
        username: p.username,
        name: `${p.first_name ?? ''} ${p.last_name ?? ''}`.trim(),
        role_id: p.role_id,
      },
    });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    return res.status(err.status || 500).json({
      message: 'Login failed (server)',
      code: err.code || undefined,
    });
  }
}

export async function logout(req, res) {
  res.clearCookie(COOKIE_NAME, { path: '/' });
  res.json({ message: 'ออกจากระบบแล้ว' });
}
