import React, { useEffect, useState } from 'react'
import { useUserContext } from '../../contexts/UserContext'
import { CREATE_LESSON, GET_ALL_STUDENTS } from '../../constants/endPoint';
import axios from 'axios';
import style from '../../styles/teacherFeedback.module.css';

const CreateLesson = ({ course, close }) => {
    const { user } = useUserContext();
    const [students, setStudents] = useState([]);
    const getAllStudents = async () => {
        try {
            const { data } = await axios.get(GET_ALL_STUDENTS + course._id)
            setStudents(data.map((item) => {
                return { ...item, status: "present" }
            }))
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getAllStudents();
    }, [])

    const createLesson = async () => {
        try {
            const { data } = await axios.post(CREATE_LESSON, { course_name: course.name, teacher_id: user._id, students: students });
            close();
        } catch (error) {
            console.error(error);
        }
    }

    const updateStudentStatus = (e, index) => {
        const { checked } = e.target;
        setStudents((prev) => {
            let newStudents = [...prev];
            newStudents[index].status = checked ? "absent" : "present";
            return newStudents;
        })
    }
    return (
        <div className={style.modalContent}>
            <div className={`${style.modalHeader} ${style.fullWidth}`}>
                <h2>Create Lesson for {course.name}</h2>
            </div>
            <form className={style.form} onSubmit={(e) => {
                e.preventDefault();
                createLesson();
            }}>
                <ul className={style.studentsList}>
                    {students.map((item, index) => (
                        <li key={index} className={style.studentItem}>
                            <h3 className={style.studentName}>{item.name}</h3>
                            <input
                                type="checkbox"
                                className={style.checkbox}
                                onChange={(e) => updateStudentStatus(e, index)}
                            />
                            <span className={`${style.status} ${item.status.toLowerCase() === 'present'
                                ? style.statusPresent
                                : style.statusAbsent
                                }`}>
                                {item.status}
                            </span>
                        </li>
                    ))}
                </ul>
                <button className={style.submitButton}>Create Lesson</button>
            </form>
        </div>
    )
}

export default CreateLesson