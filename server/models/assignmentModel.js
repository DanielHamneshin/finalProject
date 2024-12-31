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
    description: {
        type: String,
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
            type:Buffer,
            default: null
        }
    }],
    finishDate: {
        type: Date,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now()
    },
    file: {
        type: Buffer,
        required: true
    }
});

module.exports = mongoose.model('Assignment', assignmentSchema);