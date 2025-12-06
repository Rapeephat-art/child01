// backend/routes/auth.routes.js
const express = require("express");
const router = express.Router();
const pool = require("../db.js"); // ตรวจให้แน่ใจว่าไฟล์นี้อยู่ใน backend/db.js

// REGISTER parent
router.post('/register', async (req, res) => {
  const { username, password, prefix, first_name, last_name, phone, email } = req.body;

  try {
    // 1) ตรวจ username ซ้ำ
    const [exists] = await pool.query(
      "SELECT user_id FROM users WHERE username = ?",
      [username]
    );
    if (exists.length > 0) {
      return res.status(400).json({ error: "username already exists" });
    }

    // 2) สร้างข้อมูลผู้ปกครองใน parent table
    const [parentResult] = await pool.query(
      `INSERT INTO parents (prefix, first_name, last_name, phone, email, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [prefix, first_name, last_name, phone, email]
    );

    const parent_id = parentResult.insertId;

    // 3) สร้าง user เชื่อมกับ parent_id
    const [userResult] = await pool.query(
      `INSERT INTO users (username, password, role, parent_id, created_at)
       VALUES (?, ?, 'parent', ?, NOW())`,
      [username, password, parent_id]
    );

    res.json({
      message: "register success",
      user_id: userResult.insertId,
      parent_id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "register failed" });
  }
});


// ✅ LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body;   // ให้แน่ใจว่า frontend ส่งชื่อนี้มา

  if (!username || !password) {
    return res.status(400).json({ error: "username and password required" });
  }

  try {
    // หาผู้ใช้จาก username
    const [rows] = await pool.query(
      "SELECT user_id, username, password, role, parent_id FROM users WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "invalid credentials" });
    }

    const user = rows[0];

    // ตอนนี้ register ยังเก็บ password แบบ plain-text
    // ถ้าต้องการใช้ bcrypt ค่อยปรับทีหลัง
    if (user.password !== password) {
      return res.status(401).json({ error: "invalid credentials" });
    }

    // ไม่ส่ง password กลับไป
    delete user.password;

    return res.json({
      message: "login success",
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "login failed" });
  }
});

module.exports = router;
