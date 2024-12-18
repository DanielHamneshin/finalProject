const router = require("express").Router();
const authRouter = require("./authRouter")
const { auth } = require("../middlewares/authMiddleware")


router.use("/auth", authRouter);


router.use("/authentication", auth, (req, res) => {

    res.status(200).json(req.user)
});




module.exports = router;