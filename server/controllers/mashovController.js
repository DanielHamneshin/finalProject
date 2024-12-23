const Student = require("../models/studentModel")
const Lesson = require("../models/lessonModel")
const Major = require("../models/majorModel")
const Test = require("../models/testModel")
const Course = require("../models/courseModel")
const Assignment = require("../models/assignmentModel")

//for student
exports.getStudentAttendance = async (req, res) => {
    try{
        const attendence = await Lesson.find({
            "students.student_id":req.params.userId,
            "students.status":"present"
        }).populate("course","name").populate("teacher_id", "name").select("course LessonNum date teacher_id")
        
        const absence = await Lesson.find({
            "students.student_id":req.params.userId,
            "students.status":"absent"
        }).populate("course","name").populate("teacher_id", "name").select("course LessonNum date teacher_id")

        res.status(200).json({ attendence, absence })
    }catch(error){
        console.log(error);
        res.status(500).json({ msg: error })
    }
}
exports.getStudentTests = async (req, res) => {
    try {
        const tests = await Student.findById(req.params.userId).populate("tests.test_id", "name").select("tests")
        res.status(200).json(tests)

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error })
    }
}
exports.getStudentAssignments = async(req, res) => {
    try {
        const assignments = await Student.findById(req.params.userId).populate("assignments.assignment_id", "name").select("assignments, -_id")
        console.log(assignments);
        
        res.status(200).json(assignments)
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error })
    }
}


// teacher
exports.gradeTests = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error })
    }
}