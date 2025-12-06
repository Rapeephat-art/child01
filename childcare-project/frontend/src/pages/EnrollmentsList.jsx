// src/pages/EnrollmentsList.jsx
import React, { useEffect, useState } from 'react';
import API from '../api/api'; // axios instance
import { Link, useNavigate } from 'react-router-dom';

export default function EnrollmentsList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setMsg(null);
    try {
      // ปรับ path ถ้า backend ของคุณต่างกัน
      const res = await API.get('/enrollments');
      // ถ้า backend คืน { rows } หรือ { data } ให้ปรับตรงนี้ตามจริง
      const data = res.data.rows || res.data.enrollments || res.data || [];
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('load enrollments err', err);
      const errMsg = err && err.response && err.response.data && err.response.data.error
        ? err.response.data.error
        : 'โหลดข้อมูลการสมัครล้มเหลว';
      setMsg({ type: 'danger', text: errMsg });
    } finally {
      setLoading(false);
    }
  }

  function fmtDate(d) {
    if (!d) return '';
    const dt = new Date(d);
    return dt.toLocaleString();
  }

  function exportCSV() {
    if (!rows || rows.length === 0) {
      alert('ไม่มีข้อมูลสำหรับส่งออก');
      return;
    }
    const keys = [
      'enroll_id','student_firstname','student_lastname','birth_date',
      'student_idcard','classroom_id','mother_name','father_name','mother_phone','father_phone',
      'created_at','status','note'
    ];
    // แปลง rows เป็น csv (เลือกคีย์ที่มี ถ้าไม่มีให้ว่าง)
    const header = keys.join(',');
    const lines = rows.map(r => keys.map(k => {
      const v = r[k] === undefined || r[k] === null ? '' : String(r[k]);
      // escape quotes
      return `"${v.replace(/"/g, '""')}"`;
    }).join(','));
    const csv = [header, ...lines].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enrollments_${(new Date()).toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>รายการการสมัครทั้งหมด</h3>
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={load} disabled={loading}>{loading ? 'กำลังโหลด...' : 'รีเฟรช'}</button>
          <button className="btn btn-outline-success" onClick={exportCSV}>ดาวน์โหลด CSV</button>
        </div>
      </div>

      {msg && <div className={`alert alert-${msg.type || 'info'}`}>{msg.text}</div>}

      <div className="table-responsive">
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th>#</th>
              <th>ชื่อ-นามสกุล</th>
              <th>วันเกิด</th>
              <th>เลขบัตร</th>
              <th>ชั้นที่สมัคร</th>
              <th>ผู้ติดต่อ</th>
              <th>เบอร์</th>
              <th>วันที่สมัคร</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && !loading && (
              <tr><td colSpan={10} className="text-center">ไม่มีข้อมูลการสมัคร</td></tr>
            )}
            {rows.map((r, idx) => (
              <tr key={r.enroll_id || r.id || idx}>
                <td>{idx + 1}</td>
                <td>{(r.student_firstname || '') + ' ' + (r.student_lastname || '')}</td>
                <td>{r.birth_date || ''}</td>
                <td>{r.student_idcard || ''}</td>
                <td>{r.apply_level || r.classroom_id || ''}</td>
                <td>{(r.mother_name || r.father_name || r.sender_name || '')}</td>
                <td>{(r.mother_phone || r.father_phone || r.sender_phone || '')}</td>
                <td>{fmtDate(r.created_at)}</td>
                <td>{r.status || r._status || 'draft'}</td>
                <td>
                  {/* ถ้ามีหน้า detail ใช้ navigate ไปที่ /enrollments/:id */}
                  <button className="btn btn-sm btn-outline-primary me-1" onClick={() => navigate(`/enrollments/${r.enroll_id || r.id}`)}>ดู</button>
                  <Link className="btn btn-sm btn-outline-secondary" to={`/enrollments/${r.enroll_id || r.id}/edit`}>แก้ไข</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
