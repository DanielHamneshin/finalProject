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
            <div className={style.container}>
                {/* Header Section */}
                <div className={style.headerPaper}>
                    <div className={style.headerContent}>
                        <div>
                            <h1>My Classroom</h1>
                            <p>Available Courses</p>
                        </div>
                        <button
                            onClick={() => navigate('/personal')}
                            className={style.backButton}
                        >
                            Back
                        </button>
                    </div>
                </div>

                {/* Courses Grid */}
                <div className={style.coursesGrid}>
                    {courses.map((course) => (
                        <div
                            className={style.course}
                            key={course._id}
                            onClick={() => handleCourseClick(course)}
                        >
                            <h2>{course.name}</h2>
                            <p>Teacher: {course.teacher}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default StudentClassroom