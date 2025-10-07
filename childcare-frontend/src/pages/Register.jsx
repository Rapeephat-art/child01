// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    username: "",
    full_name: "",
    password: "",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  function splitName(full) {
    const parts = full.trim().split(/\s+/).filter(Boolean);
    const first_name = parts.shift() || "";
    const last_name = parts.join(" ") || "-";
    return { first_name, last_name };
  }

  async function submit(e) {
    e.preventDefault();
    if (saving) return;
    setMsg({ type: "", text: "" });

    const username = form.username.trim();
    const full_name = form.full_name.trim();
    const password = String(form.password || "");

    if (!username || !full_name) {
      return setMsg({
        type: "danger",
        text: "กรอกชื่อผู้ใช้ และ ชื่อ-นามสกุล ให้ครบ",
      });
    }
    if (password.length < 6) {
      return setMsg({
        type: "danger",
        text: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",
      });
    }

    const { first_name, last_name } = splitName(full_name);

    try {
      setSaving(true);
      await api.post("/auth/register", {
        username,
        first_name,
        last_name,
        password,
      });
      setMsg({ type: "success", text: "สมัครใช้งานสำเร็จ! กำลังไปหน้าเข้าสู่ระบบ..." });
      setTimeout(() => nav("/login"), 700);
    } catch (err) {
      setMsg({
        type: "danger",
        text: err?.response?.data?.message || "สมัครไม่สำเร็จ",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container py-5">
      <div className="card p-4 mx-auto" style={{ maxWidth: 520 }}>
        <h4 className="mb-3">
          <i className="bi bi-person-plus me-2"></i>สมัครเข้าใช้งาน
        </h4>

        {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

        <form onSubmit={submit} className="row g-3" noValidate>
          <div className="col-12">
            <label className="form-label">ชื่อผู้ใช้</label>
            <input
              className="form-control"
              value={form.username}
              onChange={(e) => set("username", e.target.value)}
              autoComplete="username"
              disabled={saving}
            />
          </div>

          <div className="col-12">
            <label className="form-label">ชื่อ-นามสกุล</label>
            <input
              className="form-control"
              value={form.full_name}
              onChange={(e) => set("full_name", e.target.value)}
              placeholder="เช่น สมชาย ใจดี"
              disabled={saving}
            />
          </div>

          <div className="col-12">
            <label className="form-label">รหัสผ่าน (อย่างน้อย 6 ตัว)</label>
            <input
              type="password"
              className="form-control"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              minLength={6}
              autoComplete="new-password"
              disabled={saving}
            />
          </div>

          <div className="col-12 d-flex gap-2">
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? (
                <span className="spinner-border spinner-border-sm me-2" />
              ) : (
                <i className="bi bi-check2-circle me-2" />
              )}
              สมัครใช้งาน
            </button>

            <Link className="btn btn-outline-secondary" to="/login">
              <i className="bi bi-box-arrow-in-right me-1"></i> ไปหน้าเข้าสู่ระบบ
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
