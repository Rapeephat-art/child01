// src/routes/health.routes.js
import { Router } from 'express';
import { authRequired, requireTeacher } from '../middleware/auth.js';
import { listChildren, saveBulk } from '../controllers/health.controller.js';

const r = Router();

// โหลดรายชื่อเด็กในศูนย์/ห้องของครู
r.get('/health/children', authRequired, requireTeacher, listChildren);

// บันทึกผลสุขภาพเป็นชุด
r.post('/health/records/bulk', authRequired, requireTeacher, saveBulk);

export default r;
