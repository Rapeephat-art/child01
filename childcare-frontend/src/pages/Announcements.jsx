// src/pages/Announcement.jsx
import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthProvider";

export default function Announcement() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // โหลดประกาศ
  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await api.get("/announcements");
        setAnnouncements(Array.isArray(data) ? data : []);
      } catch {
        console.error("ไม่สามารถโหลดข้อมูลได้");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="container py-4">
      <h4 className="fw-bold mb-3">
        <i className="bi bi-megaphone-fill me-2 text-primary"></i>
        ประกาศ / ข่าวกิจกรรม
      </h4>

      {/* ถ้าเป็นครูจะแสดงปุ่มเพิ่ม */}
      {user?.type === "teacher" && (
        <div className="mb-3">
          <button className="btn btn-primary">
            <i className="bi bi-plus-circle me-1"></i> เพิ่มประกาศ
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary"></div>
        </div>
      ) : announcements.length === 0 ? (
        <div className="alert alert-info text-center">ยังไม่มีประกาศ</div>
      ) : (
        <div className="row g-3">
          {announcements.map((a) => (
            <div key={a.id} className="col-md-6">
              <div className="card shadow-sm h-100">
                {a.image_url && (
                  <img
                    src={a.image_url}
                    alt="กิจกรรม"
                    className="card-img-top"
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                )}
                <div className="card-body">
                  <h5 className="text-primary fw-semibold">{a.title}</h5>
                  <p>{a.detail}</p>
                  <small className="text-muted">
                    เทอม {a.semester} / ปี {a.year}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
