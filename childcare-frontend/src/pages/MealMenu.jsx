// src/pages/MealMenu.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";

const thWeekdays = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];

// ✅ แปลงวันที่แบบ local (ไม่ใช้ toISOString)
function ymdLocal(d){
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  const day = String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
}

function toTHDate(d) {
  const dd = String(d.getDate()).padStart(2,"0");
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const yyyy = d.getFullYear()+543;
  return `${dd}/${mm}/${yyyy}`;
}
function monthRange(year, month) {
  const start = new Date(year, month, 1);
  const end   = new Date(year, month+1, 0);
  return [start, end];
}
function toInputDate(d){
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const dd = String(d.getDate()).padStart(2,"0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export default function MealMenu(){
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-11

  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // ฟอร์ม: ช่องกรอกเอง 6 ประเภท + หมายเหตุ
  const [form, setForm] = useState({
    menu_date: toInputDate(today),
    rice: "",   // ประเภทข้าว
    stir: "",   // ประเภทผัด
    soup: "",   // ประเภทต้ม
    fry: "",    // ประเภททอด
    fruit: "",  // ผลไม้
    snack: "",  // ขนม
    note : "",  // หมายเหตุ
  });

  // วันทั้งเดือน
  const days = useMemo(()=>{
    const [s,e] = monthRange(year, month);
    const arr = [];
    for(let d = new Date(s); d <= e; d.setDate(d.getDate()+1)){
      arr.push(new Date(d));
    }
    return arr;
  },[year, month]);

  // map date -> menu
  const menuByDate = useMemo(()=>{
    const m = {};
    (menus || []).forEach(x => m[x.menu_date] = x);
    return m;
  },[menus]);

  async function loadMonth(){
    try{
      setLoading(true);
      setErr("");
      const y = year;
      const m = month + 1;
      const { data } = await api.get(`/menus?year=${y}&month=${m}`);
      setMenus(data || []);
    }catch(e){
      setErr(e?.response?.data?.message || "โหลดเมนูเดือนไม่สำเร็จ");
    }finally{
      setLoading(false);
    }
  }

  useEffect(()=>{ loadMonth(); },[year, month]);

  function prevMonth(){
    const d = new Date(year, month, 1);
    d.setMonth(d.getMonth()-1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  }
  function nextMonth(){
    const d = new Date(year, month, 1);
    d.setMonth(d.getMonth()+1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  }

  // ✅ ใช้ ymdLocal แทน toISOString
  function onPickDate(d){
    const iso = ymdLocal(d);
    const cur = menuByDate[iso];
    const parsed = parseItems(cur?.items || "");
    setForm({
      menu_date: iso,
      rice : parsed.rice  || "",
      stir : parsed.stir  || "",
      soup : parsed.soup  || "",
      fry  : parsed.fry   || "",
      fruit: parsed.fruit || "",
      snack: parsed.snack || "",
      note : cur?.note    || "",
    });
  }

  // รวมข้อความ 6 ช่องเป็นสตริงเดียว
  function composeItems(f){
    const parts = [];
    if (f.rice)  parts.push(`ข้าว: ${f.rice}`);
    if (f.stir)  parts.push(`ผัด: ${f.stir}`);
    if (f.soup)  parts.push(`ต้ม: ${f.soup}`);
    if (f.fry)   parts.push(`ทอด: ${f.fry}`);
    if (f.fruit) parts.push(`ผลไม้: ${f.fruit}`);
    if (f.snack) parts.push(`ขนม: ${f.snack}`);
    return parts.join(" / ");
  }

  // แยกกลับเป็นช่อง ๆ
  function parseItems(str){
    const out = { rice:"", stir:"", soup:"", fry:"", fruit:"", snack:"" };
    str.split("/").map(s=>s.trim()).forEach(seg=>{
      if (seg.startsWith("ข้าว:"))   out.rice  = seg.replace("ข้าว:","").trim();
      if (seg.startsWith("ผัด:"))    out.stir  = seg.replace("ผัด:","").trim();
      if (seg.startsWith("ต้ม:"))    out.soup  = seg.replace("ต้ม:","").trim();
      if (seg.startsWith("ทอด:"))    out.fry   = seg.replace("ทอด:","").trim();
      if (seg.startsWith("ผลไม้:"))  out.fruit = seg.replace("ผลไม้:","").trim();
      if (seg.startsWith("ขนม:"))    out.snack = seg.replace("ขนม:","").trim();
    });
    return out;
  }

  async function save(){
    try{
      setErr("");
      if(!form.menu_date){
        setErr("โปรดระบุวันที่");
        return;
      }
      const items = composeItems(form);

      await api.post("/menus", {
        menu_date: form.menu_date,  // YYYY-MM-DD แบบ local
        food_id  : null,            // ไม่ใช้แล้วในรูปแบบนี้
        items    : items || null,
        note     : form.note || null,
      });
      await loadMonth();
    }catch(e){
      setErr(e?.response?.data?.message || "บันทึกไม่สำเร็จ");
    }
  }

  async function remove(dateStr){
    if(!confirm("ลบเมนูของวันนี้?")) return;
    try{
      await api.delete(`/menus/${dateStr}`);
      await loadMonth();
    }catch(e){
      alert(e?.response?.data?.message || "ลบไม่สำเร็จ");
    }
  }

  const titleTH = (() => {
    const thMonths = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
    return `${thMonths[month]} ${year + 543}`;
  })();

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">
          <i className="bi bi-journal-text me-2" />
          จัดการเมนูอาหารกลางวัน
        </h4>
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-outline-secondary btn-sm" onClick={prevMonth}>
            <i className="bi bi-chevron-left" />
          </button>
          <div className="fw-semibold">{titleTH}</div>
          <button className="btn btn-outline-secondary btn-sm" onClick={nextMonth}>
            <i className="bi bi-chevron-right" />
          </button>
        </div>
      </div>

      {err && <div className="alert alert-danger">{err}</div>}

      {/* ฟอร์มบันทึก/แก้ไขของวันเดียว */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-md-3">
              <label className="form-label">วันที่</label>
              <input
                type="date"
                className="form-control"
                value={form.menu_date}
                onChange={e=>setForm(f=>({ ...f, menu_date: e.target.value }))}
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">ข้าว</label>
              <input
                className="form-control"
                placeholder="เช่น ข้าวสวย / ข้าวมัน"
                value={form.rice}
                onChange={e=>setForm(f=>({ ...f, rice: e.target.value }))}
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">ผัด</label>
              <input
                className="form-control"
                placeholder="เช่น ผัดผักรวม, ผัดถั่วงอก"
                value={form.stir}
                onChange={e=>setForm(f=>({ ...f, stir: e.target.value }))}
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">ต้ม</label>
              <input
                className="form-control"
                placeholder="เช่น ต้มจืด, ต้มยำ"
                value={form.soup}
                onChange={e=>setForm(f=>({ ...f, soup: e.target.value }))}
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">ทอด</label>
              <input
                className="form-control"
                placeholder="เช่น ไก่ทอด, ปลาทอด"
                value={form.fry}
                onChange={e=>setForm(f=>({ ...f, fry: e.target.value }))}
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">ผลไม้</label>
              <input
                className="form-control"
                placeholder="เช่น แอปเปิ้ล, กล้วย"
                value={form.fruit}
                onChange={e=>setForm(f=>({ ...f, fruit: e.target.value }))}
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">ขนม</label>
              <input
                className="form-control"
                placeholder="เช่น ขนมปัง, วุ้น"
                value={form.snack}
                onChange={e=>setForm(f=>({ ...f, snack: e.target.value }))}
              />
            </div>

            <div className="col-12">
              <label className="form-label">หมายเหตุ</label>
              <input
                className="form-control"
                value={form.note}
                onChange={e=>setForm(f=>({ ...f, note: e.target.value }))}
              />
            </div>
          </div>

          <div className="mt-3 d-flex gap-2">
            <button className="btn btn-primary" onClick={save}>
              <i className="bi bi-check2-circle me-1" />
              บันทึกเมนู
            </button>
            {!!form.menu_date && menuByDate[form.menu_date] && (
              <button className="btn btn-outline-danger" onClick={()=>remove(form.menu_date)}>
                <i className="bi bi-trash me-1" />
                ลบเมนูวันนี้
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ตารางทั้งเดือน */}
      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="py-4 text-center"><div className="spinner-border" role="status" /></div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th style={{width:80}}>ลำดับ</th>
                    <th style={{width:180}}>ว/ด/ป</th>
                    <th>รายการ</th>
                    <th style={{width:200}}>หมายเหตุ</th>
                    <th style={{width:140}} className="text-end">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {days.map((d, idx)=>{
                    const iso = ymdLocal(d); // ✅ ใช้ local
                    const row = menuByDate[iso];
                    const weekday = thWeekdays[d.getDay()];
                    const dispDate = `${weekday} ${toTHDate(d)}`;
                    return (
                      <tr key={iso}>
                        <td>#{idx+1}</td>
                        <td>{dispDate}</td>
                        <td>
                          <div className="fw-semibold">
                            {row?.items ? row.items : <span className="text-muted">— ยังไม่ระบุเมนู —</span>}
                          </div>
                        </td>
                        <td>{row?.note || <span className="text-muted">—</span>}</td>
                        <td className="text-end">
                          <button className="btn btn-sm btn-outline-primary me-2" onClick={()=>onPickDate(d)}>
                            <i className="bi bi-pencil-square me-1" />
                            เลือกแก้ไข
                          </button>
                          {row && (
                            <button className="btn btn-sm btn-outline-danger" onClick={()=>remove(iso)}>
                              <i className="bi bi-trash me-1" />
                              ลบ
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="text-muted small">
                * ระบบจะบันทึกเป็นสตริงรวม เช่น <code>ข้าว: ข้าวสวย / ผัด: ผัดผัก / ต้ม: ต้มจืด / …</code>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
