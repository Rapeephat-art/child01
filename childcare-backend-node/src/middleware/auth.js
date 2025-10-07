// src/middleware/auth.js
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

/** ดึงข้อมูล user จาก payload (ครู/ผู้ปกครอง) */
async function getUserByToken(payload) {
  if (!payload?.type || !payload?.id) return null;

  if (payload.type === 'teacher') {
    const [rows] = await pool.query(
      `SELECT teacher_id, username, first_name, last_name, role_id, center_id
         FROM teachers
        WHERE teacher_id=? LIMIT 1`,
      [payload.id]
    );
    if (!rows.length) return null;
    const t = rows[0];
    return {
      id: t.teacher_id,
      type: 'teacher',
      username: t.username,
      name: `${t.first_name ?? ''} ${t.last_name ?? ''}`.trim(),
      role_id: t.role_id,
      center_id: t.center_id,
    };
  }

  if (payload.type === 'parent') {
    const [rows] = await pool.query(
      `SELECT parent_id, username, first_name, last_name, role_id
         FROM parents
        WHERE parent_id=? LIMIT 1`,
      [payload.id]
    );
    if (!rows.length) return null;
    const p = rows[0];
    return {
      id: p.parent_id,
      type: 'parent',
      username: p.username,
      name: `${p.first_name ?? ''} ${p.last_name ?? ''}`.trim(),
      role_id: p.role_id,
    };
  }

  return null;
}

/** ดึง token จาก cookie หรือ Authorization header */
function extractToken(req) {
  const cookieToken = req.cookies?.token;
  if (cookieToken) return cookieToken;

  const auth = req.headers?.authorization || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7).trim();

  return null;
}

/** ต้องล็อกอิน */
export async function authRequired(req, res, next) {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ message: 'Unauthenticated' });

    const payload = jwt.verify(token, JWT_SECRET);
    const user = await getUserByToken(payload);
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Unauthenticated' });
  }
}

/** ล็อกอินก็ได้ ไม่ล็อกอินก็ได้ */
export async function authOptional(req, res, next) {
  try {
    const token = extractToken(req);
    if (!token) return next();

    const payload = jwt.verify(token, JWT_SECRET);
    const user = await getUserByToken(payload);
    if (user) req.user = user;
    next();
  } catch {
    next();
  }
}

/** จำกัดสิทธิ์: ครูเท่านั้น */
export function requireTeacher(req, res, next) {
  if (req.user?.type !== 'teacher') {
    return res.status(403).json({ message: 'เฉพาะครูเท่านั้น' });
  }
  next();
}

/** (เผื่อใช้) จำกัดสิทธิ์: ผู้ปกครองเท่านั้น */
export function requireParent(req, res, next) {
  if (req.user?.type !== 'parent') {
    return res.status(403).json({ message: 'เฉพาะผู้ปกครองเท่านั้น' });
  }
  next();
}

/** ✅ alias เผื่อบาง route ยังอ้างชื่อเดิม */
export const teacherOnly = requireTeacher;
