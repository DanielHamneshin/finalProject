import React, { useState } from 'react'
import { GET_ASSIGNMENTS_BY_COURSE } from '../constants/endPoint';
import style from '../styles/studentClassroom.module.css';
import { useUserContext } from '../contexts/UserContext'
import axios from 'axios';
import ClassroomCourse from './ClassroomCourse';


const StudentClassroom = ({ courses }) => {
    const { user } = useUserContext();
    const [course, setCourse] = useState(null);

    return (
        <>
            {courses.map((course) => (
                <div className={style.course} key={course._id} onClick={() => setCourse(course)}>
                    <h2>{course.name}</h2>
                    {/* <h2>{course.teacher}</h2> */}
                </div>
            ))}
            {course && <ClassroomCourse course={course} />}
        </>
    )
}

export default StudentClassroom