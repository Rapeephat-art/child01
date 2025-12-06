import React from 'react';
import NavBar from '../components/NavBar';

export default function ParentLayout({ children }) {
  return (
    <>
      <NavBar />
      <div className="container mt-3">
        <div className="row">
          <div className="col-md-3">
            <div className="list-group">
              <a className="list-group-item list-group-item-action" href="/enroll">สมัครเรียน</a>
              <a className="list-group-item list-group-item-action" href="/my-children">ข้อมูลบุตรหลาน</a>
            </div>
          </div>
          <div className="col-md-9">{children}</div>
        </div>
      </div>
    </>
  );
}
