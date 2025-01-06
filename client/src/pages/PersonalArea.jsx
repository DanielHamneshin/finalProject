import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import StudentCard from '../components/StudentCard'
import { useUserContext } from '../contexts/UserContext'
import style from '../styles/personal.module.css'
import axios from 'axios'
import { GET_ALL_COURSES_URL, GET_RECENT_ACTIVITIES_URL, OPTIONAL_COURSES_CHOOSE_URL, OPTIONAL_COURSES_URL } from '../constants/endPoint'
import Feedback from '../components/Feedback'
import StudentClassroom from '../components/StudentClassroom'
import { Outlet, useNavigate } from 'react-router-dom'
// TODO: only added studens card
const PersonalArea = () => {
    const [effectTrigger, setEffectTrigger] = useState(false);
    const [isInFeedback, setIsInFeedback] = useState(true);
    const { user, setUser } = useUserContext();
    const [allCourses, setAllCourses] = useState([]);
    const [optionalCourses, setOptionalCourses] = useState([]);
    const [maxChoises, setMaxChoises] = useState(0);
    const [chosenCourses, setChosenCourses] = useState([]);
    const [currentCourse, setCurrentCourse] = useState("");
    const [error, setError] = useState("");
    const [recentActivities, setRecentActivities] = useState([]);
    const navigate = useNavigate();

    const switchComponents = () => {
        setIsInFeedback((prev) => !prev)
    }

    const getAllCourses = async () => {
        try {
            const { data } = await axios.get(GET_ALL_COURSES_URL + user._id + "/" + user.role);
            setAllCourses(data);
        } catch (error) {
            console.error(error);
        }
    }


    const getOptionalCourses = async () => {
        try {
            const { data } = await axios.get(OPTIONAL_COURSES_URL + user._id);
            setOptionalCourses(data.courses);
            setMaxChoises(data.max);
        } catch (error) {
            console.error(error);
        }
    }

    const updateCourses = async () => {
        try {
            const { data } = await axios.put(OPTIONAL_COURSES_CHOOSE_URL + user._id, { courses: chosenCourses });
            setUser(data);
            console.log("updated");

        } catch (error) {
            console.error(error);
        }
    }


    useEffect(() => {
        if (user.isCoursesFull) {
            getAllCourses();
        } else {
            getOptionalCourses();
        }
        getRecentActivities();
    }, [user.isCoursesFull, effectTrigger]);



    const chooseCourses = (e) => {
        const { value, checked } = e.target; // Get the value and checked state of the checkbox
        setError("");
        setChosenCourses((prev) => {
            if (checked) {
                // Add the course if it's checked
                return [...prev, value];
            } else {
                // Remove the course if it's unchecked
                return prev.filter((course) => course !== value);
            }
        });
    };

    const navigateToClassroom = () => {
        navigate('/personal/classroom', {
            state: { courses: allCourses }
        });
    };

    const getRecentActivities = async () => {
        try {
            const { data } = await axios.get(GET_RECENT_ACTIVITIES_URL + user._id);
            setRecentActivities(data);
        } catch (error) {
            console.error(error);
        }
    }
    console.log(recentActivities);

    // Helper function to determine grade class
    const getGradeClass = (grade) => {
        const numGrade = Number(grade);
        if (numGrade < 55) return style.gradeFail;
        if (numGrade < 70) return style.gradeWarning;
        if (numGrade < 85) return style.gradeGood;
        return style.gradeExcellent;
    };

    return (
        <>
            <Header />
            <div className={style.pageWrapper}>
                {/* Side Debt Alert - Moved outside main container */}
                {user?.debt > 0 && (
                    <div className={style.sideDebtAlert}>
                        <div className={style.debtInfo}>
                            <span className={style.debtLabel}>Outstanding Balance</span>
                            <span className={style.debtAmount}>${user.debt}</span>
                            <span className={style.debtMessage}>
                                Please settle your payment to maintain full access to all features.
                            </span>
                        </div>
                        <button
                            className={style.payDebtButton}
                            onClick={() => navigate('/personal/paydebt')}
                        >
                            Pay Now
                        </button>
                    </div>
                )}

                <div className={style.main}>
                    {/* Header Section */}
                    <div className={style.headerPaper} >
                        <div className={style.headerContent}>
                            <div >
                                <h1>Personal Area</h1>
                                <p>Welcome, {user?.name}</p>
                            </div>
                        </div>
                    </div>

                    <div className={style.contentWrapper}>
                        {/* Main Content */}
                        <div className={style.mainContent}>
                            {!user.isCoursesFull && (
                                <div className={style.optionalCourses}>
                                    <h4>Select Optional Courses (Max: {maxChoises})</h4>
                                    {optionalCourses.map((item, index) => (
                                        <div className={style.option} key={index}>
                                            <input
                                                type="checkbox"
                                                value={item}
                                                onChange={chooseCourses}
                                                checked={chosenCourses.includes(item)}
                                                id={`course-${index}`}
                                            />
                                            <label htmlFor={`course-${index}`}>{item}</label>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => {
                                            if (chosenCourses.length === maxChoises) {
                                                updateCourses();
                                                setEffectTrigger(prev => !prev);
                                            } else {
                                                setError(`Please choose ${maxChoises} courses`);
                                            }
                                        }}
                                    >
                                        Apply Selection
                                    </button>
                                    {error && <p className={style.error}>{error}</p>}
                                </div>
                            )}

                            {user.isCoursesFull && (
                                <div className={style.navigationButtons}>
                                    <button onClick={() => navigate('/personal/feedback')}>
                                        <h2>Feedback</h2>
                                        <p>View your grades and attendance</p>
                                    </button>
                                    <button onClick={navigateToClassroom}>
                                        <h2>Classroom</h2>
                                        <p>{allCourses.length} Courses Available</p>
                                    </button>
                                </div>
                            )}
                            <div className={style.recentActivities}>
                                <h2>Recent Activities</h2>
                                <div className={style.activitiesContainer}>
                                    {/* Lessons Section */}
                                    <div className={style.activitySection}>
                                        <h3>Recent Lessons</h3>
                                        {recentActivities?.lessons?.map((lesson, index) => (
                                            <div key={index} className={style.activityItem}>
                                                <p>{lesson.course_id.name}</p>
                                                <p>Lesson: {lesson?.lessonNum}</p>
                                                <p>Teacher: {lesson?.course_id?.teacherName}</p>
                                                <p>
                                                    <span className={`${style.status} ${lesson.status.toLowerCase() === 'present'
                                                        ? style.statusPresent
                                                        : style.statusAbsent
                                                        }`}>
                                                        {lesson.status}
                                                    </span>
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Tests Section */}
                                    <div className={style.activitySection}>
                                        <h3>Recent Tests</h3>
                                        {recentActivities?.tests?.map((test, index) => (
                                            <div key={index} className={style.activityItem}>
                                                <p>{test?.course}</p>
                                                <p>Test: {test?.test_id?.name}</p>
                                                <p>Teacher: {test?.test_id?.teacher?.name}</p>
                                                <p>Date: {test?.test_id?.createdAt?.split("T")[0]}</p>
                                                <p>Grade:
                                                    <span className={`${style.grade} ${getGradeClass(test.grade)}`}>
                                                        {test.grade}
                                                    </span>
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Assignments Section */}
                                    <div className={style.activitySection}>
                                        <h3>Recent Assignments</h3>
                                        {recentActivities?.assignments?.map((assignment, index) => (
                                            <div key={index} className={style.activityItem}>
                                                <p>{assignment?.assignment_id?.course_id?.name}</p>
                                                <p>{assignment.assignment_id.title}</p>
                                                <p>{assignment?.assignment_id?.course_id?.teacherName}</p>
                                                <p>Grade:
                                                    <span className={`${style.grade} ${getGradeClass(assignment.grade)}`}>
                                                        {assignment.grade}
                                                    </span>
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default PersonalArea