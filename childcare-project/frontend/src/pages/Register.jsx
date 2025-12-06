// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    prefix: "",
    first_name: "",
    last_name: "",
    phone: "",
    email: ""
  });

  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function validate() {
    if (!form.username || form.username.trim().length < 3) {
      return "กรุณากรอก username อย่างน้อย 3 ตัวอักษร";
    }
    if (!form.password || form.password.length < 4) {
      return "กรุณากรอก password อย่างน้อย 4 ตัวอักษร";
    }
    if (!form.first_name || !form.last_name) {
      return "กรุณากรอกชื่อ-สกุล";
    }
    // (ไม่บังคับ) ตรวจเบอร์/อีเมลแบบง่าย ๆ
    if (form.phone && !/^[0-9\-\s+()]{6,20}$/.test(form.phone)) {
      return "รูปแบบหมายเลขโทรศัพท์ดูผิด (ใช้ตัวเลขและ - หรือเว้นวรรคเท่านั้น)";
    }
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      return "รูปแบบอีเมลไม่ถูกต้อง";
    }
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg(null);

    const err = validate();
    if (err) {
      setMsg({ type: "danger", text: err });
      return;
    }

    setLoading(true);
    try {
      // payload ตามที่ backend ปรับไว้
      const payload = {
        username: form.username,
        password: form.password,
        prefix: form.prefix || null,
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone || null,
        email: form.email || null
      };

      const res = await API.post("/auth/register", payload);
      // ถ้า backend คืนค่าดี -> redirect ไปหน้า login (หรือแสดงข้อความ)
      setMsg({ type: "success", text: "สมัครสมาชิกสำเร็จแล้ว! กรุณาเข้าสู่ระบบ" });
      // ไปหน้า login
      navigate("/login");
    } catch (err) {
      console.error("register error:", err);

      // พยายามอ่านข้อความจาก response
      const serverMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        (err?.message ? err.message : null);

      setMsg({ type: "danger", text: serverMsg || "สมัครสมาชิกล้มเหลว" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container my-4" style={{ maxWidth: 720 }}>
      <h2 className="mb-3">สมัครสมาชิก (สำหรับผู้ปกครอง)</h2>

      {msg && (
        <div className={`alert alert-${msg.type}`} role="alert">
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-4">
  <label className="form-label">คำนำหน้า</label>
  <select
    name="prefix"
    className="form-select"
    value={form.prefix}
    onChange={onChange}
    required
  >
    <option value="">-- เลือกคำนำหน้า --</option>
    <option value="นาย">นาย</option>
    <option value="นางสาว">นางสาว</option>
    <option value="นาง">นาง</option>
  </select>
</div>


          <div className="col-md-4">
            <label className="form-label">ชื่อ</label>
            <input name="first_name" className="form-control" value={form.first_name} onChange={onChange} required />
          </div>

          <div className="col-md-4">
            <label className="form-label">นามสกุล</label>
            <input name="last_name" className="form-control" value={form.last_name} onChange={onChange} required />
          </div>

          <div className="col-md-6">
            <label className="form-label">หมายเลขโทรศัพท์</label>
            <input name="phone" className="form-control" value={form.phone} onChange={onChange} placeholder="0x-xxx-xxxx " />
          </div>

          <div className="col-md-6">
            <label className="form-label">อีเมล</label>
            <input name="email" type="email" className="form-control" value={form.email} onChange={onChange} placeholder="you@example.com " />
          </div>

          <div className="col-md-6">
            <label className="form-label">Username</label>
            <input name="username" className="form-control" value={form.username} onChange={onChange} required />
          </div>

          <div className="col-md-6">
            <label className="form-label">Password</label>
            <input name="password" type="password" className="form-control" value={form.password} onChange={onChange} required />
          </div>
        </div>

        <div className="mt-4">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
          </button>
          <button type="button" className="btn btn-link ms-3" onClick={() => navigate("/login")}>ไปหน้าล็อกอิน</button>
        </div>
      </form>
    </div>
  );
}
