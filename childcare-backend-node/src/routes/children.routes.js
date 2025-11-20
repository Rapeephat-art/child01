import { Router } from 'express';
import {
  index as listChildren,
  store as createChild,
  show as getChild,
  update as updateChild,
  destroy as deleteChild,
  getMyChildren,   // 👈 อันนี้ต้อง import ด้วย
} from '../controllers/children.controller.js';
import { authRequired, requireTeacher, requireParent } from '../middleware/auth.js';

const r = Router();

// ✅ ผู้ปกครองดึงลูกของตัวเอง
r.get('/children/mine', authRequired, requireParent, getMyChildren);

// ครูจัดการเด็ก
r.get   ('/children',      authRequired, requireTeacher, listChildren);
r.post  ('/children',      authRequired, requireTeacher, createChild);
r.get   ('/children/:id',  authRequired, requireTeacher, getChild);
r.put   ('/children/:id',  authRequired, requireTeacher, updateChild);
r.delete('/children/:id',  authRequired, requireTeacher, deleteChild);

export default r;
