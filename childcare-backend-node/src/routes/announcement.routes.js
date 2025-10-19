// routes/announcement.routes.js
import { Router } from "express";
import { authRequired, requireTeacher } from "../middleware/auth.js";
import * as announcement from "../controllers/announcement.controller.js";
import { upload } from "../middleware/upload.js";

const r = Router();

r.get("/announcements", announcement.getAll);
r.post("/announcements", authRequired, requireTeacher, upload.single("image"), announcement.create);
r.delete("/announcements/:id", authRequired, requireTeacher, announcement.remove);

export default r;
