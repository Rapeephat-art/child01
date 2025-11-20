const express = require("express");
const router = express.Router();
const { getAnnouncements, getStats, postEnroll } = require("../controllers/public.controller");

router.get("/announcements", getAnnouncements);
router.get("/stats", getStats);
router.post("/enroll", postEnroll); // public enroll form

module.exports = router;
