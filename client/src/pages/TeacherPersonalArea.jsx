import React, { useEffect, useState } from 'react'
import { useUserContext } from '../contexts/UserContext'
import axios from 'axios'
import { GET_TEACHER_COURSES } from '../constants/endPoint'
import Header from '../components/Header'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import style from '../styles/teacherPersonal.module.css'

const TeacherPersonalArea = () => {
    const { user } = useUserContext();
    const [courses, setCourses] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    const getAllCourses = async () => {
        try {
            const { data } = await axios.get(GET_TEACHER_COURSES + user._id);
            setCourses(data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        user.role === "teacher" && getAllCourses();
    }, [])

    return (
        <>
            <Header />
            {location.pathname === '/teacherpersonal' && (
                <div className={style.main}>
                    <div className={style.headerPaper}>
                        <div className={style.headerContent}>
                            <div>
                                <h1>Personal Area</h1>
                                <p>Welcome, {user?.name}</p>
                            </div>
                        </div>
                    </div>

                    <div className={style.navigationButtons}>
                        <button onClick={() => navigate('classroom')}>
                            <h2>Classroom</h2>
                            <p>{courses.length} Courses Available</p>
                        </button>
                        <button onClick={() => navigate('feedback')}>
                            <h2>Feedback</h2>
                            <p>Manage courses and students</p>
                        </button>
                    </div>
                </div>
            )}
            <Outlet context={{ courses }} />
        </>
    )
}

export default TeacherPersonalArea