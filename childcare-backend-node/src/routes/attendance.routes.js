// src/routes/attendance.routes.js
import { Router } from 'express';
import { initAttendance, saveBulkAttendance } from '../controllers/attendance.controller.js';
import { authRequired } from '../middleware/auth.js';

const r = Router();

r.get('/attendance/init', authRequired, initAttendance);
r.post('/attendance/:sessionId/bulk', authRequired, saveBulkAttendance);

export default r;
