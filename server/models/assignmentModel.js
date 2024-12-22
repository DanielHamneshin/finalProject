const mongoose = require("mongoose")

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    course_id: {
       type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    teacher_id: {
       type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    students: [{
        student_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        },
        grade: {    
            type: Number ,
            default: null       
        },
        submitted: {
            type: Boolean,
            default: false
        },
        file: {
            type:String,
            required: true
        }
    }],
    finishDate: {
        type: Date,
        required: true
    },
    file: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Assignment', assignmentSchema);