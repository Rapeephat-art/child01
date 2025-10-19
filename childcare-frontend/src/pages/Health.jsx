// src/pages/HealthMeasure.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";

// ✅ แปลงวันที่เป็นปีไทย
function formatDateToThai(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  const year = d.getFullYear() + 543;
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${day}/${month}/${year}`;
}

function ScoreCell({ value, onChange }) {
  return (
    <select
      className="form-select form-select-sm text-center fw-semibold square-select"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    >
      <option value={1}>1</option>
      <option value={2}>2</option>
      <option value={3}>3</option>
    </select>
  );
}

const FIELDS = [
  { key: "hair", label: "ผม" },
  { key: "eyes", label: "ตา" },
  { key: "mouth", label: "ปาก" },
  { key: "teeth", label: "ฟัน" },
  { key: "ears", label: "หู" },
  { key: "nose", label: "จมูก" },
  { key: "nails", label: "เล็บ" },
  { key: "skin", label: "ผิวหนัง" },
];

export default function HealthMeasure() {
  const [children, setChildren] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const [semester, setSemester] = useState(1);
  const [academicYear, setAcademicYear] = useState("");
  const [date, setDate] = useState("");
  const [displayDate, setDisplayDate] = useState("");

  const [search, setSearch] = useState(""); // ✅ ช่องค้นหา

  // ✅ ตั้งค่าปีการศึกษาอัตโนมัติ
  useEffect(() => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const buddhistYear = now.getFullYear() + 543;
    const academic = month <= 4 ? buddhistYear - 1 : buddhistYear;

    setAcademicYear(academic);
    const iso = now.toISOString().slice(0, 10);
    setDate(iso);
    setDisplayDate(formatDateToThai(iso));
  }, []);

  async function loadChildren() {
    try {
      setLoading(true);
      const { data } = await api.get("/children");
      const list = Array.isArray(data) ? data : [];
      setChildren(list);
      setRows(
        list.map((c) => {
          const row = { child_id: c.child_id };
          FIELDS.forEach((f) => (row[f.key] = 3));
          return row;
        })
      );
    } catch {
      setErr("โหลดรายชื่อเด็กไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadChildren();
  }, []);

  function setCell(child_id, field, value) {
    setRows((old) =>
      old.map((r) => (r.child_id === child_id ? { ...r, [field]: value } : r))
    );
  }

  async function saveAll() {
    try {
      setSaving(true);
      const payload = {
        semester,
        academic_year: academicYear,
        date,
        records: rows.map((r) => ({
          child_id: r.child_id,
          ...FIELDS.reduce((acc, f) => ({ ...acc, [f.key]: r[f.key] ?? 3 }), {}),
        })),
      };
      await api.post("/health/records/bulk", payload);
      alert("✅ บันทึกสำเร็จ");
    } catch {
      alert("❌ บันทึกไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  }

  const handleDateChange = (e) => {
    const iso = e.target.value;
    setDate(iso);
    setDisplayDate(formatDateToThai(iso));
  };

  // ✅ ฟังก์ชันกรองรายชื่อเด็กตามชื่อหรือนามสกุล
  const filteredChildren = children.filter((c) => {
    const term = search.toLowerCase();
    return (
      c.first_name?.toLowerCase().includes(term) ||
      c.last_name?.toLowerCase().includes(term) ||
      c.nickname?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="container py-4">
      {/* หัวข้อ */}
      <div className="d-flex align-items-center justify-content-between mb-3 page-header-candy">
        <h4 className="mb-0">
          <i className="bi bi-heart-pulse me-2" />
          บันทึก / ประเมินสุขภาพเด็ก
        </h4>
        <button
          className="btn btn-primary"
          onClick={saveAll}
          disabled={saving || loading || !children.length}
        >
          {saving ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              กำลังบันทึก...
            </>
          ) : (
            <>
              <i className="bi bi-check2-circle me-2" />
              บันทึกทั้งหมด
            </>
          )}
        </button>
      </div>

      {/* ส่วนปีการศึกษา + ช่องค้นหา */}
      <div className="card mb-4 p-3 shadow-sm">
        <div className="row g-3 align-items-end">
          <div className="col-md-2">
            <label className="form-label fw-semibold">เทอม</label>
            <select
              className="form-select"
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
            >
              <option value={1}>เทอม 1</option>
              <option value={2}>เทอม 2</option>
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label fw-semibold">ปีการศึกษา (พ.ศ.)</label>
            <input
              type="number"
              className="form-control"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold">วันที่ประเมิน</label>
            <div className="input-group">
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={handleDateChange}
              />
              <span className="input-group-text">{displayDate}</span>
            </div>
          </div>

          {/* ✅ ช่องค้นหาชื่อเด็ก */}
          <div className="col-md-5">
            <label className="form-label fw-semibold">ค้นหาชื่อเด็ก</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="พิมพ์ชื่อหรือนามสกุลเด็ก..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* รายชื่อเด็ก */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
        </div>
      ) : (
        <div className="row g-4">
          {filteredChildren.length === 0 ? (
            <div className="text-center text-muted">ไม่พบรายชื่อเด็ก</div>
          ) : (
            filteredChildren.map((c, i) => {
              const row = rows.find((r) => r.child_id === c.child_id) || {};
              return (
                <div key={c.child_id} className="col-md-6">
                  <div className="card measure-card card-cute p-3">
                    <h6 className="fw-bold text-primary mb-3">
                      <i className="bi bi-person-circle me-2 text-primary"></i>
                      {i + 1}. {c.first_name} {c.last_name}{" "}
                      <span className="text-muted">({c.nickname || "-"})</span>
                    </h6>

                    <div className="row g-3">
                      {FIELDS.map((f) => (
                        <div key={f.key} className="col-6">
                          <div className="measure-box d-flex justify-content-between align-items-center">
                            <span className="fw-semibold">{f.label}</span>
                            <ScoreCell
                              value={row[f.key]}
                              onChange={(n) => setCell(c.child_id, f.key, n)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
