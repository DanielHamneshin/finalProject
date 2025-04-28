import React from 'react'
import style from '../../styles/createCourse.module.css';
import { Backdrop, Box, ClickAwayListener } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const ChooseCourseWindow = ({ student_id, major, courses, close, isOpen, student_name }) => {
    const navigate = useNavigate();
    return (
        <>
            <Backdrop open={isOpen}>
                <ClickAwayListener onClickAway={close}>
                    <Box className={style.modalContent}>
                        <div className={style.modalHeader}>
                            <h1>Select a Course</h1>
                        </div>
                        <h2>Major: {major}</h2>

                        <div className={style.courseList}>
                            {courses?.map((item, index) => {
                                return (
                                    <button
                                        key={index}
                                        className={style.submitButton}
                                        style={{
                                            margin: '8px 0',
                                            width: '100%',
                                            textAlign: 'left',
                                            justifyContent: 'space-between',
                                            display: 'flex'
                                        }}
                                        onClick={() => {
                                            navigate(`/teacherpersonal/feedback/students/${item._id}`, {
                                                state: { course: item, isAdminStudent: true, student_id: student_id, isAdminCourse: false, student_name: student_name }
                                            })
                                        }}
                                    >
                                        {item.name}
                                        <span>→</span>
                                    </button>
                                )
                            })}
                        </div>

                        <button
                            type="button"
                            onClick={close}
                            className={style.submitButton}
                            style={{ marginTop: '20px', backgroundColor: '#6c757d' }}
                        >
                            Cancel
                        </button>
                    </Box>
                </ClickAwayListener>
            </Backdrop>
        </>
    )
}
