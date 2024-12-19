const mongoose = require("mongoose");

const majorSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    max_choices: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Major', majorSchema);
