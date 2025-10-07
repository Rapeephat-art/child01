// src/routes/menu.routes.js
import { Router } from 'express';
import { authRequired, authOptional, requireTeacher } from '../middleware/auth.js';
import { listFoods, listByMonth, upsertMenu, removeMenu } from '../controllers/menu.controller.js';

const r = Router();

// ✅ ใคร ๆ ก็เรียกได้ (ล็อกอินหรือไม่ก็ได้)
r.get('/foods', authOptional, listFoods);
r.get('/menus', authOptional, listByMonth);

// ✏️ สร้าง/แก้ไข ต้องเป็นครู
r.post('/menus', authRequired, requireTeacher, upsertMenu);

// 🗑️ ลบ ต้องเป็นครู
r.delete('/menus/:date', authRequired, requireTeacher, removeMenu);

export default r;
