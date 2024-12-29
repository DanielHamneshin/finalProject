import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { CREATE_TEST, GET_ALL_STUDENTS } from '../../constants/endPoint';
import { useUserContext } from '../../contexts/UserContext';

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
        <>
            <form onSubmit={(e) => {
                e.preventDefault();
                createTest();
            }}>
                <input value={testName} type="text" placeholder='test name' onChange={(e) => setTestName(e.target.value)} />
                <ul>
                    {students.map((item, index) => {
                        return <li key={index}><h3>{item.name}</h3><input type="number" onChange={(e) => updateGrade(e, index)} /></li>
                    })}
                </ul>

                <button>create</button>

            </form>
        </>
    )
}

export default CreateTest