// src/pages/Login.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (loading) return;
    setError("");

    if (!username.trim() || !password) {
      setError("กรอกชื่อผู้ใช้และรหัสผ่านให้ครบ");
      return;
    }

    try {
      setLoading(true);
      await login(username.trim(), password);
      nav("/", { replace: true });
    } catch (err) {
      // ดึงข้อความผิดพลาดให้ละเอียดขึ้น
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "เข้าสู่ระบบไม่สำเร็จ";
      setError(String(msg));
      // กันเคสที่ backend ล่ม/500 ดูสถานะและ body จะได้ debug ง่าย
      if (err?.response) {
        console.warn("[LOGIN] status:", err.response.status);
        console.warn("[LOGIN] resp body:", err.response.data);
      } else {
        console.warn("[LOGIN] network error:", err);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-7 col-lg-5">
          <div className="section-hero mb-3">
            <div className="chip">
              <i className="bi bi-stars"></i>
              ยินดีต้อนรับกลับสู่ศูนย์เด็กเล็ก
            </div>
          </div>

          <div className="auth-card">
            <h4 className="mb-3">
              <i className="bi bi-person-heart me-2"></i>เข้าสู่ระบบ
            </h4>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={onSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label">ชื่อผู้ใช้</label>
                <input
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  disabled={loading}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">รหัสผ่าน</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={loading}
                />
              </div>

              <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-2" />
                ) : (
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                )}
                เข้าสู่ระบบ
              </button>
            </form>
          </div>

          {/* บอกทิปเล็ก ๆ ช่วยดีบัก */}
          <div className="text-muted small mt-3">
            ถ้าขึ้น 500 (Internal Server Error) ให้ดู log ที่ฝั่งแบ็กเอนด์ด้วย:
            <code> LOGIN_ERROR: ...</code>
          </div>
        </div>
      </div>
    </div>
  );
}
