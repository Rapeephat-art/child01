// src/pages/AdminUsers.jsx
import React, { useEffect, useState } from 'react';
import API from '../api/api';

export default function AdminUsers() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null); // {type:'success'|'danger'|'warning', text:''}

  // modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [form, setForm] = useState({ username: '', password: '', role: 'teacher', parent_id: '' });
  const [editId, setEditId] = useState(null);

  async function load() {
    setLoading(true);
    setAlert(null);
    try {
      const res = await API.get('/admin/users');
      setRows(res.data.rows || []);
    } catch (err) {
      console.error('load users err', err);
      const text = err?.response?.data?.error || err?.message || 'โหลดล้มเหลว';
      setAlert({ type: 'danger', text });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setModalMode('create');
    setForm({ username: '', password: '', role: 'teacher', parent_id: '' });
    setEditId(null);
    setShowModal(true);
  }

  function openEdit(user) {
    setModalMode('edit');
    setForm({ username: user.username, password: '', role: user.role, parent_id: user.parent_id || '' });
    setEditId(user.user_id);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditId(null);
    setForm({ username: '', password: '', role: 'teacher', parent_id: '' });
  }

  function onChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function submitCreate(e) {
    e.preventDefault();
    setAlert(null);
    try {
      await API.post('/admin/users', {
        username: form.username,
        password: form.password,
        role: form.role,
        parent_id: form.parent_id || null
      });
      setAlert({ type: 'success', text: 'สร้างผู้ใช้เรียบร้อย' });
      closeModal();
      load();
    } catch (err) {
      console.error(err);
      setAlert({ type: 'danger', text: err?.response?.data?.error || 'สร้างล้มเหลว' });
    }
  }

  async function submitEdit(e) {
    e.preventDefault();
    if (!editId) return;
    setAlert(null);
    try {
      await API.put(`/admin/users/${editId}`, {
        username: form.username,
        // ส่ง password เฉพาะเมื่อกรอก
        ...(form.password ? { password: form.password } : {}),
        role: form.role,
        parent_id: form.parent_id || null
      });
      setAlert({ type: 'success', text: 'แก้ไขเรียบร้อย' });
      closeModal();
      load();
    } catch (err) {
      console.error(err);
      setAlert({ type: 'danger', text: err?.response?.data?.error || 'แก้ไขล้มเหลว' });
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('ยืนยันลบผู้ใช้นี้?')) return;
    setAlert(null);
    try {
      await API.delete(`/admin/users/${id}`);
      setAlert({ type: 'success', text: 'ลบเรียบร้อย' });
      load();
    } catch (err) {
      console.error(err);
      setAlert({ type: 'danger', text: err?.response?.data?.error || 'ลบล้มเหลว' });
    }
  }

  return (
    <div className="container my-4">
      <h3 className="mb-3">จัดการผู้ใช้ (Admin)</h3>

      {alert && (
        <div className={`alert alert-${alert.type} alert-dismissible`} role="alert">
          {alert.text}
          <button type="button" className="btn-close" aria-label="Close" onClick={() => setAlert(null)} />
        </div>
      )}

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div>
          <button className="btn btn-primary" onClick={openCreate}>+ สร้างผู้ใช้</button>
        </div>
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={load} disabled={loading}>{loading ? 'กำลังโหลด...' : 'รีโหลด'}</button>
        </div>
      </div>

      <div className="card">
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th style={{width:40}}>ลำดับ</th>
                <th>ชื่อ</th>
                <th style={{width:120}}>สถานะ</th>
                <th style={{width:200}}>วันที่สมัคร</th>
                <th style={{width:160}}></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && !loading && (
                <tr><td colSpan="7" className="text-center py-4">ไม่มีผู้ใช้</td></tr>
              )}
              {rows.map((r, idx) => (
                <tr key={r.user_id}>
                  <td>{idx+1}</td>
                  <td>{r.username}</td>
                  <td>{r.role}</td>
                  <td>{r.created_at}</td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEdit(r)}>แก้ไข</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(r.user_id)}>ลบ</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="modal-dialog modal-md modal-dialog-centered" role="document">
            <div className="modal-content">
              <form onSubmit={modalMode === 'create' ? submitCreate : submitEdit}>
                <div className="modal-header">
                  <h5 className="modal-title">{modalMode === 'create' ? 'สร้างผู้ใช้ใหม่' : `แก้ไขผู้ใช้ #${editId}`}</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={closeModal} />
                </div>
                <div className="modal-body">
                  <div className="mb-2">
                    <label className="form-label">Username</label>
                    <input className="form-control" name="username" value={form.username} onChange={onChange} required />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Password {modalMode === 'edit' ? '(ใส่ถ้าต้องการเปลี่ยน)' : ''}</label>
                    <input className="form-control" name="password" type="password" value={form.password} onChange={onChange} minLength={modalMode === 'create' ? 6 : undefined} required={modalMode === 'create'} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Role</label>
                    <select className="form-select" name="role" value={form.role} onChange={onChange}>
                      <option value="admin">admin</option>
                      <option value="teacher">teacher</option>
                      <option value="parent">parent</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>ยกเลิก</button>
                  <button type="submit" className="btn btn-primary">{modalMode === 'create' ? 'สร้าง' : 'บันทึก'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
