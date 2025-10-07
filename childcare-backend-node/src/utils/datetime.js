// src/utils/datetime.js
export function formatDMYTH(isoString, timeZone = "Asia/Bangkok") {
  if (!isoString) return "";
  const f = new Intl.DateTimeFormat("th-TH", {
    timeZone,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(
    f.formatToParts(new Date(isoString)).map(p => [p.type, p.value])
  );
  // ได้รูปแบบ dd-MM-yyyy'T'HH.mm
  return `${parts.day}-${parts.month}-${parts.year}T${parts.hour}.${parts.minute}`;
}
