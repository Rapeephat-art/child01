import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Enroll from "./pages/Enroll";
import Children from "./pages/Children";
import Register from "./pages/Register";
import EnrollRequests from "./pages/EnrollRequests";

import Index from "./pages/Index";              // ✅ หน้า Index (หน้าแรกสาธารณะ)
import Health from "./pages/Health";            // ฟอร์มสุขภาพ (ครู)
import Attendance from "./pages/Attendance";    // ฟอร์มเช็คชื่อมาเรียน (ครู)
import MealMenu from "./pages/MealMenu";        // ฟอร์มเมนูอาหารกลางวัน (ครู)
import Announcement from "./pages/Announcements"; // ✅ หน้า "ประกาศ"
import MyChildren from "./pages/MyChildren";

import { useAuth } from "./context/AuthProvider";

// -----------------------------
// 🔐 ส่วนควบคุมสิทธิ์การเข้าใช้
// -----------------------------
function Private({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="container py-5">Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

function ParentOnly({ children }) {
  const { user } = useAuth();
  return user?.type === "parent" ? children : <Navigate to="/" replace />;
}

function TeacherOnly({ children }) {
  const { user } = useAuth();
  return user?.type === "teacher" ? children : <Navigate to="/" replace />;
}

function GuestOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="container py-5">Loading...</div>;
  return user ? <Navigate to="/" replace /> : children;
}

// -----------------------------
// 🧭 ส่วนหลักของแอป
// -----------------------------
export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* 🏠 หน้าแรก (Index) — สาธารณะ ไม่ต้องล็อกอิน */}
        <Route path="/" element={<Index />} />

        {/* 🏠 หน้าแดชบอร์ดจริง (ต้องล็อกอิน) */}
        <Route
          path="/dashboard"
          element={
            <Private>
              <Dashboard />
            </Private>
          }
        />

        {/* 🔓 ผู้ที่ยังไม่ได้ล็อกอิน */}
        <Route
          path="/login"
          element={
            <GuestOnly>
              <Login />
            </GuestOnly>
          }
        />
        <Route
          path="/register"
          element={
            <GuestOnly>
              <Register />
            </GuestOnly>
          }
        />
<Route
  path="/my-children"
  element={
    <Private>
      <ParentOnly>
        <MyChildren />
      </ParentOnly>
    </Private>
  }
/>

        {/* 👩‍🏫 สำหรับ "ครู" */}
        <Route
          path="/children"
          element={
            <Private>
              <TeacherOnly>
                <Children />
              </TeacherOnly>
            </Private>
          }
        />
        <Route
          path="/enroll-requests"
          element={
            <Private>
              <TeacherOnly>
                <EnrollRequests />
              </TeacherOnly>
            </Private>
          }
        />
        <Route
          path="/health"
          element={
            <Private>
              <TeacherOnly>
                <Health />
              </TeacherOnly>
            </Private>
          }
        />
        <Route
          path="/attendance"
          element={
            <Private>
              <TeacherOnly>
                <Attendance />
              </TeacherOnly>
            </Private>
          }
        />
        <Route
          path="/meals"
          element={
            <Private>
              <TeacherOnly>
                <MealMenu />
              </TeacherOnly>
            </Private>
          }
        />

        {/* 👨‍👩‍👧 สำหรับ "ผู้ปกครอง" */}
        <Route
          path="/enroll"
          element={
            <Private>
              <ParentOnly>
                <Enroll />
              </ParentOnly>
            </Private>
          }
        />

        {/* 📢 ประกาศ — ปัจจุบันอยู่หลังล็อกอิน (ครู/ผู้ปกครอง) */}
        <Route
          path="/announcements"
          element={
            <Private>
              <Announcement />
            </Private>
          }
        />

        {/* 🔄 ทางลัดเดิมให้ใช้งานได้ */}
        <Route path="/menus" element={<Navigate to="/meals" replace />} />
        <Route path="/health/measure" element={<Navigate to="/health" replace />} />

        {/* ❌ เส้นทางอื่น ส่งกลับหน้าแรก */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
