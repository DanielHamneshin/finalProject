const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Admin routes

// Students
router.get("/students", adminController.getAllStudents);
router.delete("/students/:id", adminController.removeStudent);
router.get("/students/debt", adminController.getStudentsWithDebt);
router.put("/students/:id/debt", adminController.giveStudentDebt);

// Teachers
router.get("/teachers", adminController.getAllTeachers);
router.delete("/teachers/:id", adminController.removeTeacher);

// Majors
router.post("/majors", adminController.addMajor);

// Courses
router.post("/courses", adminController.addCourse);

module.exports = router;
