const { getStudentAttendance } = require("../controllers/mashovController");

const router = require("express").Router();

router.get("/attendence/:userId", getStudentAttendance)
router.get("/tests/:userId", getTests)
router.get("/assignments/:userId", getAssignments)

module.exports = router;