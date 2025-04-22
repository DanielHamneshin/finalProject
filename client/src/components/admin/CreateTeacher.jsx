import { Backdrop, Box, ClickAwayListener } from '@mui/material'
import React from 'react'
import style from '../../styles/createTeacher.module.css'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { CREATE_TEACHER } from '../../constants/endPoint'

const CreateTeacher = ({ close, open }) => {
    const { watch, register, handleSubmit } = useForm();
    const createTeacher = async () => {
        try {
            const response = await axios.post(CREATE_TEACHER, watch())
            console.log(response);
            close();
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
                            <h1>Create Teacher</h1>
                        </div>
                        <form onSubmit={handleSubmit(createTeacher)}>
                            <input {...register("name")} type="text" placeholder="Name" className={style.inputField} />
                            <input {...register("email")} type="text" placeholder="Email" className={style.inputField} />
                            <input {...register("password")} type="password" placeholder="Password" className={style.inputField} />
                            <button type="submit" className={style.submitButton}>Create</button>
                        </form>
                    </Box>
                </ClickAwayListener>
            </Backdrop>
        </>
    )
}

export default CreateTeacher