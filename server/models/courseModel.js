const mongoose = require("mongoose")
const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    students: [{
        type: Schema.Types.ObjectId,
        ref: 'Student'
    }],
    is_mandatory: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

 
module.exports = mongoose.model('Course', courseSchema);
