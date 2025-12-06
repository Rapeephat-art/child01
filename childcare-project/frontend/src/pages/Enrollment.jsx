// src/pages/Enrollment.jsx
import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

/*
  Enrollment.jsx (ปรับเพิ่มการเก็บ draft ใน localStorage, เก็บไฟล์จริง, ส่ง FormData)
  - รักษาโครงฟอร์มของคุณไว้ครบ
  - ต้องมี bootstrap.css โหลดไว้ในโปรเจค (index.html หรือ main.jsx)
*/

export default function Enrollment() {
  const initial = {
    // ข้อมูลเด็ก
    apply_level: "",
    student_prefix: "",
    student_firstname: "",
    student_lastname: "",
    student_nickname: "",
    student_idcard: "",
    birth_date: "",
    birth_weight: "",
    birth_height: "",
    oral_health: "",

    // ที่อยู่ตามทะเบียน
    reg_house_no: "",
    reg_moo: "",
    reg_tambon: "",
    reg_amphur: "",
    reg_province: "",

    // ที่อยู่ปัจจุบัน
    curr_house_no: "",
    curr_moo: "",
    curr_tambon: "",
    curr_amphur: "",
    curr_province: "",

    // ข้อมูลมารดา
    mother_prefix: "",
    mother_name: "",
    mother_lastname: "",
    mother_idcard: "",
    mother_birthdate: "",
    mother_reg_house_no: "",
    mother_reg_moo: "",
    mother_reg_tambon: "",
    mother_reg_amphur: "",
    mother_reg_province: "",
    mother_curr_house_no: "",
    mother_curr_moo: "",
    mother_curr_tambon: "",
    mother_curr_amphur: "",
    mother_curr_province: "",
    mother_phone: "",
    mother_email: "",
    mother_job: "",
    mother_income: "",

    // ข้อมูลบิดา
    father_prefix: "",
    father_name: "",
    father_lastname: "",
    father_idcard: "",
    father_birthdate: "",
    father_reg_house_no: "",
    father_reg_moo: "",
    father_reg_tambon: "",
    father_reg_amphur: "",
    father_reg_province: "",
    father_curr_house_no: "",
    father_curr_moo: "",
    father_curr_tambon: "",
    father_curr_amphur: "",
    father_curr_province: "",
    father_phone: "",
    father_email: "",
    father_job: "",
    father_income: "",

    // ผู้ดูแลปัจจุบัน
    care_responsible: "",
    caregiver_job: "",
    caregiver_income: "",
    caregiver_phone: "",

    // ผู้รับส่งเด็ก
    sender_prefix: "",
    sender_name: "",
    sender_lastname: "",
    sender_relation: "",
    sender_phone: "",

    // file names (แสดงชื่อไฟล์เท่านั้นในเวอร์ชันนี้)
    attachment_birth_certificate: null,
    attachment_reg_child: null,
    attachment_father_id: null,
    attachment_father_reg: null,
    attachment_mother_id: null,
    attachment_mother_reg: null,

    // NOTE: ไฟล์จริงจะเก็บในฟิลด์ *_file (ไม่เซฟลง localStorage)
    attachment_birth_certificate_file: null,
    attachment_reg_child_file: null,
    attachment_father_id_file: null,
    attachment_father_reg_file: null,
    attachment_mother_id_file: null,
    attachment_mother_reg_file: null
  };

  const [form, setForm] = useState(initial);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  // โหลด draft จาก localStorage เมื่อ mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('enrollDraft');
      if (saved) {
        const parsed = JSON.parse(saved);
        // merge with initial (เพื่อให้ฟิลด์ใหม่ยังมีค่า)
        setForm((s) => ({ ...s, ...parsed }));
      }
    } catch (e) {
      console.warn('Failed to load enrollDraft:', e);
    }
  }, []);

  // เก็บ draft ลง localStorage ทุกครั้งที่ form เปลี่ยน (ไม่รวมไฟล์จริง)
  useEffect(() => {
    try {
      const copy = { ...form };
      // ลบ field ที่เป็นไฟล์จริงก่อน serialize
      delete copy.attachment_birth_certificate_file;
      delete copy.attachment_reg_child_file;
      delete copy.attachment_father_id_file;
      delete copy.attachment_father_reg_file;
      delete copy.attachment_mother_id_file;
      delete copy.attachment_mother_reg_file;
      localStorage.setItem('enrollDraft', JSON.stringify(copy));
    } catch (e) {
      console.warn('Failed to save enrollDraft:', e);
    }
  }, [form]);

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((s) => ({ ...s, [name]: checked }));
    } else {
      setForm((s) => ({ ...s, [name]: value }));
    }
  }

  // ใน Enrollment.jsx: (แทนที่ function onFile และ handleNext เดิมด้วยโค้ดนี้)

