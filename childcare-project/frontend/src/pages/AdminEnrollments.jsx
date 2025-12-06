// src/pages/AdminEnrollments.jsx
import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminEnrollments() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await API.get('/enrollments'); // ปรับ path ให้ตรง backend ของคุณ
      const data = res.data.rows || res.data || [];
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('load enrollments err', err);
      setMsg({ type: 'danger', text: err?.response?.data?.error || 'โหลดล้มเหลว' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>จัดการการสมัคร (Admin)</h3>
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={load} disabled={loading}>{loading ? 'กำลังโหลด...' : 'รีเฟรช'}</button>
          <Link className="btn btn-primary" to="/enroll">สร้างใหม่</Link>
        </div>
      </div>

      {msg && <div className={`alert alert-${msg.type || 'info'}`}>{msg.text}</div>}

      <div className="table-responsive">
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th>#</th>
              <th>ชื่อ-นามสกุล</th>
              <th>ชั้นที่สมัคร</th>
              <th>เบอร์ติดต่อ</th>
              <th>วันที่สมัคร</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && !loading && <tr><td colSpan={7} className="text-center">ไม่มีการสมัคร</td></tr>}
            {rows.map((r, idx) => (
              <tr key={r.enroll_id || r.id || idx}>
                <td>{idx + 1}</td>
                <td>{(r.student_firstname || '') + ' ' + (r.student_lastname || '')}</td>
                <td>{r.apply_level || ''}</td>
                <td>{r.mother_phone || r.father_phone || r.sender_phone || ''}</td>
                <td>{r.created_at || ''}</td>
                <td>{r.status || 'draft'}</td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-1" onClick={() => navigate(`/enrollments/${r.enroll_id || r.id}`)}>ดู</button>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => navigate(`/enrollments/${r.enroll_id || r.id}/edit`)}>แก้ไข</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
