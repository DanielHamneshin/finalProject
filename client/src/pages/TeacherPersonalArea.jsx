import React, { useEffect, useState } from 'react'
import { useUserContext } from '../contexts/UserContext'
import axios from 'axios'
import { GET_ALL_STUDENTS, GET_TEACHER_COURSES } from '../constants/endPoint'
import Header from '../components/Header'
import { Backdrop, Box, ClickAwayListener } from '@mui/material'
import CreateTest from '../components/teacher/CreateTest'
import CreateLesson from '../components/teacher/CreateLesson'
import StudentsInfo from '../components/teacher/StudentsInfo'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import style from '../styles/teacherPersonal.module.css'

const TeacherPersonalArea = () => {
    const { user } = useUserContext();
    const [courses, setCourses] = useState([]);
    const [openTestCreation, setOpenTestCreation] = useState(false);
    const [openLessonCreation, setOpenLessonCreation] = useState(false);
    const [openStudentInfo, setOpenStudentInfo] = useState(false)
    const [currentCourse, setCurrentCourse] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    const getAllCourses = async () => {
        try {
            const { data } = await axios.get(GET_TEACHER_COURSES + user._id);
            setCourses(data);
        } catch (error) {
            console.error(error);
        }
    }

    const closeTest = () => {
        setOpenTestCreation(false);
    }

    const closeLesson = () => {
        setOpenLessonCreation(false);
    }

    const closeStudentInfo = () => {
        setOpenStudentInfo(false);
    }

    useEffect(() => {
        getAllCourses();
    }, [])



    return (
        <>
            <Header />

            {location.pathname === '/teacherpersonal' && (
                <div className={style.container}>
                    <button
                        onClick={() => navigate('classroom')}
                        className={style.classroomButton}
                    >
                        Go to Classroom
                    </button>

                    <ul className={style.coursesList}>
                        {courses.map((item, index) => (
                            <li key={index} className={style.courseCard}>
                                <h3 className={style.courseName}>{item.name}</h3>
                                <div className={style.actionButtons}>
                                    <button
                                        className={style.actionButton}
                                        onClick={() => {
                                            setCurrentCourse(item);
                                            setOpenTestCreation(true);
                                        }}
                                    >
                                        Create Test
                                    </button>
                                    <button
                                        className={style.actionButton}
                                        onClick={() => {
                                            setCurrentCourse(item);
                                            setOpenLessonCreation(true);
                                        }}
                                    >
                                        Create Lesson
                                    </button>
                                    <button
                                        className={style.actionButton}
                                        onClick={() => {
                                            setCurrentCourse(item);
                                            setOpenStudentInfo(true);
                                        }}
                                    >
                                        Students Info
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <Outlet context={{ courses }} />

            {openStudentInfo && <StudentsInfo course={currentCourse} close={closeStudentInfo} />}

            {openTestCreation && <Backdrop open={openTestCreation}>
                <ClickAwayListener onClickAway={() => closeTest()}>
                    <Box>
                        <CreateTest course={currentCourse} close={closeTest} />
                    </Box>
                </ClickAwayListener>
            </Backdrop>}

            {openLessonCreation && <Backdrop open={openLessonCreation}>
                <ClickAwayListener onClickAway={() => closeLesson()}>
                    <Box>
                        <CreateLesson course={currentCourse} close={closeLesson} />
                    </Box>
                </ClickAwayListener>
            </Backdrop>}
        </>
    )
}

export default TeacherPersonalArea