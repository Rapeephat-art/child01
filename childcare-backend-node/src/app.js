// src/app.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import multer from 'multer';

import authRoutes from './routes/auth.routes.js';
import childrenRoutes from './routes/children.routes.js';
import enrollRoutes from './routes/enroll.routes.js';
import healthRoutes from './routes/health.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import menuRoutes from './routes/menu.routes.js';       // ⬅️ NEW: เมนูอาหาร

import { authOptional } from './middleware/auth.js';
import { uploadsPath } from './middleware/upload.js';

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

// อนุญาต cross-origin สำหรับ static ใน /uploads
app.use(helmet({ crossOriginResourcePolicy: false }));

// parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS: ตั้งจาก ENV CORS_ORIGINS (เช่น http://localhost:5173,http://127.0.0.1:5173)
const allow = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const corsConfig = {
  origin(origin, cb) {
    if (!origin) return cb(null, true); // Postman / same-origin
    if (allow.includes(origin)) return cb(null, true);
    return cb(new Error('CORS not allowed for origin: ' + origin));
  },
  credentials: true,
};

// preflight + cors หลัก
app.options('*', cors(corsConfig));
app.use(cors(corsConfig));

/**
 * เสิร์ฟไฟล์อัปโหลด 2 path
 * - /uploads      (เข้าตรง)
 * - /api/uploads  (ผ่าน proxy ของ Vite:5173)
 */
app.use('/uploads',     express.static(uploadsPath, { maxAge: '7d', immutable: true }));
app.use('/api/uploads', express.static(uploadsPath, { maxAge: '7d', immutable: true, fallthrough: false }));

// ---------- API Routes (วางหลัง parsers/CORS เสมอ) ----------
app.use('/api/auth', authRoutes);
app.use('/api', enrollRoutes);
app.use('/api', childrenRoutes);
app.use('/api', healthRoutes);
app.use('/api', attendanceRoutes);  // ⬅️ ย้ายมาไว้ตรงนี้
app.use('/api', menuRoutes);        // ⬅️ NEW: เส้นทางเมนูอาหาร

// ข้อมูลผู้ใช้ปัจจุบันจาก token
app.get('/api/me', authOptional, (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthenticated' });
  res.json(req.user);
});

// health check
app.get('/healthz', (_req, res) => res.json({ ok: true }));

// 404 เฉพาะเส้นทาง /api/*
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'Not Found' });
  }
  next();
});

// Global error handler (+ แจกแจง Multer)
app.use((err, _req, res, _next) => {
  console.error('[APP ERROR]', err);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Upload error: ${err.message}`, code: err.code });
  }
  if (err?.message?.startsWith?.('Invalid file type')) {
    return res.status(400).json({ message: err.message });
  }
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal Server Error', code: err.code });
});

export default app;
