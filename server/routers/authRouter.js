const { studentRegister, studentLogin, teacherLogin, logout, createTeacher, adminLogin, createAdmin } = require("../controllers/authController");

const router = require("express").Router();



router.post("/register", studentRegister);

router.post("/login/student", studentLogin);

router.post("/login/teacher", teacherLogin);

router.post("/teacher/create", createTeacher);

router.post("/login/admin", adminLogin);

router.post("/logout", logout);

router.post("/admin/create", createAdmin);


module.exports = router;