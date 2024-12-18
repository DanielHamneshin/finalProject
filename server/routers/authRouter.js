const { studentRegister, studentLogin, teacherLogin, logout } = require("../controllers/authController");

const router = require("express").Router();



router.post("/register", studentRegister);

router.post("/login/student", studentLogin);

router.post("/login/teacher", teacherLogin);

router.post("/logout", logout);



module.exports = router;