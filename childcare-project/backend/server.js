require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ensure upload dir exists
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// helper for safer app.use with diagnostics
function safeRequireRoute(relPath) {
  try {
    const route = require(relPath);
    // router can be a function (express app/router) or object that has .use/.get/.post
    const isRouterLike =
      typeof route === 'function' ||
      (route && typeof route.use === 'function' && typeof route.stack !== 'undefined') ||
      (route && typeof route.router === 'function'); // extra tolerance
    console.log(`[routes] ${relPath} -> typeof: ${typeof route}, isRouterLike: ${isRouterLike}`);
    if (!isRouterLike) {
      console.warn(`[routes] WARNING: ${relPath} does not look like an express Router/function. Got:`, route);
    }
    return route;
  } catch (err) {
    console.error(`[routes] require error for ${relPath}:`, err && err.message ? err.message : err);
    return undefined;
  }
}

// load routes (use relative paths from this file)
const authRoutes = safeRequireRoute('./routes/auth.routes');
const childrenRoutes = safeRequireRoute('./routes/children.routes');
const announcementsRoutes = safeRequireRoute('./routes/announcements.routes');
app.use('/api/announcements', announcementsRoutes);
const filesRoutes = safeRequireRoute('./routes/files.routes');

const enrollmentsRoutes = safeRequireRoute('./routes/enrollments.routes');
const enrollmentsRoutes = require('./routes/enrollments.routes');
app.use('/api/enrollments', enrollmentsRoutes);
const teacherRoutes = safeRequireRoute('./routes/teacher.routes');

const childrenClassRoutes = safeRequireRoute('./routes/children.class.routes');
const admissionRoutes = safeRequireRoute('./routes/admissions.routes');
const studentsRoutes = safeRequireRoute('./routes/students.routes');
const measurementsRoutes = safeRequireRoute('./routes/measurements.routes');
const healthRoutes = safeRequireRoute('./routes/health.routes');
const brushingsRoutes = safeRequireRoute('./routes/brushings.routes');
const milkRoutes = safeRequireRoute('./routes/milk.routes');
const lunchRoutes = safeRequireRoute('./routes/lunch.routes');
const lunchEatingRoutes = safeRequireRoute('./routes/lunchEating.routes');


const adminUsersRoutes = safeRequireRoute('./routes/admin.users.routes');

// register only valid routers
if (authRoutes) app.use('/api/auth', authRoutes);
if (childrenRoutes) app.use('/api/children', childrenRoutes);
if (announcementsRoutes) app.use('/api/announcements', announcementsRoutes);
if (filesRoutes) app.use('/api/files', filesRoutes);

if (enrollmentsRoutes) app.use('/api/enrollments', enrollmentsRoutes);
if (teacherRoutes) app.use('/api/teacher', teacherRoutes);

if (admissionRoutes) app.use('/api/admission', admissionRoutes);
if (studentsRoutes) app.use('/api/student', studentsRoutes);
if (measurementsRoutes) app.use('/api/measurements', measurementsRoutes);
if (childrenClassRoutes) app.use('/api/children', childrenClassRoutes);
if (healthRoutes) app.use('/api/health', healthRoutes);
if (brushingsRoutes) app.use('/api/brushings', brushingsRoutes);
if (lunchRoutes) app.use('/api/lunch', lunchRoutes);
if (lunchEatingRoutes) app.use('/api/lunch-eating', lunchEatingRoutes);
if (milkRoutes) app.use('/api/milk', milkRoutes);


if (adminUsersRoutes) app.use('/api/admin', adminUsersRoutes);

app.get('/ping', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
