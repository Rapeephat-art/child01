// src/pages/EnrollmentDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";

export default function EnrollmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [row, setRow] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get(`/enrollments/${id}`);
        setRow(res.data?.row || res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="container my-4">กำลังโหลด...</div>;
  if (!row) return <div className="container my-4">ไม่พบข้อมูลการสมัคร</div>;

  return (
    <div className="container my-4">
      <h3>รายละเอียดการสมัคร #{id}</h3>

      <div className="card p-3 mt-3">
        <p><strong>ชื่อ:</strong> {row.student_firstname} {row.student_lastname}</p>
        <p><strong>วันเกิด:</strong> {row.birth_date}</p>
        <p><strong>ชั้นที่สมัคร:</strong> {row.apply_level}</p>
        <p><strong>เบอร์โทรผู้ปกครอง:</strong> {row.parent_phone}</p>
        <p><strong>สถานะ:</strong> {row.status}</p>
      </div>

      <button className="btn btn-secondary mt-3" onClick={() => navigate("/enrollments")}>
        กลับไปหน้ารายการสมัคร
      </button>
    </div>
  );
}
