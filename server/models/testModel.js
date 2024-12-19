const mongoose = require("mongoose")

const testSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    course_id: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
        unique: true
    },
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    students: [{
        student_id: {
            type: Schema.Types.ObjectId,
            ref: 'Student'
        },
        grade: {
            type: Number
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Test', testSchema);
