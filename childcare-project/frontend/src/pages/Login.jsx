// src/pages/Login.jsx
import React, { useState } from 'react';
import API, { setAuthToken } from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Login({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { username, password });
      const { token, user } = res.data;
      // เก็บ token + user
      setAuthToken(token);               // เซ็ต header ให้ axios
      localStorage.setItem('user', JSON.stringify(user));
      // ให้ตัว App รับรู้ (ถ้ามี callback)
      setUser && setUser(user);
      navigate('/');
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.error || 'เข้าสู่ระบบไม่สำเร็จ';
      alert(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mt-4">
      <div className="mx-auto" style={{ maxWidth: 420 }}>
        <div className="card shadow-sm">
          <div className="card-body">
            <h4 className="card-title mb-3">เข้าสู่ระบบ</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                </button>
                <a href="/register" className="text-decoration-none">ยังไม่มีบัญชี? สมัคร</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
