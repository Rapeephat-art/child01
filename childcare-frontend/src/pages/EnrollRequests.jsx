// src/pages/EnrollRequests.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";
import { fileUrl } from "../lib/fileUrl";
import { formatDMY, ageTextTH, ageGroupLabel } from "../lib/date";

/* รายการไฟล์แนบ + บอกว่าอะไรบังคับ */
const FILE_SPEC = [
  { key: "map_file",               label: "แผนที่บ้านของนักเรียน",       required: true  },
  { key: "birth_cert_file",        label: "สำเนาสูติบัตร",               required: true  },
  { key: "child_house_reg_file",   label: "สำเนาทะเบียนบ้าน (เด็ก)",     required: true  },
  { key: "father_id_file",         label: "สำเนาบัตรประชาชน (บิดา)",    required: false },
  { key: "father_house_reg_file",  label: "สำเนาทะเบียนบ้าน (บิดา)",     required: false },
  { key: "mother_id_file",         label: "สำเนาบัตรประชาชน (มารดา)",   required: false },
  { key: "mother_house_reg_file",  label: "สำเนาทะเบียนบ้าน (มารดา)",    required: false },
  { key: "document",               label: "เอกสารอื่น (document)",       required: false },
];

/* ---------- UI helpers ---------- */
const Field = ({ label, value }) => (
  <div className="mb-2">
    <div className="text-muted small">{label}</div>
    <div>{value !== undefined && value !== null && value !== "" ? String(value) : "-"}</div>
  </div>
);

const Sec = ({ icon, title, children }) => (
  <div className="card p-3 mb-3">
    <h6 className="mb-2">{icon ? <i className={`me-2 ${icon}`} /> : null}{title}</h6>
    {children}
  </div>
);

