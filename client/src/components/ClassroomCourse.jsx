import React, { useEffect, useState } from 'react'
import { GET_ASSIGNMENTS_BY_COURSE } from '../constants/endPoint';
import axios from 'axios';
import { useUserContext } from '../contexts/UserContext';

const ClassroomCourse = ({ course }) => {
    const { user } = useUserContext();
    const [assignments, setAssignments] = useState([]);
    const getAssignmentsByCourse = async () => {
        try {
            const { data } = await axios.get(GET_ASSIGNMENTS_BY_COURSE + user._id + "/" + course._id);
            setAssignments(data);
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        getAssignmentsByCourse();
    }, []);
    return (
        <>
            {assignments.map((assignment) => (
                <div key={assignment._id}>
                    <h2>{assignment.name}</h2>
                </div>
            ))}
        </>
    )
}

export default ClassroomCourse