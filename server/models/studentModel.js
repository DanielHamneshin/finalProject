const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Student Schema
const studentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    student_id: {
        type: String,
        required: true,
        unique: true
    },
    major: {
        type: Schema.Types.ObjectId,
        ref: 'Major',
        required: true
    },
    courses: [{
        type: Schema.Types.ObjectId,
        ref: 'Course'
    }],
    attendance: [{
        type: Schema.Types.ObjectId,
        ref: 'Lesson'
    }],
    absences: [{
       type: Schema.Types.ObjectId,
        ref: 'Lesson',
    }],
    enrollment_date: {
        type: Date,
        default: Date.now,
        required: true
    },
    tests: [{
        test_id: {
            type: Schema.Types.ObjectId,
            ref: 'Test'
        },
        course: {
            type: String
        },
        grade: {
            type: Number
        }
    }],
    img: {
        type: String // URL or file path of the student's image
    },
    role: {
        type: String,
        default: "student"
    }
}, { timestamps: true });


module.exports = mongoose.model('Student', studentSchema);
