// frontend/src/pages/TeacherDashboard.jsx
import React from "react";

export default function TeacherDashboard() {
  return (
    <div className="container my-4">
      <h2>แดชบอร์ดครู</h2>
      <p className="text-muted">หน้าแดชบอร์ดสำหรับครู — ใส่คอนเทนต์ที่ต้องการที่นี่</p>
      {/* ตัวอย่างลิงก์ด่วน */}
      <div className="list-group">
        <a className="list-group-item list-group-item-action" href="/teacher/attendance">เช็คชื่อ</a>
        <a className="list-group-item list-group-item-action" href="/teacher/my-students">ข้อมูลเด็กในห้อง</a>
      </div>
    </div>
  );
}
