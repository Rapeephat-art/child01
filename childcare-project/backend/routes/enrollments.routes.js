// backend/routes/enrollments.routes.js
const express = require("express");
const router = express.Router();
const pool = require("../db");
const { authMiddleware, permit } = require("../middlewares/auth");

// สมัครเรียน (ผู้ปกครอง)
router.post(
  "/",
  authMiddleware,
  permit("parent"),
  async (req, res) => {
    try {
      const parent_id = req.user.parent_id;

      // รับทั้งฟอร์มเป็น JSON
      const payload = req.body;

      if (!payload || Object.keys(payload).length === 0) {
        return res.status(400).json({ error: "enrollment data required" });
      }

      await pool.query(
        `
        INSERT INTO enrollments
          (parent_id, status, extra_json, created_by, created_at)
        VALUES
          (?, 'pending', ?, ?, NOW())
        `,
        [
          parent_id,
          JSON.stringify(payload),
          parent_id
        ]
      );

      res.json({ ok: true, message: "enrollment submitted" });
    } catch (err) {
      console.error("enrollments error:", err);
      res.status(500).json({ error: "cannot save enrollment" });
    }
  }
);

module.exports = router;
