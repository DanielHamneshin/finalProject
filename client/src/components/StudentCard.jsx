import React from 'react'
import { useUserContext } from '../contexts/UserContext'
import { Person } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import style from '../styles/studentCard.module.css'
//TODO: only init need css and fixing the bg img
const StudentCard = () => {
    const { user } = useUserContext();

    return (
        <>
            <div className={style.card}>
                {user.img ? <img src={user.img} alt="" /> : <IconButton><Person /></IconButton>}
                <h2>{user.name}</h2>
                {/* <h3>Student id{user.StudentNumber}</h3> */}
                <h2>Major: {user.majortitle}</h2>
                <h3>Registeration date: {user.enrollment_date.split("T")[0]}</h3>
            </div>
        </>
    )
}

export default StudentCard