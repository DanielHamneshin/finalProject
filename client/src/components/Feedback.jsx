import React, { useEffect, useState } from 'react'
import { useUserContext } from '../contexts/UserContext';
import style from '../styles/feedback.module.css'
import axios from 'axios';
import { GET_ASSIGNMENTS_URL, GET_ATTENDANCE_URL, GET_TESTS_URL } from '../constants/endPoint';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const Feedback = () => {
    const { user } = useUserContext();
    const navigate = useNavigate();
    const [isInGrades, setIsInGrades] = useState(true);
    const [tests, setTests] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [filterPresenceBy, setFilterPresenceBy] = useState('');
    const [presence, setPresence] = useState([]);

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
            setAssignments(data.assignments);
        } catch (error) {
            console.error(error);
        }
    }




    useEffect(() => {
        getTests();
        getAssignments();
        getPresence()
    }, [])

    console.log(tests);
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
                        <p>{tests.length} Tests</p>
                    </div>
                    <div
                        className={`${style.navItem} ${!isInGrades ? style.active : ''}`}
                        onClick={() => setIsInGrades(false)}
                    >
                        <h2>Attendance</h2>
                        <p>{presence.length} Records</p>
                    </div>
                </div>

                {/* Content Section */}
                <div className={style.content}>
                    {isInGrades ? (
                        // Grades content
                        <div className={style.gradesGrid}>
                            {tests.map((test, index) => (
                                <div key={index} className={style.gradeCard}>
                                    <h3>{test.test_id.name}</h3>
                                    <p>Grade: {test.grade}</p>
                                    <p>Course: {test.course}</p>
                                    <p>Date: {test.test_id.createdAt.split("T")[0]}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Attendance content
                        <div className={style.attendanceGrid}>
                            {presence.map((record, index) => (
                                <div key={index} className={style.attendanceCard}>
                                    <h3>{record.date ? record.date.split("T")[0] : ""}</h3>
                                    <p>Status: {record.status}</p>
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