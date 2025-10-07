// src/middleware/upload.js
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const uploadDir = path.resolve('uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    // ตัด path ออกให้เหลือแค่ชื่อไฟล์จริง
    const original = path.basename(file.originalname)
    // อนุญาตอักษร ตัวเลข จุด ขีดลบ ขีดล่าง + อักษรไทย
    const safeBase = original.replace(/[^\w.\-ก-๙]/g, '_')
    // ต่อ uuid เพื่อกันชื่อซ้ำ
    const unique = `${Date.now()}_${crypto.randomUUID()}_${safeBase}`
    cb(null, unique)
  },
})

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const ok = /^(image\/(jpeg|png|gif|webp)|application\/pdf)$/.test(file.mimetype)
    if (ok) return cb(null, true)
    return cb(new Error('ชนิดไฟล์ไม่รองรับ (อนุญาต: jpg, png, gif, webp, pdf)'))
  },
})

export const uploadsPath = uploadDir
