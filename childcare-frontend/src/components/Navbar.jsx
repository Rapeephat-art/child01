// src/components/Navbar.jsx
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import logo from "../assets/logo1.jpg";

export default function Navbar() {
  const { user, logout } = useAuth();

  const Active = ({ to, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
    >
      {children}
    </NavLink>
  );

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        {/* โลโก้ + ชื่อระบบ */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img src={logo} alt="ศูนย์พัฒนาเด็กเล็ก" className="brand-logo" />
          <span className="brand-text">ศูนย์พัฒนาเด็กเล็ก</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMain"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div id="navMain" className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {user?.type === "teacher" && (
              <>
                <li className="nav-item">
                  <Active to="/children">
                    <i className="bi bi-people-fill me-1"></i>เด็ก
                  </Active>
                </li>

                {/* คำขอสมัครเรียน (ครู) */}
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
          </ul>

          {/* มุมขวา: ปุ่มล็อกอิน/ออก */}
          <ul className="navbar-nav align-items-center gap-2">
            {!user ? (
              <>
                <li className="nav-item">
                  <Active to="/register">
                    <i className="bi bi-person-plus me-1"></i>สมัครสมาชิก
                  </Active>
                </li>
                <li className="nav-item">
                  <Active to="/login">
                    <i className="bi bi-box-arrow-in-right me-1"></i>เข้าสู่ระบบ
                  </Active>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button className="btn btn-primary btn-sm" onClick={logout}>
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
