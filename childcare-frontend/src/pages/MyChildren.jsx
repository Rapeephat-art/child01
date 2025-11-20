// src/pages/MyChildren.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";

function ageText(dateStr) {
  if (!dateStr) return "-";
  const dob = new Date(dateStr);
  if (isNaN(dob)) return "-";

  const now = new Date();
  let years = now.getFullYear() - dob.getFullYear();
  let months = now.getMonth() - dob.getMonth();
  const days = now.getDate() - dob.getDate();

  if (days < 0) months -= 1;
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  if (years < 0) return "-";
  return `${years} ปี ${months} เดือน`;
}

export default function MyChildren() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        // ✅ เรียก API ใหม่ที่เราทำไว้ให้ผู้ปกครอง
        const { data } = await api.get("/children/mine", {
          withCredentials: true,
        });
        if (!alive) return;
        setChildren(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!alive) return;
        console.error(e);
        setError(e?.response?.data?.message || "โหลดข้อมูลบุตรหลานไม่สำเร็จ");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="container py-4">
      <h4 className="mb-3">
        <i className="bi bi-heart-fill me-2" />
        บุตรหลานของฉัน
      </h4>

      {loading && (
        <div className="card p-4 text-center">
          <span className="spinner-border me-2" />
          กำลังโหลดข้อมูล…
        </div>
      )}

      {!loading && error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {!loading && !error && children.length === 0 && (
        <div className="card p-4 text-center text-muted">
          ยังไม่มีข้อมูลบุตรหลานในระบบ
        </div>
      )}

      {!loading && !error && children.length > 0 && (
        <div className="card">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: 80 }}>รหัส</th>
                  <th>ชื่อ-สกุล</th>
                  <th style={{ width: 120 }}>ชื่อเล่น</th>
                  <th style={{ width: 80 }}>เพศ</th>
                  <th style={{ width: 160 }}>วันเกิด / อายุ</th>
                  <th style={{ width: 110 }}>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {children.map((c) => (
                  <tr key={c.child_id}>
                    <td>#{c.child_id}</td>
                    <td>{`${c.prefix ?? ""} ${c.first_name ?? ""} ${
                      c.last_name ?? ""
                    }`.trim()}</td>
                    <td>{c.nickname || "-"}</td>
                    <td>{c.gender || "-"}</td>
                    <td>
                      {c.birth_date
                        ? new Date(c.birth_date).toLocaleDateString()
                        : "-"}
                      <div className="text-muted small">
                        {ageText(c.birth_date)}
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-primary-subtle text-primary">
                        {c.status || "-"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
