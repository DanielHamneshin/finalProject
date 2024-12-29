const mongoose = require("mongoose")
const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique:true
    },
    teacherName: {
        type: String,
        required: true,
        unique: true
    },
    students_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    }],
    is_mandatory: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

 
module.exports = mongoose.model('Course', courseSchema);
