const { getAllMajors, getOptionalCourses, getAllCourses, UpdateCoursesInStudent } = require("../controllers/courseController");

const router = require("express").Router();
router.get("/majors", getAllMajors)
router.get("/options/:userId", getOptionalCourses)
router.get("/all/:userId/:role", getAllCourses)
router.put("/update/:userId", UpdateCoursesInStudent)

module.exports = router;