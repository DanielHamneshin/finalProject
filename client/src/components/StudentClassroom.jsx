import React from 'react'
import style from '../styles/studentClassroom.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';

const StudentClassroom = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const courses = location.state?.courses || [];

    const handleCourseClick = (course) => {
        navigate(`/personal/classroom/${course._id}`, {
            state: {
                course,
                allCourses: courses
            }
        });
    };

    return (
        <>
            <Header />
            <div className={style.container} style={{ marginTop: '100px' }}>
                <button
                    onClick={() => navigate('/personal')}
                    className={style.backButton}
                >
                    Back to Personal Area
                </button>

                {courses.map((course) => (
                    <div
                        className={style.course}
                        key={course._id}
                        onClick={() => handleCourseClick(course)}
                    >
                        <h2>{course.name}</h2>
                    </div>
                ))}
            </div>
        </>
    )
}

export default StudentClassroom