const { getStudentAttendance, getStudentTests, getStudentAssignments, createTest, getAllStudents, createLesson, getAllStudentsByCourse, studentInfoByCourse } = require("../controllers/mashovController");


const router = require("express").Router();

router.get("/attendence/:userId", getStudentAttendance)
router.get("/tests/:userId", getStudentTests)
router.get("/assignments/:userId", getStudentAssignments)
router.get("/admin/students", getAllStudents)
router.get("/teacher/students/:course_id", getAllStudentsByCourse)
router.get("/teacher/studentinfo/:student_id/:course_id", studentInfoByCourse)
router.post("/teacher/test",createTest)
router.post("teacher/lesson",createLesson)



module.exports = router;