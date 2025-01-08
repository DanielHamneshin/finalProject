import React, { useState } from 'react'
import style from '../styles/studentClassroom.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';

const StudentClassroom = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const courses = location.state?.courses || [];
    const [courseSearch, setCourseSearch] = useState('');
    const [teacherSearch, setTeacherSearch] = useState('');

    // Filter courses based on both search inputs
    const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(courseSearch.toLowerCase()) &&
        course.teacher.toLowerCase().includes(teacherSearch.toLowerCase())
    );

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

                {/* Search inputs with labels */}
                <div className={style.searchContainer}>
                    <div className={style.searchInputWrapper}>
                        <label className={style.searchLabel}>
                            Search By Course Name
                        </label>
                        <input
                            type="text"
                            placeholder="Search by course name..."
                            value={courseSearch}
                            onChange={(e) => setCourseSearch(e.target.value)}
                            className={style.searchInput}
                        />
                    </div>
                    <div className={style.searchInputWrapper}>
                        <label className={style.searchLabel}>
                            Search By Teacher Name
                        </label>
                        <input
                            type="text"
                            placeholder="Search by teacher name..."
                            value={teacherSearch}
                            onChange={(e) => setTeacherSearch(e.target.value)}
                            className={style.searchInput}
                        />
                    </div>
                </div>

                {/* Courses Grid */}
                <div className={style.coursesGrid}>
                    {filteredCourses.map((course) => (
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

                {/* Show message when no results found */}
                {filteredCourses.length === 0 && (courseSearch || teacherSearch) && (
                    <div className={style.noResults}>
                        No courses found matching your search criteria
                    </div>
                )}
            </div>
        </>
    )
}

export default StudentClassroom