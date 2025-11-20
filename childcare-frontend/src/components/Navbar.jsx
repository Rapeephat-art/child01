// childcare-frontend/src/components/Navbar.jsx
import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import logo from "../assets/logo1.jpg";

export default function Navbar() {
  const auth = useAuth?.() ?? { user: null, logout: () => {} };
  const { user, logout } = auth;
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout?.();
    } catch (e) {
      // ignore
    }
    navigate("/login", { replace: true });
  };

  const Active = ({ to, children, ...rest }) => (
    <NavLink
      to={to}
      className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
      {...rest}
    >
      {children}
    </NavLink>
  );

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{
        boxShadow: "var(--cc-shadow)",
        background: "linear-gradient(135deg,#fff,#ecf6ff)",
      }}
      aria-label="Main navigation"
    >
      <div
        className="container"
        style={{ display: "flex", alignItems: "center", gap: 12 }}
      >
        {/* โลโก้ + ชื่อระบบ */}
        <Link
          className="navbar-brand d-flex align-items-center gap-2"
          to="/"
          onClick={() => setOpen(false)}
        >
          <img src={logo} alt="ศูนย์พัฒนาเด็กเล็ก" className="brand-logo" />
          <span className="brand-text">ศูนย์พัฒนาเด็กเล็ก</span>
        </Link>

        {/* toggler สำหรับมือถือ */}
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navMain"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
          style={{ border: "none", background: "transparent" }}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div
          id="navMain"
          className={`collapse navbar-collapse ${open ? "show" : ""}`}
          style={{ display: open ? "block" : undefined }}
        >
          <ul
            className="navbar-nav me-auto mb-2 mb-lg-0"
            onClick={() => setOpen(false)}
          >
            {/* 👩‍🏫 เมนูของครู */}
            {user?.type === "teacher" && (
              <>
                <li className="nav-item">
                  <Active to="/children">
                    <i className="bi bi-people-fill me-1"></i>เด็ก
                  </Active>
                </li>
                <li className="nav-item">
                  <Active to="/enroll-requests">
                    <i className="bi bi-journal-check me-1"></i>คำขอสมัครเรียน
                  </Active>
                </li>
                <li className="nav-item">
                  <Active to="/attendance">
                    <i className="bi bi-check2-square me-1"></i>การมาเรียน
                  </Active>
                </li>
                <li className="nav-item">
                  <Active to="/health">
                    <i className="bi bi-activity me-1"></i>สุขภาพ
                  </Active>
                </li>
                {/* ✅ ครูยังเห็น “ประกาศ” ได้ */}
                <li className="nav-item">
                  <Active to="/announcements">
                    <i className="bi bi-megaphone-fill me-1"></i>ประกาศ
                  </Active>
                </li>
                <li className="nav-item">
                  <Active to="/meals">
                    <i className="bi bi-egg-fried me-1"></i>เมนูอาหาร
                  </Active>
                </li>
              </>
            )}

            {/* 👨‍👩‍👧 เมนูของผู้ปกครอง (เอา ‘ประกาศ’ ออก) */}
            {user?.type === "parent" && (
              <>
                <li className="nav-item">
                  <Active to="/enroll">
                    <i className="bi bi-journal-plus me-1"></i>สมัครเรียน
                  </Active>
                </li>
                <li className="nav-item">
                  <Active to="/my-children">
                    <i className="bi bi-heart-fill me-1"></i>บุตรหลานของฉัน
                  </Active>
                </li>
              </>
            )}

            {/* 🏠 หน้า public (index) — ล็อกอินยังไม่ได้ → เอา ‘ประกาศ’ ออก */}
            {!user && <></>}
          </ul>

          {/* ปุ่มขวา: เข้าสู่ระบบ / ออกจากระบบ */}
          <ul
            className="navbar-nav align-items-center gap-2"
            style={{ display: "flex", gap: 8 }}
          >
            {!user ? (
              <>
                <li className="nav-item">
                  <Link
                    to="/register"
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => setOpen(false)}
                  >
                    <i className="bi bi-person-plus me-1"></i>สมัครสมาชิก
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/login"
                    className="btn btn-candy btn-sm"
                    onClick={() => setOpen(false)}
                  >
                    <i className="bi bi-box-arrow-in-right me-1"></i>เข้าสู่ระบบ
                  </Link>
                </li>
              </>
            ) : (
              <li
                className="nav-item"
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <span className="muted" style={{ marginRight: 8 }}>
                  สวัสดี, {user.name ?? user.username}
                </span>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-1"></i> ออกจากระบบ
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
