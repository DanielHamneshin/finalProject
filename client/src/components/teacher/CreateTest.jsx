import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { CREATE_TEST, GET_ALL_STUDENTS } from '../../constants/endPoint';
import { useUserContext } from '../../contexts/UserContext';
import style from '../../styles/teacherFeedback.module.css';

const CreateTest = ({ course, close }) => {
    const { user } = useUserContext();
    const [students, setStudents] = useState([]);
    const [testName, setTestName] = useState("");
    const getAllStudents = async () => {
        try {
            const { data } = await axios.get(GET_ALL_STUDENTS + course._id)
            setStudents(data.map((item) => {
                return { ...item, grade: 0 }
            }))
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getAllStudents();
    }, [])


    // body:{name,course_name,teacher_id , students{ student._id, grade}}
    const createTest = async () => {
        try {
            const { data } = await axios.post(CREATE_TEST, { name: testName, course_name: course.name, teacher_id: user._id, students: students });
            close();
        } catch (error) {
            console.error(error);
        }
    }


    const updateGrade = (e, index) => {
        setStudents((prev) => {
            let newStudents = [...prev];
            newStudents[index].grade = e.target.value;
            return newStudents;
        })
    }
    return (
        <div className={style.modalContent}>
            <div className={style.modalHeader}>
                <h2>Create Test for {course.name}</h2>
                <button className={style.closeButton} onClick={close}>×</button>
            </div>
            <form className={style.form} onSubmit={(e) => {
                e.preventDefault();
                createTest();
            }}>
                <input
                    className={style.inputField}
                    value={testName}
                    type="text"
                    placeholder='Test name'
                    onChange={(e) => setTestName(e.target.value)}
                />
                <ul className={style.studentsList}>
                    {students.map((item, index) => (
                        <li key={index} className={style.studentItem}>
                            <h3 className={style.studentName}>{item.name}</h3>
                            <input
                                className={style.gradeInput}
                                type="number"
                                placeholder="Grade"
                                onChange={(e) => updateGrade(e, index)}
                            />
                        </li>
                    ))}
                </ul>
                <button className={style.submitButton}>Create Test</button>
            </form>
        </div>
    )
}

export default CreateTest