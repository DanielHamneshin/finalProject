const mongoose = require("mongoose");

const teacherSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    teacher_id: {
        type: String,
        required: true,
        unique: true
    },
    courses: [{
        type: Schema.Types.ObjectId,
        ref: 'Course'
    }],
    img: {
        type: String // URL or file path of the teacher's image
    },
    role:{
        type:String,
        default:"teacher"
    }
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
