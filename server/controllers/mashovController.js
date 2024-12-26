const Student = require("../models/studentModel")
const Lesson = require("../models/lessonModel")
const Major = require("../models/majorModel")
const Test = require("../models/testModel")
const Course = require("../models/courseModel")
const Assignment = require("../models/assignmentModel")
const Teacher = require("../models/teacherModel")

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
        const assignments = await Student.findById(req.params.userId).populate("assignments.assignment_id", "name").select("assignments")
        console.log(assignments);
        
        res.status(200).json(assignments)
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error })
    }
}


// teacher

exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find()
        res.status(200).json({names: students.map(student => student.name), ids: students.map(student => student._id)})
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error })
    }
}
exports.createTest = async (req, res) => {
    // body:{name,course_name,teacher_id , students{ student._id, grade}}
    try {
        const {name} = req.body
        const course = await Course.findOne({name: req.body.course_name})
        const teacher = await Teacher.findById(req.body.teacher_id)
        const newtest = new Test({name:name,teacher_id:teacher._id,course:course._id,students:req.body.students})
        await newtest.save()
       await Promise.all(newtest.students.map(async(student)=>{
                  return await Student.findByIdAndUpdate(student.student_id,{$push:{tests:{test_id:newtest._id,course:course.name,grade:student.grade}}})
               }))

        res.status(200).json(newtest)
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error })
    }
}

exports.createLesson =async(req,res)=>{
    try{
        const { course_name, teacher_id, students} = req.body
        const course = await Course.findOne({ name: course_name })
        const teacher = await Teacher.findById(teacher_id)
        const lesson = new Lesson({ course: course._id, teacher_id: teacher._id, students: students, date: Date.now() })
        await lesson.save()
        await Promise.all(lesson.students.map(async (student) => { return await Student.findByIdAndUpdate(student.student_id, { $push: { presence: { lessonNum: lesson.lessonNum, course_id: course._id, status: student.status } } }) }))
        res.status(200).json(lesson)
    }
    catch(error){
        console.log(error);
        res.status(500).json({ msg: error })
    }
}
