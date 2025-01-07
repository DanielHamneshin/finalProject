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
    const [attendanceFilters, setAttendanceFilters] = useState({
        searchText: '',
        filterBy: 'all', // 'all', 'lesson', 'teacher', 'date', 'status', 'course'
        sortDirection: 'desc'
    });
    const [testFilters, setTestFilters] = useState({
        searchText: '',
        filterBy: 'all', // 'all', 'name', 'teacher', 'date', 'grade', 'course'
        sortDirection: 'desc'
    });
    const [assignmentFilters, setAssignmentFilters] = useState({
        searchText: '',
        filterBy: 'all', // 'all', 'title', 'teacher', 'dueDate', 'grade', 'course'
        sortDirection: 'desc'
    });

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
    // Filter and sort function for attendance
    const filterAttendance = (items) => {
        return items.filter(record => {
            const searchLower = attendanceFilters.searchText.toLowerCase();
            switch (attendanceFilters.filterBy) {
                case 'lesson':
                    return record.lessonNum.toString().includes(searchLower);
                case 'teacher':
                    return record.course_id.teacherName.toLowerCase().includes(searchLower);
                case 'date':
                    return record?.date?.split('T')[0].includes(attendanceFilters.searchText);
                case 'status':
                    return record.status.toLowerCase().includes(searchLower);
                case 'course':
                    return record.course_id.name.toLowerCase().includes(searchLower);
                default:
                    return record.course_id.name.toLowerCase().includes(searchLower) ||
                        record.course_id.teacherName.toLowerCase().includes(searchLower) ||
                        record.status.toLowerCase().includes(searchLower);
            }
        }).sort((a, b) => {
            if (attendanceFilters.filterBy === 'date') {
                return attendanceFilters.sortDirection === 'desc'
                    ? new Date(b.date) - new Date(a.date)
                    : new Date(a.date) - new Date(b.date);
            }
            if (attendanceFilters.filterBy === 'lesson') {
                return attendanceFilters.sortDirection === 'desc'
                    ? b.lessonNum - a.lessonNum
                    : a.lessonNum - b.lessonNum;
            }
            return 0;
        });
    };

    // Filter function for tests
    const filterTests = (tests) => {
        return tests.filter(test => {
            const searchLower = testFilters.searchText.toLowerCase();
            switch (testFilters.filterBy) {
                case 'name':
                    return test.test_id.name.toLowerCase().includes(searchLower);
                case 'teacher':
                    return test?.test_id?.teacher?.name.toLowerCase().includes(searchLower);
                case 'date':
                    return test.test_id.createdAt.split('T')[0].includes(testFilters.searchText);
                case 'grade':
                    return test.grade.toString().includes(testFilters.searchText);
                case 'course':
                    return test.course.toLowerCase().includes(searchLower);
                default:
                    return true;
            }
        }).sort((a, b) => {
            if (testFilters.filterBy === 'date') {
                return testFilters.sortDirection === 'desc'
                    ? new Date(b.test_id.createdAt) - new Date(a.test_id.createdAt)
                    : new Date(a.test_id.createdAt) - new Date(b.test_id.createdAt);
            }
            if (testFilters.filterBy === 'grade') {
                return testFilters.sortDirection === 'desc' ? b.grade - a.grade : a.grade - b.grade;
            }
            return 0;
        });
    };

    // Filter function for assignments
    const filterAssignments = (assignments) => {
        return assignments.filter(assignment => {
            const searchLower = assignmentFilters.searchText.toLowerCase();
            switch (assignmentFilters.filterBy) {
                case 'title':
                    return assignment.assignment_id.title.toLowerCase().includes(searchLower);
                case 'teacher':
                    return assignment.assignment_id.course_id.teacherName.toLowerCase().includes(searchLower);
                case 'dueDate':
                    return assignment?.assignment_id?.dueDate?.split('T')[0].includes(assignmentFilters.searchText);
                case 'grade':
                    return assignment?.grade?.toString().includes(assignmentFilters.searchText);
                case 'course':
                    return assignment.assignment_id.course_id.name.toLowerCase().includes(searchLower);
                default:
                    return true;
            }
        }).sort((a, b) => {
            if (assignmentFilters.filterBy === 'dueDate') {
                return assignmentFilters.sortDirection === 'desc'
                    ? new Date(b.assignment_id.dueDate) - new Date(a.assignment_id.dueDate)
                    : new Date(a.assignment_id.dueDate) - new Date(b.assignment_id.dueDate);
            }
            if (assignmentFilters.filterBy === 'grade') {
                return assignmentFilters.sortDirection === 'desc' ? b.grade - a.grade : a.grade - b.grade;
            }
            return 0;
        });
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
                        <div className={style.sectionsContainer}>
                            {/* Tests Section */}
                            <div>
                                <h2>Tests</h2>
                                <div className={style.filterControls}>
                                    <select
                                        value={testFilters.filterBy}
                                        onChange={(e) => setTestFilters(prev => ({ ...prev, filterBy: e.target.value }))}
                                        className={style.filterSelect}
                                    >
                                        <option value="all">Filter By All</option>
                                        <option value="name">Test Name</option>
                                        <option value="teacher">Teacher</option>
                                        <option value="date">Date</option>
                                        <option value="grade">Grade</option>
                                        <option value="course">Course</option>
                                    </select>

                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={testFilters.searchText}
                                        onChange={(e) => setTestFilters(prev => ({ ...prev, searchText: e.target.value }))}
                                        className={style.searchInput}
                                    />

                                    <select
                                        value={testFilters.sortDirection}
                                        onChange={(e) => setTestFilters(prev => ({ ...prev, sortDirection: e.target.value }))}
                                        className={style.filterSelect}
                                    >
                                        <option value="desc">Newest First</option>
                                        <option value="asc">Oldest First</option>
                                    </select>
                                </div>
                                <div className={style.gradesGrid}>
                                    {filterTests(tests).map((test, index) => (
                                        <div key={index} className={style.gradeCard}>
                                            <h3>{test.test_id.name}</h3>
                                            <p>Grade: <span className={`${style.grade} ${getGradeClass(test.grade)}`}>{test.grade}</span></p>
                                            <p>Course: {test.course}</p>
                                            <p>Date: {test.test_id.createdAt.split("T")[0]}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Assignments Section */}
                            <div>
                                <h2>Assignments</h2>
                                <div className={style.filterControls}>
                                    <select
                                        value={assignmentFilters.filterBy}
                                        onChange={(e) => setAssignmentFilters(prev => ({ ...prev, filterBy: e.target.value }))}
                                        className={style.filterSelect}
                                    >
                                        <option value="all">Filter By All</option>
                                        <option value="title">Assignment Title</option>
                                        <option value="teacher">Teacher</option>
                                        <option value="dueDate">Due Date</option>
                                        <option value="grade">Grade</option>
                                        <option value="course">Course</option>
                                    </select>

                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={assignmentFilters.searchText}
                                        onChange={(e) => setAssignmentFilters(prev => ({ ...prev, searchText: e.target.value }))}
                                        className={style.searchInput}
                                    />

                                    <select
                                        value={assignmentFilters.sortDirection}
                                        onChange={(e) => setAssignmentFilters(prev => ({ ...prev, sortDirection: e.target.value }))}
                                        className={style.filterSelect}
                                    >
                                        <option value="desc">Newest First</option>
                                        <option value="asc">Oldest First</option>
                                    </select>
                                </div>
                                <div className={style.gradesGrid}>
                                    {filterAssignments(assignments).map((assignment, index) => (
                                        <div key={index} className={style.gradeCard}>
                                            <h3>{assignment?.assignment_id?.title}</h3>
                                            <p>Grade: <span className={`${style.grade} ${getGradeClass(assignment.grade)}`}>{assignment?.grade || 'Not graded'}</span></p>
                                            <p>Course: {assignment?.assignment_id?.course_id?.name}</p>
                                            <p>Teacher: {assignment?.assignment_id?.course_id?.teacherName}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    ) : (
                        // Attendance content
                        <>
                            {/* Attendance Filters */}
                            <div className={style.filterControls}>
                                <select
                                    value={attendanceFilters.filterBy}
                                    onChange={(e) => setAttendanceFilters(prev => ({
                                        ...prev,
                                        filterBy: e.target.value
                                    }))}
                                    className={style.filterSelect}
                                >
                                    <option value="all">Filter By All</option>
                                    <option value="lesson">Lesson Number</option>
                                    <option value="teacher">Teacher</option>
                                    <option value="date">Date</option>
                                    <option value="status">Status</option>
                                    <option value="course">Course</option>
                                </select>

                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={attendanceFilters.searchText}
                                    onChange={(e) => setAttendanceFilters(prev => ({
                                        ...prev,
                                        searchText: e.target.value
                                    }))}
                                    className={style.searchInput}
                                />

                                <select
                                    value={attendanceFilters.sortDirection}
                                    onChange={(e) => setAttendanceFilters(prev => ({
                                        ...prev,
                                        sortDirection: e.target.value
                                    }))}
                                    className={style.filterSelect}
                                >
                                    <option value="desc">Newest First</option>
                                    <option value="asc">Oldest First</option>
                                </select>
                            </div>

                            {/* Attendance Grid */}
                            <div className={style.attendanceGrid}>
                                {filterAttendance(presence).map((record, index) => (
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
                        </>
                    )}
                </div>


            </div>
        </>
    )
}

export default Feedback