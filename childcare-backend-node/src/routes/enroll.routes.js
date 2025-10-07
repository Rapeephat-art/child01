// src/routes/enroll.routes.js
import { Router } from "express";
import * as enroll from "../controllers/enroll.controller.js";
import { authRequired, requireTeacher } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js"; // ✅ ใช้ multer

const r = Router();

// ผู้ปกครองส่งคำขอสมัครเรียน (รองรับแนบไฟล์หลายชนิด)
r.post(
  "/enrollments",
  authRequired,
  upload.fields([
    { name: "document", maxCount: 1 },              // ช่องแนบเอกสารเดิม (ถ้ามี)
    { name: "map_file", maxCount: 1 },              // แผนที่บ้านของนักเรียน
    { name: "birth_cert_file", maxCount: 1 },       // สำเนาสูติบัตร
    { name: "child_house_reg_file", maxCount: 1 },  // ทะเบียนบ้านเด็ก
    { name: "father_id_file", maxCount: 1 },        // บัตร ปชช. บิดา
    { name: "father_house_reg_file", maxCount: 1 }, // ทะเบียนบ้าน บิดา
    { name: "mother_id_file", maxCount: 1 },        // บัตร ปชช. มารดา
    { name: "mother_house_reg_file", maxCount: 1 }, // ทะเบียนบ้าน มารดา
  ]),
  enroll.create
);

// ผู้ปกครองดูคำขอตัวเอง
r.get("/enrollments/mine", authRequired, enroll.myList);

// (ครู) ดูรายการรออนุมัติ
r.get("/enrollments", authRequired, requireTeacher, enroll.listPending);

// ✅ (ครู) ดู “รายละเอียด” คำขอสมัครเรียนรายคน
r.get("/enrollments/:id", authRequired, requireTeacher, enroll.detail);

// (ครู) อนุมัติ -> สร้างเด็กใน children
r.patch(
  "/enrollments/:id/approve",
  authRequired,
  requireTeacher,
  enroll.approve
);

export default r;
