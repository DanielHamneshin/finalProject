const Student = require("../models/studentModel")
const Lesson = require("../models/lessonModel")
const Major = require("../models/majorModel")
const Test = require("../models/testModel")
const Course = require("../models/courseModel")
const Assignment = require("../models/assignmentModel")
const Teacher = require("../models/teacherModel")

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
        res.status(200).json(teachers);
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.removeTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndDelete(req.params.id);
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
        res.status(200).json(student);
    }catch (err) {
        res.status(500).json(err);
    }
}

// login
// add major with courses : geting array if courses names that nedd to be created

exports.addMajor = async (req, res) => {
    try {
        const { courses, major, teacher, max_choices } = req.body
        const majorCourses=[];
        //need to think weather we need to add an existing course to major without creating a new one
        courses.forEach(async(course) => {
            const newcourse = new Course({name:course.name, teacherName:teacher, is_mandatory:course.is_mandatory });
           await newcourse.save();
            majorCourses.push(course);
        });
        const newMajor = new Major({ title: major, courses: majorCourses, max_choices :max_choices});
        await newMajor.save();
        res.status(200).json(newMajor);
    }catch (err) {
        res.status(500).json(err);
    }
}

exports.addCourse = async (req, res) => {
    try {
        const { name, teacherName, is_mandatory } = req.body
        const newcourse = new Course({name:name, teacherName:teacherName, is_mandatory:is_mandatory });
        await newcourse.save();
        res.status(200).json(newcourse);
    }catch (err) {
        res.status(500).json(err);
    }
}

 


