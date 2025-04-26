const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Admin routes

// Students
router.get("/students", adminController.getAllStudents);
router.delete("/students/:id", adminController.removeStudent);
router.get("/students/debt", adminController.getStudentsWithDebt);
router.put("/students/debt/:id", adminController.giveStudentDebt);

// Teachers
router.get("/teachers", adminController.getAllTeachers);
router.delete("/teachers/:id", adminController.removeTeacherAndReplace);

// Majors
router.post("/majors", adminController.createMajor);

// Courses
router.post("/course", adminController.craeteCourse);
router.post("/courses", adminController.createCourses);
router.get("/coureses/without-major", adminController.getCoursesWithoutMajor);
router.put("/course/add",adminController.addCourseToMajor);
module.exports = router;
