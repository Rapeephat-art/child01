import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthProvider";

export default function Announcement() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // ฟอร์มเพิ่มประกาศ
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [semester, setSemester] = useState(1);
  const [year, setYear] = useState(new Date().getFullYear() + 543);
  const [images, setImages] = useState([]);

  // โหลดประกาศทั้งหมด
  async function loadAnnouncements() {
    try {
      setLoading(true);
      const { data } = await api.get("/announcements");
      setAnnouncements(Array.isArray(data) ? data : []);
    } catch {
      console.error("❌ โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnnouncements();
  }, []);

  // บันทึกประกาศใหม่
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append("title", title);
      form.append("body", body);
      form.append("semester", semester);

      // ✅ แปลงปี พ.ศ. → ค.ศ. ก่อนส่งให้ backend
      const christianYear = year - 543;
      form.append("academic_year", christianYear);

      // ✅ แนบหลายรูปภาพ (สูงสุด 5)
      images.forEach((img) => form.append("images", img));

      await api.post("/announcements", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ เพิ่มประกาศสำเร็จ!");
      setShowForm(false);
      setTitle("");
      setBody("");
      setImages([]);
      loadAnnouncements();
    } catch (err) {
      alert("❌ เพิ่มประกาศไม่สำเร็จ");
      console.error(err);
    }
  }

  return (
    <div className="container py-4">
      <h4 className="fw-bold mb-3">
        <i className="bi bi-megaphone-fill me-2 text-primary"></i>
        ประกาศ / ข่าวกิจกรรม
      </h4>

      {/* ปุ่มเพิ่มประกาศ */}
      {user?.type === "teacher" && (
        <div className="mb-3">
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            <i className="bi bi-plus-circle me-1"></i> เพิ่มประกาศ
          </button>
        </div>
      )}

      {/* ฟอร์มเพิ่มประกาศ */}
      {showForm && (
        <form className="card p-3 mb-4" onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">หัวข้อประกาศ</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold">เทอม</label>
              <select
                className="form-select"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              >
                <option value={1}>เทอม 1</option>
                <option value={2}>เทอม 2</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold">ปีการศึกษา (พ.ศ.)</label>
              <input
                type="number"
                className="form-control"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              />
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">รายละเอียด</label>
              <textarea
                className="form-control"
                rows={3}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
              />
            </div>

            {/* ✅ อัปโหลดหลายไฟล์ได้สูงสุด 5 รูป */}
            <div className="col-12">
              <label className="form-label fw-semibold">
                รูปภาพกิจกรรม (สูงสุด 5 รูป)
              </label>
              <input
                type="file"
                className="form-control"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  if (files.length > 5) {
                    alert("อัปโหลดได้สูงสุด 5 รูปเท่านั้น");
                    e.target.value = null;
                    return;
                  }
                  setImages(files);
                }}
              />
              {images.length > 0 && (
                <div className="mt-2 d-flex flex-wrap gap-2">
                  {images.map((img, i) => (
                    <img
                      key={i}
                      src={URL.createObjectURL(img)}
                      alt="preview"
                      style={{
                        width: "90px",
                        height: "90px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        border: "1px solid #ddd",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 text-end">
            <button
              type="button"
              className="btn btn-secondary me-2"
              onClick={() => setShowForm(false)}
            >
              ยกเลิก
            </button>
            <button type="submit" className="btn btn-success">
              <i className="bi bi-check-circle me-1"></i> บันทึกประกาศ
            </button>
          </div>
        </form>
      )}

      {/* แสดงรายการประกาศ */}
      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary"></div>
        </div>
      ) : announcements.length === 0 ? (
        <div className="alert alert-info text-center">ยังไม่มีประกาศ</div>
      ) : (
        <div className="row g-3">
          {announcements.map((a) => (
            <div key={a.announcement_id} className="col-md-6">
              <div className="card shadow-sm h-100">
                {a.image_urls &&
                  a.image_urls.split(",").map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt="กิจกรรม"
                      className="card-img-top"
                      style={{
                        height: "180px",
                        objectFit: "cover",
                        borderBottom: "1px solid #eee",
                      }}
                    />
                  ))}
                <div className="card-body">
                  <h5 className="text-primary fw-semibold">{a.title}</h5>
                  <p>{a.body}</p>
                  <small className="text-muted">
                    เทอม {a.semester} / ปี {Number(a.academic_year) + 543}
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
