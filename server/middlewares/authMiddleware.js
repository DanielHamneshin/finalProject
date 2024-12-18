const jwt = require("jsonwebtoken");
const Student = require("../models/studentModel");
const Teacher = require("../models/teacherModel")



exports.auth = async (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        if (!token) {
            return res.status(401).json({ msg: "unauthorized" })
        }
        const tokenData = token.split(" ")[1];
        const decodedToken = jwt.verify(tokenData, process.env.TOKEN_SECRET_KEY);
        // req._id = decodedToken._id;
        // req.role = decodedToken.role;
        // req.isAdmin = decodedToken.isAdmin ? true : false;

        const curruntUser = (decodedToken.role == "student") ? await Student.findById(decodedToken.id) : await Teacher.findById(decodedToken.id);
        req.user = curruntUser;

        next();
    } catch (error) {
        console.error("Unauthorized: ", error.message);

        // Determine the type of error
        if (error.name === "TokenExpiredError") {
            res.status(401).json({ msg: "Unauthorized: Token expired" });
        } else if (error.name === "JsonWebTokenError") {
            res.status(401).json({ msg: "Unauthorized: Invalid token" });
        } else {
            res.status(500).json({ msg: "Internal server error" });
        }
    }
}