import React, { useEffect, useState } from 'react'
import { Backdrop, Box, ClickAwayListener } from '@mui/material'
import style from '../../styles/createCourse.module.css'
import { CREATE_COURSE, TEACHERS_URL } from '../../constants/endPoint'
import axios from 'axios'




const CreateCourse = ({ open, close, showSuccess }) => {

    const [teachers, setTeachers] = useState([]);
    const [courseName, setCourseName] = useState("");
    const [selectedTeacher, setSelectedTeacher] = useState({});
    const [isMandatory, setIsMandatory] = useState(false);
    const getTeachers = async () => {
        try {
            const { data } = await axios.get(TEACHERS_URL);
            setTeachers(data);
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        getTeachers()
    }, [])

    const createCourse = async () => {
        try {
            const { data } = await axios.post(CREATE_COURSE, { name: courseName, teacher_id: selectedTeacher, is_mandatory: isMandatory });
            showSuccess("Course Created Successfully!");
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    }



    return (
        <>
            <Backdrop open={open}>
                <ClickAwayListener onClickAway={close}>
                    <Box className={style.modalContent}>
                        <div className={style.modalHeader}>
                            <h1>Create Course</h1>
                        </div>
                        <form onSubmit={() => {
                            createCourse();
                            close();
                        }}>
                            <input type="text" placeholder="Course Name" className={style.inputField} onChange={(e) => setCourseName(e.target.value)} />
                            <select className={style.inputField} onChange={(e) => setSelectedTeacher(e.target.value)}>
                                <option value="">Select Teacher</option>
                                {teachers?.map((teacher) => (
                                    <option key={teacher._id} value={teacher._id}>{teacher.name}</option>
                                ))}
                            </select>
                            <div>
                                <input type="checkbox" onChange={(e) => {
                                    const { checked } = e.target;
                                    setIsMandatory(checked);
                                }} />
                                <label htmlFor="">is mandatory</label>
                            </div>
                            <button type="submit" className={style.submitButton}>Create</button>
                        </form>
                    </Box>
                </ClickAwayListener>
            </Backdrop>
        </>
    )
}

export default CreateCourse