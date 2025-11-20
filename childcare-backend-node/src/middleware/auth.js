// src/middleware/auth.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

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
    if (!token) {
      return res.status(401).json({ message: 'Unauthenticated' });
    }

    const payload = jwt.verify(token, JWT_SECRET);
    // payload คือ object user ที่เรา sign จาก login / register
    // ต้องมี id + type อย่างน้อย
    if (!payload || !payload.id || !payload.type) {
      return res.status(401).json({ message: 'Unauthenticated' });
    }

    req.user = payload;
    next();
  } catch (e) {
    console.error('authRequired error:', e?.message || e);
    return res.status(401).json({ message: 'Unauthenticated' });
  }
}

/** ล็อกอินก็ได้ ไม่ล็อกอินก็ได้ */
export async function authOptional(req, res, next) {
  try {
    const token = extractToken(req);
    if (!token) return next();

    const payload = jwt.verify(token, JWT_SECRET);
    if (payload && payload.id && payload.type) {
      req.user = payload;
    }
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

/** จำกัดสิทธิ์: ผู้ปกครองเท่านั้น */
export function requireParent(req, res, next) {
  if (req.user?.type !== 'parent') {
    return res.status(403).json({ message: 'เฉพาะผู้ปกครองเท่านั้น' });
  }
  next();
}

/** จำกัดสิทธิ์: แอดมินเท่านั้น (ถ้าอยากใช้ที่หลัง) */
export function requireAdmin(req, res, next) {
  if (req.user?.type !== 'admin') {
    return res.status(403).json({ message: 'เฉพาะผู้ดูแลระบบเท่านั้น' });
  }
  next();
}

/** alias เผื่อบาง route ยังอ้างชื่อเดิม */
export const teacherOnly = requireTeacher;
