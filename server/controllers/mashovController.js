const Student = require("../models/studentModel");
const Lesson = require("../models/lessonModel");
const Major = require("../models/majorModel");
const Test = require("../models/testModel");
const Course = require("../models/courseModel");
const Assignment = require("../models/assignmentModel");
const Teacher = require("../models/teacherModel");

//for student
exports.getStudentAttendance = async (req, res) => {
  try {
    const student = await Student.findById(req.params.userId)
      .populate("presence.course_id", "name teacherName")
      .select("presence");

    // const attendence = student.presence.filter(record => record.status === 'present');
    //const absence = student.presence.filter(record => record.status === 'absent');

    res.status(200).json(student.presence);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
};
exports.getStudentTests = async (req, res) => {
  try {
    const tests = await Student.findById(req.params.userId)
      .populate("tests.test_id", "name createdAt")
      .select("tests");
    res.status(200).json(tests);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
};
exports.getStudentAssignments = async (req, res) => {
  try {
    const assignments = await Student.findById(req.params.userId)
      .populate({
        path: "assignments.assignment_id",
        select: "title course_id",
        populate: {
          path: "course_id",
          select: "name teacherName"
        }
      }).select("assignments");

    console.log(assignments);


    res.status(200).json(assignments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
};

// teacher
exports.getTeacherCourses = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.userId);
    console.log(teacher);
    console.log(teacher.courses);

    const courses = await Promise.all(
      teacher.courses.map(async (courseId) => {
        return await Course.findById(courseId).select("name _id");
      })
    );
    res.status(200).json(courses);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
};
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res
      .status(200)
      .json({
        names: students.map((student) => student.name),
        ids: students.map((student) => student._id),
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
};
exports.getAllStudentsByCourse = async (req, res) => {
  // params: course_id
  try {
    const course = await Course.findById(req.params.course_id);
    const students = await Promise.all(
      course.students_id.map(async (studentId) => {
        const student = await Student.findById(studentId)
          .select("name _id email tests assignments presence");

        // Calculate average grade for tests
        const testGrades = student.tests.map(test => test.grade);
        const avgTestGrade = testGrades.length > 0 ? (testGrades.reduce((a, b) => a + b, 0) / testGrades.length).toFixed(2) : 0;

        // Calculate average grade for assignments
        const assignmentGrades = student.assignments.map(assignment => assignment.grade);
        const avgAssignmentGrade = assignmentGrades.length > 0 ? (assignmentGrades.reduce((a, b) => a + b, 0) / assignmentGrades.length).toFixed(2) : 0;

        // Calculate attendance percentage
        const totalClasses = student.presence.length;
        const attendedClasses = student.presence.filter(record => record.status === 'present').length;
        const attendancePercentage = totalClasses > 0 ? ((attendedClasses / totalClasses) * 100).toFixed(2) : 0;

        return {
          name: student.name,
          _id: student._id,
          email: student.email,
          avgTestGrade,
          avgAssignmentGrade,
          attendancePercentage
        };
      })
    );
    res.status(200).json(students);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
};

exports.studentInfoByCourse = async (req, res) => {
  try {

    const course = await Course.findById(req.params.course_id);
    const student = await Student.findById(req.params.student_id)
      .populate("tests.test_id", "name")
      .select("presence tests assignments")
      .populate("presence.course_id", "name")
      .populate("assignments.assignment_id", "title")
    const tests = student.tests.filter((test) => test.course == course.name);
    console.log(student.assignments)
    const assignments = student.assignments.filter(
      (assignment) => assignment.course == course.name
    );
    const attendence = student.presence.filter(
      (lesson) =>
        lesson.course_id._id.toString() == course._id.toString() &&
        lesson.status == "present"
    );
    const absence = student.presence.filter(
      (lesson) =>
        lesson.course_id._id.toString() == course._id.toString() &&
        lesson.status == "absent"
    );
    console.log(assignments);

    res.status(200).json({ tests, assignments, attendence, absence });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
};

exports.createTest = async (req, res) => {
  // body:{name,course_name,teacher_id , students{ student._id, grade}}
  try {
    const { name, teacher_id } = req.body;
    console.log(req.body);

    const course = await Course.findOne({ name: req.body.course_name });
    const teacher = await Teacher.findById(req.body.teacher);
    const newtest = new Test({
      name: name,
      teacher: teacher_id,
      course: course._id,
      students: req.body.students,
    });
    await newtest.save();
    await Promise.all(
      newtest.students.map(async (student) => {
        return await Student.findByIdAndUpdate(student._id, {
          $push: {
            tests: {
              test_id: newtest._id,
              course: course.name,
              grade: student.grade,
            },
          },
        });
      })
    );
    console.log(newtest);
    res.status(200).json(newtest);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
};

exports.createLesson = async (req, res) => {
  try {
    console.log("hi");
    const { course_name, teacher_id, students } = req.body;
    const course = await Course.findOne({ name: course_name });
    const teacher = await Teacher.findById(teacher_id);
    const students1 = students.map((student) => {
      return { ...student, student_id: student._id };
    });
    const lesson = new Lesson({
      course: course._id,
      teacher_id: teacher._id,
      students: students1,
      date: Date.now(),
    });
    await lesson.save();


    await Promise.all(
      lesson.students.map(async (student) => {
        return await Student.findByIdAndUpdate(student.student_id, {
          $push: {
            presence: {
              lessonNum: lesson.lessonNum,
              course_id: course._id,
              status: student.status,
              date: lesson.date,
            },
          },
        });
      })
    );
    res.status(200).json(lesson);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
};

exports.getLastThree = async (req, res) => {
  try {
    const userId = req.params.userId;
    const student = await Student.findById(userId)
      .populate({
        path: "presence.course_id",
        select: "name teacherName"
      })
      // Populate tests with test info and course info
      .populate({
        path: "tests.test_id",
        select: "name createdAt teacher",
        populate: {
          path: "teacher",
          select: "name"
        }
      })
      // Populate assignments with assignment info and course info
      .populate({
        path: "assignments.assignment_id",
        select: "title course_id",
        populate: {
          path: "course_id",
          select: "name teacherName"
        }
      });
    const lessons = student.presence
      .sort((a, b) => b.date - a.date)
      .slice(0, 3);

    const tests = student.tests
      .sort((a, b) => b.date - a.date)
      .slice(0, 3);

    const assignments = student.assignments
      .sort((a, b) => b.date - a.date)
      .slice(0, 3);

    res.status(200).json({ lessons, tests, assignments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
};



