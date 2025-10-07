// src/pages/HealthMeasure.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";

const PARTS = [
  { key: "hair",  label: "ผม" },
  { key: "eyes",  label: "ตา" },
  { key: "mouth", label: "ปาก" },
  { key: "teeth", label: "ฟัน" },
  { key: "ears",  label: "หู" },
  { key: "nose",  label: "จมูก" },
  { key: "nails", label: "เล็บ" },
  { key: "skin",  label: "ผิวหนัง" },
];

export default function HealthMeasure() {
  const [rows, setRows] = useState([]);       // รายชื่อเด็ก + คะแนน
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  // โหลดรายชื่อเด็กทันทีที่เปิดหน้า
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/health/children");
        // เตรียมแถว + ฟิลด์คะแนนเริ่มต้นเป็น null
        const init = (data || []).map((c, i) => ({
          idx: i + 1,
          child_id: c.child_id,
          name: `${c.first_name} ${c.last_name}${c.nickname ? ` (${c.nickname})` : ""}`,
          hair: null, eyes: null, mouth: null, teeth: null,
          ears: null, nose: null, nails: null, skin: null,
        }));
        setRows(init);
        setErr("");
      } catch (e) {
        console.error(e);
        setErr("โหลดรายชื่อเด็กไม่สำเร็จ");
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function setScore(ridx, key, val) {
    setRows(prev => prev.map((r, i) => i === ridx ? { ...r, [key]: val } : r));
  }

  async function onSaveAll() {
    try {
      setSaving(true);
      // เตรียม payload เฉพาะแถวที่มีอย่างน้อย 1 คะแนน
      const records = rows
        .map(r => {
          const anyScore = PARTS.some(p => r[p.key] != null);
          if (!anyScore) return null;
          return {
            child_id: r.child_id,
            weight_kg: null,
            height_cm: null,
            // อวัยวะให้คะแนน (1–3)
            hair: r.hair, eyes: r.eyes, mouth: r.mouth, teeth: r.teeth,
            ears: r.ears, nose: r.nose, nails: r.nails, skin: r.skin,
          };
        })
        .filter(Boolean);

      if (records.length === 0) {
        alert("ยังไม่ได้ให้คะแนนสักรายการ");
        return;
      }

      await api.post("/health/bulk", { records });
      alert("บันทึกเรียบร้อย");
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
          บันทึก/ประเมินสุขภาพเด็ก (รายห้อง)
        </h4>
        <button className="btn btn-primary" onClick={onSaveAll} disabled={saving || loading || rows.length === 0}>
          {saving ? <span className="spinner-border spinner-border-sm me-2" /> : <i className="bi bi-check2-circle me-2" />}
          บันทึกทั้งหมด
        </button>
      </div>

      {err && <div className="alert alert-danger">{err}</div>}

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border" /></div>
      ) : rows.length === 0 ? (
        <div className="card"><div className="card-body text-muted">ไม่พบรายชื่อเด็ก</div></div>
      ) : (
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-sm align-middle text-center">
                <thead className="table-light">
                  <tr>
                    <th style={{width:60}}>#</th>
                    <th className="text-start">ชื่อ-สกุล / ชื่อเล่น</th>
                    {PARTS.map(p => <th key={p.key}>{p.label}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, ridx) => (
                    <tr key={r.child_id}>
                      <td>{r.idx}</td>
                      <td className="text-start">{r.name}</td>
                      {PARTS.map(p => (
                        <td key={p.key}>
                          {[1,2,3].map(v => (
                            <label key={v} className="me-2">
                              <input
                                type="radio"
                                name={`${r.child_id}-${p.key}`}
                                className="form-check-input me-1"
                                checked={r[p.key] === v}
                                onChange={() => setScore(ridx, p.key, v)}
                              />
                              {v}
                            </label>
                          ))}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-muted small mt-2">
              * ให้คะแนน 1 = ปรับปรุง / 2 = ปานกลาง / 3 = ดีเยี่ยม
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
