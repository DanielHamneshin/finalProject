import React, { useEffect, useState } from 'react'
import { useUserContext } from '../contexts/UserContext'
import axios from 'axios'
import { GET_ALL_STUDENTS } from '../constants/endPoint'

const TeacherPersonalArea = () => {
    const { user } = useUserContext();
    const [students, setStudents] = useState([]);
    const getAllStudents = async () => {
        try {
            const { data } = await axios.get(GET_ALL_STUDENTS + user._id)
            setStudents(data)
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getAllStudents();
    }, [])
    return (
        <div>

        </div>
    )
}

export default TeacherPersonalArea