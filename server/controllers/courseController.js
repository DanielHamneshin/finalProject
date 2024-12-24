const Student = require("../models/studentModel")
const Lesson  = require("../models/lessonModel")
const Major = require("../models/majorModel")
const Course = require("../models/courseModel")



// courses when not selected
exports.getAllMajors = async (req, res) => {
    try{
        
        const majors = await Major.find()
        res.status(200).json(majors.map(major => major.title))    
    }catch(error){
        console.log(error);
        
        res.status(500).json({ msg: error })
    }
}
exports.getOptionalCourses = async (req, res) => {
 
    try{
        const student = await Student.findById(req.params.userId);
        console.log(student);
        const major = await Major.findOne({title:student.majortitle})
            .populate({
                path: "courses", 
                select: "name is_mandatory" ,
                match:{is_mandatory: false}
            })
        const courses = major.courses.map(course => course.name)
        res.status(200).json({ courses, max: major.max_choices })    
    }catch(error){
        console.log("hello3");
        console.log(error);
        res.status(500).json({ msg: error })
    }    
}

// courses when selected
exports.getAllCourses = async (req, res) => {
    try{
        const role = req.body.role;
        let courses=[]
        if(role === "student"){
            const student = await Student.findById(req.params.userId);
            courses = student.courses
        }
        else if(role === "teacher"){
            const teacher = await Teacher.findById(req.params.userId);
            courses = teacher.courses
        }

        res.status(200).json(courses.map(course => course.name))    
    }catch(error){
        console.log(error);
        res.status(500).json({ msg: error })
    }
}

// apply - course
exports.UpdateCoursesInStudent = async (req, res) => {
    try{
        const student = await Student.findById(req.params.userId)
        const studentCourses = await Promise.all( student.courses.map(async(courseId)=>{
            return await Course.findById(courseId)
        }))
        const coursesToUpdate = await Promise.all( req.body.courses.map(async(courseName)=>{
            return await Course.findOne({name: courseName})
        }))
        const updateCourses = [...studentCourses,...coursesToUpdate]
        console.log("   updateCourses : " +updateCourses);
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.userId,
            { $set: { courses: updateCourses, isCoursesFull:true }},
            { new: true } 
        );
        await Promise.all( coursesToUpdate.map(async(courseId)=>{
            await Course.findByIdAndUpdate(courseId,{$push:{students_id:student._id}})
        }))
       
        res.status(200).json(updatedStudent)
    }catch(error){
        console.log(error);
        res.status(500).json({ msg: error })
    }
}
