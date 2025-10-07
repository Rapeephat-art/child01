// src/pages/Attendance.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";

const STATUS = ["มา","ขาด","สาย","ลา"];

export default function Attendance(){
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [rows, setRows] = useState([]);
  const [session, setSession] = useState(null);

  const date = useMemo(() => new Date().toISOString().slice(0,10), []);

  useEffect(() => {
    (async () => {
      try {
        setErr("");
        const { data } = await api.get("/attendance/init", {
          params: { date, period: "เช้า" }
        });
        setSession(data.session);
        setRows(data.rows);
      } catch (e) {
        setErr(e?.response?.data?.message || "โหลดรายชื่อเด็กไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    })();
  }, [date]);

  function setStatus(child_id, status){
    setRows(rs => rs.map(r => r.child_id===child_id ? {...r, status} : r));
  }
  function setNote(child_id, note){
    setRows(rs => rs.map(r => r.child_id===child_id ? {...r, note} : r));
  }

  async function onSave(){
    try{
      setErr("");
      await api.post(`/attendance/${session.session_id}/bulk`, {
        items: rows.map(r => ({ child_id: r.child_id, status: r.status, note: r.note }))
      });
      alert("บันทึกเรียบร้อย");
    }catch(e){
      setErr(e?.response?.data?.message || "บันทึกไม่สำเร็จ");
    }
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="m-0">
          <i className="bi bi-clipboard-check me-2"></i>
          เช็คชื่อมาเรียน ({date} • เช้า)
        </h4>
        <button className="btn btn-primary" onClick={onSave} disabled={!session}>
          <i className="bi bi-save2 me-1"></i> บันทึกทั้งหมด
        </button>
      </div>

      {err && <div className="alert alert-danger">{err}</div>}
      {loading ? <div>Loading...</div> : (
        <div className="card">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{width:60}} className="text-center">#</th>
                  <th>ชื่อ-สกุล</th>
                  <th style={{width:120}} className="text-center">ชื่อเล่น</th>
                  {STATUS.map(s => (
                    <th key={s} style={{width:90}} className="text-center">{s}</th>
                  ))}
                  <th style={{width:240}}>หมายเหตุ</th>
                </tr>
              </thead>
              <tbody>
                {rows.length===0 && (
                  <tr><td colSpan={6} className="text-center py-5">ไม่มีรายชื่อเด็ก</td></tr>
                )}
                {rows.map((r,idx) => (
                  <tr key={r.child_id}>
                    <td className="text-center">{idx+1}</td>
                    <td>{r.name}</td>
                    <td className="text-center">{r.nickname || "-"}</td>
                    {STATUS.map(s => (
                      <td key={s} className="text-center">
                        <input
                          type="radio"
                          name={`st-${r.child_id}`}
                          checked={r.status===s}
                          onChange={() => setStatus(r.child_id, s)}
                        />
                      </td>
                    ))}
                    <td>
                      <input
                        className="form-control"
                        value={r.note}
                        onChange={e => setNote(r.child_id, e.target.value)}
                        placeholder="เช่น ลาป่วย "
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 text-muted">
            * สถานะ: มา / ขาด / สาย / ลา
          </div>
        </div>
      )}
    </div>
  );
}
