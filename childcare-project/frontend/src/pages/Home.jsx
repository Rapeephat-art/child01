// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="site-wrapper">

      {/* ส่วนของคอนเทนต์ */}
      <div className="content" style={{ maxWidth: "1200px", margin: "0 auto" }}>

        <section className="hero card-panel">
          <div className="hero-left">
            <h1 className="hero-title">ระบบจัดการศูนย์พัฒนาเด็กเล็ก</h1>
          </div>

        </section>

        {/* ----------------------------- */}
        {/*       ประกาศล่าสุด           */}
        {/* ----------------------------- */}

        <h2 className="section-title">ประกาศล่าสุด</h2>

        <article className="announcement card-panel">
          <div>
            <h5>ประกาศเรื่อง: วันหยุดพิเศษ</h5>
            <p className="text-muted">
              เนื่องในโอกาสวันสำคัญ ทางศูนย์ฯ จะหยุดทำการในวันพรุ่งนี้ กรุณามารับบุตรหลานวันนี้ก่อนเวลา 15:00 น.
            </p>
            <p className="meta">โดย admin • 23/11/2568</p>
          </div>

          <div className="announcement-cta">
            <Link to="/announcements" className="btn btn-sm btn-outline-primary">
              อ่านเพิ่มเติม
            </Link>
          </div>
        </article>

      </div>

      {/* Footer */}
      <footer className="site-footer content">
        <div className="card-panel">
          <small>
             ศูนย์พัฒนาเด็กเล็กองค์การบิรหารส่วนตำบลหนองน้ำแดง ที่อยู่ 399 หมู่ 11 ต.หนองน้ำแดง อ.ปากช่อง จ.นครราชสีมา 30450 โทร 044 000 360  {new Date().getFullYear()}
          </small>
        </div>
      </footer>

    </div>
  );
}
