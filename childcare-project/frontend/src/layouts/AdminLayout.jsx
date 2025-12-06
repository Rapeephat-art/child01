import React from 'react';
import NavBar from '../components/NavBar';

export default function AdminLayout({ children }) {
  return (
    <>
      <NavBar />
      <div className="container mt-3">
        <div className="row">
          <div className="col-md-3">
            <div className="list-group">
              <a className="list-group-item list-group-item-action" href="/admin/users">จัดการผู้ใช้</a>
              <a className="list-group-item list-group-item-action" href="/admin/announcements">ประกาศ</a>
              <a className="list-group-item list-group-item-action" href="/admin/enrollments">การสมัครเรียนทั้งหมด</a>
              <a className="list-group-item list-group-item-action" href="/admin/menus">เมนูอาหาร</a>
            </div>
          </div>
          <div className="col-md-9">{children}</div>
        </div>
      </div>
    </>
  );
}
