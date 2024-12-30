const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    lessonNum: {
        type: Number,
        unique: true // Ensures no duplicate lesson numbers
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,    
        ref: 'Course',
       required: true
    },
    teacher_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    students: [{
        student_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: ['present', 'absent']
        },
    }],
    date: {
        type: Date,
        required: true,
        default: Date.now(),
        validate: {
            validator: function (value) {
                const now = new Date();
                const tolerance = 3000; 
                return value.getTime() >= now.getTime() - tolerance;
            },
            message: props => `Lesson date (${props.value}) cannot be earlier than the current time!`
        }
    }
}, { timestamps: true });

// Pre-save hook to auto-generate lessonNum
lessonSchema.pre('save', async function (next) {
    if (!this.lessonNum) {
        try {
            const maxLesson = await mongoose.model('Lesson').findOne().sort({ lessonNum: -1 });
            this.lessonNum = maxLesson ? maxLesson.lessonNum + 1 : 1; // Start from 1 if no lessons exist
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

module.exports = mongoose.model('Lesson', lessonSchema);
