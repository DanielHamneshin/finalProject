const Student = require("../models/studentModel");
const Major = require("../models/majorModel");
const Teacher = require("../models/teacherModel")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.studentRegister = async (req, res) => {
    const { email, password, passwordagain, major } = req.body;

    try {
        // Validate input
        if (!email || !password || !passwordagain || !major) {
            console.log("Validation failed: missing fields");
            console.log({ email, password, passwordagain });
            return res.status(400).json({ msg: "Missing required fields" });
        }

        if (password !== passwordagain) {
            return res.status(400).json({ msg: "Passwords do not match" });
        }

        // Check if email already exists
        const isEmailExists = await Student.findOne({ email: email });
        if (isEmailExists) {
            return res.status(400).json({ msg: "User already exists" });
        }

        // Find the major and populate only mandatory courses
        const currentMajor = await Major.findOne({ title: major }).populate({
            path: "courses",
            match: { is_mandatory: true },
            select: "_id",
        });

        if (!currentMajor) {
            return res.status(404).json({ msg: "Major not found" });
        }

        // Extract mandatory course IDs
        const mustCourses = currentMajor.courses.map((course) => course._id);

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new student
        const newStudent = new Student({
            ...req.body,
            password: hashedPassword,
            courses: mustCourses,
            student_id: Date.now().toString(),
        });

        // Save the student
        await newStudent.save();

        res.status(200).json({ msg: "User created successfully" });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ msg: error.message });
    }
};


exports.studentLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: "fill all fields" });
        }
        const user = await Student.findOne({ email: email })

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ msg: "invalid email or password" })
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.TOKEN_SECRET_KEY, { expiresIn: "30d" });

        res.cookie("access_token", "Bearer " + token, {
            httpOnly: true, // Secure the cookie (can't be accessed via JavaScript)
            secure: true, // Use secure cookies in production
            sameSite: "none"
        })


        res.status(200).json(user)

    } catch (error) {
        console.error("error login " + error);
        res.status(500).json({ msg: error })
    }
}

exports.teacherLogin = async (req, res) => {
    try {
        const { email, password, teacherPassword } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: "fill all fields" });
        }
        const user = await Teacher.findOne({ email: email })
        if (!user || !(await bcrypt.compare(password, user.password)) || teacherPassword !== process.env.TEACHER_PASSWORD) {
            return res.status(400).json({ msg: "invalid email or password" })
        }

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin, role: user.role }, process.env.TOKEN_SECRET_KEY, { expiresIn: "30d" });

        res.cookie("access_token", "Bearer " + token, {
            httpOnly: true, // Secure the cookie (can't be accessed via JavaScript)
            secure: true, // Use secure cookies in production
            sameSite: "none"
        })


    } catch (error) {
        console.error("error login " + error);
        res.status(500).json({ msg: error })
    }
}

exports.logout = (req, res) => {
    try {
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: true,
            sameSite: "none", // or "lax" depending on your use case
            path: "/"
        });
        console.log("cookies cleared");
        res.status(200).json({ msg: "loggedout" });
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
}