function onFile(e) {
  const inputName = e.target.name;
  const f = e.target.files && e.target.files[0];
  // **ยังไม่อัปโหลดไฟล์จริงตอน draft** — เอาเฉพาะชื่อไฟล์แสดง
  setForm((s) => ({ ...s, [inputName]: f ? f.name : null }));
}

// handleNext: save draft to backend then navigate to /admission
// แทนที่ handleNext เดิมด้วยตัวนี้
async function handleNext() {
  setMsg(null);
  const err = validate();
  if (err) {
    // ถ้าต้องการให้ bypass validation เพื่อทดสอบ ให้ comment out บรรทัดนี้
    setMsg({ type: "danger", text: err });
    console.warn('validation failed:', err);
    return;
  }

  try {
    // ปิดปุ่มถัดไป (คุณอาจจะเพิ่ม state isSaving เพื่อ disable ปุ่ม)
    const payload = { ...form, _savedAt: new Date().toISOString() };
    console.log("Enrollment payload (NEXT):", payload);

    // เรียก backend draft
    const res = await API.post('/enrollments/draft', payload);
    if (res?.data?.draftId) {
      console.log('draft saved id=', res.data.draftId);
      localStorage.setItem('enrollDraftId', String(res.data.draftId));
      localStorage.setItem('enrollDraftPayload', JSON.stringify(payload));
    } else {
      console.warn('draft API did not return draftId, fallback to localStorage');
      localStorage.setItem('enrollDraftPayload', JSON.stringify(payload));
    }

    // ไปหน้า next เสมอ
    navigate('/admission');
  } catch (err) {
    console.error('save draft err (will fallback to localStorage):', err);
    // fallback เก็บ local หาก server ไม่ตอบ
    localStorage.setItem('enrollDraftPayload', JSON.stringify(form));
    setMsg({ type: 'warning', text: 'บันทึกชั่วคราวลง localStorage (server ไม่ตอบกลับ)' });
    navigate('/admission');
  }
}



  function validate() {
    if (!form.student_firstname || !form.student_lastname) {
      return "กรุณากรอกชื่อ-นามสกุลนักเรียน";
    }
    if (
      !(
        (form.mother_name && form.mother_phone) ||
        (form.father_name && form.father_phone) ||
        (form.sender_name && form.sender_phone)
      )
    ) {
      return "กรุณากรอกข้อมูลผู้ปกครองหรือผู้รับส่งอย่างน้อยหนึ่งคนพร้อมเบอร์ติดต่อ";
    }
    if (form.student_idcard && !/^\d{13}$/.test(form.student_idcard)) {
      return "เลขบัตรประจำตัวประชาชนเด็กต้องเป็นตัวเลข 13 หลัก (ถ้ากรอก)";
    }
    return null;
  }

  // บันทึกแบบฟอร์ม -> ส่ง FormData ขึ้น backend (ตัวอย่าง)
  async function handleSubmit(e) {
    e.preventDefault();
    setMsg(null);
    const err = validate();
    if (err) {
      setMsg({ type: "danger", text: err });
      return;
    }

    // สร้าง FormData
    const data = new FormData();

    // เพิ่มฟิลด์ข้อความทั้งหมด
    const skipFiles = [
      'attachment_birth_certificate_file',
      'attachment_reg_child_file',
      'attachment_father_id_file',
      'attachment_father_reg_file',
      'attachment_mother_id_file',
      'attachment_mother_reg_file'
    ];
    Object.keys(form).forEach((k) => {
      if (skipFiles.includes(k)) return;
      const v = form[k];
      if (v !== null && v !== undefined) {
        data.append(k, v);
      }
    });

    // เพิ่มไฟล์จริงถ้ามี
    if (form.attachment_birth_certificate_file) data.append('attachment_birth_certificate', form.attachment_birth_certificate_file);
    if (form.attachment_reg_child_file) data.append('attachment_reg_child', form.attachment_reg_child_file);
    if (form.attachment_father_id_file) data.append('attachment_father_id', form.attachment_father_id_file);
    if (form.attachment_father_reg_file) data.append('attachment_father_reg', form.attachment_father_reg_file);
    if (form.attachment_mother_id_file) data.append('attachment_mother_id', form.attachment_mother_id_file);
    if (form.attachment_mother_reg_file) data.append('attachment_mother_reg', form.attachment_mother_reg_file);

    try {
      // ตัวอย่างเรียก API: POST /api/enrollments
      // หาก backend ยังไม่รองรับ การเรียกนี้จะโยน error — เราจัดการด้วยข้อความ
      const res = await API.post('/enrollments', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log('Enrollment saved response:', res.data);
      setMsg({ type: 'success', text: 'บันทึกแบบฟอร์มเรียบร้อย' });

      // ถ้าต้องการ ล้าง draft หลังส่งสำเร็จ ให้เปิดบรรทัดถัดไป
      // localStorage.removeItem('enrollDraft');
      // setForm(initial);
    } catch (err) {
      console.error('Enrollment save error:', err);
      // หาก backend ยังไม่พร้อม ให้ยังแสดง success แบบ local (คุณบอกว่าเดโมได้)
      setMsg({ type: 'danger', text: 'ส่งข้อมูลล้มเหลว (ตรวจสอบ backend) หรือทำงานแบบ offline' });
    }
  }

  function handlePreview() {
    console.log("Preview enrollment data:", form);
    alert("ดูตัวอย่างส่งออก: เปิด console ดูข้อมูล (Preview)");
  }

  function handleNext() {
    setMsg(null);
    const err = validate();
    if (err) {
      setMsg({ type: "danger", text: err });
      return;
    }
    // บันทึก draft (effect จะบันทึกอัตโนมัติ แต่เซฟซ้ำอีกทีให้ชัวร์)
    try {
      const copy = { ...form };
      delete copy.attachment_birth_certificate_file;
      delete copy.attachment_reg_child_file;
      delete copy.attachment_father_id_file;
      delete copy.attachment_father_reg_file;
      delete copy.attachment_mother_id_file;
      delete copy.attachment_mother_reg_file;
      localStorage.setItem('enrollDraft', JSON.stringify(copy));
    } catch (e) {
      console.warn('save before next failed', e);
    }

    // ไปหน้า Admission (ข้อมูลจะยังอยู่ใน localStorage)
    navigate('/admission');
  }

  return (
    <div className="container my-4">
      <h2 className="mb-3">แบบฟอร์มสมัครเข้าเรียน</h2>

      {msg && (
        <div className={`alert alert-${msg.type}`} role="alert">
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* — ข้อมูลเด็ก — */}
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">ข้อมูลเด็ก</h5>

            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">ชั้นที่สมัครเข้าเรียน</label>
                <select className="form-select" name="apply_level" value={form.apply_level} onChange={onChange}>
                  <option value="">-- เลือก --</option>
                  <option value="ต่ำกว่า 3 ขวบ">ต่ำกว่า 3 ขวบ</option>
                  <option value="อายุ 3 ขวบ">อายุ 3 ขวบ</option>
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label">คำนำหน้า</label>
                <select className="form-select" name="student_prefix" value={form.student_prefix} onChange={onChange}>
                  <option value="">เลือก</option>
                  <option value="เด็กชาย">เด็กชาย</option>
                  <option value="เด็กหญิง">เด็กหญิง</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">ชื่อ</label>
                <input className="form-control" name="student_firstname" value={form.student_firstname} onChange={onChange} />
              </div>
              <div className="col-md-4">
                <label className="form-label">นามสกุล</label>
                <input className="form-control" name="student_lastname" value={form.student_lastname} onChange={onChange} />
              </div>

              <div className="col-md-3">
                <label className="form-label">ชื่อเล่น</label>
                <input className="form-control" name="student_nickname" value={form.student_nickname} onChange={onChange} />
              </div>

              <div className="col-md-4">
                <label className="form-label">เลขบัตรประชาชน</label>
                <input className="form-control" name="student_idcard" value={form.student_idcard} onChange={onChange} placeholder="13 หลัก (ถ้ามี)" />
              </div>

              <div className="col-md-4">
                <label className="form-label">วัน/เดือน/ปีเกิด</label>
                <input className="form-control" type="date" name="birth_date" value={form.birth_date} onChange={onChange} />
              </div>

              <div className="col-md-2">
                <label className="form-label">น้ำหนัก (kg)</label>
                <input className="form-control" name="birth_weight" value={form.birth_weight} onChange={onChange} />
              </div>
              <div className="col-md-2">
                <label className="form-label">ส่วนสูง (cm)</label>
                <input className="form-control" name="birth_height" value={form.birth_height} onChange={onChange} />
              </div>

              <div className="col-md-4">
                <label className="form-label">สุขภาพช่องปาก</label>
                <select className="form-select" name="oral_health" value={form.oral_health} onChange={onChange}>
                  <option value="">เลือก</option>
                  <option value="ฟันผุ">ฟันผุ</option>
                  <option value="ฟันไม่ผุ">ฟันไม่ผุ</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label">ที่อยู่ตามสำเนาทะเบียนบ้าน</label>
                <div className="row g-2">
                  <div className="col-md-2"><input className="form-control" name="reg_house_no" placeholder="บ้านเลขที่" value={form.reg_house_no} onChange={onChange} /></div>
                  <div className="col-md-2"><input className="form-control" name="reg_moo" placeholder="หมู่ที่" value={form.reg_moo} onChange={onChange} /></div>
                  <div className="col-md-3"><input className="form-control" name="reg_tambon" placeholder="ตำบล" value={form.reg_tambon} onChange={onChange} /></div>
                  <div className="col-md-3"><input className="form-control" name="reg_amphur" placeholder="อำเภอ" value={form.reg_amphur} onChange={onChange} /></div>
                  <div className="col-md-2"><input className="form-control" name="reg_province" placeholder="จังหวัด" value={form.reg_province} onChange={onChange} /></div>
                </div>
              </div>

              <div className="col-12">
                <label className="form-label">ที่อยู่ปัจจุบัน</label>
                <div className="row g-2">
                  <div className="col-md-2"><input className="form-control" name="curr_house_no" placeholder="บ้านเลขที่" value={form.curr_house_no} onChange={onChange} /></div>
                  <div className="col-md-2"><input className="form-control" name="curr_moo" placeholder="หมู่ที่" value={form.curr_moo} onChange={onChange} /></div>
                  <div className="col-md-3"><input className="form-control" name="curr_tambon" placeholder="ตำบล" value={form.curr_tambon} onChange={onChange} /></div>
                  <div className="col-md-3"><input className="form-control" name="curr_amphur" placeholder="อำเภอ" value={form.curr_amphur} onChange={onChange} /></div>
                  <div className="col-md-2"><input className="form-control" name="curr_province" placeholder="จังหวัด" value={form.curr_province} onChange={onChange} /></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* — ข้อมูลมารดา — */}
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">ข้อมูลมารดา</h5>
            <div className="row g-3">
              <div className="col-md-2">
                <label className="form-label">คำนำหน้า</label>
                  <select className="form-select" name="mother_prefix" value={form.mother_prefix} onChange={onChange}>
                    <option value="">เลือก</option>
                    <option value="นาง">นาง</option>
                    <option value="นางสาว">นางสาว</option>
                  </select>
                  </div>
              <div className="col-md-4"><label className="form-label">ชื่อ</label><input className="form-control" name="mother_name" value={form.mother_name} onChange={onChange} /></div>
              <div className="col-md-4"><label className="form-label">นามสกุล</label><input className="form-control" name="mother_lastname" value={form.mother_lastname} onChange={onChange} /></div>
              <div className="col-md-2"><label className="form-label">เลขบัตร</label><input className="form-control" name="mother_idcard" value={form.mother_idcard} onChange={onChange} /></div>

              <div className="col-md-4"><label className="form-label">วัน/เดือน/ปีเกิด</label><input type="date" className="form-control" name="mother_birthdate" value={form.mother_birthdate} onChange={onChange} /></div>

              <div className="col-12"><label className="form-label">ที่อยู่ตามทะเบียนบ้าน</label>
                <div className="row g-2">
                  <div className="col-md-2"><input className="form-control" name="mother_reg_house_no" placeholder="บ้านเลขที่" value={form.mother_reg_house_no} onChange={onChange} /></div>
                  <div className="col-md-2"><input className="form-control" name="mother_reg_moo" placeholder="หมู่ที่" value={form.mother_reg_moo} onChange={onChange} /></div>
                  <div className="col-md-3"><input className="form-control" name="mother_reg_tambon" placeholder="ตำบล" value={form.mother_reg_tambon} onChange={onChange} /></div>
                  <div className="col-md-3"><input className="form-control" name="mother_reg_amphur" placeholder="อำเภอ" value={form.mother_reg_amphur} onChange={onChange} /></div>
                  <div className="col-md-2"><input className="form-control" name="mother_reg_province" placeholder="จังหวัด" value={form.mother_reg_province} onChange={onChange} /></div>
                </div>
              </div>

              <div className="col-12"><label className="form-label">ที่อยู่ปัจจุบัน</label>
                <div className="row g-2">
                  <div className="col-md-2"><input className="form-control" name="mother_curr_house_no" placeholder="บ้านเลขที่" value={form.mother_curr_house_no} onChange={onChange} /></div>
                  <div className="col-md-2"><input className="form-control" name="mother_curr_moo" placeholder="หมู่ที่" value={form.mother_curr_moo} onChange={onChange} /></div>
                  <div className="col-md-3"><input className="form-control" name="mother_curr_tambon" placeholder="ตำบล" value={form.mother_curr_tambon} onChange={onChange} /></div>
                  <div className="col-md-3"><input className="form-control" name="mother_curr_amphur" placeholder="อำเภอ" value={form.mother_curr_amphur} onChange={onChange} /></div>
                  <div className="col-md-2"><input className="form-control" name="mother_curr_province" placeholder="จังหวัด" value={form.mother_curr_province} onChange={onChange} /></div>
                </div>
              </div>

              <div className="col-md-4"><label className="form-label">มือถือ</label><input className="form-control" name="mother_phone" value={form.mother_phone} onChange={onChange} /></div>
              <div className="col-md-4"><label className="form-label">อีเมล</label><input className="form-control" name="mother_email" value={form.mother_email} onChange={onChange} /></div>
              <div className="col-md-4"><label className="form-label">อาชีพ</label><input className="form-control" name="mother_job" value={form.mother_job} onChange={onChange} placeholder="" /></div>
              <div className="col-md-4"><label className="form-label">รายได้ต่อเดือน</label><input className="form-control" name="mother_job" value={form.mother_job} onChange={onChange} placeholder="" /></div>
            </div>
          </div>
        </div>

        {/* — ข้อมูลบิดา — */}
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">ข้อมูลบิดา</h5>
            <div className="row g-3">
              <div className="col-md-2">
              <label className="form-label">คำนำหน้า</label>
              <select className="form-select" name="father_prefix" value={form.father_prefix} onChange={onChange}>
              <option value="">เลือก</option>
              <option value="นาย">นาย</option>
              </select>
            </div>
              <div className="col-md-4"><label className="form-label">ชื่อ</label><input className="form-control" name="father_name" value={form.father_name} onChange={onChange} /></div>
              <div className="col-md-4"><label className="form-label">นามสกุล</label><input className="form-control" name="father_lastname" value={form.father_lastname} onChange={onChange} /></div>
              <div className="col-md-2"><label className="form-label">เลขบัตร</label><input className="form-control" name="father_idcard" value={form.father_idcard} onChange={onChange} /></div>

              <div className="col-md-4"><label className="form-label">วัน/เดือน/ปีเกิด</label><input type="date" className="form-control" name="father_birthdate" value={form.father_birthdate} onChange={onChange} /></div>

              <div className="col-12"><label className="form-label">ที่อยู่ตามทะเบียนบ้าน</label>
                <div className="row g-2">
                  <div className="col-md-2"><input className="form-control" name="father_reg_house_no" placeholder="บ้านเลขที่" value={form.father_reg_house_no} onChange={onChange} /></div>
                  <div className="col-md-2"><input className="form-control" name="father_reg_moo" placeholder="หมู่ที่" value={form.father_reg_moo} onChange={onChange} /></div>
                  <div className="col-md-3"><input className="form-control" name="father_reg_tambon" placeholder="ตำบล" value={form.father_reg_tambon} onChange={onChange} /></div>
                  <div className="col-md-3"><input className="form-control" name="father_reg_amphur" placeholder="อำเภอ" value={form.father_reg_amphur} onChange={onChange} /></div>
                  <div className="col-md-2"><input className="form-control" name="father_reg_province" placeholder="จังหวัด" value={form.father_reg_province} onChange={onChange} /></div>
                </div>
              </div>

              <div className="col-12"><label className="form-label">ที่อยู่ปัจจุบัน</label>
                <div className="row g-2">
                  <div className="col-md-2"><input className="form-control" name="father_curr_house_no" placeholder="บ้านเลขที่" value={form.father_curr_house_no} onChange={onChange} /></div>
                  <div className="col-md-2"><input className="form-control" name="father_curr_moo" placeholder="หมู่ที่" value={form.father_curr_moo} onChange={onChange} /></div>
                  <div className="col-md-3"><input className="form-control" name="father_curr_tambon" placeholder="ตำบล" value={form.father_curr_tambon} onChange={onChange} /></div>
                  <div className="col-md-3"><input className="form-control" name="father_curr_amphur" placeholder="อำเภอ" value={form.father_curr_amphur} onChange={onChange} /></div>
                  <div className="col-md-2"><input className="form-control" name="father_curr_province" placeholder="จังหวัด" value={form.father_curr_province} onChange={onChange} /></div>
                </div>
              </div>

              <div className="col-md-4"><label className="form-label">มือถือ</label><input className="form-control" name="father_phone" value={form.father_phone} onChange={onChange} /></div>
              <div className="col-md-4"><label className="form-label">อีเมล</label><input className="form-control" name="father_email" value={form.father_email} onChange={onChange} /></div>
              <div className="col-md-4"><label className="form-label">อาชีพ</label><input className="form-control" name="father_job" value={form.father_job} onChange={onChange} placeholder="" /></div>
              <div className="col-md-4"><label className="form-label">รายได้ต่อเดือน</label><input className="form-control" name="father_job" value={form.father_job} onChange={onChange} placeholder="" /></div>
            </div>
          </div>
        </div>

        {/* — ปัจจุบันเด็กอยู่ในความดูแล/รับผิดชอบของ — */}
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">ปัจจุบันเด็กอยู่ในความดูแล/รับผิดชอบของ</h5>

            <div className="mb-2">
              <select className="form-select" name="care_responsible" value={form.care_responsible} onChange={onChange}>
                <option value="">-- เลือก --</option>
                <option value="บิดา">บิดา</option>
                <option value="มารดา">มารดา</option>
                <option value="ทั้งบิดา-มารดา">ทั้งบิดา-มารดา</option>
                <option value="ญาติ">ญาติ</option>
              </select>
            </div>

            <div className="row g-3">
              <div className="col-md-4"><label className="form-label">อาชีพผู้อุปการะ</label><input className="form-control" name="caregiver_job" value={form.caregiver_job} onChange={onChange} /></div>
              <div className="col-md-4"><label className="form-label">รายได้ต่อเดือน</label><input className="form-control" name="caregiver_income" value={form.caregiver_income} onChange={onChange} /></div>
              <div className="col-md-4"><label className="form-label">หมายเลขโทรศัพท์</label><input className="form-control" name="caregiver_phone" value={form.caregiver_phone} onChange={onChange} /></div>
            </div>
          </div>
        </div>

        {/* — ผู้ที่รับส่งเด็ก — */}
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">ผู้ที่รับส่งเด็ก</h5>
            <div className="row g-3">
              <div className="col-md-2">
              <label className="form-label">คำนำหน้า</label>
              <select className="form-select" name="father_prefix" value={form.father_prefix} onChange={onChange}>
              <option value="">เลือก</option>
              <option value="นาย">นาย</option>
              </select>
            </div>
              <div className="col-md-4"><label className="form-label">ชื่อ</label><input className="form-control" name="sender_name" value={form.sender_name} onChange={onChange} /></div>
              <div className="col-md-4"><label className="form-label">นามสกุล</label><input className="form-control" name="sender_lastname" value={form.sender_lastname} onChange={onChange} /></div>
              <div className="col-md-2"><label className="form-label">ความเกี่ยวข้อง</label><input className="form-control" name="sender_relation" value={form.sender_relation} onChange={onChange} /></div>

              <div className="col-md-4"><label className="form-label">หมายเลขโทรศัพท์</label><input className="form-control" name="sender_phone" value={form.sender_phone} onChange={onChange} /></div>
            </div>
          </div>
        </div>

        {/* — แนบไฟล์ 6 รายการ — */}
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">แนบเอกสาร (แสดงชื่อไฟล์เท่านั้น)</h5>

            <div className="mb-3">
              <label className="form-label">1. สำเนาสูติบัตรเด็ก</label>
              <input type="file" name="attachment_birth_certificate" className="form-control" onChange={onFile} />
              {form.attachment_birth_certificate && <div className="form-text">ไฟล์ที่เลือก: {form.attachment_birth_certificate}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">2. สำเนาทะเบียนบ้านเด็ก</label>
              <input type="file" name="attachment_reg_child" className="form-control" onChange={onFile} />
              {form.attachment_reg_child && <div className="form-text">ไฟล์ที่เลือก: {form.attachment_reg_child}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">3. สำเนาบัตรประชาชนพ่อ</label>
              <input type="file" name="attachment_father_id" className="form-control" onChange={onFile} />
              {form.attachment_father_id && <div className="form-text">ไฟล์ที่เลือก: {form.attachment_father_id}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">4. สำเนาทะเบียนบ้านพ่อ</label>
              <input type="file" name="attachment_father_reg" className="form-control" onChange={onFile} />
              {form.attachment_father_reg && <div className="form-text">ไฟล์ที่เลือก: {form.attachment_father_reg}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">5. สำเนาบัตรประชาชนแม่</label>
              <input type="file" name="attachment_mother_id" className="form-control" onChange={onFile} />
              {form.attachment_mother_id && <div className="form-text">ไฟล์ที่เลือก: {form.attachment_mother_id}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">6. สำเนาทะเบียนบ้านแม่</label>
              <input type="file" name="attachment_mother_reg" className="form-control" onChange={onFile} />
              {form.attachment_mother_reg && <div className="form-text">ไฟล์ที่เลือก: {form.attachment_mother_reg}</div>}
            </div>

          </div>
        </div>

        {/* ปุ่ม: บันทึกแบบฟอร์ม และ ถัดไป */}
        <div className="mb-5">
          <button type="submit" className="btn btn-primary">บันทึกแบบฟอร์ม</button>
          <button type="button" className="btn btn-success ms-2" onClick={handleNext}>ถัดไป</button>
          <button type="button" className="btn btn-outline-danger ms-2" onClick={() => { localStorage.removeItem('enrollDraft'); setForm(initial); setMsg(null); }}>ล้างฟอร์ม</button>
        </div>
      </form>
    </div>
  );
}
