// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminAnnouncements from './pages/AdminAnnouncements';
import AnnouncementForm from './pages/AnnouncementForm';
import AnnouncementDetail from './pages/AnnouncementDetail';
import Announcements from './pages/Announcements'; // ผู้ปกครอง

import Children from "./pages/Children";
import ChildDetail from "./pages/ChildDetail";

import Enrollment from "./pages/Enrollment";
import Admission from "./pages/Admission";
import StudentRecord from "./pages/StudentRecord";
import ChildrenInClass from './pages/ChildrenInClass';

import CheckinPage from './pages/Checkin';
import MeasurementsPage from './pages/Measurements';
import HealthPage from './pages/Health';
import BrushingsPage from './pages/Brushings';
import MilkPage from './pages/Milk';
import LunchPage from './pages/Lunch';
import LunchEating from "./pages/LunchEating";

import AdminUsers from './pages/AdminUsers';
import EnrollmentsList from './pages/EnrollmentsList';
import EnrollmentDetail from "./pages/EnrollmentDetail";
import AdminEnrollments from './pages/AdminEnrollments';
import ChildrenCount from './pages/ChildrenCount';
import AdminMenus from "./pages/AdminMenus";
import AdminDailyMenu from './pages/AdminDailyMenu';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  function handleLogout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <div>
      <NavBar user={user} onLogout={handleLogout} />
      <div className="site-wrapper">
        <Routes>
          {/* Public / Parent */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/announcements" element={<Announcements />} />

          {/* Admin - Announcements (list / create / detail / edit) */}
          <Route path="/admin/announcements" element={<AdminAnnouncements />} />
          <Route path="/admin/announcements/new" element={<AnnouncementForm />} />
          <Route path="/admin/announcements/:id" element={<AnnouncementDetail />} />
          <Route path="/admin/announcements/:id/edit" element={<AnnouncementForm />} />

          {/* Children */}
          <Route path="/children" element={<Children />} />
          <Route path="/children/:id" element={<ChildDetail />} />

          {/* Enrollment / Admission / Records */}
          <Route path="/enroll" element={<Enrollment />} />
          <Route path="/admission" element={<Admission />} />
          <Route path="/record" element={<StudentRecord />} />

          {/* Teacher area */}
          <Route path="/teacher/children" element={<ChildrenInClass />} />
          <Route path="/teacher/checkin" element={<CheckinPage />} />
          <Route path="/teacher/:teacherId/checkin" element={<CheckinPage />} />
          <Route path="/teacher/measurements" element={<MeasurementsPage />} />
          <Route path="/teacher/:teacherId/measurements" element={<MeasurementsPage />} />
          <Route path="/teacher/health" element={<HealthPage />} />
          <Route path="/teacher/:teacherId/health" element={<HealthPage />} />
          <Route path="/teacher/brushings" element={<BrushingsPage />} />
          <Route path="/teacher/:teacherId/brushings" element={<BrushingsPage />} />
          <Route path="/teacher/lunch" element={<LunchPage />} />
          <Route path="/teacher/:teacherId/lunch" element={<LunchPage />} />
          <Route path="/teacher/lunch-eating" element={<LunchEating />} />
          <Route path="/teacher/:teacherId/lunch-eating" element={<LunchEating />} />
          <Route path="/teacher/milk" element={<MilkPage />} />
          <Route path="/teacher/:teacherId/milk" element={<MilkPage />} />

          {/* Enrollments */}
          <Route path="/enrollments" element={<EnrollmentsList />} />
          <Route path="/enrollments/:id" element={<EnrollmentDetail />} />
          <Route path="/admin/enrollments" element={<AdminEnrollments />} />


          {/* Admin users */}
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/children-count" element={<ChildrenCount />} />
          <Route path="/admin/menus" element={<AdminMenus />} />
          <Route path="/admin/daily-menu" element={<AdminDailyMenu />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
