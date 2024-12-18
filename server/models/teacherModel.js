const mongoose = require("mongoose");

const Teacher = mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"], // Makes the field mandatory
        trim: true, // Removes leading/trailing whitespace
    },
    age: {
        type: Number,
        min: 1, // Minimum allowed age
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: [true, "user already exists"], // Ensures no two documents have the same email
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email validation
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minlength: [6, "min length is 6"], // Minimum password length
    },
    courses: [
        {
            courseName: {
                type: String,
            },
            students: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "student"
            }]
        },
    ],
    enrolledDate: {
        type: Date,
        default: Date.now,
    },
    role: {
        type: String,
        default: "teacher"
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("teacher", Teacher);