import React, { useEffect, useState } from 'react'
import { useUserContext } from '../contexts/UserContext'
import axios from 'axios'
import { GET_ALL_STUDENTS } from '../constants/endPoint'
import Header from '../components/Header'
import { Backdrop, Box, ClickAwayListener } from '@mui/material'
import CreateTest from '../components/teacher/CreateTest'
import CreateLesson from '../components/teacher/CreateLesson'

const TeacherPersonalArea = () => {
    const { user } = useUserContext();
    const [courses, setCourses] = useState([]);
    const [openTestCreation, setOpenTestCreation] = useState(false);
    const [openLessonCreation, setOpenLessonCreation] = useState(false);
    const [currentCourse, setCurrentCourse] = useState("");

    const getAllCourses = async () => {
        try {
            const { data } = await axios.get();
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

    useEffect(() => {

    }, [])



    return (
        <>
            <Header />

            <ul>
                {courses.map((item, index) => {
                    return <li key={index}><h3>{item.name}</h3><button onClick={() => {
                        setCurrentCourse(item.name)
                        setOpenTestCreation(true);
                    }}>create test</button><button onClick={() => {
                        setCurrentCourse(item.name)
                        setOpenLessonCreation(true)
                    }}>create lesson</button></li>
                })}
            </ul>

            <Backdrop open={openTestCreation}>
                <ClickAwayListener onClickAway={() => closeTest()}>
                    <Box>
                        <CreateTest course={currentCourse} close={closeTest} />
                    </Box>
                </ClickAwayListener>
            </Backdrop>

            <Backdrop open={openLessonCreation}>
                <ClickAwayListener onClickAway={() => closeLesson()}>
                    <Box>
                        <CreateLesson course={currentCourse} close={closeLesson} />
                    </Box>
                </ClickAwayListener>
            </Backdrop>
        </>
    )
}

export default TeacherPersonalArea