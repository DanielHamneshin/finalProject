import { Backdrop, Box, ClickAwayListener } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ASSIGN_COURSE_TO_MAJOR, GET_UNASSIGNED_COURSES, MAJORS_URL } from '../../constants/endPoint'
import style from '../../styles/createMajor.module.css'

export const AssignCourseToMajor = ({ open, close, showSuccess }) => {
    const [majors, setMajors] = useState([]);
    const [unAssignedCourses, setUnAssignedCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedMajor, setSelectedMajor] = useState("");

    const getAllMajors = async () => {
        try {
            const { data } = await axios.get(MAJORS_URL);
            setMajors(data);
        } catch (error) {
            console.error(error);
        }
    }
    const getUnAssignedCourses = async () => {
        try {
            const { data } = await axios.get(GET_UNASSIGNED_COURSES);
            console.log(data);
            setUnAssignedCourses(data);
        } catch (error) {
            console.error(error);
        }
    }

    const assignCourse = async () => {
        try {
            const { data } = await axios.put(ASSIGN_COURSE_TO_MAJOR, { course_id: selectedCourse, title: selectedMajor });
            showSuccess("Corses Assigned Successfully!")
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getAllMajors();
        getUnAssignedCourses();
    }, [])
    return (
        <Backdrop open={open}>
            <ClickAwayListener onClickAway={close}>
                <Box className={style.modalContent}>
                    <div className={style.modalHeader}>
                        <h1>Assign Courses to Major</h1>
                    </div>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        assignCourse();
                        // Add your submit logic here
                        close();
                    }}>
                        <select
                            className={style.inputField}
                            value={selectedMajor}
                            onChange={(e) => setSelectedMajor(e.target.value)}
                        >
                            <option value="">Select Major</option>
                            {majors.map((major, index) => (
                                <option key={index} value={major}>
                                    {major}
                                </option>
                            ))}
                        </select>

                        <select
                            className={style.inputField}
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                        >
                            <option value="">Select Course</option>
                            {unAssignedCourses.map(course => (
                                <option key={course._id} value={course._id}>
                                    {course.name}
                                </option>
                            ))}
                        </select>

                        <button type="submit" className={style.submitButton}>
                            Assign Courses
                        </button>
                    </form>
                </Box>
            </ClickAwayListener>
        </Backdrop>
    )
}
