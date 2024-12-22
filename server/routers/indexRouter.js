const router = require("express").Router();
const authRouter = require("./authRouter")
const { auth } = require("../middlewares/authMiddleware")
const courseRouter = require("./courseRoute")
const mashoveRouter = require("./mashovRoute")


router.use("/auth", authRouter);
router.use("/course", courseRouter);
router.use("/mashov", mashoveRouter);
router.use("/authentication", auth, (req, res) => {

    res.status(200).json(req.user)
});


module.exports = router;