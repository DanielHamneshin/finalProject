const Student = require("../models/studentModel")
const Major = require("../models/majorModel")
const Course = require("../models/courseModel")
const Assignment = require("../models/assignmentModel")
const Teacher = require("../models/teacherModel")
const assignmentModel = require("../models/assignmentModel")
// student
exports.getAllAssignmentsByCourse = async (req, res) => {
    try {
        const student = await Student.findById(req.params.student_id)
        const course = await Course.findById(req.params.course_id)
        const assignments = await Assignment.find({
            course_id: course._id,
            'students._id': student._id
        }, {
            finishDate: 1,
            title: 1,
            description: 1,
            file: 1,
            students: { $elemMatch: { _id: student._id } }, // Include only the specific student
        })
        res.status(200).json(assignments)
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error })
    }
}
// upload file for student
exports.studentUploadFile = async (req, res) => {
    try {
        const binaryFile = Buffer.from(req.body.file, 'base64');
        let assignment = await Assignment.updateOne({
            _id: req.params.assignment_id,
            'students._id': req.params.student_id
        }, {
            $set: {
                'students.$.file': binaryFile,
                'students.$.submitted': true
            }
        })
        const finalAssignment = await Assignment.findById(req.params.assignment_id)


        // const fileBuffer = Buffer.from(req.body.file, 'base64')

        // const updatedAssignment = await Assignment.findOneAndUpdate(
        //     {
        //         _id: assignment._id,
        //         'students.student_id': student._id, 
        //     },
        //     {
        //         $set: {
        //             'students.$.file': fileBuffer, // Update the file field for the specific student
        //             'students.$.submitted': true, // Mark the assignment as submitted
        //         },
        //     },
        //     { new: true } // Return the updated document
        // );
        res.status(200).json(finalAssignment)
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error })
    }
}

//teacher
//upload task for teacher
exports.createAssignment = async (req, res) => {

    try {
        const { title, coures_id, teacher_id, finishDate, file } = req.body
        const course = await Course.findById(coures_id)
        const students = course.students_id
        const binaryFile = Buffer.from(file, 'base64');
        const assignment = new Assignment({
            title: title,
            course_id: coures_id,
            teacher_id: teacher_id,
            finishDate: finishDate,
            file: binaryFile,
            students: students
        })
        await assignment.save()

        res.status(200).json(assignment);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error })
    }
}

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({ "students_id": req.params.student_id })
        res.status(200).json(courses)
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error })
    }
}

exports.gradeAssignment = async (req, res) => {
    //{student_id,grade}
    try {
        const assignmentId = req.params.assignment_id;
        const { student_id, grade } = req.body
        // Find the assignment
        const assignment = await Assignment.findOne({ _id: assignmentId, "students._id": student_id });
        console.log(assignment)
        if (!assignment) {
            return res.status(404).json({ msg: "Assignment not found" });
        }
        // Check if the assignment deadline has passed
        if (Date.now() <= new Date(assignment.finishDate)) {
            return res.status(400).json({ msg: "Assignment not finished yet" });
        }
        console.log(grade);


        const updatedAssignment = await Assignment.updateOne({
            _id: assignmentId,
            'students._id': student_id
        }, {
            $set: {
                'students.$.grade': grade
            }
        })
        // update the student assignment array
        const course = await Course.findById(assignment.course_id)
        await Student.updateOne(
            { _id: student_id },
            {
                $push: {
                    assignments: {
                        assignment_id: assignmentId,
                        grade: grade,
                        course_id: course._id
                    }
                }
            }
        );

        res.status(200).json(updatedAssignment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
};
