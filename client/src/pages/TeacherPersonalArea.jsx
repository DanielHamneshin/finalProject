import React, { useEffect, useState } from 'react'
import { useUserContext } from '../contexts/UserContext'
import axios from 'axios'
import { GET_ALL_STUDENTS, GET_TEACHER_COURSES } from '../constants/endPoint'
import Header from '../components/Header'
import { Backdrop, Box, ClickAwayListener } from '@mui/material'
import CreateTest from '../components/teacher/CreateTest'
import CreateLesson from '../components/teacher/CreateLesson'
import StudentsInfo from '../components/teacher/StudentsInfo'

const TeacherPersonalArea = () => {
    const { user } = useUserContext();
    const [courses, setCourses] = useState([]);
    const [openTestCreation, setOpenTestCreation] = useState(false);
    const [openLessonCreation, setOpenLessonCreation] = useState(false);
    const [openStudentInfo, setOpenStudentInfo] = useState(false)
    const [currentCourse, setCurrentCourse] = useState(null);

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

            <ul style={{ marginTop: "150px" }}>
                {courses.map((item, index) => {
                    return <li key={index}><h3>{item.name}</h3><button onClick={() => {
                        setCurrentCourse(item);
                        setOpenTestCreation(true);
                    }}>create test</button><button onClick={() => {
                        setCurrentCourse(item);
                        setOpenLessonCreation(true);
                    }}>create lesson</button>
                        <button onClick={() => {
                            setCurrentCourse(item);
                            setOpenStudentInfo(true);
                        }}>students info</button>
                    </li>
                })}
            </ul>

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