import React, { useState } from 'react';
import { Backdrop, Box, ClickAwayListener } from '@mui/material';
import { useNavigate, useOutletContext } from 'react-router-dom';
import CreateTest from './CreateTest';
import CreateLesson from './CreateLesson';
import StudentsInfo from './StudentsInfo';
import style from '../../styles/teacherFeedback.module.css';
const TeacherFeedback = () => {
    const navigate = useNavigate();
    const { courses } = useOutletContext();

    const [openTestCreation, setOpenTestCreation] = useState(false);
    const [openLessonCreation, setOpenLessonCreation] = useState(false);
    const [openStudentInfo, setOpenStudentInfo] = useState(false);
    const [currentCourse, setCurrentCourse] = useState(null);

    const closeTest = () => {
        setOpenTestCreation(false);
    }

    const closeLesson = () => {
        setOpenLessonCreation(false);
    }

    const closeStudentInfo = () => {
        setOpenStudentInfo(false);
    }

    return (
        <div className={style.main}>
            <div className={style.headerPaper}>
                <div className={style.headerContent}>
                    <div>
                        <h1>Feedback Area</h1>
                        <p>Manage your courses and students</p>
                    </div>
                    <button
                        className={style.backButton}
                        onClick={() => navigate('/teacherpersonal')}
                    >
                        Back to Personal Area
                    </button>
                </div>
            </div>

            <div className={style.coursesList}>
                {courses.map((item, index) => (
                    <div key={index} className={style.courseCard}>
                        <h2>{item.name}</h2>
                        <div className={style.actionButtons}>
                            <button
                                onClick={() => {
                                    setCurrentCourse(item);
                                    setOpenTestCreation(true);
                                }}
                            >
                                <h3>Create Test</h3>
                                <p>Add a new test for this course</p>
                            </button>
                            <button
                                onClick={() => {
                                    setCurrentCourse(item);
                                    setOpenLessonCreation(true);
                                }}
                            >
                                <h3>Create Lesson</h3>
                                <p>Add a new lesson for this course</p>
                            </button>
                            <button
                                onClick={() => {
                                    setCurrentCourse(item);
                                    setOpenStudentInfo(true);
                                }}
                            >
                                <h3>Students Info</h3>
                                <p>View student details and progress</p>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

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
        </div>
    );
};

export default TeacherFeedback;