// src/components/NavBar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setAuthToken } from '../api/api'; // ถ้าใช้ func นี้บนโปรเจค (optional)

export default function NavBar() {
  const navigate = useNavigate();
  const rawUser = localStorage.getItem('user');
  const user = rawUser ? JSON.parse(rawUser) : null;
  const role = user?.role || null;

  function handleLogout() {
    // ลบ token + user
    try {
      setAuthToken && setAuthToken(null);
    } catch (e) {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    // reload เพื่อรีเฟรช UI ให้แน่นอน
    window.location.reload();
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm navbar-custom">
  <div className="container">  {/* ให้เป็น bootstrap container แค่นี้พอ */}
    <div className="hero-right">
            <div className="hero-image">
              <img src="/logo-placeholder.png" alt="โลโก้ศูนย์" />
            </div>
          </div>
    <Link className="navbar-brand" to="/">ศูนย์พัฒนาเด็กเล็ก</Link>
    

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          {/* ขวา: เมนูตามบทบาท */}
          <ul className="navbar-nav ms-auto align-items-center">
            {!user && (
              <>
                <li className="nav-item me-2">
                  <Link className="btn btn-outline-primary" to="/login">เข้าสู่ระบบ</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary text-white" to="/register">สมัคร</Link>
                </li>
              </>
            )}

            {user && role === 'parent' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/enroll">สมัครเรียน</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/my-children">ข้อมูลบุตรหลาน</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/my-children">การประเมินบุตรหลาน</Link>
                </li>

                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#!" id="userMenu" role="button" data-bs-toggle="dropdown">
                    สวัสดี, {user.username}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><button className="dropdown-item" onClick={() => navigate('/profile')}>โปรไฟล์</button></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item text-danger" onClick={handleLogout}>ออกจากระบบ</button></li>
                  </ul>
                </li>
              </>
            )}

            {user && role === 'teacher' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/teacher/enrollments">การสมัครเรียน (ห้องของฉัน)</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/teacher/children">ข้อมูลเด็กในห้อง</Link>
                </li>

                {/* ฟอร์มครู (dropdown เพื่อให้เรียกใช้หลายฟอร์มได้) */}
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#!" id="teacherForms" role="button" data-bs-toggle="dropdown">
                    ฟอร์มครู
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><Link className="dropdown-item" to="/teacher/checkin">บันทึกเช็คชื่อ</Link></li>
                    <li><Link className="dropdown-item" to="/teacher/measurements">บันทึกน้ำหนัก/ส่วนสูง</Link></li>
                    <li><Link className="dropdown-item" to="/teacher/health">บันทึกสุขภาพ</Link></li>
                    <li><Link className="dropdown-item" to="/teacher/brushings">บันทึกแปรงฟัน</Link></li>
                    <li><Link className="dropdown-item" to="/teacher/milk">บันทึกดื่มนม</Link></li>
                    <li><Link className="dropdown-item" to="/teacher/lunch">บันทึกจัดรายการอาหารกลางวัน</Link></li>
                    <li><Link className="dropdown-item" to="/teacher/lunch-eating">บันทึกการรับประทานอาหารกลางวัน</Link></li>
                    <li><Link className="dropdown-item" to="/teacher/assessment">ประเมินคุณลักษณะ</Link></li>
                  </ul>
                </li>

                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#!" id="userMenuT" role="button" data-bs-toggle="dropdown">
                    สวัสดี, {user.username}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><button className="dropdown-item" onClick={() => navigate('/profile')}>โปรไฟล์</button></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item text-danger" onClick={handleLogout}>ออกจากระบบ</button></li>
                  </ul>
                </li>
              </>
            )}

            {user && role === 'admin' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/users">จัดการผู้ใช้</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/announcements">ประกาศ</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/enrollments">การสมัครเรียนทั้งหมด</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/menus">เมนูอาหาร</Link>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#!" id="adminMenu" role="button" data-bs-toggle="dropdown">
                    ระบบ (Admin)
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item text-danger" onClick={handleLogout}>ออกจากระบบ</button></li>
                  </ul>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}