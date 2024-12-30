import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { GET_ALL_STUDENTS, GET_STUDENTS_INFO } from '../../constants/endPoint';
import { useUserContext } from '../../contexts/UserContext';
import { IconButton } from '@mui/material';
import { Cancel } from '@mui/icons-material';

const StudentsInfo = ({ course, close }) => {
    const { user } = useUserContext();
    const [allStudents, setAllStudents] = useState([]);
    const [student, setStudent] = useState(null);

    const getStudentsInfo = async (student) => {
        try {
            const { data } = await axios.get(GET_STUDENTS_INFO + student._id + "/" + course._id);
            setStudent(data);
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
    console.log(student);

    return (
        <>
            <IconButton onClick={() => {
                close();
                setStudent(null);
            }}><Cancel /></IconButton>
            <ul>
                {allStudents.map((student) => {
                    return (
                        <li key={student._id} onClick={() => getStudentsInfo(student)}>{student.name}</li>
                    )
                })}
            </ul>

            {student && (<IconButton onClick={() => {
                setStudent(null);
            }}><Cancel /></IconButton>)}
            {student && (
                <ul>
                    <li>Tests:</li>
                    <ul>
                        {student.tests.map((test) => {

                            return (
                                <li key={test._id}>{test.test_id.name}  Grade:    {test.grade}</li>

                            )
                        })}
                    </ul>

                    <li>Assignments:</li>
                    <ul>
                        {student.assignments.map((assignment) => {
                            return (
                                <li key={assignment._id}>{assignment.assignment_id.name}  Grade:    {assignment.grade}</li>
                            )
                        })}
                    </ul>

                    <li>Attendence:</li>
                    <ul>
                        {student.attendence.map((lesson) => {
                            return (
                                <li key={lesson._id}>Lesson number: {lesson.lessonNum}{lesson.course_id.name}  Status:    {lesson.status}</li>
                            )
                        })}
                    </ul>

                    <li>Absence:</li>
                    <ul>
                        {student.absence.map((lesson) => {
                            return (
                                <li key={lesson._id}>Lesson number: {lesson.lessonNum}{lesson.course_id.name}  Status:    {lesson.status}</li>
                            )
                        })}
                    </ul>



                </ul>
            )}
        </>
    )
}

export default StudentsInfo