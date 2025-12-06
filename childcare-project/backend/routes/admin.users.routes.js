// backend/routes/admin.users.routes.js
const express = require('express');
const router = express.Router();
const pool = require('../db.js');
const bcrypt = require('bcryptjs');

// (Optional) middleware ตรวจ admin - ถ้ามี req.user
function requireAdmin(req, res, next) {
  // ถ้าไม่มีระบบ auth ให้ comment out หรือแก้ตามระบบจริงของคุณ
  if (req.user && req.user.role === 'admin') return next();
  // สำหรับทดสอบ ถ้ไม่มี req.user ให้ผ่าน (หรือ return 403)
  // return res.status(403).json({ error: 'forbidden' });
  return next();
}

router.use(requireAdmin);

// GET /api/admin/users  -> ดึงรายชื่อผู้ใช้ทั้งหมด
router.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT user_id, username, role, parent_id, created_at
       FROM users
       ORDER BY created_at DESC`
    );
    res.json({ ok: true, rows });
  } catch (err) {
    console.error('GET /api/admin/users err', err);
    res.status(500).json({ error: 'failed to fetch users' });
  }
});

// POST /api/admin/users -> สร้างผู้ใช้ใหม่
router.post('/users', async (req, res) => {
  try {
    const { username, password, role, parent_id } = req.body;
    if (!username || !password || !role) {
      return res.status(400).json({ error: 'username, password and role required' });
    }

    // ตรวจ username ซ้ำ
    const [exists] = await pool.query('SELECT user_id FROM users WHERE username = ?', [username]);
    if (exists.length > 0) return res.status(400).json({ error: 'username already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (username, password, role, parent_id, created_at) VALUES (?, ?, ?, ?, NOW())',
      [username, hashed, role, parent_id || null]
    );

    res.json({ ok: true, user_id: result.insertId });
  } catch (err) {
    console.error('POST /api/admin/users err', err);
    res.status(500).json({ error: 'failed to create user' });
  }
});

// PUT /api/admin/users/:id -> แก้ไขผู้ใช้ (ไม่แก้ password ถ้าไม่ส่ง)
router.put('/users/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { username, password, role, parent_id } = req.body;
    if (!id) return res.status(400).json({ error: 'invalid id' });

    // ถ้ามี username ตรวจซ้ำ (ยกเว้นตัวเอง)
    if (username) {
      const [dup] = await pool.query('SELECT user_id FROM users WHERE username = ? AND user_id <> ?', [username, id]);
      if (dup.length > 0) return res.status(400).json({ error: 'username already taken' });
    }

    const parts = [];
    const params = [];

    if (username) { parts.push('username = ?'); params.push(username); }
    if (role) { parts.push('role = ?'); params.push(role); }
    if (typeof parent_id !== 'undefined') { parts.push('parent_id = ?'); params.push(parent_id || null); }
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      parts.push('password = ?'); params.push(hashed);
    }

    if (parts.length === 0) return res.status(400).json({ error: 'nothing to update' });

    params.push(id);
    const sql = `UPDATE users SET ${parts.join(', ')} WHERE user_id = ?`;
    await pool.query(sql, params);

    res.json({ ok: true });
  } catch (err) {
    console.error('PUT /api/admin/users/:id err', err);
    res.status(500).json({ error: 'failed to update user' });
  }
});

// DELETE /api/admin/users/:id -> ลบผู้ใช้
router.delete('/users/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({ error: 'invalid id' });

    await pool.query('DELETE FROM users WHERE user_id = ?', [id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/admin/users/:id err', err);
    res.status(500).json({ error: 'failed to delete user' });
  }
});

module.exports = router;
