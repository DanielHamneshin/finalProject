import React, { useState } from 'react'
//TODO: connect to server and filter
const Attendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [absence, setAbsence] = useState([]);
    const [searchBy, setSearchBy] = useState("");
    return (
        <>
            {absence.map((item, index) => {
                return <div key={index}>
                    <h3>absence</h3>
                    {/* <h3>{item.course}</h3> */}
                    {/* <h3>{item.lessonNum}{item.date}</h3> */}
                </div>
            })}
        </>
    )
}

export default Attendance