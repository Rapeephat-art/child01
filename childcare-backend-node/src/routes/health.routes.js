// src/routes/health.routes.js
import { Router } from 'express';
import { authRequired, requireTeacher } from '../middleware/auth.js';
import { saveBulk /*, listByDate*/ } from '../controllers/health.controller.js';

const r = Router();

/**
 * บันทึกสุขภาพแบบ “ครั้งเดียวหลายคน” (ที่หน้า Health.jsx ใช้อยู่)
 * POST /api/health/records/bulk
 */
r.post('/health/records/bulk', authRequired, requireTeacher, saveBulk);

// (ถ้าจะมีดึงข้อมูลภายหลัง)
// r.get('/health/records', authRequired, requireTeacher, listByDate);

export default r;
