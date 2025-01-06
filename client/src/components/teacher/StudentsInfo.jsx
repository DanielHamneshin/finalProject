import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { GET_ALL_STUDENTS, GET_STUDENTS_INFO } from '../../constants/endPoint';
import { useUserContext } from '../../contexts/UserContext';
import { IconButton } from '@mui/material';
import { Cancel } from '@mui/icons-material';
import style from '../../styles/teacherFeedback.module.css';

const StudentsInfo = ({ course, close }) => {
    const { user } = useUserContext();
    const [allStudents, setAllStudents] = useState([]);
    const [studentName, setStudentName] = useState("");
    const [studentInfo, setStudentInfo] = useState(null);

    const getStudentsInfo = async (student) => {
        try {
            const { data } = await axios.get(GET_STUDENTS_INFO + student._id + "/" + course._id);
            setStudentInfo(data);
        } catch (error) {
            console.error(error);
        }
    }

    const getAllStudents = async (course) => {
        try {
            const { data } = await axios.get(GET_ALL_STUDENTS + course._id);
            setAllStudents(data);
        } catch (error) {
            console.error(error);
        }
    }


    useEffect(() => {
        getAllStudents(course);
    }, [])
    console.log(studentInfo);

    return (
        <div className={style.modalContent}>
            <div className={style.modalHeader}>
                <h2>Students Info - {course.name}</h2>
                <button className={style.closeButton} onClick={close}>×</button>
            </div>

            {!studentInfo ? (
                <ul className={style.studentsList}>
                    {allStudents.map((student) => (
                        <li
                            key={student._id}
                            className={style.studentInfoItem}
                            onClick={() => {
                                getStudentsInfo(student)
                                setStudentName(student.name)
                            }}
                        >
                            {student.name}
                        </li>
                    ))}
                </ul>
            ) : (
                <div>
                    <div className={style.infoSection}>
                        <h2>{studentName}</h2>
                        <h3>Tests</h3>
                        <ul className={style.infoList}>
                            {studentInfo.tests.map((test) => (
                                <li key={test._id} className={style.infoItem}>
                                    <span>{test.test_id.name}</span>
                                    <span>Grade: {test.grade}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={style.infoSection}>
                        <h3>Assignments</h3>
                        <ul className={style.infoList}>
                            {studentInfo.assignments.map((assignment) => (
                                <li key={assignment._id} className={style.infoItem}>
                                    <span>{assignment.assignment_id.title}</span>
                                    <span>Grade: {assignment.grade}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={style.infoSection}>
                        <h3>Attendance</h3>
                        <ul className={style.infoList}>
                            {studentInfo.attendence.map((lesson) => (
                                <li key={lesson._id} className={style.infoItem}>
                                    <span>Lesson {lesson.lessonNum} - {lesson.course_id.name}</span>
                                    <span>Status: {lesson.status}</span>
                                </li>
                            ))}
                            {studentInfo.absence.map((absence) => (
                                <li key={absence._id} className={style.infoItem}>
                                    <span>Lesson {absence.lessonNum} - {absence.course_id.name}</span>
                                    <span>Status: {absence.status}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button
                        className={style.backButton}
                        onClick={() => {
                            setStudentInfo(null)
                            setStudentName("")
                        }}
                    >
                        Back to Students List
                    </button>
                </div>
            )}
        </div>
    )
}

export default StudentsInfo