const mongoose = require("mongoose");

const majorSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    courses: [{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Course',
        required: true
    }],
    max_choices: {
        type: Number,
        required: true,
        defaulted: 3
    }
}, { timestamps: true });

module.exports = mongoose.model('Major', majorSchema);
