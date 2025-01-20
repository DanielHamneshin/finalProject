import React from 'react'
import { Backdrop, Box, ClickAwayListener } from '@mui/material'
import style from '../../styles/createMajor.module.css'

const CreateMajor = ({ open, close }) => {
    return (
        <>
            <Backdrop open={open}>
                <ClickAwayListener onClickAway={close}>
                    <Box className={style.modalContent}>
                        <div className={style.modalHeader}>
                            <h1>Create Major</h1>
                        </div>
                        <form onSubmit={() => {
                            close();
                        }}>
                            <input type="text" placeholder="Major Name" className={style.inputField} />
                            <input type="text" placeholder="Major Code" className={style.inputField} />
                            <button type="submit" className={style.submitButton}>Create</button>
                        </form>
                    </Box>
                </ClickAwayListener>
            </Backdrop>
        </>
    )
}

export default CreateMajor