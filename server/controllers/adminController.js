const Student = require("../models/studentModel")
const Lesson = require("../models/lessonModel")
const Major = require("../models/majorModel")
const Test = require("../models/testModel")
const Course = require("../models/courseModel")
const Assignment = require("../models/assignmentModel")
const Teacher = require("../models/teacherModel")
const { mailSender } = require("../mailSender")
const createTeacher = require("../controllers/authController").createTeacher

exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (err) {
        res.status(500).json(err);
    }
}
exports.getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find();
        console.log(teachers)
        res.status(200).json(teachers);
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.removeTeacherAndReplace = async (req, res) => {
    try {
        const { replace } = req.body// student_id
        const teacherReplace = await Teacher.findById(replace)
        const teacher = await Teacher.findById(req.params.id);
        console.log(teacher)
        const teacherCourses = teacher.courses
        console.log(teacherCourses)
        await Teacher.UpdateOne({ _id: teacherReplace._id }, { $push: { courses: teacherCourses } })
        const courses = await Course.updateMany({ teacherName: teacher.name }, { $set: { teacherName: teacherReplace.name } });
        console.log(courses)
        await Assignment.updateMany({ teacher_id: teacher._id }, { $set: { teacher_id: teacherReplace._id } });
        await Lesson.updateMany({ teacher_id: teacher._id }, { $set: { teacher_id: teacherReplace._id } });
        res.status(200).json(teacher);
    } catch (err) {
        res.status(500).json(err);
    }
}
exports.removeStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        res.status(200).json(student);
    } catch (err) {
        res.status(500).json(err);
    }
}
exports.getStudentsWithDebt = async (req, res) => {
    try {
        const students = await Student.find({ debt: { $gt: 0 } }).select("_id email name debt");
        // need to send an email to students
        res.status(200).json(students);
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.giveStudentDebt = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate({ _id: req.params.id }, { $set: { debt: req.body.debt } });
        mailSender(student.email, "Debt Update", req.body.debt ? `Your debt has been updated to ${req.body.debt}` : "Your debt has been cleared");
        res.status(200).json(student);
    } catch (err) {
        res.status(500).json(err);
    }
}

// login
// add major with courses : geting array if courses names that nedd to be created
//finished
exports.addMajor = async (req, res) => {
    try {
        const { courses, major, teacher, max_choices } = req.body
        // Find existing courses by their IDs
        const courseIds = courses.map(course => course._id);
        const existingCourses = await Course.find({ _id: { $in: courseIds } });

        if (existingCourses.length !== courses.length) {
            return res.status(400).json({ msg: "Some courses were not found" });
        }
        //need to think weather we need to add an existing course to major without creating a new one
        const newMajor = new Major({
            title: major,
            courses: courseIds,
            max_choices: max_choices
        });

        await newMajor.save();
        res.status(200).json(newMajor);
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.addCourse = async (req, res) => {
    try {
        const { name, teacher_id, is_mandatory } = req.body
        const teacher = await Teacher.findById(teacher_id)
        const newCourse = new Course({
            name: name,
            teacherName: teacher.name,
            is_mandatory: is_mandatory
        })
        await newCourse.save()
        res.status(200).json(newCourse)
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.addCourses = async (req, res) => {
    try {
        const { names, teacher_id, is_mandatory } = req.body
        const teacher = await Teacher.findById(teacher_id);
        const newCourses = [];
        await Promise.all(names.map(async (name) => {
            const newCourse = new Course({
                name: name,
                teacherName: teacher.name,
                is_mandatory: is_mandatory
            });
            await newCourse.save();
            newCourses.push(newCourse._id);
        }));
        // Add all new courses to teacher's courses array
        await Teacher.findByIdAndUpdate(
            teacher_id,
            { $push: { courses: { $each: newCourses } } }
        );
        res.status(200).json(newcourse);
    } catch (err) {
        res.status(500).json(err);
    }
}




