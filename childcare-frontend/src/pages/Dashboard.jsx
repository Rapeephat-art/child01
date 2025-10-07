// src/pages/Dashboard.jsx
import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router-dom";
import logo from "../assets/logo1.jpg";


export default function Dashboard(){
  const { user } = useAuth();
  return (
    <div className="container py-4">
      <div className="section-hero d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">สวัสดี {user?.name || ""} 👋</h4>
          <div className="text-muted">
            บทบาท: {user?.type === "teacher" ? "ครู/ผู้ดูแล" : "ผู้ปกครอง"}
          </div>
        </div>
        <div className="chip"><i className="bi bi-magic"></i> เรียบง่าย ใช้งานคล่อง</div>
      </div>

      <div className="row g-3">
        {user?.type === "teacher" ? (
          <>
            <Card to="/children"  icon="bi-people-fill"     title="จัดการเด็ก"     desc="เพิ่ม/แก้ไข/ลบ ข้อมูลเด็ก" />
            <Card to="/attendance" icon="bi-check2-square"   title="การมาเรียน"     desc="เช็คชื่อเด็กนักเรียน" />
            <Card to="/health"     icon="bi-activity"        title="สุขภาพ"         desc="บันทึกส่วนสูง น้ำหนัก ฯลฯ" />
            <Card to="/announcements" icon="bi-megaphone-fill" title="ประกาศ"      desc="ข่าวสารจากศูนย์" />
            <Card to="/menus"      icon="bi-egg-fried"       title="เมนูอาหาร"      desc="เมนูประจำวัน" />
          </>
        ) : (
          <>
            <Card to="/my-children" icon="bi-heart-fill"     title="ข้อมูลบุตรหลาน" desc="ดูข้อมูลบุตรหลานของฉัน" />
            <Card to="/announcements" icon="bi-megaphone-fill" title="ประกาศ"     desc="ข่าวสาร/กิจกรรม" />
            <Card to="/menus"      icon="bi-egg-fried"       title="เมนูอาหาร"      desc="ดูเมนูประจำวัน" />
          </>
        )}
      </div>
    </div>
  );
}

function Card({to, title, desc, icon}){
  return (
    <div className="col-12 col-md-6 col-lg-4">
      <Link to={to} className="text-decoration-none">
        <div className="card card-hover h-100">
          <div className="card-body">
            <div className="d-flex align-items-center mb-2">
              <i className={`bi ${icon} me-2`} style={{fontSize:"1.25rem", color:"var(--cc-accent)"}}></i>
              <h5 className="card-title mb-0">{title}</h5>
            </div>
            <p className="card-text text-muted">{desc}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
