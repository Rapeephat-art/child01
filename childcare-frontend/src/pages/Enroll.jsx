// src/pages/Enroll.jsx
import { useState } from "react";
import api from "../api/axios";

export default function Enroll() {
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [file, setFile] = useState(null); // เดิม: แนบเอกสาร 1 ช่องทั่วไป

  // ✅ เพิ่ม state ไฟล์แนบรายชนิด
  const [mapFile, setMapFile] = useState(null);                 // แผนที่บ้านของนักเรียน
  const [birthCertFile, setBirthCertFile] = useState(null);     // สำเนาสูติบัตร
  const [childHouseRegFile, setChildHouseRegFile] = useState(null); // สำเนาทะเบียนบ้านเด็ก
  const [fatherIdFile, setFatherIdFile] = useState(null);       // สำเนาบัตรประชาชน บิดา
  const [fatherHouseRegFile, setFatherHouseRegFile] = useState(null); // สำเนาทะเบียนบ้าน บิดา
  const [motherIdFile, setMotherIdFile] = useState(null);       // สำเนาบัตรประชาชน มารดา
  const [motherHouseRegFile, setMotherHouseRegFile] = useState(null); // สำเนาทะเบียนบ้าน มารดา

  const [form, setForm] = useState({
    // --- กลุ่มอายุ ---
    age_group: "", // "<3" | "3"

    // --- ข้อมูลเด็กพื้นฐาน ---
    prefix: "",
    first_name: "",
    last_name: "",
    nickname: "",
    gender: "",
    citizen_id: "",
    birth_date: "",
    weight_kg: "",
    height_cm: "",

    // --- ที่อยู่เด็ก: ทะเบียนบ้าน ---
    child_home_house_no: "",
    child_home_village: "",
    child_home_street: "",
    child_home_subdistrict: "",
    child_home_district: "",
    child_home_province: "",
    child_home_postal: "",

    // --- ที่อยู่เด็ก: ปัจจุบัน ---
    child_cur_house_no: "",
    child_cur_village: "",
    child_cur_street: "",
    child_cur_subdistrict: "",
    child_cur_district: "",
    child_cur_province: "",
    child_cur_postal: "",

    // --- ช่องทางติดต่อผู้ปกครองหลัก ---
    parent_phone: "",
    note: "",

    // --- บิดา ---
    father_prefix: "",
    father_first_name: "",
    father_last_name: "",
    father_citizen_id: "",
    father_job: "",
    father_income: "",

    // ที่อยู่บิดา (แยกช่อง)
    father_house_no: "",
    father_village: "",
    father_street: "",
    father_subdistrict: "",
    father_district: "",
    father_province: "",
    father_postal: "",

    // --- มารดา ---
    mother_prefix: "",
    mother_first_name: "",
    mother_last_name: "",
    mother_citizen_id: "",
    mother_job: "",
    mother_income: "",

    // ที่อยู่มารดา (แยกช่อง)
    mother_house_no: "",
    mother_village: "",
    mother_street: "",
    mother_subdistrict: "",
    mother_district: "",
    mother_province: "",
    mother_postal: "",

    // --- ผู้ดูแลอุปการะ ---
    caregiver_relation: "", // "father" | "mother" | "both" | "relative"
    caregiver_job: "",
    caregiver_income: "",

    // --- ผู้รับส่งเด็ก ---
    pickup_name: "",
    pickup_relation: "",
    pickup_phone: "",

    // --- สุขภาพทั่วไป / หมายเหตุสุขภาพ ---
    health_accidents_history: "",
    health_chronic_disease: "",
    health_behavior_issue: "",
    health_food_allergy: "",
    health_drug_allergy: "",
    vaccine_status: "", // "complete" | "incomplete"
  });

  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    // ตรวจสอบขั้นต่ำ
    if (!form.first_name.trim() || !form.last_name.trim()) {
      setMsg({ type: "danger", text: "กรอกชื่อและสกุลของเด็กให้ครบถ้วน" });
      return;
    }
    if (!form.age_group) {
      setMsg({ type: "danger", text: "กรุณาเลือกช่วงอายุของเด็ก" });
      return;
    }

    try {
      setSaving(true);
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ""));

      // เดิม: แนบไฟล์ทั่วไป 1 ช่อง
      if (file) fd.append("document", file);

      // ✅ เพิ่ม: แนบไฟล์แยกตามชนิด
      if (mapFile) fd.append("map_file", mapFile);
      if (birthCertFile) fd.append("birth_cert_file", birthCertFile);
      if (childHouseRegFile) fd.append("child_house_reg_file", childHouseRegFile);
      if (fatherIdFile) fd.append("father_id_file", fatherIdFile);
      if (fatherHouseRegFile) fd.append("father_house_reg_file", fatherHouseRegFile);
      if (motherIdFile) fd.append("mother_id_file", motherIdFile);
      if (motherHouseRegFile) fd.append("mother_house_reg_file", motherHouseRegFile);

      await api.post("/enrollments", fd);
      setMsg({
        type: "success",
        text: "ส่งคำขอสมัครเรียนแล้ว! เจ้าหน้าที่จะตรวจสอบและติดต่อกลับ",
      });

      // รีเซ็ตฟอร์ม (คงตามของเดิม ไม่แตะ state ไฟล์ใหม่ตามที่สั่งให้เพิ่มอย่างเดียว)
      setForm({
        age_group: "",
        prefix: "",
        first_name: "",
        last_name: "",
        nickname: "",
        gender: "",
        citizen_id: "",
        birth_date: "",
        weight_kg: "",
        height_cm: "",
        child_home_house_no: "",
        child_home_village: "",
        child_home_street: "",
        child_home_subdistrict: "",
        child_home_district: "",
        child_home_province: "",
        child_home_postal: "",
        child_cur_house_no: "",
        child_cur_village: "",
        child_cur_street: "",
        child_cur_subdistrict: "",
        child_cur_district: "",
        child_cur_province: "",
        child_cur_postal: "",
        parent_phone: "",
        note: "",
        father_prefix: "",
        father_first_name: "",
        father_last_name: "",
        father_citizen_id: "",
        father_job: "",
        father_income: "",
        father_house_no: "",
        father_village: "",
        father_street: "",
        father_subdistrict: "",
        father_district: "",
        father_province: "",
        father_postal: "",
        mother_prefix: "",
        mother_first_name: "",
        mother_last_name: "",
        mother_citizen_id: "",
        mother_job: "",
        mother_income: "",
        mother_house_no: "",
        mother_village: "",
        mother_street: "",
        mother_subdistrict: "",
        mother_district: "",
        mother_province: "",
        mother_postal: "",
        caregiver_relation: "",
        caregiver_job: "",
        caregiver_income: "",
        pickup_name: "",
        pickup_relation: "",
        pickup_phone: "",
        health_accidents_history: "",
        health_chronic_disease: "",
        health_behavior_issue: "",
        health_food_allergy: "",
        health_drug_allergy: "",
        vaccine_status: "",
      });
      setFile(null);
      // ถ้าต้องการล้างไฟล์แนบใหม่ทั้งหมดด้วย ให้เพิ่ม:
      // setMapFile(null); setBirthCertFile(null); setChildHouseRegFile(null);
      // setFatherIdFile(null); setFatherHouseRegFile(null);
      // setMotherIdFile(null); setMotherHouseRegFile(null);

    } catch (err) {
      setMsg({
        type: "danger",
        text: err?.response?.data?.message || "ส่งคำขอไม่สำเร็จ",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container py-4">
      <div className="section-hero d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">
          <i className="bi bi-journal-plus me-2" />
          สมัครเรียนเข้า “ศูนย์พัฒนาเด็กเล็ก”
        </h4>
        <div className="brand-chip">
          <i className="bi bi-stars me-2" />
          กรอกข้อมูลให้ครบถ้วน
        </div>
      </div>

      <div className="card p-3 card-hover">
        {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

        <form onSubmit={submit} className="row g-3">
          {/* ====== กลุ่มอายุ ====== */}
          <div className="col-12">
            <h6 className="text-muted mb-2">
              <i className="bi bi-calendar-heart me-2" />
              ระบุช่วงอายุ
            </h6>
            <hr className="mt-0" />
            <div className="d-flex gap-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="age_lt3"
                  name="age_group"
                  value="<3"
                  checked={form.age_group === "<3"}
                  onChange={(e) => set("age_group", e.target.value)}
                />
                <label className="form-check-label" htmlFor="age_lt3">
                  อายุต่ำกว่า 3 ปี
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="age_eq3"
                  name="age_group"
                  value="3"
                  checked={form.age_group === "3"}
                  onChange={(e) => set("age_group", e.target.value)}
                />
                <label className="form-check-label" htmlFor="age_eq3">
                  อายุ 3 ปี
                </label>
              </div>
            </div>
          </div>

          {/* ====== ข้อมูลเด็ก ====== */}
          <div className="col-12">
            <h6 className="text-muted mb-2">
              <i className="bi bi-person-badge me-2" />
              ข้อมูลเด็ก
            </h6>
            <hr className="mt-0" />
          </div>

          <div className="col-12 col-md-3">
            <label className="form-label">คำนำหน้า</label>
            <select
              className="form-select"
              value={form.prefix}
              onChange={(e) => set("prefix", e.target.value)}
            >
              <option value="">- เลือก -</option>
              <option value="เด็กชาย">เด็กชาย</option>
              <option value="เด็กหญิง">เด็กหญิง</option>
            </select>
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">ชื่อ</label>
            <input
              className="form-control"
              required
              value={form.first_name}
              onChange={(e) => set("first_name", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-5">
            <label className="form-label">สกุล</label>
            <input
              className="form-control"
              required
              value={form.last_name}
              onChange={(e) => set("last_name", e.target.value)}
            />
          </div>

          <div className="col-12 col-md-3">
            <label className="form-label">ชื่อเล่น</label>
            <input
              className="form-control"
              value={form.nickname}
              onChange={(e) => set("nickname", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-3">
            <label className="form-label">เพศ</label>
            <select
              className="form-select"
              value={form.gender}
              onChange={(e) => set("gender", e.target.value)}
            >
              <option value="">- เลือก -</option>
              <option value="ชาย">ชาย</option>
              <option value="หญิง">หญิง</option>
            </select>
          </div>
          <div className="col-12 col-md-3">
            <label className="form-label">เลขบัตรประชาชน</label>
            <input
              className="form-control"
              value={form.citizen_id}
              onChange={(e) => set("citizen_id", e.target.value)}
              maxLength={20}
            />
          </div>
          <div className="col-12 col-md-3">
            <label className="form-label">วัน/เดือน/ปี เกิด</label>
            <input
              type="date"
              className="form-control"
              value={form.birth_date}
              onChange={(e) => set("birth_date", e.target.value)}
            />
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label">น้ำหนัก (กก.)</label>
            <input
              className="form-control"
              value={form.weight_kg}
              onChange={(e) => set("weight_kg", e.target.value)}
            />
          </div>
          <div className="col-6 col-md-3">
            <label className="form-label">ส่วนสูง (ซม.)</label>
            <input
              className="form-control"
              value={form.height_cm}
              onChange={(e) => set("height_cm", e.target.value)}
            />
          </div>

          {/* ====== ที่อยู่เด็ก: ทะเบียนบ้าน ====== */}
          <div className="col-12 mt-2">
            <h6 className="text-muted mb-2">
              <i className="bi bi-geo-alt me-2" />
              ที่อยู่ตามทะเบียนบ้าน (เด็ก)
            </h6>
            <hr className="mt-0" />
          </div>

          <div className="col-6 col-md-2">
            <label className="form-label">บ้านเลขที่</label>
            <input
              className="form-control"
              value={form.child_home_house_no}
              onChange={(e) => set("child_home_house_no", e.target.value)}
            />
          </div>
          <div className="col-6 col-md-2">
            <label className="form-label">หมู่บ้าน/หมู่</label>
            <input
              className="form-control"
              value={form.child_home_village}
              onChange={(e) => set("child_home_village", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">ถนน</label>
            <input
              className="form-control"
              value={form.child_home_street}
              onChange={(e) => set("child_home_street", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">ตำบล/แขวง</label>
            <input
              className="form-control"
              value={form.child_home_subdistrict}
              onChange={(e) => set("child_home_subdistrict", e.target.value)}
            />
          </div>
          <div className="col-6 col-md-4">
            <label className="form-label">อำเภอ/เขต</label>
            <input
              className="form-control"
              value={form.child_home_district}
              onChange={(e) => set("child_home_district", e.target.value)}
            />
          </div>
          <div className="col-6 col-md-4">
            <label className="form-label">จังหวัด</label>
            <input
              className="form-control"
              value={form.child_home_province}
              onChange={(e) => set("child_home_province", e.target.value)}
            />
          </div>
          <div className="col-6 col-md-2">
            <label className="form-label">รหัสไปรษณีย์</label>
            <input
              className="form-control"
              maxLength={5}
              value={form.child_home_postal}
              onChange={(e) => set("child_home_postal", e.target.value)}
            />
          </div>

          {/* ====== ที่อยู่เด็ก: ปัจจุบัน ====== */}
          <div className="col-12 mt-2">
            <h6 className="text-muted mb-2">
              <i className="bi bi-geo-alt-fill me-2" />
              ที่อยู่ปัจจุบัน (เด็ก)
            </h6>
            <hr className="mt-0" />
          </div>

          <div className="col-6 col-md-2">
            <label className="form-label">บ้านเลขที่</label>
            <input
              className="form-control"
              value={form.child_cur_house_no}
              onChange={(e) => set("child_cur_house_no", e.target.value)}
            />
          </div>
          <div className="col-6 col-md-2">
            <label className="form-label">หมู่บ้าน/หมู่</label>
            <input
              className="form-control"
              value={form.child_cur_village}
              onChange={(e) => set("child_cur_village", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">ถนน</label>
            <input
              className="form-control"
              value={form.child_cur_street}
              onChange={(e) => set("child_cur_street", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">ตำบล/แขวง</label>
            <input
              className="form-control"
              value={form.child_cur_subdistrict}
              onChange={(e) => set("child_cur_subdistrict", e.target.value)}
            />
          </div>
          <div className="col-6 col-md-4">
            <label className="form-label">อำเภอ/เขต</label>
            <input
              className="form-control"
              value={form.child_cur_district}
              onChange={(e) => set("child_cur_district", e.target.value)}
            />
          </div>
          <div className="col-6 col-md-4">
            <label className="form-label">จังหวัด</label>
            <input
              className="form-control"
              value={form.child_cur_province}
              onChange={(e) => set("child_cur_province", e.target.value)}
            />
          </div>
          <div className="col-6 col-md-2">
            <label className="form-label">รหัสไปรษณีย์</label>
            <input
              className="form-control"
              maxLength={5}
              value={form.child_cur_postal}
              onChange={(e) => set("child_cur_postal", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-8">
            <label className="form-label">หมายเหตุ</label>
            <input
              className="form-control"
              value={form.note}
              onChange={(e) => set("note", e.target.value)}
              placeholder="แพ้อาหาร/ข้อมูลเพิ่มเติม"
            />
          </div>
          {/* ====== ข้อมูลบิดา ====== */}
          <div className="col-12 mt-4">
            <h6 className="text-muted mb-2">
              <i className="bi bi-person me-2" />
              ข้อมูลบิดา
            </h6>
            <hr className="mt-0" />
          </div>

          <div className="col-12 col-md-2">
            <label className="form-label">คำนำหน้า</label>
            <select
              className="form-select"
              value={form.father_prefix}
              onChange={(e) => set("father_prefix", e.target.value)}
            >
              <option value="">- เลือก -</option>
              <option value="นาย">นาย</option>
              <option value="นาง">นาง</option>
              <option value="นางสาว">นางสาว</option>
              <option value="อื่นๆ">อื่นๆ</option>
            </select>
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">ชื่อ</label>
            <input
              className="form-control"
              value={form.father_first_name}
              onChange={(e) => set("father_first_name", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">สกุล</label>
            <input
              className="form-control"
              value={form.father_last_name}
              onChange={(e) => set("father_last_name", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">เลขบัตรประชาชน</label>
            <input
              className="form-control"
              value={form.father_citizen_id}
              onChange={(e) => set("father_citizen_id", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">อาชีพ</label>
            <input
              className="form-control"
              value={form.father_job}
              onChange={(e) => set("father_job", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">รายได้ต่อเดือน (บาท)</label>
            <input
              className="form-control"
              value={form.father_income}
              onChange={(e) => set("father_income", e.target.value)}
            />
          </div>

          {/* ที่อยู่บิดา */}
          <div className="col-6 col-md-2">
            <label className="form-label">บ้านเลขที่</label>
            <input
              className="form-control"
              value={form.father_house_no}
              onChange={(e) => set("father_house_no", e.target.value)}
            />
          </div>
          <div className="col-6 col-md-2">
            <label className="form-label">หมู่บ้าน/หมู่</label>
            <input
              className="form-control"
              value={form.father_village}
              onChange={(e) => set("father_village", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">ถนน</label>
            <input
              className="form-control"
              value={form.father_street}
              onChange={(e) => set("father_street", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">ตำบล/แขวง</label>
            <input
              className="form-control"
              value={form.father_subdistrict}
              onChange={(e) => set("father_subdistrict", e.target.value)}
            />
          </div>
          <div className="col-6 col-md-4">
            <label className="form-label">อำเภอ/เขต</label>
            <input
              className="form-control"
              value={form.father_district}
              onChange={(e) => set("father_district", e.target.value)}
            />
          </div>
          <div className="col-6 col-md-4">
            <label className="form-label">จังหวัด</label>
            <input
              className="form-control"
              value={form.father_province}
              onChange={(e) => set("father_province", e.target.value)}
            />
          </div>
          <div className="col-6 col-md-2">
            <label className="form-label">รหัสไปรษณีย์</label>
            <input
              className="form-control"
              maxLength={5}
              value={form.father_postal}
              onChange={(e) => set("father_postal", e.target.value)}
            />
          </div>

          {/* ====== ข้อมูลมารดา ====== */}
          <div className="col-12 mt-4">
            <h6 className="text-muted mb-2">
              <i className="bi bi-person me-2" />
              ข้อมูลมารดา
            </h6>
            <hr className="mt-0" />
          </div>

          <div className="col-12 col-md-2">
            <label className="form-label">คำนำหน้า</label>
            <select
              className="form-select"
              value={form.mother_prefix}
              onChange={(e) => set("mother_prefix", e.target.value)}
            >
              <option value="">- เลือก -</option>
              <option value="นาย">นาย</option>
              <option value="นาง">นาง</option>
              <option value="นางสาว">นางสาว</option>
              <option value="อื่นๆ">อื่นๆ</option>
            </select>
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">ชื่อ</label>
            <input
              className="form-control"
              value={form.mother_first_name}
              onChange={(e) => set("mother_first_name", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">สกุล</label>
            <input
              className="form-control"
              value={form.mother_last_name}
              onChange={(e) => set("mother_last_name", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">เลขบัตรประชาชน</label>
            <input
              className="form-control"
              value={form.mother_citizen_id}
              onChange={(e) => set("mother_citizen_id", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">อาชีพ</label>
            <input
              className="form-control"
              value={form.mother_job}
              onChange={(e) => set("mother_job", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">รายได้ต่อเดือน (บาท)</label>
            <input
              className="form-control"
              value={form.mother_income}
              onChange={(e) => set("mother_income", e.target.value)}
            />
          </div>

          {/* ที่อยู่มารดา */}
          <div className="col-6 col-md-2">
            <label className="form-label">บ้านเลขที่</label>
            <input
              className="form-control"
              value={form.mother_house_no}
              onChange={(e) => set("mother_house_no", e.target.value)}
            />
          </div>
          <div className="col-6 col-md-2">
            <label className="form-label">หมู่บ้าน/หมู่</label>
            <input
              className="form-control"
              value={form.mother_village}
              onChange={(e) => set("mother_village", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">ถนน</label>
            <input
              className="form-control"
              value={form.mother_street}
              onChange={(e) => set("mother_street", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">ตำบล/แขวง</label>
            <input
              className="form-control"
              value={form.mother_subdistrict}
              onChange={(e) => set("mother_subdistrict", e.target.value)}
            />
          </div>
          <div className="col-6 col-md-4">
            <label className="form-label">อำเภอ/เขต</label>
            <input
              className="form-control"
              value={form.mother_district}
              onChange={(e) => set("mother_district", e.target.value)}
            />
          </div>
          <div className="col-6 col-md-4">
            <label className="form-label">จังหวัด</label>
            <input
              className="form-control"
              value={form.mother_province}
              onChange={(e) => set("mother_province", e.target.value)}
            />
          </div>
          <div className="col-6 col-md-2">
            <label className="form-label">รหัสไปรษณีย์</label>
            <input
              className="form-control"
              maxLength={5}
              value={form.mother_postal}
              onChange={(e) => set("mother_postal", e.target.value)}
            />
          </div>

          {/* ====== ผู้ดูแลอุปการะ ====== */}
          <div className="col-12 mt-4">
            <h6 className="text-muted mb-2">
              <i className="bi bi-people-fill me-2" />
              ผู้ดูแลอุปการะ / รับผิดชอบ
            </h6>
            <hr className="mt-0" />
          </div>

          <div className="col-12">
            <div className="d-flex flex-wrap gap-4">
              {[
                { v: "father", l: "บิดา" },
                { v: "mother", l: "มารดา" },
                { v: "both", l: "ทั้งบิดามารดาร่วมกัน" },
                { v: "relative", l: "ญาติที่เกี่ยวข้อง" },
              ].map((opt) => (
                <div className="form-check" key={opt.v}>
                  <input
                    className="form-check-input"
                    type="radio"
                    id={`care_${opt.v}`}
                    name="caregiver_relation"
                    value={opt.v}
                    checked={form.caregiver_relation === opt.v}
                    onChange={(e) => set("caregiver_relation", e.target.value)}
                  />
                  <label className="form-check-label" htmlFor={`care_${opt.v}`}>
                    {opt.l}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label">อาชีพผู้อุปการะ</label>
            <input
              className="form-control"
              value={form.caregiver_job}
              onChange={(e) => set("caregiver_job", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">รายได้ต่อเดือน (บาท)</label>
            <input
              className="form-control"
              value={form.caregiver_income}
              onChange={(e) => set("caregiver_income", e.target.value)}
            />
          </div>
          {/* ====== ช่องทางติดต่อ/แนบไฟล์ (เดิม) ====== */}
          <div className="col-12 col-md-4">
            <label className="form-label">เบอร์มือถือผู้ปกครอง</label>
            <input
              className="form-control"
              value={form.parent_phone}
              onChange={(e) => set("parent_phone", e.target.value)}
              placeholder="081-xxx-xxxx"
            />
          </div>

          {/* ====== ผู้รับส่งเด็ก ====== */}
          <div className="col-12 mt-4">
            <h6 className="text-muted mb-2">
              <i className="bi bi-person-walking me-2" />
              ผู้ที่รับส่งเด็ก
            </h6>
            <hr className="mt-0" />
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label">ชื่อ</label>
            <input
              className="form-control"
              value={form.pickup_name}
              onChange={(e) => set("pickup_name", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">ความเกี่ยวข้อง</label>
            <input
              className="form-control"
              value={form.pickup_relation}
              onChange={(e) => set("pickup_relation", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">เบอร์มือถือ</label>
            <input
              className="form-control"
              value={form.pickup_phone}
              onChange={(e) => set("pickup_phone", e.target.value)}
            />
          </div>


          {/* ====== สุขภาพทั่วไป ====== */}
          <div className="col-12 mt-4">
            <h6 className="text-muted mb-2">
              <i className="bi bi-heart-pulse me-2" />
              สุขภาพทั่วไป / หมายเหตุสุขภาพ
            </h6>
            <hr className="mt-0" />
          </div>

          <div className="col-12">
            <label className="form-label">ประวัติได้รับอุบัติเหตุหรือเจ็บป่วย (เมื่ออายุกี่ปี/รายละเอียด)</label>
            <input
              className="form-control"
              value={form.health_accidents_history}
              onChange={(e) => set("health_accidents_history", e.target.value)}
            />
          </div>
          <div className="col-12">
            <label className="form-label">โรคประจำตัว</label>
            <input
              className="form-control"
              value={form.health_chronic_disease}
              onChange={(e) => set("health_chronic_disease", e.target.value)}
            />
          </div>
          <div className="col-12">
            <label className="form-label">โรคทางพฤติกรรม/หรือความผิดปกติอื่น ๆ</label>
            <input
              className="form-control"
              value={form.health_behavior_issue}
              onChange={(e) => set("health_behavior_issue", e.target.value)}
            />
          </div>
          <div className="col-12">
            <label className="form-label">แพ้อาหาร (บอกชนิด/ชื่ออาหาร)</label>
            <input
              className="form-control"
              value={form.health_food_allergy}
              onChange={(e) => set("health_food_allergy", e.target.value)}
            />
          </div>
          <div className="col-12">
            <label className="form-label">แพ้ยา (บอกชนิด/ชื่อยา)</label>
            <input
              className="form-control"
              value={form.health_drug_allergy}
              onChange={(e) => set("health_drug_allergy", e.target.value)}
            />
          </div>

          <div className="col-12">
            <label className="form-label me-3">การได้รับวัคซีน (ภูมิคุ้มกันโรค)</label>
            <div className="d-flex gap-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="vax_complete"
                  name="vaccine_status"
                  value="complete"
                  checked={form.vaccine_status === "complete"}
                  onChange={(e) => set("vaccine_status", e.target.value)}
                />
                <label className="form-check-label" htmlFor="vax_complete">
                  ได้รับวัคซีนครบ
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="vax_incomplete"
                  name="vaccine_status"
                  value="incomplete"
                  checked={form.vaccine_status === "incomplete"}
                  onChange={(e) => set("vaccine_status", e.target.value)}
                />
                <label className="form-check-label" htmlFor="vax_incomplete">
                  ได้รับวัคซีนไม่ครบ
                </label>
              </div>
            </div>
          </div>
           {/* ✅ เอกสารแนบเพิ่มเติม (เพิ่มใหม่) */}
          <div className="col-12 mt-4">
            <h6 className="text-muted mb-2">
              <i className="bi bi-paperclip me-2" />
              เอกสารแนบเพิ่มเติม
            </h6>
            <hr className="mt-0" />
          </div>

          <div className="col-12 col-lg-6">
            <label className="form-label">แผนที่บ้านของนักเรียน</label>
            <input
              type="file"
              className="form-control"
              accept="image/*,application/pdf"
              onChange={(e) => setMapFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="col-12 col-lg-6">
            <label className="form-label">สำเนาสูติบัตร</label>
            <input
              type="file"
              className="form-control"
              accept="image/*,application/pdf"
              onChange={(e) => setBirthCertFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="col-12 col-lg-6">
            <label className="form-label">สำเนาทะเบียนบ้าน (เด็ก)</label>
            <input
              type="file"
              className="form-control"
              accept="image/*,application/pdf"
              onChange={(e) => setChildHouseRegFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="col-12 col-lg-6">
            <label className="form-label">สำเนาบัตรประชาชน (บิดา)</label>
            <input
              type="file"
              className="form-control"
              accept="image/*,application/pdf"
              onChange={(e) => setFatherIdFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="col-12 col-lg-6">
            <label className="form-label">สำเนาทะเบียนบ้าน (บิดา)</label>
            <input
              type="file"
              className="form-control"
              accept="image/*,application/pdf"
              onChange={(e) => setFatherHouseRegFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="col-12 col-lg-6">
            <label className="form-label">สำเนาบัตรประชาชน (มารดา)</label>
            <input
              type="file"
              className="form-control"
              accept="image/*,application/pdf"
              onChange={(e) => setMotherIdFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="col-12 col-lg-6">
            <label className="form-label">สำเนาทะเบียนบ้าน (มารดา)</label>
            <input
              type="file"
              className="form-control"
              accept="image/*,application/pdf"
              onChange={(e) => setMotherHouseRegFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="col-12">
            <small className="text-muted">.jpg .png .pdf</small>
          </div>
{/* ====== ปุ่มส่ง ====== */}
          <div className="col-12">
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? (
                <span className="spinner-border spinner-border-sm me-2" />
              ) : (
                <i className="bi bi-send-fill me-2" />
              )}
              ส่งคำขอสมัครเรียน
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
