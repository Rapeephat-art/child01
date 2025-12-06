// frontend/src/pages/StudentRecord.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

/*
  StudentRecord.jsx
  - แบบฟอร์มทะเบียนประวัตินักเรียน (อ้างอิงจากรูปที่ผู้ใช้ให้)
  - อ่าน/เก็บ draft จาก localStorage key: 'enrollDraftPayload'
  - เก็บไฟล์จริงใน state (ส่งเป็น FormData เมื่อกด 'สมัครเรียน')
  - ปุ่ม: ย้อนกลับ (ไป /admission), บันทึกแบบฟอร์ม (เก็บ draft), สมัครเรียน (POST /api/enrollments)
*/

export default function StudentRecord() {
  const navigate = useNavigate();
  const STORAGE_KEY = "enrollDraftPayload";

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // draft payload ที่มาจาก Enrollment/Admission
  const [draft, setDraft] = useState({});

  // ฟิลด์ของ "ทะเบียนประวัติ" ตามรูป
  const [form, setForm] = useState({
    // ข้อมูลที่อาจซ้ำกับ enrollment (แสดง/แก้ไขได้)
    child_fullname: "",
    child_prefix: "",
    child_firstname: "",
    child_lastname: "",
    gender: "",
    birth_date: "",
    weight_kg: "",
    height_cm: "",

    // ข้อมูลพ่อ/แม่ (สำคัญ)
    mother_name: "",
    father_name: "",
    mother_job: "",
    father_job: "",
    parent_address: "",
    parent_phone: "",

    // ข้อมูลเพิ่มเติมจากรูป
    number_of_siblings: "",
    child_order: "", // ที่เท่าไหร่ในพี่น้อง
    chronic_disease: "", // ประวัติการเจ็บป่วยเรื้อรัง
    allergies: "", // แพ้อะไร
    food_restrictions: "", // อาหารที่ต้องระวัง

    // การได้รับวัคซีน
    vaccine_complete: false,
    vaccine_incomplete: false,

    // พฤติกรรม/ความสามารถ
    can_feed_self: false,
    can_express_need: false, // บอกความต้องการเช่น ปัสสาวะ/อุจจาระ
    other_notes: "",

    // เก็บ admission/other draft
    __raw_draft: {}
  });

  // ไฟล์จริง (File objects) สำหรับส่งไป backend
  const [files, setFiles] = useState({
    birth_certificate: null, // สูติบัตรเด็ก
    reg_child: null,         // ทะเบียนบ้านเด็ก
    father_id: null,         // บัตร ปชช. พ่อ
    father_reg: null,        // ทะเบียนบ้านพ่อ
    mother_id: null,         // บัตร ปชช. แม่
    mother_reg: null         // ทะเบียนบ้านแม่
  });

  useEffect(() => {
    // โหลด draft จาก localStorage แล้วแมปค่าเริ่มต้น
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const payload = JSON.parse(raw);
        setDraft(payload || {});
        // พยายามแมปค่าจาก payload ที่มีอยู่มาเติมฟอร์ม
        setForm((f) => ({
          ...f,
          child_prefix: payload.student_prefix || f.child_prefix,
          child_firstname: payload.student_firstname || f.child_firstname,
          child_lastname: payload.student_lastname || f.child_lastname,
          child_fullname: `${payload.student_prefix ? payload.student_prefix + " " : ""}${payload.student_firstname || ""} ${payload.student_lastname || ""}`.trim(),
          gender: payload.student_prefix === "เด็กชาย" ? "ชาย" : payload.student_prefix === "เด็กหญิง" ? "หญิง" : (payload.gender || f.gender),
          birth_date: payload.birth_date || f.birth_date,
          weight_kg: payload.birth_weight || f.weight_kg,
          height_cm: payload.birth_height || f.height_cm,
          mother_name: payload.mother_name || f.mother_name,
          father_name: payload.father_name || f.father_name,
          parent_address: payload.curr_house_no ? `บ้านเลขที่ ${payload.curr_house_no}` : (payload.reg_house_no ? `บ้านเลขที่ ${payload.reg_house_no}` : f.parent_address),
          parent_phone: payload.mother_phone || payload.father_phone || f.parent_phone,
          __raw_draft: payload || {}
        }));
      } catch (e) {
        console.warn("Invalid enrollDraftPayload:", e);
      }
    }
    setLoading(false);
  }, []);

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((s) => ({ ...s, [name]: checked }));
    } else {
      setForm((s) => ({ ...s, [name]: value }));
    }
  }

  function onFileChange(e) {
    const name = e.target.name;
    const f = e.target.files && e.target.files[0];
    setFiles((s) => ({ ...s, [name]: f || null }));
  }

  function saveDraftToStorage(extra = {}) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const base = raw ? JSON.parse(raw) : {};
      // merge: base <- form-specific fields (as "student_record") <- extra
      const merged = {
        ...base,
        student_record: {
          ...base.student_record,
          ...form
        },
        ...extra
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      setMsg({ type: "success", text: "บันทึกชั่วคราวเรียบร้อย" });
      // update local state draft
      setDraft(merged);
    } catch (e) {
      console.error("saveDraftToStorage:", e);
      setMsg({ type: "danger", text: "บันทึกชั่วคราวล้มเหลว" });
    }
  }

  function handleBack() {
    // เก็บสถานะปัจจุบันก่อน แล้วกลับไป /admission
    saveDraftToStorage({
      student_files_uploaded: Object.keys(files).filter((k) => !!files[k])
    });
    navigate("/admission");
  }

  async function handleFinalSubmit() {
    // ตรวจกรณีจำเป็น (ตัวอย่าง: ชื่อเด็กต้องมี)
    if (!form.child_firstname && !form.child_fullname) {
      setMsg({ type: "danger", text: "กรุณากรอกชื่อเด็กก่อน (หรือกลับไปกรอกที่หน้า Enrollment)" });
      return;
    }

    setSubmitting(true);
    setMsg(null);

    try {
      // โหลด draft เก่า
      const raw = localStorage.getItem(STORAGE_KEY);
      const payload = raw ? JSON.parse(raw) : {};

      const formData = new FormData();

      // Map ฟิลด์สำคัญจาก enrollment/draft -> ชื่อ field ที่ backend ต้องการ (ปรับตาม backend ของคุณ)
      // ตัวอย่าง mapping พื้นฐาน:
      if (payload.student_firstname) formData.append("first_name", payload.student_firstname);
      if (payload.student_lastname) formData.append("last_name", payload.student_lastname);
      if (payload.student_nickname) formData.append("nickname", payload.student_nickname);
      if (payload.student_idcard) formData.append("citizen_id", payload.student_idcard);
      if (payload.birth_date) formData.append("birth_date", payload.birth_date);
      if (payload.apply_level) formData.append("apply_level", payload.apply_level);

      // เพิ่มข้อมูลจากหน้า StudentRecord (form)
      formData.append("student_record", JSON.stringify({
        ...form,
        // convert booleans to string if backend expects that
        vaccine_complete: !!form.vaccine_complete,
        vaccine_incomplete: !!form.vaccine_incomplete,
        can_feed_self: !!form.can_feed_self,
        can_express_need: !!form.can_express_need
      }));

      // เพิ่มไฟล์จริง
      if (files.birth_certificate) formData.append("birth_certificate", files.birth_certificate);
      if (files.reg_child) formData.append("reg_child", files.reg_child);
      if (files.father_id) formData.append("father_id", files.father_id);
      if (files.father_reg) formData.append("father_reg", files.father_reg);
      if (files.mother_id) formData.append("mother_id", files.mother_id);
      if (files.mother_reg) formData.append("mother_reg", files.mother_reg);

      // ตัวอย่างเรียก API: ปรับ path ให้ตรงกับ backend ของคุณ
      const res = await API.post("/api/enrollments", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res && (res.status === 200 || res.status === 201)) {
        // หากสำเร็จ ลบ draft แล้วแจ้ง และนำทางไปหน้าหลักหรือหน้า success
        localStorage.removeItem(STORAGE_KEY);
        setMsg({ type: "success", text: "สมัครเรียนเรียบร้อย" });
        // ไปหน้าอื่นตามต้องการ (ปรับเส้นทาง)
        navigate("/");
      } else {
        console.warn("Unexpected response:", res);
        saveDraftToStorage({ student_files_uploaded: Object.keys(files).filter((k) => !!files[k]) });
        setMsg({ type: "warning", text: "ส่งข้อมูลแล้วแต่ผลลัพธ์ไม่ปกติ — บันทึกชั่วคราวไว้" });
      }
    } catch (err) {
      console.error("submit error:", err);
      saveDraftToStorage({ student_files_uploaded: Object.keys(files).filter((k) => !!files[k]) });
      setMsg({ type: "danger", text: "ส่งข้อมูลล้มเหลว — บันทึกชั่วคราวไว้ในเครื่อง" });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="container my-4">Loading…</div>;

  return (
    <div className="container my-4">
      <h2 className="mb-3">ทะเบียนประวัตินักเรียน / แนบเอกสาร</h2>

      {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}


      {/* ฟอร์มรายละเอียดทะเบียน */}
      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">รายละเอียดทะเบียน</h5>

          <div className="row g-3">
            <div className="col-md-2">
              <label className="form-label">คำนำหน้า</label>
              <input name="child_prefix" value={form.child_prefix} onChange={onChange} className="form-control" />
            </div>
            <div className="col-md-5">
              <label className="form-label">ชื่อ</label>
              <input name="child_firstname" value={form.child_firstname} onChange={onChange} className="form-control" />
            </div>
            <div className="col-md-5">
              <label className="form-label">นามสกุล</label>
              <input name="child_lastname" value={form.child_lastname} onChange={onChange} className="form-control" />
            </div>

            <div className="col-md-3">
              <label className="form-label">เพศ</label>
              <select name="gender" value={form.gender} onChange={onChange} className="form-select">
                <option value="">-- เลือก --</option>
                <option value="ชาย">ชาย</option>
                <option value="หญิง">หญิง</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">วัน/เดือน/ปีเกิด</label>
              <input type="date" name="birth_date" value={form.birth_date} onChange={onChange} className="form-control" />
            </div>

            <div className="col-md-3">
              <label className="form-label">น้ำหนัก (kg)</label>
              <input name="weight_kg" value={form.weight_kg} onChange={onChange} className="form-control" />
            </div>
            <div className="col-md-3">
              <label className="form-label">ส่วนสูง (cm)</label>
              <input name="height_cm" value={form.height_cm} onChange={onChange} className="form-control" />
            </div>

            <div className="col-md-4">
              <label className="form-label">จำนวนพี่น้อง</label>
              <input name="number_of_siblings" value={form.number_of_siblings} onChange={onChange} className="form-control" />
            </div>
            <div className="col-md-4">
              <label className="form-label">เป็นบุตรลำดับที่</label>
              <input name="child_order" value={form.child_order} onChange={onChange} className="form-control" />
            </div>

            <div className="col-12">
              <label className="form-label">ประวัติการเจ็บป่วย / โรคประจำตัว</label>
              <input name="chronic_disease" value={form.chronic_disease} onChange={onChange} className="form-control" placeholder="เช่น โรคหืด, โรคหัวใจ (ถ้ามี)" />
            </div>

            <div className="col-12">
              <label className="form-label">แพ้ยา / แพ้อาหาร / ข้อควรระวัง (ถ้ามี)</label>
              <input name="allergies" value={form.allergies} onChange={onChange} className="form-control" placeholder="ระบุยา, อาหาร" />
            </div>

            <div className="col-12">
              <label className="form-label">อาหารที่ต้องงด / ข้อจำกัดทางอาหาร</label>
              <input name="food_restrictions" value={form.food_restrictions} onChange={onChange} className="form-control" />
            </div>

            <div className="col-12">
              <label className="form-label">ได้รับวัคซีน</label>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" name="vaccine_complete" id="vaccine_complete" checked={form.vaccine_complete} onChange={onChange} />
                <label className="form-check-label" htmlFor="vaccine_complete">ได้รับวัคซีนครบ</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" name="vaccine_incomplete" id="vaccine_incomplete" checked={form.vaccine_incomplete} onChange={onChange} />
                <label className="form-check-label" htmlFor="vaccine_incomplete">ได้รับวัคซีนไม่ครบ</label>
              </div>
            </div>

            <div className="col-12">
              <label className="form-label">ความสามารถ / พฤติกรรมพื้นฐาน</label>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" name="can_feed_self" id="can_feed_self" checked={form.can_feed_self} onChange={onChange} />
                <label className="form-check-label" htmlFor="can_feed_self">รับประทานอาหารเองได้</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" name="can_express_need" id="can_express_need" checked={form.can_express_need} onChange={onChange} />
                <label className="form-check-label" htmlFor="can_express_need">บอกความต้องการของตนเองได้ (เช่น ปัสสาวะ/อุจจาระ)</label>
              </div>
            </div>

            <div className="col-12">
              <label className="form-label">คำอธิบายเพิ่มเติม / ข้อสังเกต</label>
              <textarea name="other_notes" value={form.other_notes} onChange={onChange} className="form-control" rows={3} />
            </div>
          </div>
        </div>
      </div>
      {/* ปุ่มควบคุม */}
      <div className="mb-4">
        <button className="btn btn-outline-secondary me-2" onClick={handleBack}>ย้อนกลับ</button>
        <button
          className="btn btn-primary me-2"
          onClick={() => saveDraftToStorage({ student_files_uploaded: Object.keys(files).filter(k => !!files[k]) })}
        >
          บันทึกแบบฟอร์ม
        </button>
        <button className="btn btn-success" onClick={handleFinalSubmit} disabled={submitting}>
          {submitting ? "กำลังส่ง..." : "สมัครเรียน"}
        </button>
      </div>
    </div>
  );
}
