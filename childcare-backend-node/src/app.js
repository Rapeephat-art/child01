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
import announcementRoutes from './routes/announcement.routes.js';

import { authRequired } from './middleware/auth.js';
import { uploadsPath } from './middleware/upload.js';

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

// ✅ Security
app.use(helmet({ crossOriginResourcePolicy: false }));

// ✅ Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ CORS สำหรับ dev: allow 5173 + 5174
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true); // Postman / server-side
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS: ' + origin));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

/**
 * ✅ เสิร์ฟไฟล์อัปโหลด
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
app.use('/api', announcementRoutes);

// ✅ alias สำหรับตรวจ token ปัจจุบัน (ให้ตรงกับ frontend ที่เรียก /api/me)
app.get('/api/me', authRequired, (req, res) => {
  return res.json(req.user);
});

// ✅ Health check
app.get('/healthz', (_req, res) => res.json({ ok: true }));

// ✅ 404 เฉพาะ API
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'Not Found' });
  }
  next();
});

// ✅ Global Error Handler
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
