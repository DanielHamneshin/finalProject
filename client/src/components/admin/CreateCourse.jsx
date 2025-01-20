import React, { useEffect, useState } from 'react'
import { Backdrop, Box, ClickAwayListener } from '@mui/material'
import style from '../../styles/createCourse.module.css'
import { TEACHERS_URL } from '../../constants/endPoint'
import axios from 'axios'




const CreateCourse = ({ open, close }) => {

    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState({});
    const getTeachers = async () => {
        try {
            const { data } = await axios.get(TEACHERS_URL)
            console.log(data)
            setTeachers(data)
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        getTeachers()
    }, [])



    return (
        <>
            <Backdrop open={open}>
                <ClickAwayListener onClickAway={close}>
                    <Box className={style.modalContent}>
                        <div className={style.modalHeader}>
                            <h1>Create Course</h1>
                        </div>
                        <form onSubmit={() => {
                            close();
                        }}>
                            <input type="text" placeholder="Course Name" className={style.inputField} />
                            <select className={style.inputField} value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)}>
                                <option value="">Select Teacher</option>
                                {teachers?.map((teacher) => (
                                    <option key={teacher._id} value={teacher._id}>{teacher.name}</option>
                                ))}
                            </select>
                            <input type="text" placeholder="Course Code" className={style.inputField} />
                            <button type="submit" className={style.submitButton}>Create</button>
                        </form>
                    </Box>
                </ClickAwayListener>
            </Backdrop>
        </>
    )
}

export default CreateCourse