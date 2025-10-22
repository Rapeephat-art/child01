// src/app.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import multer from 'multer';

// ✅ Import routes
import authRoutes from './routes/auth.routes.js';
import childrenRoutes from './routes/children.routes.js';
import enrollRoutes from './routes/enroll.routes.js';
import healthRoutes from './routes/health.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import menuRoutes from './routes/menu.routes.js';
import announcementRoutes from './routes/announcement.routes.js'; // ✅ เพิ่ม route ประกาศ

import { authOptional } from './middleware/auth.js';
import { uploadsPath } from './middleware/upload.js';

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

// ✅ ตั้งค่า Helmet ให้อนุญาต cross-origin resource
app.use(helmet({ crossOriginResourcePolicy: false }));

// ✅ ตัวแปลงข้อมูลพื้นฐาน
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ ตั้งค่า CORS
const allow = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const corsConfig = {
  origin(origin, cb) {
    if (!origin) return cb(null, true); // allow Postman หรือ same-origin
    if (allow.includes(origin)) return cb(null, true);
    return cb(new Error('CORS not allowed for origin: ' + origin));
  },
  credentials: true,
};

app.options('*', cors(corsConfig));
app.use(cors(corsConfig));

/**
 * ✅ เสิร์ฟไฟล์อัปโหลดได้จาก 2 path
 *  - /uploads
 *  - /api/uploads
 */
app.use(
  '/uploads',
  express.static(uploadsPath, { maxAge: '7d', immutable: true })
);
app.use(
  '/api/uploads',
  express.static(uploadsPath, {
    maxAge: '7d',
    immutable: true,
    fallthrough: false,
  })
);

// ✅ Register API routes
app.use('/api/auth', authRoutes);
app.use('/api', enrollRoutes);
app.use('/api', childrenRoutes);
app.use('/api', healthRoutes);
app.use('/api', attendanceRoutes);
app.use('/api', menuRoutes);
app.use('/api', announcementRoutes); // ✅ เพิ่มตรงนี้

// ✅ Endpoint ตรวจสอบ token ปัจจุบัน
app.get('/api/me', authOptional, (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthenticated' });
  res.json(req.user);
});

// ✅ Health check สำหรับระบบ monitoring
app.get('/healthz', (_req, res) => res.json({ ok: true }));

// ✅ จัดการ 404 เฉพาะเส้นทาง API
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'Not Found' });
  }
  next();
});

// ✅ Global Error Handler (รวม Multer ด้วย)
app.use((err, _req, res, _next) => {
  console.error('[APP ERROR]', err);

  if (err instanceof multer.MulterError) {
    return res
      .status(400)
      .json({ message: `Upload error: ${err.message}`, code: err.code });
  }

  if (err?.message?.startsWith?.('Invalid file type')) {
    return res.status(400).json({ message: err.message });
  }

  const status = err.status || 500;
  res
    .status(status)
    .json({ message: err.message || 'Internal Server Error', code: err.code });
});

export default app;
