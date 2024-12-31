const express = require("express");
const router = express.Router();
const classroomController = require("../controllers/classroomController");

// Student routes
router.get(
    "/assignments/:student_id/:course_id",
    classroomController.getAllAssignmentsByCourse
);

router.post(
    "/upload/:assignment_id/:student_id",
    classroomController.studentUploadFile
);

// Teacher routes
router.post(
    "/assignments",
    classroomController.createAssignment
);

router.put(
    "/grade/:assignment_id",
    classroomController.gradeAssignment
);

// General routes
router.get(
    "/courses/:student_id",
    classroomController.getAllCourses
);

module.exports = router;
