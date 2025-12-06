// frontend/src/pages/AdminDashboard.jsx
import React from "react";

export default function AdminDashboard() {
  return (
    <div className="container my-4">
      <h2>แดชบอร์ดผู้ดูแลระบบ (Admin)</h2>
      <p className="text-muted">หน้าแดชบอร์ดสำหรับผู้ดูแลระบบ — จัดการประกาศ/ผู้ใช้งาน/รายงาน</p>

      <div className="d-grid gap-2">
        <a className="btn btn-outline-primary" href="/admin/announcements">จัดการประกาศ</a>
        <a className="btn btn-outline-primary" href="/admin/users">จัดการผู้ใช้งาน</a>
        <a className="btn btn-outline-primary" href="/admin/enrollments">การสมัครเรียนทั้งหมด</a>
      </div>
    </div>
  );
}
