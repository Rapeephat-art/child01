import { Router } from "express";
import { authRequired, requireTeacher } from "../middleware/auth.js";
import * as announcement from "../controllers/announcement.controller.js";
import { upload } from "../middleware/upload.js";

const r = Router();

// ✅ ใช้ upload.array สำหรับหลายรูป (สูงสุด 5 รูป)
r.get("/announcements", announcement.getAll);
r.post(
  "/announcements",
  authRequired,
  requireTeacher,
  upload.array("images", 5),
  announcement.create
);
r.delete("/announcements/:id", authRequired, requireTeacher, announcement.remove);

export default r;
