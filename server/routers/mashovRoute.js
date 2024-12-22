const { getStudentAttendance, getStudentTests, getStudentAssignments } = require("../controllers/mashovController");

const router = require("express").Router();

router.get("/attendence/:userId", getStudentAttendance)
router.get("/tests/:userId", getStudentTests)
router.get("/assignments/:userId", getStudentAssignments)


module.exports = router;