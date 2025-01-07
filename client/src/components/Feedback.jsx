import React, { useEffect, useState } from 'react'
import { useUserContext } from '../contexts/UserContext';
import style from '../styles/feedback.module.css'
import axios from 'axios';
import { GET_ASSIGNMENTS_URL, GET_ATTENDANCE_URL, GET_TESTS_URL } from '../constants/endPoint';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { PieChart } from '@mui/x-charts';

const Feedback = () => {
    const { user } = useUserContext();
    const navigate = useNavigate();
    const [isInGrades, setIsInGrades] = useState(true);
    const [tests, setTests] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [filterPresenceBy, setFilterPresenceBy] = useState('');
    const [presence, setPresence] = useState([]);

    const getGradeClass = (grade) => {
        const numGrade = Number(grade);
        if (numGrade < 55) return style.gradeFail;
        if (numGrade < 70) return style.gradeWarning;
        if (numGrade < 85) return style.gradeGood;
        return style.gradeExcellent;
    };

    const getPresence = async () => {
        try {
            const { data } = await axios.get(GET_ATTENDANCE_URL + user._id);
            setPresence(data);

        } catch (error) {
            console.error(error);
        }
    }

    const getTests = async () => {
        try {
            const { data } = await axios.get(GET_TESTS_URL + user._id);
            setTests(data.tests);
        } catch (error) {
            console.error(error);
        }
    }

    const getAssignments = async () => {
        try {
            const { data } = await axios.get(GET_ASSIGNMENTS_URL + user._id);
            console.log(data);
            setAssignments(data.assignments);
        } catch (error) {
            console.error(error);
        }
    }

    const calculateAttendanceStats = () => {
        const presentCount = presence.filter(record =>
            record.status.toLowerCase() === 'present'
        ).length;
        const absentCount = presence.length - presentCount;

        return [
            { id: 0, value: presentCount, label: 'Present', color: '#0a7c42' },
            { id: 1, value: absentCount, label: 'Absent', color: '#dc3545' }
        ];
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

    useEffect(() => {
        getTests();
        getAssignments();
        getPresence()
    }, [])

    return (
        <>
            <Header />
            <div className={style.container}>
                {/* Header Section */}
                <div className={style.headerPaper}>
                    <div className={style.headerContent}>
                        <div>
                            <h1>My Feedback</h1>
                            <p>Welcome, {user?.name}</p>
                        </div>
                        <button
                            onClick={() => navigate('/personal')}
                            className={style.backButton}
                        >
                            Back
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <div className={style.navigationGrid}>
                    <div
                        className={`${style.navItem} ${isInGrades ? style.active : ''}`}
                        onClick={() => setIsInGrades(true)}
                    >
                        <h2>Grades</h2>
                        <p>{tests.length + assignments.length} Items</p>
                    </div>
                    <div
                        className={`${style.navItem} ${!isInGrades ? style.active : ''}`}
                        onClick={() => setIsInGrades(false)}
                    >
                        <h2>Attendance</h2>
                        <p>{presence.length} Records</p>
                    </div>
                </div>

                {/* Charts Section */}
                <div className={style.chartsContainer}>
                    {/* Attendance Chart */}
                    <div className={style.chartBox}>
                        <h3>Attendance Overview</h3>
                        {presence.length > 0 && (
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

                    {/* Tests Chart */}
                    <div className={style.chartBox}>
                        <h3>Tests Grade Distribution</h3>
                        {tests.length > 0 && (
                            <PieChart
                                series={[
                                    {
                                        data: calculateGradeStats(tests),
                                        highlightScope: { faded: 'global', highlighted: 'item' },
                                        faded: { innerRadius: 30, additionalRadius: -30 },
                                    },
                                ]}
                                height={200}
                            />
                        )}
                    </div>

                    {/* Assignments Chart */}
                    <div className={style.chartBox}>
                        <h3>Assignments Grade Distribution</h3>
                        {assignments.length > 0 && (
                            <PieChart
                                series={[
                                    {
                                        data: calculateGradeStats(assignments),
                                        highlightScope: { faded: 'global', highlighted: 'item' },
                                        faded: { innerRadius: 30, additionalRadius: -30 },
                                    },
                                ]}
                                height={200}
                            />
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <div className={style.content}>
                    {isInGrades ? (
                        // Grades content
                        <div className={style.gradesGrid}>
                            {/* Tests Section */}
                            <h2>Tests</h2>
                            {tests.map((test, index) => (
                                <div key={index} className={style.gradeCard}>
                                    <h3>{test.test_id.name}</h3>
                                    <p>Grade: <span className={`${style.grade} ${getGradeClass(test.grade)}`}>{test.grade}</span></p>
                                    <p>Course: {test.course}</p>
                                    <p>Date: {test.test_id.createdAt.split("T")[0]}</p>
                                </div>
                            ))}

                            {/* Assignments Section */}
                            <h2>Assignments</h2>
                            {assignments.map((assignment, index) => (
                                <div key={index} className={style.gradeCard}>
                                    <h3>{assignment?.assignment_id?.title}</h3>
                                    <p>Grade: <span className={`${style.grade} ${getGradeClass(assignment.grade)}`}>{assignment?.grade || 'Not graded'}</span></p>
                                    <p>Course: {assignment?.assignment_id?.course_id?.name}</p>
                                    <p>Teacher: {assignment?.assignment_id?.course_id?.teacherName}</p>
                                </div>
                            ))}
                        </div>

                    ) : (
                        // Attendance content
                        <div className={style.attendanceGrid}>
                            {presence.map((record, index) => (
                                <div key={index} className={style.attendanceCard}>
                                    <h3>{record.date ? record.date.split("T")[0] : ""}</h3>
                                    <p>Status: <span className={`${style.status} ${record.status.toLowerCase() === 'present'
                                        ? style.statusPresent
                                        : style.statusAbsent
                                        }`}>
                                        {record.status}
                                    </span></p>
                                    <p>Course: {record.course_id.name}</p>
                                    <p>Lesson: {record.lessonNum}</p>
                                    <p>Teacher: {record.course_id.teacherName}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>


            </div>
        </>
    )
}

export default Feedback