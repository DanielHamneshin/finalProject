import React from 'react'
import { useUserContext } from '../contexts/UserContext'
import axios from 'axios'

const TeacherPersonalArea = () => {
    const { user } = useUserContext()
    const getAllStudents = async () => {
        const { data } = await axios.get()
    }
    return (
        <div>

        </div>
    )
}

export default TeacherPersonalArea