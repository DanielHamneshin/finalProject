const mongoose = require('mongoose');


// Student Schema
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    student_id: {
        type: String,
        required: true,
        unique: true
    },
    majortitle: {
       type: String,
       
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    enrollment_date: {
        type: Date,
        default: Date.now,
        required: true
    },
    presence:[{
        lessonNum:{
            type:Number,
            required:true
        },
        course_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Course',
            required:true,
        },
        status:{
            type:String,
            required: true,
            enum: ['present', 'absent']
        }
    }],
    tests: [{
        test_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Test'
        },
        course: {
            type: String
        },
        grade: {
            type: Number
        }
    }],
    assignments: [{
        assignment_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Assignment'
        },
        course: {
            type: String
        },
        grade: {
            type: Number
        }
    }],
    img: {
        type: Buffer // URL or file path of the student's image
    },
    role: {
        type: String,
        default: "student"
    },
    isCoursesFull:{
        type: Boolean,
        default: false
    },
    debt: {
        type: Number,
        default: 0
    }

}, { timestamps: true });


module.exports = mongoose.model('Student', studentSchema);
