// backend/routes/enrollments.routes.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); // assume you already have mysql2 promise pool exported
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// upload config (เก็บใน uploads/enrollments)
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads', 'enrollments');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '_');
    cb(null, `${Date.now()}_${base}${ext}`);
  }
});
const upload = multer({ storage });

// POST /api/enrollments/draft
// body: arbitrary JSON form payload
router.post('/draft', async (req, res) => {
  try {
    const parentId = req.body.parent_id || null; // optional
    const payload = JSON.stringify(req.body);
    const status = 'draft';
    const [result] = await pool.query(
      'INSERT INTO enrollments (parent_id, payload, status, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      [parentId, payload, status]
    );
    const draftId = result.insertId;
    res.json({ ok: true, draftId });
  } catch (err) {
    console.error('enrollments.draft err', err);
    res.status(500).json({ ok: false, error: 'cannot save draft' });
  }
});

// GET /api/enrollments/:id
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await pool.query('SELECT * FROM enrollments WHERE enrollment_id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ ok: false, error: 'not found' });
    const row = rows[0];
    // parse payload if present
    let payload = null;
    try { payload = row.payload ? JSON.parse(row.payload) : null; } catch(e){ payload = row.payload; }
    res.json({ ok: true, enrollment: { ...row, payload } });
  } catch (err) {
    console.error('enrollments.get err', err);
    res.status(500).json({ ok: false, error: 'cannot read' });
  }
});

// POST /api/enrollments  (final submit) - expecting multipart/form-data
// fields: payload fields (as text) and files: attachment_birth_certificate, attachment_reg_child, ...
const fileFields = [
  { name: 'attachment_birth_certificate', maxCount: 1 },
  { name: 'attachment_reg_child', maxCount: 1 },
  { name: 'attachment_father_id', maxCount: 1 },
  { name: 'attachment_father_reg', maxCount: 1 },
  { name: 'attachment_mother_id', maxCount: 1 },
  { name: 'attachment_mother_reg', maxCount: 1 }
];

router.post('/', upload.fields(fileFields), async (req, res) => {
  try {
    // payload: fields may include many keys (we'll collect all non-file fields)
    // note: if client sent a single "payload" JSON field, prefer that
    let payloadObj = {};
    if (req.body.payload) {
      try { payloadObj = JSON.parse(req.body.payload); } catch(e){ payloadObj = { payload: req.body.payload }; }
    } else {
      // copy all text fields
      Object.keys(req.body).forEach(k => payloadObj[k] = req.body[k]);
    }

    // attach uploaded file paths (relative)
    if (req.files) {
      for (const [field, files] of Object.entries(req.files)) {
        if (files && files[0]) {
          payloadObj[field] = files[0].filename; // store filename, path can be reconstructed if needed
        }
      }
    }

    const parentId = payloadObj.parent_id || null;
    const status = 'submitted';
    const payloadStr = JSON.stringify(payloadObj);

    const [result] = await pool.query(
      'INSERT INTO enrollments (parent_id, payload, status, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      [parentId, payloadStr, status]
    );

    res.json({ ok: true, enrollmentId: result.insertId });
  } catch (err) {
    console.error('enrollments.create err', err);
    res.status(500).json({ ok: false, error: 'cannot create enrollment' });
  }
});

module.exports = router;