/* ---------- main ---------- */
export default function EnrollRequests() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // คุมสถานะระหว่างยิง API (ทั้งอนุมัติ/ไม่อนุมัติ)
  const [acting, setActing] = useState(false);

  // ข้อความถึงผู้ปกครอง
  const [parentMsg, setParentMsg] = useState("");

  async function loadList() {
    try {
      setLoading(true);
      const { data } = await api.get("/enrollments"); // ครู: รายการรออนุมัติ
      setList(data || []);
      setErr("");
    } catch (e) {
      setErr(e?.response?.data?.message || "โหลดรายการไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  async function openDetail(id) {
    try {
      setLoadingDetail(true);
      const { data } = await api.get(`/enrollments/${id}`); // รายละเอียดคำขอ
      const base = data.enrollment || data;
      const extra =
        typeof base.extra_json === "string" ? safeJSON(base.extra_json) : (data.extra_json || base.extra_json || {});
      const files =
        typeof base.files_json === "string" ? safeJSON(base.files_json) : (data.files_json || base.files_json || {});
      setDetail({ ...base, extra_json: extra, files_json: files });
      setParentMsg(""); // รีเซ็ตเมื่อเปิดใบใหม่
    } catch (e) {
      alert(e?.response?.data?.message || "โหลดรายละเอียดไม่สำเร็จ");
    } finally {
      setLoadingDetail(false);
    }
  }

  async function approve(id) {
    if (!confirm("ยืนยันอนุมัติคำขอนี้?")) return;
    try {
      setActing(true);
      await api.patch(`/enrollments/${id}/approve`, { message: parentMsg || null });
      await loadList();
      setDetail(null);
    } catch (e) {
      alert(e?.response?.data?.message || "อนุมัติไม่สำเร็จ");
    } finally {
      setActing(false);
    }
  }

  async function reject(id) {
    if (!confirm("ยืนยัน 'ไม่อนุมัติ' คำขอนี้?")) return;
    try {
      setActing(true);
      await api.patch(`/enrollments/${id}/reject`, { message: parentMsg || null });
      await loadList();
      setDetail(null);
    } catch (e) {
      alert(e?.response?.data?.message || "ไม่อนุมัติไม่สำเร็จ");
    } finally {
      setActing(false);
    }
  }

  useEffect(() => { loadList(); }, []);

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">
          <i className="bi bi-clipboard2-check me-2" />
          คำขอสมัครเรียน (รออนุมัติ)
        </h4>
        <button className="btn btn-outline-secondary btn-sm" onClick={loadList} disabled={loading}>
          <i className="bi bi-arrow-clockwise me-1" />
          รีเฟรช
        </button>
      </div>

      {err && <div className="alert alert-danger">{err}</div>}

      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="py-4 text-center">
              <div className="spinner-border" role="status" />
            </div>
          ) : list.length === 0 ? (
            <div className="text-muted">ยังไม่มีคำขอที่รออนุมัติ</div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>ชื่อเด็ก</th>
                    <th>เพศ</th>
                    <th>ผู้ติดต่อ</th>
                    <th>สถานะ</th>
                    <th className="text-end">การจัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((r) => (
                    <tr key={r.enrollment_id}>
                      <td>
                        <div>
                          {r.first_name} {r.last_name}
                          {r.nickname ? <span className="text-muted"> ({r.nickname})</span> : null}
                        </div>
                        <div className="small text-muted">
                          ส่งเมื่อ: {fmtDateTime(r.created_at)}
                        </div>
                      </td>
                      <td>{r.gender || "-"}</td>
                      <td>{r.parent_phone || "-"}</td>
                      <td>
                        <span className="badge bg-secondary">{r.status}</span>
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => openDetail(r.enrollment_id)}
                        >
                          <i className="bi bi-search me-1" />
                          ดูรายละเอียด
                        </button>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => approve(r.enrollment_id)}
                          disabled={acting}
                        >
                          {acting ? (
                            <span className="spinner-border spinner-border-sm me-1" />
                          ) : (
                            <i className="bi bi-check2-circle me-1" />
                          )}
                          อนุมัติ
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop */}
      {detail && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={() => setDetail(null)}
        />
      )}

      {/* Offcanvas: รายละเอียด */}
      <div
        className={"offcanvas offcanvas-end" + (detail ? " show" : "")}
        style={{ visibility: detail ? "visible" : "hidden", width: 640 }}
        tabIndex="-1"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">
            <i className="bi bi-file-earmark-text me-2" />
            รายละเอียดคำขอ
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setDetail(null)}
          />
        </div>

        <div className="offcanvas-body">
          {!detail || loadingDetail ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status" />
            </div>
          ) : (
            <>
              {/* เด็ก (หลัก) */}
              <Sec icon="bi bi-person-badge" title="ข้อมูลเด็ก (ตามฟอร์มสมัคร)">
                <div className="row g-2">
                  <div className="col-md-3"><Field label="คำนำหน้า" value={detail.prefix} /></div>
                  <div className="col-md-3"><Field label="ชื่อ" value={detail.first_name} /></div>
                  <div className="col-md-3"><Field label="สกุล" value={detail.last_name} /></div>
                  <div className="col-md-3"><Field label="ชื่อเล่น" value={detail.nickname} /></div>
                  <div className="col-md-3"><Field label="เพศ" value={detail.gender} /></div>
                  <div className="col-md-3"><Field label="วันเกิด" value={formatDMY(detail.birth_date)} /></div>
                  <div className="col-md-3"><Field label="อายุ (คำนวณ)" value={ageTextTH(detail.birth_date)} /></div>
                  <div className="col-md-3"><Field label="เลขบัตรประชาชน" value={detail.citizen_id} /></div>
                  <div className="col-md-3"><Field label="เบอร์ผู้ปกครอง" value={detail.parent_phone} /></div>
                  <div className="col-md-12"><Field label="หมายเหตุ" value={detail.note} /></div>
                </div>
                <hr />
                <div className="row g-2">
                  <div className="col-md-3"><Field label="ช่วงอายุ (จากฟอร์ม)" value={ageGroupLabel(detail.extra_json?.age_group)} /></div>
                  <div className="col-md-3"><Field label="น้ำหนัก (กก.)" value={detail.extra_json?.weight_kg} /></div>
                  <div className="col-md-3"><Field label="ส่วนสูง (ซม.)" value={detail.extra_json?.height_cm} /></div>
                </div>
              </Sec>

              {/* ที่อยู่เด็ก */}
              <Sec icon="bi bi-geo-alt" title="ที่อยู่เด็ก">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="text-muted small">ที่อยู่ตามทะเบียนบ้าน</h6>
                    {addrFields(detail.extra_json?.child_home)}
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-muted small">ที่อยู่ปัจจุบัน</h6>
                    {addrFields(detail.extra_json?.child_current)}
                  </div>
                </div>
              </Sec>

              {/* บิดา */}
              <Sec icon="bi bi-person" title="บิดา">
                <div className="row g-2">
                  <div className="col-md-4"><Field label="คำนำหน้า" value={detail.extra_json?.father?.prefix} /></div>
                  <div className="col-md-4"><Field label="ชื่อ" value={detail.extra_json?.father?.first_name} /></div>
                  <div className="col-md-4"><Field label="สกุล" value={detail.extra_json?.father?.last_name} /></div>
                  <div className="col-md-4"><Field label="เลขบัตรประชาชน" value={detail.extra_json?.father?.citizen_id} /></div>
                  <div className="col-md-4"><Field label="อาชีพ" value={detail.extra_json?.father?.job} /></div>
                  <div className="col-md-4"><Field label="รายได้" value={detail.extra_json?.father?.income} /></div>
                  <div className="col-md-12"><h6 className="text-muted small mt-2">ที่อยู่บิดา</h6></div>
                  {addrCols(detail.extra_json?.father?.address)}
                </div>
              </Sec>

              {/* มารดา */}
              <Sec icon="bi bi-person" title="มารดา">
                <div className="row g-2">
                  <div className="col-md-4"><Field label="คำนำหน้า" value={detail.extra_json?.mother?.prefix} /></div>
                  <div className="col-md-4"><Field label="ชื่อ" value={detail.extra_json?.mother?.first_name} /></div>
                  <div className="col-md-4"><Field label="สกุล" value={detail.extra_json?.mother?.last_name} /></div>
                  <div className="col-md-4"><Field label="เลขบัตรประชาชน" value={detail.extra_json?.mother?.citizen_id} /></div>
                  <div className="col-md-4"><Field label="อาชีพ" value={detail.extra_json?.mother?.job} /></div>
                  <div className="col-md-4"><Field label="รายได้" value={detail.extra_json?.mother?.income} /></div>
                  <div className="col-md-12"><h6 className="text-muted small mt-2">ที่อยู่มารดา</h6></div>
                  {addrCols(detail.extra_json?.mother?.address)}
                </div>
              </Sec>

              {/* ผู้อุปการะ & ผู้รับส่ง */}
              <Sec icon="bi bi-person-heart" title="ผู้อุปการะ & ผู้รับส่ง">
                <div className="row g-2">
                  <div className="col-md-4"><Field label="ความสัมพันธ์ผู้อุปการะ" value={detail.extra_json?.caregiver?.relation} /></div>
                  <div className="col-md-4"><Field label="อาชีพผู้อุปการะ" value={detail.extra_json?.caregiver?.job} /></div>
                  <div className="col-md-4"><Field label="รายได้ผู้อุปการะ" value={detail.extra_json?.caregiver?.income} /></div>
                  <div className="col-md-4"><Field label="ผู้รับส่ง" value={detail.extra_json?.pickup?.name} /></div>
                  <div className="col-md-4"><Field label="ความสัมพันธ์ผู้รับส่ง" value={detail.extra_json?.pickup?.relation} /></div>
                  <div className="col-md-4"><Field label="เบอร์ผู้รับส่ง" value={detail.extra_json?.pickup?.phone} /></div>
                </div>
              </Sec>

              {/* เอกสารแนบ + ปุ่ม อนุมัติ/ไม่อนุมัติ */}
              <Sec icon="bi bi-paperclip" title="เอกสารแนบ">
                <div className="row g-2">
                  {FILE_SPEC.map(({ key, label }) => {
                    const href = detail.files_json?.[key];
                    return (
                      <div className="col-md-6" key={key}>
                        <div className="d-flex justify-content-between align-items-center border rounded p-2">
                          <div>{label}</div>
                          {href ? (
                            <a
                              href={fileUrl(href)}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-sm btn-outline-primary"
                            >
                              เปิดดู
                            </a>
                          ) : (
                            <span className="text-muted">- ไม่มีไฟล์ -</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ข้อความถึงผู้ปกครอง + ปุ่ม action */}
                <hr />
                <div className="mt-2">
                  <label className="form-label fw-semibold">ข้อความถึงผู้ปกครอง</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="พิมพ์ข้อความถึงผู้ปกครอง (ถ้ามี)"
                    value={parentMsg}
                    onChange={(e) => setParentMsg(e.target.value)}
                  />
                  <div className="d-flex gap-2 mt-2">
                    <button
                      type="button"
                      className="btn btn-success btn-sm"
                      onClick={() => approve(detail.enrollment_id)}
                      disabled={acting}
                    >
                      <i className="bi bi-check2-circle me-1" />
                      อนุมัติ
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => reject(detail.enrollment_id)}
                      disabled={acting}
                    >
                      <i className="bi bi-x-circle me-1" />
                      ไม่อนุมัติ
                    </button>
                  </div>
                </div>
              </Sec>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- utils ---------- */
function fmtDateTime(s) {
  if (!s) return "-";
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function safeJSON(s) { try { return JSON.parse(s); } catch { return {}; } }

function addrFields(addr) {
  return (
    <>
      <Field label="บ้านเลขที่" value={addr?.house_no} />
      <Field label="หมู่บ้าน/ชุมชน" value={addr?.village} />
      <Field label="ถนน/ตรอก/ซอย" value={addr?.street} />
      <Field label="ตำบล" value={addr?.subdistrict} />
      <Field label="อำเภอ" value={addr?.district} />
      <Field label="จังหวัด" value={addr?.province} />
      <Field label="รหัสไปรษณีย์" value={addr?.postal} />
    </>
  );
}

function addrCols(addr) {
  return (
    <>
      <div className="col-md-4"><Field label="บ้านเลขที่" value={addr?.house_no} /></div>
      <div className="col-md-4"><Field label="หมู่บ้าน/ชุมชน" value={addr?.village} /></div>
      <div className="col-md-4"><Field label="ถนน/ตรอก/ซอย" value={addr?.street} /></div>
      <div className="col-md-4"><Field label="ตำบล" value={addr?.subdistrict} /></div>
      <div className="col-md-4"><Field label="อำเภอ" value={addr?.district} /></div>
      <div className="col-md-4"><Field label="จังหวัด" value={addr?.province} /></div>
      <div className="col-md-4"><Field label="รหัสไปรษณีย์" value={addr?.postal} /></div>
    </>
  );
}
