import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import StudentCard from '../components/StudentCard'
import { useUserContext } from '../contexts/UserContext'
import style from '../styles/personal.module.css'
import axios from 'axios'
import { OPTIONAL_COURSES_URL } from '../constants/endPoint'
import Feedback from '../components/Feedback'
// TODO: only added studens card
const PersonalArea = () => {
    const { user } = useUserContext();
    const [optionalCourses, setOptionalCourses] = useState([]);
    const [currentCourse, setCurrentCourse] = useState("");
    const [isCoursesFull, setIsCoursesFull] = useState(false);


    const getOptionalCourses = async () => {
        try {
            const { data } = axios.get(OPTIONAL_COURSES_URL + user._id);
            setOptionalCourses(data);
        } catch (error) {
            console.error(error);
        }
    }

    // !isCoursesFull && useEffect(() => {
    //     getOptionalCourses();
    // }, []);



    return (
        <>
            <Header />
            <main className={style.main}>
                {isCoursesFull && <select name="" id="" onChange={(e) => setCurrentCourse(e.target.value)}>
                    <option value="">Select course</option>
                    {user.coursesnames.map((course, index) => <option value={course} key={index}>{course}</option>)}
                </select>}
                {!isCoursesFull && <select name="" id="">
                    <option value="">select optional courses</option>
                    {optionalCourses.map((item) => {
                        return <option value={item}>{item}</option>
                    })}
                </select>}

                <Feedback />
            </main>
        </>
    )
}

export default PersonalArea