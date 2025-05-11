import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { CREATE_TEST, GET_ALL_STUDENTS } from '../../constants/endPoint';
import { useUserContext } from '../../contexts/UserContext';
import style from '../../styles/teacherFeedback.module.css';

const CreateTest = ({ course, close, showSuccess }) => {
    const { user } = useUserContext();
    const [students, setStudents] = useState([]);
    const [testName, setTestName] = useState("");
    const [searchText, setSearchText] = useState('');
    const getAllStudents = async () => {
        try {
            const { data } = await axios.get(GET_ALL_STUDENTS + course._id)
            setStudents(data.map((item, index) => {
                return { ...item, grade: 0, index: index }
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
            showSuccess();
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

    // Filter students based on search text
    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div className={style.modalContent}>
            <div className={style.modalHeader}>
                <div className={style.headerContent}>
                    <h2>Create Test for {course.name}</h2>
                </div>
            </div>

            <form className={style.form} onSubmit={(e) => {
                e.preventDefault();
                createTest();
            }}>
                <div className={style.testNameContainer}>
                    <input
                        type="text"
                        placeholder="Test name"
                        value={testName}
                        onChange={(e) => setTestName(e.target.value)}
                        className={style.testNameInput}
                        required
                    />
                </div>

                {/* Add search input */}
                <div className={style.searchContainer}>
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className={style.searchInput}
                    />
                </div>

                <ul className={style.studentsList}>
                    {filteredStudents.map((student, index) => (
                        <li key={index} className={style.studentItem}>
                            <h3 className={style.studentName}>{student.name}</h3>
                            <input
                                placeholder='Grade'
                                type="number"
                                min="0"
                                max="100"
                                className={style.gradeInput}
                                value={student.grade || ''}
                                onChange={(e) => updateGrade(e, student.index)}
                            />
                        </li>
                    ))}
                </ul>
                <button type="submit" className={style.submitButton}>Create Test</button>
            </form>
        </div>
    )
}

export default CreateTest