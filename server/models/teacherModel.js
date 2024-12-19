const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
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
    teacher_id: {
        type: String,
        required: true,
        unique: true
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    img: {
        type: String // URL or file path of the teacher's image
    },
    role: {
        type: String,
        default: "teacher"
    }
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
