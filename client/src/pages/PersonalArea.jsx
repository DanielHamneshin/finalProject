import React, { useState } from 'react'
import Header from '../components/Header'
import StudentCard from '../components/StudentCard'
import { useUserContext } from '../contexts/UserContext'
import style from '../styles/personal.module.css'
// TODO: only added studens card
const PersonalArea = () => {
    const { user } = useUserContext();
    const [currentCourse, setCurrentCourse] = useState("");
    const [isCoursesFull, setIsCoursesFull] = useState(false);
    return (
        <>
            <Header />
            <main className={style.main}>
                {isCoursesFull && <select name="" id="" onChange={(e) => setCurrentCourse(e.target.value)}>
                    <option value="">Select course</option>
                    {user.coursesnames.map((course, index) => <option value={course} key={index}>{course}</option>)}
                </select>}
                {!isCoursesFull && <button>Select optional courses</button>}
                <StudentCard />
            </main>
        </>
    )
}

export default PersonalArea