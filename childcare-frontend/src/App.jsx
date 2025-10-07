// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Enroll from "./pages/Enroll";
import Children from "./pages/Children";
import Register from "./pages/Register";
import EnrollRequests from "./pages/EnrollRequests";

import Health from "./pages/Health";          // ฟอร์มสุขภาพ (ครู)
import Attendance from "./pages/Attendance";  // ฟอร์มเช็คชื่อมาเรียน (ครู)
import MealMenu from "./pages/MealMenu";      // ฟอร์มเมนูอาหารกลางวัน (ครู)

import { useAuth } from "./context/AuthProvider";

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

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* หน้าแรก */}
        <Route
          path="/"
          element={
            <Private>
              <Dashboard />
            </Private>
          }
        />

        {/* ผู้ที่ยังไม่ล็อกอินเท่านั้น */}
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

        {/* จัดการเด็ก (ครู) */}
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

        {/* คำขอสมัครเรียน (ครู) */}
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

        {/* สมัครเรียน (ผู้ปกครอง) */}
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

        {/* สุขภาพเด็ก (ครู) */}
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

        {/* เช็คชื่อมาเรียน (ครู) */}
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

        {/* เมนูอาหารกลางวัน (ครู) */}
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

        {/* ✅ เพิ่ม alias: /menus -> /meals เพื่อให้ลิงก์เดิมทำงาน */}
        <Route path="/menus" element={<Navigate to="/meals" replace />} />

        {/* ทางลัดเก่าของหน้า measure -> /health */}
        <Route path="/health/measure" element={<Navigate to="/health" replace />} />

        {/* เส้นทางอื่น ส่งกลับหน้าแรก */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
