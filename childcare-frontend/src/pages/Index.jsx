// childcare-frontend/src/pages/Index.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthProvider";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState(null);

  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // 🔐 ถ้าเป็นครูหรือแอดมิน ให้เด้งไป /dashboard
  useEffect(() => {
    if (authLoading) return;
    if (user && (user.type === "teacher" || user.type === "admin")) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        const res = await api.get("/announcements?limit=10");
        if (!mounted) return;
        const data = Array.isArray(res.data) ? res.data : [];
        setAnnouncements(data);
      } catch (e) {
        if (!mounted) return;
        setError("ไม่สามารถดึงประกาศได้");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  // ระหว่างเช็คสิทธิ์ / redirect
  if (
    authLoading ||
    (user && (user.type === "teacher" || user.type === "admin"))
  ) {
    return null;
  }

  return (
    <div className="container py-4 page-index">
      {/* แถบหัวเรื่องด้านบน */}
      <header className="page-header-candy mb-3">
  <h1 className="mb-1">คุณ  {user?.name || "ผู้ปกครอง"}</h1>
  <p className="muted mb-0">
    ยินดีต้อนรับสู่หน้าแรกของศูนย์พัฒนาเด็กเล็ก
  </p>
</header>


      {/* layout 2 คอลัมน์: ซ้ายข่าว, ขวาช่องทางติดต่อ */}
      <div className="row g-3">
        {/* คอลัมน์ซ้าย: ข่าวประชาสัมพันธ์ (พื้นที่ใหญ่) */}
        <div className="col-12 col-lg-8">
          <div className="card h-100" style={{ padding: 16 }}>
            <h3 className="mb-3">ข่าวประชาสัมพันธ์</h3>

            {loading ? (
              <div className="muted">กำลังโหลด...</div>
            ) : error ? (
              <div className="muted" style={{ color: "#c00" }}>
                {error}
              </div>
            ) : announcements.length ? (
              <ul className="announcement-list list-unstyled mb-0">
                {announcements.map((a) => (
                  <li
                    key={a.id}
                    style={{
                      padding: "12px 0",
                      borderBottom: "1px solid #f0f3fb",
                      display: "flex",
                      gap: 12,
                    }}
                  >
                    {a.image ? (
                      <img
                        src={a.image}
                        alt={a.title}
                        style={{
                          width: 110,
                          height: 80,
                          objectFit: "cover",
                          borderRadius: 6,
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 110,
                          height: 80,
                          background: "#f3f6fb",
                          borderRadius: 6,
                          flexShrink: 0,
                        }}
                      />
                    )}

                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{a.title}</div>
                      <div className="muted small">
                        {(a.body || "").slice(0, 140)}
                        {(a.body || "").length > 140 ? "..." : ""}
                      </div>
                      <div className="muted small mt-1">
                        {a.created_at
                          ? new Date(a.created_at).toLocaleString()
                          : ""}
                      </div>

                      <Link
                        to={`/announcements/${a.id}`}
                        className="btn btn-primary btn-sm mt-2"
                      >
                        อ่านเพิ่มเติม
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="muted">ยังไม่มีประกาศ</div>
            )}
          </div>
        </div>

        {/* คอลัมน์ขวา: ช่องทางติดต่อ + สมัครเรียน รวมเป็นบล็อกเดียว */}
        <div className="col-12 col-lg-4">
  <aside className="card h-100 d-flex flex-column" style={{ padding: 16 }}>
    
    {/* ช่องทางติดต่อ */}
    <div className="mb-3">
      <h4 className="mb-2">ช่องทางติดต่อ</h4>
      <div className="muted">โทร: 0x-xxx-xxxx</div>
      <div className="muted">
        ที่อยู่: ต.หนองน้ำแดง อ.ปากช่อง จ.นครราชสีมา
      </div>
    </div>

    <hr className="my-3" />

    {/* 🔥 บุตรหลานของฉัน */}
<div className="mb-3">
  <h4 className="mb-2">บุตรหลานของฉัน</h4>
  <p className="muted small mb-3">
    ดูข้อมูลบุตรหลานของคุณ เช่น ข้อมูลส่วนตัว การเข้าเรียน และสุขภาพ
  </p>
  <Link className="btn btn-primary w-100" to="/my-children">
    ข้อมูลบุตรหลาน
  </Link>
</div>



    <hr className="my-3" />

    {/* สมัครเข้าเรียน */}
    <div className="mt-auto">
      <h4 className="mb-2">สมัครเข้าเรียน</h4>
      <p className="muted small mb-3">
        คลิกเพื่อกรอกแบบฟอร์มสมัครเรียนออนไลน์
      </p>
      <Link className="btn btn-primary w-100" to="/enroll">
        สมัครเรียน
      </Link>
    </div>

  </aside>
</div>

      </div>
    </div>
  );
}
