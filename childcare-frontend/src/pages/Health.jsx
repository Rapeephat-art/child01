// src/pages/Health.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";

function ScoreCell({ value, onChange, name }) {
  return (
    <div className="d-flex justify-content-center gap-4 score-radio">
      {[1, 2, 3].map((n) => (
        <label
          key={n}
          className="d-inline-flex align-items-center gap-2 mb-0"
          style={{ cursor: "pointer" }}
        >
          <input
            type="radio"
            className="form-check-input m-0"
            name={name}
            value={n}
            checked={String(value) === String(n)}
            onChange={() => onChange(n)}
          />
          <span>{n}</span>
        </label>
      ))}
    </div>
  );
}

/** หัวข้อที่ให้คะแนน (ปรับเพิ่ม/ลดได้) */
const FIELDS = [
  { key: "hair",  label: "ผม" },
  { key: "eyes",  label: "ตา" },
  { key: "mouth", label: "ปาก" },
  { key: "teeth", label: "ฟัน" },
  { key: "ears",  label: "หู" },
  { key: "nose",  label: "จมูก" },
  { key: "nails", label: "เล็บ" },
  { key: "skin",  label: "ผิวหนัง" },
];

export default function Health() {
  const [children, setChildren] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  // โหลดรายชื่อเด็ก
  async function loadChildren() {
    try {
      setLoading(true);
      setErr("");

      const { data } = await api.get("/children");
      const list = Array.isArray(data) ? data : [];

      setChildren(list);
      setRows(
        list.map((c) => ({
          child_id: c.child_id,
          hair: null,
          eyes: null,
          mouth: null,
          teeth: null,
          ears: null,
          nose: null,
          nails: null,
          skin: null,
        }))
      );
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.message || "โหลดรายชื่อเด็กไม่สำเร็จ");
      setChildren([]);
      setRows([]);
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
      setErr("");

      const payload = rows.map((r) => ({
        child_id: r.child_id,
        hair: r.hair ?? null,
        eyes: r.eyes ?? null,
        mouth: r.mouth ?? null,
        teeth: r.teeth ?? null,
        ears: r.ears ?? null,
        nose: r.nose ?? null,
        nails: r.nails ?? null,
        skin: r.skin ?? null,
      }));

      await api.post("/health/records/bulk", { records: payload });
      alert("บันทึกสำเร็จ");
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "บันทึกไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">
          <i className="bi bi-clipboard2-pulse me-2" />
          บันทึก/ประเมินสุขภาพเด็ก
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

      {err && <div className="alert alert-danger">{err}</div>}

      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="py-4 text-center">
              <div className="spinner-border" role="status" />
            </div>
          ) : children.length === 0 ? (
            <div className="text-muted">ไม่พบรายชื่อเด็ก</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{ minWidth: 30 }} className="text-center">#</th>
                    <th style={{ minWidth: 250 }}>ชื่อ-สกุล</th>
                    <th style={{ minWidth: 100 }}>ชื่อเล่น</th>
                    {FIELDS.map((f) => (
                      <th key={f.key} className="text-center" style={{ minWidth: 120 }}>
                        {f.label}
                        <div className="small text-muted">(1–3)</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {children.map((c, idx) => {
                    const row = rows.find((r) => r.child_id === c.child_id) || {};
                    return (
                      <tr key={c.child_id}>
                        <td className="text-center">{idx + 1}</td>
                        <td>{c.first_name} {c.last_name}</td>
                        <td>{c.nickname || "-"}</td>
                        {FIELDS.map((f) => (
                          <td key={f.key}>
                            <ScoreCell
                              name={`${c.child_id}-${f.key}`}
                              value={row[f.key]}
                              onChange={(n) => setCell(c.child_id, f.key, n)}
                            />
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="text-muted small mt-2">
            * ให้คะแนน <b>1 = ปรับปรุง</b> / <b>2 = ปานกลาง</b> / <b>3 = ดีเยี่ยม</b>
          </div>
        </div>
      </div>
    </div>
  );
}
