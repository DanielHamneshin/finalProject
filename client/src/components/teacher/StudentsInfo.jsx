import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { GET_ALL_STUDENTS, GET_STUDENTS_INFO } from '../../constants/endPoint';
import { useUserContext } from '../../contexts/UserContext';
import { IconButton } from '@mui/material';
import { Cancel } from '@mui/icons-material';
import style from '../../styles/teacherFeedback.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { PieChart } from '@mui/x-charts';

const StudentsInfo = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { course } = location.state;
    const { user } = useUserContext();
    const [allStudents, setAllStudents] = useState([]);
    const [studentName, setStudentName] = useState("");
    const [studentInfo, setStudentInfo] = useState(null);
    const [searchText, setSearchText] = useState("");

    const getStudentsInfo = async (student) => {
        try {
            const { data } = await axios.get(GET_STUDENTS_INFO + student._id + "/" + course._id);
            setStudentInfo(data);
        } catch (error) {
            console.error(error);
        }
    }

    const getAllStudents = async (course) => {
        try {
            const { data } = await axios.get(GET_ALL_STUDENTS + course._id);
            setAllStudents(data);
        } catch (error) {
            console.error(error);
        }
    }

    const filteredStudents = allStudents.filter(student =>
        student.name.toLowerCase().includes(searchText.toLowerCase())
    );

    useEffect(() => {
        getAllStudents(course);
    }, [])

    const getGradeStyle = (grade) => {
        if (grade >= 85) return style.gradeExcellent;
        if (grade >= 70) return style.gradeGood;
        if (grade >= 55) return style.gradeWarning;
        return style.gradeFail;
    };

    const getAttendanceStyle = (attendance) => {
        if (attendance >= 85) return style.attendanceExcellent;
        if (attendance >= 75) return style.attendanceWarning;
        return style.attendanceFail;
    };

    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'present':
                return style.gradeExcellent;
            case 'late':
                return style.gradeWarning;
            case 'absent':
                return style.gradeFail;
            default:
                return '';
        }
    };

    const handleClose = () => {
        navigate('/teacherpersonal/feedback');
    };

    const calculateGradeStats = (items) => {
        const failCount = items.filter(item => item.grade < 55).length;
        const warningCount = items.filter(item => item.grade >= 55 && item.grade < 70).length;
        const goodCount = items.filter(item => item.grade >= 70 && item.grade < 85).length;
        const excellentCount = items.filter(item => item.grade >= 85).length;

        return [
            { id: 0, value: failCount, label: 'Below 55', color: '#dc3545' },
            { id: 1, value: warningCount, label: '55-69', color: '#ffc107' },
            { id: 2, value: goodCount, label: '70-84', color: '#0056b3' },
            { id: 3, value: excellentCount, label: '85+', color: '#0a7c42' }
        ];
    };

    const calculateAttendanceStats = () => {
        const presentCount = [...studentInfo.attendence].filter(record =>
            record.status.toLowerCase() === 'present'
        ).length;
        const absentCount = studentInfo.absence.length;

        return [
            { id: 0, value: presentCount, label: 'Present', color: '#0a7c42' },
            { id: 1, value: absentCount, label: 'Absent', color: '#dc3545' }
        ];
    };

    return (
        <div className={style.modalContent}>
            <div className={style.modalHeader}>
                <div className={style.headerContent}>
                    <div>
                        <h2>Students Info</h2>
                        <p>{course.name}</p>
                    </div>
                    <button
                        className={style.backButton}
                        onClick={() => navigate('/teacherpersonal/feedback')}
                    >
                        Back to Feedback
                    </button>
                </div>
            </div>

            {!studentInfo ? (
                <>
                    <div className={style.searchContainer}>
                        <input
                            type="text"
                            placeholder="Search student..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className={style.searchInput}
                        />
                    </div>

                    <table className={style.studentsTable}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Avg Test Grade</th>
                                <th>Avg Assignment Grade</th>
                                <th>Attendance Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student) => (
                                <tr key={student._id} onClick={() => {
                                    getStudentsInfo(student);
                                    setStudentName(student.name);
                                }}>
                                    <td>{student.name}</td>
                                    <td className={getGradeStyle(Math.floor(student.avgTestGrade))}>
                                        {Math.floor(student.avgTestGrade)}
                                    </td>
                                    <td className={getGradeStyle(Math.floor(student.avgAssignmentGrade))}>
                                        {Math.floor(student.avgAssignmentGrade)}
                                    </td>
                                    <td className={getAttendanceStyle(Math.floor(student.attendancePercentage))}>
                                        {Math.floor(student.attendancePercentage)}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <div>
                    <div className={style.studentHeader}>
                        <h2>{studentName}</h2>
                        <button
                            className={style.backToList}
                            onClick={() => {
                                setStudentInfo(null)
                                setStudentName("")
                            }}
                        >
                            Back to List →
                        </button>
                    </div>

                    <div className={style.chartsContainer}>
                        <div className={style.chartBox}>
                            <h3>Tests Grade Distribution</h3>
                            {studentInfo.tests.length > 0 && (
                                <PieChart
                                    series={[
                                        {
                                            data: calculateGradeStats(studentInfo.tests),
                                            highlightScope: { faded: 'global', highlighted: 'item' },
                                            faded: { innerRadius: 30, additionalRadius: -30 },
                                        },
                                    ]}
                                    height={200}
                                />
                            )}
                        </div>

                        <div className={style.chartBox}>
                            <h3>Assignments Grade Distribution</h3>
                            {studentInfo.assignments.length > 0 && (
                                <PieChart
                                    series={[
                                        {
                                            data: calculateGradeStats(studentInfo.assignments),
                                            highlightScope: { faded: 'global', highlighted: 'item' },
                                            faded: { innerRadius: 30, additionalRadius: -30 },
                                        },
                                    ]}
                                    height={200}
                                />
                            )}
                        </div>

                        <div className={style.chartBox}>
                            <h3>Attendance Overview</h3>
                            {(studentInfo.attendence.length > 0 || studentInfo.absence.length > 0) && (
                                <PieChart
                                    series={[
                                        {
                                            data: calculateAttendanceStats(),
                                            highlightScope: { faded: 'global', highlighted: 'item' },
                                            faded: { innerRadius: 30, additionalRadius: -30 },
                                        },
                                    ]}
                                    height={200}
                                />
                            )}
                        </div>
                    </div>

                    <div className={style.infoGrid}>
                        <div className={style.infoSection}>
                            <h3>Tests</h3>
                            <ul className={style.infoList}>
                                {studentInfo.tests
                                    .sort((a, b) => new Date(b.test_id.createdAt) - new Date(a.test_id.createdAt))
                                    .map((test) => (
                                        <li key={test._id} className={style.infoItem}>
                                            <div className={style.testInfo}>
                                                <span>{test.test_id.name}</span>
                                                <span className={style.courseInfo}>{test?.course}</span>
                                            </div>
                                            <span className={`${style.grade} ${getGradeStyle(test.grade)}`}>
                                                {test.grade}
                                            </span>
                                        </li>
                                    ))}
                            </ul>
                        </div>

                        <div className={style.infoSection}>
                            <h3>Assignments</h3>
                            <ul className={style.infoList}>
                                {studentInfo.assignments
                                    .sort((a, b) => new Date(b.assignment_id.dueDate) - new Date(a.assignment_id.dueDate))
                                    .map((assignment) => (
                                        <li key={assignment._id} className={style.infoItem}>
                                            <div className={style.assignmentInfo}>
                                                <span>{assignment.assignment_id.title}</span>
                                                <span className={style.courseInfo}>{assignment?.course}</span>
                                            </div>
                                            <span className={`${style.grade} ${getGradeStyle(assignment.grade)}`}>
                                                {assignment.grade}
                                            </span>
                                        </li>
                                    ))}
                            </ul>
                        </div>

                        <div className={style.infoSection}>
                            <h3>Attendance</h3>
                            <ul className={style.infoList}>
                                {[...studentInfo.attendence, ...studentInfo.absence]
                                    .sort((a, b) => b.lessonNum - a.lessonNum)
                                    .map((lesson) => (
                                        <li key={lesson._id} className={style.infoItem}>
                                            <div className={style.attendanceInfo}>
                                                <span>Lesson {lesson.lessonNum}</span>
                                                <span className={style.courseInfo}>Course: {lesson.course_id.name}</span>
                                                {lesson.date && (
                                                    <span className={style.courseInfo}>Date: {lesson.date.split("T")[0]}</span>
                                                )}
                                            </div>
                                            <span className={`${style.grade} ${getStatusStyle(lesson.status)}`}>
                                                {lesson.status}
                                            </span>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default StudentsInfo