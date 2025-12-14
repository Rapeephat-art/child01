// backend/routes/auth.routes.js
const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

/* ================= REGISTER (parent) ================= */
router.post("/register", async (req, res) => {
  const { username, password, prefix, first_name, last_name, phone, email } = req.body;

  try {
    const [exists] = await pool.query(
      "SELECT user_id FROM users WHERE username = ?",
      [username]
    );
    if (exists.length > 0) {
      return res.status(400).json({ error: "username already exists" });
    }

    const [parentResult] = await pool.query(
      `INSERT INTO parents (prefix, first_name, last_name, phone, email, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [prefix, first_name, last_name, phone, email]
    );

    const parent_id = parentResult.insertId;

    const [userResult] = await pool.query(
      `INSERT INTO users (username, password, role, parent_id, created_at)
       VALUES (?, ?, 'parent', ?, NOW())`,
      [username, password, parent_id]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "register failed" });
  }
});

/* ================= LOGIN (แก้ตรงนี้) ================= */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "username and password required" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT user_id, username, password, role, parent_id, teacher_id FROM users WHERE username = ?",
      [username]
    );

    if (rows.length === 0 || rows[0].password !== password) {
      return res.status(401).json({ error: "invalid credentials" });
    }

    const user = rows[0];
    delete user.password;

    // ✅ สร้าง JWT
    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "login success",
      token,
      user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "login failed" });
  }
});

module.exports = router;
