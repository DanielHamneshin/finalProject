import React, { useEffect, useState } from 'react'
import { useUserContext } from '../contexts/UserContext';
import style from '../styles/feedback.module.css'
import axios from 'axios';
import { GET_ASSIGNMENTS_URL, GET_ATTENDANCE_URL, GET_TESTS_URL } from '../constants/endPoint';
import StudentCard from './StudentCard';

const Feedback = ({ course }) => {
    const { user } = useUserContext();
    const [isInGrades, setIsInGrades] = useState(false);
    const [tests, setTests] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [filterPresenceBy, setFilterPresenceBy] = useState('');
    const [presence, setPresence] = useState([]);

    const getPresence = async () => {
        try {
            const { data } = await axios.get(GET_ATTENDANCE_URL + user._id);
            setPresence(data);

        } catch (error) {
            console.error(error);
        }
    }

    const getTests = async () => {
        try {
            const { data } = await axios.get(GET_TESTS_URL + user._id);
            setTests(data.tests);
        } catch (error) {
            console.error(error);
        }
    }

    const getAssignments = async () => {
        try {
            const { data } = await axios.get(GET_ASSIGNMENTS_URL + user._id);
            setAssignments(data.assignments);
        } catch (error) {
            console.error(error);
        }
    }




    useEffect(() => {
        if (isInGrades) {
            getTests();
            getAssignments();
        }
        else {
            getPresence()
        }
    }, [isInGrades])



    const switchComponents = () => {
        setIsInGrades((prev) => !prev);
    }


    return (
        <>
            <nav className={style.nav}>
                <div className={`${isInGrades ? style.active : style.nonActive} ${style.navChild}`} onClick={() => {
                    if (!isInGrades) switchComponents()
                }}><h1>Grades</h1></div>
                <div className={`${isInGrades ? style.nonActive : style.active} ${style.navChild}`} onClick={() => {
                    if (isInGrades) switchComponents()
                }}><h1>Attendance</h1></div>
            </nav>

            <ul>
                <li className={style.li}><h3>Test Name</h3> <h3>course</h3> <h3>grade</h3> <h3>date</h3> </li>
                {isInGrades && tests.map((item, index) => {
                    return <li className={style.li} key={index}><h3>{item.test_id.name}</h3> <h3>{item.course}</h3> <h3>{item.grade}</h3> <h3>date</h3> </li>
                })}

                {isInGrades && assignments.map((item, index) => {
                    return <li className={style.li} key={index}><h3>{item.test_id.name}</h3> <h3>{item.course}</h3> <h3>{item.grade}</h3> <h3>date</h3> </li>
                })}

                {!isInGrades && <select name="" id="" onChange={(e) => setFilterPresenceBy(e.target.value)}>
                    <option value="">all</option>
                    <option value="present">present</option>
                    <option value="absent">absent</option>
                </select>
                }
                {!isInGrades && presence.map((item, index) => {
                    if (item.status === filterPresenceBy || !filterPresenceBy) return <li className={style.li} key={index}><h3>{item.lessonNum}</h3> <h3>{item.course_id.name}</h3> <h3>{item.status}</h3> <h3>{item.date ? item.date.split("T")[0] : ""}</h3> </li>
                })}
            </ul>

        </>
    )
}

export default Feedback