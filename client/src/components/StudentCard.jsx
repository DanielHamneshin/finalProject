import React from 'react'
import { useUserContext } from '../contexts/UserContext'
import style from '../styles/studentCard.module.css'
//TODO: only init need css and fixing the bg img
const StudentCard = () => {
    const { user } = useUserContext();
    const firstName = user.name.split(" ")[0];
    const lastName = user.name.split(" ")[1];
    return (
        <>
            <div className={style.card}>
                <img src={user.img ? user.img : `https://avatar.iran.liara.run/username?username=${firstName + lastName}`} alt="" style={{ width: "100px", height: "100px", borderRadius: "50%" }} />
                <h2>{user.name}</h2>
                {/* <h3>Student id{user.StudentNumber}</h3> */}
                <h2>Major: {user.majortitle}</h2>
                <h3>Registeration date: {user.enrollment_date.split("T")[0]}</h3>
            </div>
        </>
    )
}

export default StudentCard