import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { fileUrl } from "../lib/fileUrl";

function toThaiDate(dateInput) {
  if (!dateInput) return "-";
  const iso = String(dateInput);
  const base = iso.includes("T") ? iso.split("T")[0] : iso;
  const d = new Date(base);
  if (!isNaN(d)) {
    const yyyy = d.getFullYear() + 543;
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${dd}-${mm}-${yyyy}`;
  }
  const [y, m, dd] = base.split("-").map(Number);
  if (!y || !m || !dd) return "-";
  return `${String(dd).padStart(2, "0")}-${String(m).padStart(2, "0")}-${y + 543}`;
}
const formatDMYTH = toThaiDate;

function RowStatusBadge({ ok }) {
  return ok ? (
    <span className="badge bg-success">ข้อมูลที่ได้รับ</span>
  ) : (
    <span className="badge bg-warning text-dark">ข้อมูลอาจไม่ครบ</span>
  );
}

function KV({ label, children }) {
  return (
    <div className="mb-2">
      <div className="text-muted small">{label}</div>
      <div>{children || <span className="text-muted">-</span>}</div>
    </div>
  );
}

function safeJson(s) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

/** ประเมินความครบคร่าว ๆ จากฟิลด์หลัก + ไฟล์สำคัญ */
function checkCompleteness(detail) {
  if (!detail) return false;
  const files =
    typeof detail.files_json === "string"
      ? safeJson(detail.files_json)
      : detail.files_json || {};

  const needMain =
    detail.first_name && detail.last_name && detail.birth_date && detail.parent_phone;

  const needFiles =
    !!files?.birth_cert_file && !!files?.child_house_reg_file && !!files?.map_file;

  return !!(needMain && needFiles);
}

export default function EnrollRequests() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [approving, setApproving] = useState(false);

  async function loadList() {
    try {
      setLoading(true);
      const { data } = await api.get("/enrollments");
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
      const { data } = await api.get(`/enrollments/${id}`);
      const normalized = { ...data };
      if (typeof normalized.extra_json === "string") {
        normalized.extra_json = safeJson(normalized.extra_json);
      }
      if (typeof normalized.files_json === "string") {
        normalized.files_json = safeJson(normalized.files_json);
      }
      setDetail(normalized);
    } catch (e) {
      alert(e?.response?.data?.message || "โหลดรายละเอียดไม่สำเร็จ");
    } finally {
      setLoadingDetail(false);
    }
  }

  async function approve(id) {
    if (!confirm("ยืนยันอนุมัติคำขอนี้?")) return;
    try {
      setApproving(true);
      await api.patch(`/enrollments/${id}/approve`);
      await loadList();
      setDetail(null);
    } catch (e) {
      alert(e?.response?.data?.message || "อนุมัติไม่สำเร็จ");
    } finally {
      setApproving(false);
    }
  }

  useEffect(() => {
    loadList();
  }, []);

  const listWithFlags = useMemo(
    () =>
      (list || []).map((r) => ({
        ...r,
        _birth_fmt: formatDMYTH(r.birth_date),
      })),
    [list]
  );

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
          ) : listWithFlags.length === 0 ? (
            <div className="text-muted">ยังไม่มีคำขอที่รออนุมัติ</div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>ชื่อเด็ก</th>
                    <th>เพศ</th>
                    <th>วันเกิด</th>
                    <th>ผู้ติดต่อ</th>
                    <th>สถานะ</th>
                    <th className="text-end">การจัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {listWithFlags.map((r) => (
                    <tr key={r.enrollment_id}>
                      <td>
                        {r.first_name} {r.last_name}
                        {r.nickname ? <span className="text-muted"> ({r.nickname})</span> : null}
                      </td>
                      <td>{r.gender || "-"}</td>
                      <td>{r._birth_fmt}</td>
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
                          disabled={approving}
                          title="อนุมัติโดยไม่เปิดรายละเอียด"
                        >
                          {approving ? (
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

      {/* แผงรายละเอียด (offcanvas/side panel แบบง่าย) */}
      {detail && <div className="offcanvas-backdrop fade show" onClick={() => setDetail(null)} />}
      <div
        className={"offcanvas offcanvas-end" + (detail ? " show" : "")}
        style={{ visibility: detail ? "visible" : "hidden", width: 520 }}
        tabIndex="-1"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">
            <i className="bi bi-file-earmark-text me-2" />
            รายละเอียดคำขอ
          </h5>
          <button type="button" className="btn-close" onClick={() => setDetail(null)} />
        </div>

        <div className="offcanvas-body">
          {!detail || loadingDetail ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status" />
            </div>
          ) : (
            <>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <div className="fw-semibold">
                    {detail.first_name} {detail.last_name}
                    {detail.nickname ? <span className="text-muted"> ({detail.nickname})</span> : null}
                  </div>
                  <div className="text-muted small">
                    สถานะ: <span className="badge bg-secondary">{detail.status}</span>
                  </div>
                </div>
                <RowStatusBadge ok={checkCompleteness(detail)} />
              </div>

              <hr />

              {/* หลัก */}
              <KV label="คำนำหน้า">{detail.prefix}</KV>
              <KV label="เพศ">{detail.gender}</KV>
              <KV label="เลขบัตรประชาชน">{detail.citizen_id}</KV>
              <KV label="วันเกิด">{formatDMYTH(detail.birth_date)}</KV>
              <KV label="เบอร์ผู้ปกครอง">{detail.parent_phone}</KV>
              <KV label="หมายเหตุ">{detail.note}</KV>

              {/* extra_json */}
              {detail.extra_json && (
                <>
                  <hr />
                  <div className="mb-2 fw-semibold">ข้อมูลเพิ่มเติม</div>
                  <KV label="ช่วงอายุ">
                    {detail.extra_json?.age_group === "3" ? "อายุ 3 ปี" : "อายุต่ำกว่า 3 ปี"}
                  </KV>
                  <KV label="น้ำหนัก (กก.)">{detail.extra_json?.weight_kg}</KV>
                  <KV label="ส่วนสูง (ซม.)">{detail.extra_json?.height_cm}</KV>

                  <div className="mt-2">
                    <div className="fw-semibold small text-muted">ที่อยู่ตามทะเบียนบ้าน (เด็ก)</div>
                    <div className="small">
                      {[
                        detail.extra_json?.child_home?.house_no,
                        detail.extra_json?.child_home?.village,
                        detail.extra_json?.child_home?.street,
                        detail.extra_json?.child_home?.subdistrict,
                        detail.extra_json?.child_home?.district,
                        detail.extra_json?.child_home?.province,
                        detail.extra_json?.child_home?.postal,
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="fw-semibold small text-muted">ที่อยู่ปัจจุบัน (เด็ก)</div>
                    <div className="small">
                      {[
                        detail.extra_json?.child_current?.house_no,
                        detail.extra_json?.child_current?.village,
                        detail.extra_json?.child_current?.street,
                        detail.extra_json?.child_current?.subdistrict,
                        detail.extra_json?.child_current?.district,
                        detail.extra_json?.child_current?.province,
                        detail.extra_json?.child_current?.postal,
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="fw-semibold">บิดา</div>
                    <div className="small text-muted">
                      {detail.extra_json?.father?.prefix} {detail.extra_json?.father?.first_name}{" "}
                      {detail.extra_json?.father?.last_name}
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="fw-semibold">มารดา</div>
                    <div className="small text-muted">
                      {detail.extra_json?.mother?.prefix} {detail.extra_json?.mother?.first_name}{" "}
                      {detail.extra_json?.mother?.last_name}
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="fw-semibold">สุขภาพ</div>
                    <div className="small">
                      <div>อุบัติเหตุ/เจ็บป่วย: {detail.extra_json?.health?.accidents_history || "-"}</div>
                      <div>โรคประจำตัว: {detail.extra_json?.health?.chronic_disease || "-"}</div>
                      <div>พฤติกรรม/ผิดปกติ: {detail.extra_json?.health?.behavior_issue || "-"}</div>
                      <div>แพ้อาหาร: {detail.extra_json?.health?.food_allergy || "-"}</div>
                      <div>แพ้ยา: {detail.extra_json?.health?.drug_allergy || "-"}</div>
                      <div>
                        วัคซีน:{" "}
                        {detail.extra_json?.health?.vaccine_status === "complete"
                          ? "ครบ"
                          : detail.extra_json?.health?.vaccine_status === "incomplete"
                          ? "ไม่ครบ"
                          : "-"}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* files_json */}
              {detail.files_json && (
                <>
                  <hr />
                  <div className="mb-2 fw-semibold">ไฟล์แนบ</div>
                  <ul className="list-unstyled small">
                    {[
                      ["แผนที่บ้านของนักเรียน", detail.files_json?.map_file],
                      ["สำเนาสูติบัตร", detail.files_json?.birth_cert_file],
                      ["สำเนาทะเบียนบ้าน (เด็ก)", detail.files_json?.child_house_reg_file],
                      ["สำเนาบัตรประชาชน (บิดา)", detail.files_json?.father_id_file],
                      ["สำเนาทะเบียนบ้าน (บิดา)", detail.files_json?.father_house_reg_file],
                      ["สำเนาบัตรประชาชน (มารดา)", detail.files_json?.mother_id_file],
                      ["สำเนาทะเบียนบ้าน (มารดา)", detail.files_json?.mother_house_reg_file],
                      ["เอกสารอื่น (document)", detail.files_json?.document],
                    ].map(([label, href]) => (
                      <li key={label}>
                        {label}:{" "}
                        {href ? (
                          <a href={fileUrl(href)} target="_blank" rel="noopener noreferrer">
                            เปิดดู
                          </a>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <div className="d-flex gap-2 mt-3">
                <button
                  className="btn btn-success"
                  onClick={() => approve(detail.enrollment_id)}
                  disabled={approving}
                >
                  {approving ? (
                    <span className="spinner-border spinner-border-sm me-2" />
                  ) : (
                    <i className="bi bi-check2-circle me-2" />
                  )}
                  อนุมัติคำขอ
                </button>
                <button className="btn btn-outline-secondary" onClick={() => setDetail(null)}>
                  ปิด
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
