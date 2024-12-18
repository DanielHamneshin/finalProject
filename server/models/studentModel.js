const mongoose = require("mongoose");

const Students = mongoose.Schema({
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
    major: {
        type: String
    },
    courses: [
        {
            coursename: {
                type: String,
            },
            attendance: {
                presentDays: {
                    type: Number,
                    default: 0,
                },
                absentDays: {
                    type: Number,
                    default: 0,
                },
            },
            assignments: [
                {
                    title: { type: String, required: true },
                    score: { type: Number, min: 0, max: 100 },
                    totalPoints: { type: Number, default: 100 },
                },
            ],
            finalGrade: {
                type: String,
                enum: ["A", "B", "C", "D", "F", "no-grade"],
                default: "no-grade",
            },
        },
    ],
    enrolledDate: {
        type: Date,
        default: Date.now,
    },
    role: {
        type: String,
        default: "student"
    },
})

module.exports = mongoose.model("student", Students)