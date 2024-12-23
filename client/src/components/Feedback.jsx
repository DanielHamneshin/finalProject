import React, { useEffect, useState } from 'react'
import { useUserContext } from '../contexts/UserContext';
import style from '../styles/feedback.module.css'
import axios from 'axios';
import { GET_ASSIGNMENTS_URL, GET_ATTENDANCE_URL, GET_TESTS_URL } from '../constants/endPoint';

const Feedback = ({ course }) => {
    const { user } = useUserContext();
    const [isInGrades, setIsInGrades] = useState(false);
    const [tests, setTests] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [attendances, setAttendances] = useState([]);
    const [abesnces, setAbcences] = useState([]);

    const getAbsencesAndAttendences = async () => {
        try {
            const { data } = await axios.get(GET_ATTENDANCE_URL + user._id);
            setAbcences(data.absence);
            setAttendances(data.attendence);
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
            getAbsencesAndAttendences()
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
                <li className={style.li}><h3>teacher</h3> <h3>course</h3> <h3>grade</h3> <h3>date</h3> </li>

            </ul>

        </>
    )
}

export default Feedback