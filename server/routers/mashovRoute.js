const { getStudentAttendance, getStudentTests, getStudentAssignments, createTest, getAllStudents } = require("../controllers/mashovController");


const router = require("express").Router();

router.get("/attendence/:userId", getStudentAttendance)
router.get("/tests/:userId", getStudentTests)
router.get("/assignments/:userId", getStudentAssignments)
router.get("/teacher/students", getAllStudents)
router.post("/teacher/test",createTest)


module.exports = router;