// src/pages/EnrollRequestDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function EnrollRequestDetail(){
  const { id } = useParams();
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({type:"", text:""});

  useEffect(() => {
    let mounted = true;
    (async () => {
      try{
        const { data } = await api.get(`/enrollments/${id}`);
        if(mounted) setData(data);
      }catch(err){
        setMsg({type:"danger", text: err?.response?.data?.message || "โหลดไม่สำเร็จ"});
      }finally{
        if(mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; }
  }, [id]);

  async function approve(){
    try{
      setSaving(true);
      await api.patch(`/enrollments/${id}/approve`);
      setMsg({type:"success", text:"อนุมัติเรียบร้อย"});
      setTimeout(() => nav("/enroll-requests"), 800);
    }catch(err){
      setMsg({type:"danger", text: err?.response?.data?.message || "อนุมัติไม่สำเร็จ"});
    }finally{
      setSaving(false);
    }
  }

  if(loading) return <div className="container py-4">Loading...</div>;
  if(!data) return <div className="container py-4">ไม่พบข้อมูล</div>;

  const e = data.enrollment;
  const files = e.files_json || {};
  const extra = e.extra_json || {};
  const { checklist, summary } = data;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">
          <i className="bi bi-card-text me-2" />
          รายละเอียดคำขอ #{e.enrollment_id}
        </h4>
        <div className="d-flex gap-2">
          <Link to="/enroll-requests" className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-left"></i> กลับรายการ
          </Link>
          <button className="btn btn-success btn-sm" onClick={approve} disabled={saving}>
            {saving ? <span className="spinner-border spinner-border-sm me-2"/> : <i className="bi bi-check2-circle me-1" />}
            อนุมัติ
          </button>
        </div>
      </div>

      {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

      {/* สรุปความครบถ้วน */}
      <div className="card p-3 mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0">
            <i className="bi bi-clipboard-check me-2" />
            สรุปความครบถ้วน
          </h6>
          <span className={`badge ${summary.ok ? "bg-success" : "bg-danger"}`}>
            {summary.ok ? "ครบถ้วน" : `ขาด ${summary.missing_count} รายการ`}
          </span>
        </div>
        <hr />
        <ul className="list-group">
          {checklist.map((c) => (
            <li key={c.key} className="list-group-item d-flex justify-content-between align-items-center">
              {c.label}
              {c.ok ? (
                <span className="badge bg-success"><i className="bi bi-check2" /> OK</span>
              ) : (
                <span className="badge bg-danger"><i className="bi bi-x" /> ขาด</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* ข้อมูลหลัก */}
      <div className="card p-3 mb-3">
        <h6 className="mb-2"><i className="bi bi-person-badge me-2" />ข้อมูลเด็ก</h6>
        <div className="row g-2">
          <div className="col-md-3"><strong>ชื่อ</strong><div>{e.prefix || ''} {e.first_name}</div></div>
          <div className="col-md-3"><strong>สกุล</strong><div>{e.last_name}</div></div>
          <div className="col-md-2"><strong>ชื่อเล่น</strong><div>{e.nickname || '-'}</div></div>
          <div className="col-md-2"><strong>เพศ</strong><div>{e.gender || '-'}</div></div>
          <div className="col-md-2"><strong>วันเกิด</strong><div>{e.birth_date || '-'}</div></div>
          <div className="col-md-2"><strong>อายุ (กลุ่ม)</strong><div>{extra.age_group || '-'}</div></div>
          <div className="col-md-2"><strong>น้ำหนัก</strong><div>{extra.weight_kg || '-'} กก.</div></div>
          <div className="col-md-2"><strong>ส่วนสูง</strong><div>{extra.height_cm || '-'} ซม.</div></div>
          <div className="col-md-3"><strong>ผู้ปกครอง (โทร)</strong><div>{e.parent_phone || '-'}</div></div>
          <div className="col-md-12"><strong>หมายเหตุ</strong><div>{e.note || '-'}</div></div>
        </div>
      </div>

      {/* เอกสารแนบ */}
      <div className="card p-3 mb-3">
        <h6 className="mb-2"><i className="bi bi-paperclip me-2" />เอกสารแนบ</h6>
        <div className="row g-2">
          {Object.entries(files).map(([k, v]) => (
            <div className="col-md-6" key={k}>
              <div className="d-flex justify-content-between align-items-center border rounded p-2">
                <div>{k}</div>
                {v ? (
                  <a href={v} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary">
                    เปิดดู
                  </a>
                ) : (
                  <span className="text-muted">- ไม่มีไฟล์ -</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* สุขภาพ/ผู้รับส่ง/ผู้อุปการะ (ยกตัวอย่าง) */}
      <div className="card p-3">
        <h6 className="mb-2"><i className="bi bi-heart-pulse me-2" />สุขภาพ & อื่นๆ</h6>
        <div className="row g-2">
          <div className="col-md-4"><strong>วัคซีน</strong><div>{extra?.health?.vaccine_status || '-'}</div></div>
          <div className="col-md-4"><strong>แพ้อาหาร</strong><div>{extra?.health?.health_food_allergy || extra?.health?.food_allergy || '-'}</div></div>
          <div className="col-md-4"><strong>แพ้ยา</strong><div>{extra?.health?.drug_allergy || '-'}</div></div>
          <div className="col-md-4"><strong>ผู้รับส่ง</strong><div>{extra?.pickup?.name || '-'} ({extra?.pickup?.relation || '-'})</div></div>
          <div className="col-md-4"><strong>เบอร์ผู้รับส่ง</strong><div>{extra?.pickup?.phone || '-'}</div></div>
          <div className="col-md-4"><strong>ผู้อุปการะ</strong><div>{extra?.caregiver?.relation || '-'}</div></div>
        </div>
      </div>
    </div>
  );
}
