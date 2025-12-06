import React from 'react';
import NavBar from '../components/NavBar';

export default function TeacherLayout({ children }) {
  return (
    <>
      <NavBar />
      <div className="container mt-3">
        <div className="row">
          <div className="col-md-3">
            <div className="list-group">
              <a className="list-group-item list-group-item-action" href="/teacher/enrollments">การสมัครเรียน (ห้องของฉัน)</a>
              <a className="list-group-item list-group-item-action" href="/teacher/classroom">ข้อมูลเด็กในห้อง</a>
              <a className="list-group-item list-group-item-action" href="/teacher/attendance">เช็คชื่อ (Attendance)</a>
            </div>
          </div>
          <div className="col-md-9">{children}</div>
        </div>
      </div>
    </>
  );
}
