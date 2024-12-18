const mongoose = require("mongoose");

const Major = mongoose.Schema({
    title: {
        type: String,
    },
    courses: [{
        coursename: {
            type: String,
        },
        mustCourse: { type: Boolean }
    }],
    maxChoices: {
        type: Number,
        min: 3
    }
})

module.exports = mongoose.model("major", Major);