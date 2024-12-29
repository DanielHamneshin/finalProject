import React, { useEffect, useState } from 'react'
import { useUserContext } from '../../contexts/UserContext'
import { CREATE_LESSON, GET_ALL_STUDENTS } from '../../constants/endPoint';
import axios from 'axios';

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
        <div>
            <form style={{ marginTop: "150px" }} onSubmit={(e) => {
                e.preventDefault();
                createLesson();
            }}>
                <ul>
                    {students.map((item, index) => {
                        return <li key={index}><h3>{item.name}</h3><input type="checkbox" onChange={(e) => updateStudentStatus(e, index)} /><label htmlFor="">presence</label></li>
                    })}
                </ul>

                <button>create</button>

            </form>
        </div>
    )
}

export default CreateLesson