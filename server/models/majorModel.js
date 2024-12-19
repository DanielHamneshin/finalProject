const mongoose = require("mongoose");

const majorSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    courses: [{
        type: Schema.Types.ObjectId,
        ref: 'Course'
    }],
    max_choices: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Major', majorSchema);
