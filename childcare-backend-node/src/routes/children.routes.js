// src/routes/children.routes.js
import { Router } from 'express';
import {
  index as listChildren,
  mine as listMyChildren,      // ✅ เพิ่มอันนี้
  store as createChild,
  show as getChild,
  update as updateChild,
  destroy as deleteChild,
} from '../controllers/children.controller.js';
import { authRequired, requireTeacher, requireParent } from '../middleware/auth.js';

const r = Router();

// ✅ ผู้ปกครองดูบุตรหลานของตัวเอง
r.get('/children/mine', authRequired, requireParent, listMyChildren);

// ✅ ครูจัดการเด็ก
r.get   ('/children',     authRequired, requireTeacher, listChildren);
r.post  ('/children',     authRequired, requireTeacher, createChild);
r.get   ('/children/:id', authRequired, requireTeacher, getChild);
r.put   ('/children/:id', authRequired, requireTeacher, updateChild);
r.delete('/children/:id', authRequired, requireTeacher, deleteChild);

export default r;
