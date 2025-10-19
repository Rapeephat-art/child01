// src/lib/date.js
// ฟอร์แมตวันเกิดเป็น dd/mm/yyyy (กันวันเขยื้อนด้วยโซนเวลาไทย)
export function formatDMY(value) {
  if (!value) return "-";
  const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return `${m[3]}/${m[2]}/${m[1]}`;
  const d = new Date(value);
  if (isNaN(d)) return String(value);
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Bangkok",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

// ดึง y/m/d ตามโซนเวลา
function ymd(dateLike, tz = "Asia/Bangkok") {
  const d = new Date(dateLike);
  if (isNaN(d)) return null;
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(d);
  const get = (t) => parts.find((p) => p.type === t)?.value;
  return {
    y: Number(get("year")),
    m: Number(get("month")),
    d: Number(get("day")),
  };
}
const daysInMonth = (y, m) => new Date(y, m, 0).getDate(); // m: 1-12

// คำนวณอายุเป็น {years, months, days}
export function calcAgeYMD(birth, now = new Date()) {
  const b = ymd(birth);
  const n = ymd(now);
  if (!b || !n) return null;
  if (
    b.y > n.y ||
    (b.y === n.y && b.m > n.m) ||
    (b.y === n.y && b.m === n.m && b.d > n.d)
  ) {
    return null; // อนาคต
  }
  let y = n.y - b.y;
  let m = n.m - b.m;
  let d = n.d - b.d;

  if (d < 0) {
    // ยืมวันจากเดือนก่อนหน้า
    const prevY = n.m === 1 ? n.y - 1 : n.y;
    const prevM = n.m === 1 ? 12 : n.m - 1;
    d += daysInMonth(prevY, prevM);
    m -= 1;
  }
  if (m < 0) {
    m += 12;
    y -= 1;
  }
  return { years: y, months: m, days: d };
}

// แปลงอายุเป็นข้อความไทย “x ขวบ y เดือน z วัน”
export function ageTextTH(birth) {
  const a = calcAgeYMD(birth);
  if (!a) return "-";
  const y = `${a.years} ขวบ`;
  const m = `${a.months} เดือน`;
  const d = `${a.days} วัน`;
  return `${y} ${m} ${d}`;
}

// แปลงค่าช่วงอายุจากฟอร์มให้เป็นข้อความอ่านง่าย
export function ageGroupLabel(value) {
  if (!value) return "-";
  if (value === "<3" || value === "< 3" || value === "lt3") return "ต่ำกว่า 3 ปี";
  if (value === "3" || value === "3y" || value === "3+") return "อายุ 3 ปี";
  return String(value);
}
