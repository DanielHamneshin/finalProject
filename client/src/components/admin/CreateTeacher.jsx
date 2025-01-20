import { Backdrop, Box, ClickAwayListener } from '@mui/material'
import React from 'react'
import style from '../../styles/createTeacher.module.css'

const CreateTeacher = ({ close, open }) => {
    return (
        <>
            <Backdrop open={open}>
                <ClickAwayListener onClickAway={close}>
                    <Box className={style.modalContent}>
                        <div className={style.modalHeader}>
                            <h1>Create Teacher</h1>
                        </div>
                        <form onSubmit={() => {
                            close();
                        }}>
                            <input type="text" placeholder="Name" className={style.inputField} />
                            <input type="text" placeholder="Email" className={style.inputField} />
                            <input type="password" placeholder="Password" className={style.inputField} />
                            <button type="submit" className={style.submitButton}>Create</button>
                        </form>
                    </Box>
                </ClickAwayListener>
            </Backdrop>
        </>
    )
}

export default CreateTeacher