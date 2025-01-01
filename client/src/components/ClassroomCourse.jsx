import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import style from '../styles/studentClassroom.module.css';
import { GET_ASSIGNMENTS_BY_COURSE } from '../constants/endPoint';
import axios from 'axios';
import { useUserContext } from '../contexts/UserContext';

const ClassroomCourse = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const course = location.state?.course;
    const allCourses = location.state?.allCourses;
    const [assignments, setAssignments] = useState([]);
    const { user } = useUserContext();

    useEffect(() => {
        const getAssignmentsByCourse = async () => {
            try {
                const { data } = await axios.get(GET_ASSIGNMENTS_BY_COURSE + user._id + "/" + course._id);
                setAssignments(data);
            } catch (error) {
                console.error(error);
            }
        }
        if (course && user) {
            getAssignmentsByCourse();
        }
    }, [course, user]);

    if (!course) {
        navigate('/personal/classroom');
        return null;
    }

    const handleAssignmentClick = (assignment) => {
        navigate(`/personal/classroom/${course._id}/assignment/${assignment._id}`, {
            state: {
                assignment,
                course,
                allCourses
            }
        });
    };

    return (
        <>
            <Header />
            <div className={style.container} style={{ marginTop: '100px' }}>
                <button
                    onClick={() => navigate('/personal/classroom', {
                        state: { courses: allCourses }
                    })}
                    className={style.backButton}
                >
                    Back to Classroom
                </button>

                <h2>{course.name}</h2>

                {assignments.map((assignment) => (
                    <div
                        key={assignment._id}
                        className={style.assignment}
                        onClick={() => handleAssignmentClick(assignment)}
                    >
                        <h3>{assignment.title}</h3>
                        <p>Upload Date: {assignment.uploadDate}</p>
                        <p>Due Date: {assignment.finishDate.split("T")[0]}</p>
                    </div>
                ))}
            </div>
        </>
    )
}

export default ClassroomCourse