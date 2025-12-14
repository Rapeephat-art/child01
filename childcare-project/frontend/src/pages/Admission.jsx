// frontend/src/pages/Admission.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

/*
  Admission.jsx
  - อ่าน payload ชั่วคราวจาก localStorage (key: enrollDraftPayload)
  - ผู้ใช้สามารถกรอก/แก้ไขข้อมูลมอบตัว (ตามภาพที่ให้)
  - ปุ่ม: ย้อนกลับ (กลับไป /enrollment), ถัดไป (ไป /student-record)
*/

export default function Admission() {
  const navigate = useNavigate();
  const STORAGE_KEY = "enrollDraftPayload";

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  const [form, setForm] = useState({
    // จะรวมข้อมูลเดิมจาก enrollment (ถ้ามี)
    // ฟิลด์มอบตัว (ตัวอย่างตามภาพที่ผู้ใช้ส่ง)
    guardian_prefix: "",
    guardian_firstname: "",
    guardian_lastname: "",
    guardian_phone: "",
    guardian_address: "",
    guardian_contact_place: "",
    relation_to_child: "",

    child_fullname: "",
    child_nickname: "",
    child_birthdate: "",

    consent_date: "",
    consent_place: "",
    signature_name: "",

    // เก็บ payload เดิม (enrollment) ทั้งหมด
    __draft: {}
  });

  useEffect(() => {
    // โหลด payload เก่าจาก localStorage และแมปฟิลด์ที่มี
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const draft = JSON.parse(raw);
        // เติมข้อมูลมอบตัวบางส่วนจาก draft (ถ้ามี)
        const merged = {
          guardian_prefix: draft.mother_prefix || draft.father_prefix || "",
          guardian_firstname: draft.mother_name || draft.father_name || "",
          guardian_lastname: draft.mother_lastname || draft.father_lastname || "",
          guardian_phone: draft.mother_phone || draft.father_phone || "",
          guardian_address:
            (draft.curr_house_no ? `บ้านเลขที่ ${draft.curr_house_no}` : "") ||
            (draft.reg_house_no ? `บ้านเลขที่ ${draft.reg_house_no}` : "") ||
            "",
          child_fullname: `${draft.student_prefix ? draft.student_prefix + " " : ""}${draft.student_firstname || ""} ${draft.student_lastname || ""}`.trim(),
          child_nickname: draft.student_nickname || "",
          child_birthdate: draft.birth_date || "",
          __draft: draft
        };
        setForm((f) => ({ ...f, ...merged }));
      } catch (e) {
        console.warn("Invalid draft payload:", e);
      }
    }
    setLoading(false);
  }, []);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function saveToStorage(payload = null) {
    // เก็บ merge payload ลง localStorage
    try {
      const oldRaw = localStorage.getItem(STORAGE_KEY);
      const old = oldRaw ? JSON.parse(oldRaw) : {};
      const merged = {
        ...old,
        ...((payload && typeof payload === "object") ? payload : {}),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch (e) {
      console.error("saveToStorage err:", e);
    }
  }

  function handleBack() {
    // เก็บข้อมูลมอบตัวก่อน แล้วกลับไปหน้าสมัคร
    const toSave = {
      admission: {
        guardian_prefix: form.guardian_prefix,
        guardian_firstname: form.guardian_firstname,
        guardian_lastname: form.guardian_lastname,
        guardian_phone: form.guardian_phone,
        guardian_address: form.guardian_address,
        guardian_contact_place: form.guardian_contact_place,
        relation_to_child: form.relation_to_child,
        consent_date: form.consent_date,
        consent_place: form.consent_place,
        signature_name: form.signature_name
      }
    };
    saveToStorage(toSave);
    navigate("/enrollment");
  }

  function handleBack() {
  // เก็บข้อมูลมอบตัวก่อน แล้วกลับไปหน้าสมัคร
  const toSave = {
    admission: {
      guardian_prefix: form.guardian_prefix,
      guardian_firstname: form.guardian_firstname,
      guardian_lastname: form.guardian_lastname,
      guardian_phone: form.guardian_phone,
      guardian_address: form.guardian_address,
      guardian_contact_place: form.guardian_contact_place,
      relation_to_child: form.relation_to_child,
      consent_date: form.consent_date,
      consent_place: form.consent_place,
      signature_name: form.signature_name
    }
  };
  saveToStorage(toSave);

  // ถูกต้อง: ไปยัง route ที่มีจริง คือ "/enroll"
  navigate("/enroll");
}

function handleNext() {
  if (!form.guardian_firstname || !form.guardian_lastname) {
    setMsg({ type: "danger", text: "กรุณากรอกชื่อ-นามสกุลผู้ปกครองก่อน" });
    return;
  }
  const toSave = { admission: { /* ... */ } };
  saveToStorage(toSave);

  // ถูกต้อง: ไปยัง route ที่มีจริง คือ "/record"
  navigate("/record");
}

  if (loading) return <div className="container my-4">Loading…</div>;

  return (
    <div className="container my-4">
      <h2 className="mb-3">แบบฟอร์มมอบตัว / ใบยินยอม</h2>

      {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">ข้อมูลผู้มอบตัว / ผู้ปกครอง</h5>

          <div className="row g-3">
            <div className="col-md-2">
              <label className="form-label">คำนำหน้า</label>
              <select className="form-select" name="father_prefix" value={form.father_prefix} onChange={onChange}>
              <option value="">เลือก</option>
              <option value="นาย">นาย</option>
              <option value="นาง">นาง</option>
              <option value="นางสาว">นางสาว</option>  
              </select>
            </div>
            <div className="col-md-5">
              <label className="form-label">ชื่อ</label>
              <input name="guardian_firstname" className="form-control" value={form.guardian_firstname} onChange={onChange} />
            </div>
            <div className="col-md-5">
              <label className="form-label">นามสกุล</label>
              <input name="guardian_lastname" className="form-control" value={form.guardian_lastname} onChange={onChange} />
            </div>

            <div className="col-md-4">
              <label className="form-label">หมายเลขโทรศัพท์</label>
              <input name="guardian_phone" className="form-control" value={form.guardian_phone} onChange={onChange} />
            </div>

            <div className="col-12">
              <label className="form-label">ที่อยู่ (ที่ติดต่อได้)</label>
              <input name="guardian_address" className="form-control" value={form.guardian_address} onChange={onChange} />
            </div>

            <div className="col-md-6">
              <label className="form-label">สถานที่ติดต่อกรณีฉุกเฉิน</label>
              <input name="guardian_contact_place" className="form-control" value={form.guardian_contact_place} onChange={onChange} />
            </div>

            <div className="col-md-6">
              <label className="form-label">ความเกี่ยวข้องกับเด็ก</label>
              <input name="relation_to_child" className="form-control" value={form.relation_to_child} onChange={onChange} />
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">ข้อมูลเด็ก (อ่านจากแบบฟอร์มสมัคร)</h5>
          <div className="row g-3">
            <div className="col-md-8">
              <label className="form-label">ชื่อ - สกุลเด็ก</label>
              <input readOnly className="form-control-plaintext" value={form.child_fullname} />
            </div>
            <div className="col-md-4">
              <label className="form-label">ชื่อเล่น</label>
              <input readOnly className="form-control-plaintext" value={form.child_nickname} />
            </div>

            <div className="col-md-4">
              <label className="form-label">วัน/เดือน/ปีเกิด</label>
              <input readOnly className="form-control-plaintext" value={form.child_birthdate} />
            </div>

            <div className="col-12 mt-2">
              <label className="form-label">ข้อความยินยอม / เงื่อนไข (พิมพ์/แก้ไขได้)</label>
              <textarea className="form-control" rows="4" name="consent_place" value={form.consent_place} onChange={onChange} placeholder="ระบุข้อความยินยอมหรือเงื่อนไข"></textarea>
            </div>

            <div className="col-md-4">
              <label className="form-label">วันที่ลงนาม</label>
              <input type="date" name="consent_date" className="form-control" value={form.consent_date} onChange={onChange} />
            </div>

            <div className="col-md-8">
              <label className="form-label">สถานที่</label>
              <input name="consent_place" className="form-control" value={form.consent_place} onChange={onChange} />
            </div>

            <div className="col-12 mt-2">
              <label className="form-label">ชื่อผู้ลงนาม (ลายเซ็น)</label>
              <input name="signature_name" className="form-control" value={form.signature_name} onChange={onChange} />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <button className="btn btn-outline-secondary me-2" onClick={handleBack}>ย้อนกลับ</button>
        <button className="btn btn-success" onClick={handleNext}>ถัดไป</button>
      </div>
    </div>
  );
}
