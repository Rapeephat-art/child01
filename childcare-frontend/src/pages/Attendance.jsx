// src/pages/Attendance.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";

const STATUS = ["มา","ขาด","สาย","ลา"];

export default function Attendance(){
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [rows, setRows] = useState([]);
  const [session, setSession] = useState(null);

  // วันนี้ (yyyy-mm-dd)
  const date = useMemo(() => new Date().toISOString().slice(0,10), []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setErr("");
        setLoading(true);

        // ใส่ withCredentials เพื่อให้ส่ง cookie (token) ไปด้วย (ถ้าใช้ cookie auth)
        const { data } = await api.get("/attendance/init", {
          params: { date, period: "เช้า" },
          withCredentials: true,
        });

        if (!mounted) return;

        // data ควรมี shape: { session: {...}, rows: [...] }
        setSession(data?.session ?? null);
        setRows(Array.isArray(data?.rows) ? data.rows : []);
      } catch (e) {
        console.error("[Attendance] load error:", e);
        // แสดงข้อความจาก backend ถ้ามี
        setErr(e?.response?.data?.message || "โหลดรายชื่อเด็กไม่สำเร็จ");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [date]);

  function setStatus(child_id, status){
    setRows(rs => rs.map(r => r.child_id===child_id ? {...r, status} : r));
  }
  function setNote(child_id, note){
    setRows(rs => rs.map(r => r.child_id===child_id ? {...r, note} : r));
  }

  async function onSave(){
    if (!session) {
      alert("ยังไม่มี session การเช็คชื่อสำหรับวันนี้");
      return;
    }
    try{
      setErr("");
      await api.post(
        `/attendance/${session.session_id}/bulk`,
        { items: rows.map(r => ({ child_id: r.child_id, status: r.status, note: r.note })) },
        { withCredentials: true } // ถ้า backend ต้องการ cookie
      );
      alert("บันทึกเรียบร้อย");
    }catch(e){
      console.error("[Attendance] save error:", e);
      setErr(e?.response?.data?.message || "บันทึกไม่สำเร็จ");
    }
  }

  // จำนวนคอลัมน์ทั้งหมด เพื่อใช้ colSpan เมื่อไม่มีข้อมูล
  const totalCols = 1 /*#*/ + 1 /*ชื่อ*/ + 1 /*ชื่อเล่น*/ + STATUS.length + 1 /*หมายเหตุ*/;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="m-0">
          <i className="bi bi-clipboard-check me-2"></i>
          เช็คชื่อมาเรียน ({date} • เช้า)
        </h4>
        <button className="btn btn-primary" onClick={onSave} disabled={!session || rows.length===0}>
          <i className="bi bi-save2 me-1"></i> บันทึกทั้งหมด
        </button>
      </div>

      {err && <div className="alert alert-danger">{err}</div>}

      {loading ? (
        <div className="card p-4 text-center">
          <span className="spinner-border me-2" />
          กำลังโหลดข้อมูล…
        </div>
      ) : (
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
                {rows.length===0 ? (
                  <tr>
                    <td colSpan={totalCols} className="text-center py-5 text-muted">
                      ไม่มีรายชื่อเด็ก
                    </td>
                  </tr>
                ) : (
                  rows.map((r,idx) => (
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
                          value={r.note || ""}
                          onChange={e => setNote(r.child_id, e.target.value)}
                          placeholder="เช่น ลาป่วย "
                        />
                      </td>
                    </tr>
                  ))
                )}
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
