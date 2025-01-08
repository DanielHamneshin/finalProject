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
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

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

    const filteredAssignments = assignments.filter(assignment =>
        assignment.title.toLowerCase().includes(searchText.toLowerCase()) &&
        (statusFilter === 'all' ||
            (statusFilter === 'submitted' && assignment?.students[0]?.submitted) ||
            (statusFilter === 'pending' && !assignment?.students[0]?.submitted))
    );

    console.log(assignments);
    return (
        <>
            <Header />
            <div className={style.container}>
                <div className={style.headerPaper}>
                    <div className={style.headerContent}>
                        <div>
                            <h1>{course.name}</h1>
                            <p>Course Assignments</p>
                        </div>
                        <button
                            onClick={() => navigate('/personal/classroom', {
                                state: { courses: allCourses }
                            })}
                            className={style.backButton}
                        >
                            Back
                        </button>
                    </div>
                </div>

                <div className={style.filterContainer}>
                    <div className={style.filterWrapper}>
                        <label className={style.filterLabel}>
                            Assignment Name
                        </label>
                        <input
                            type="text"
                            placeholder="Search assignments..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className={style.filterInput}
                        />
                    </div>
                    <div className={style.filterWrapper}>
                        <label className={style.filterLabel}>
                            Status
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className={style.filterSelect}
                        >
                            <option value="all">All Status</option>
                            <option value="submitted">Submitted</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                </div>

                <div className={style.assignmentsGrid}>
                    {filteredAssignments.map((assignment) => (
                        <div
                            key={assignment._id}
                            className={style.assignmentCard}
                            onClick={() => handleAssignmentClick(assignment)}
                        >
                            <h2>{assignment.title}</h2>
                            <p>Upload Date: {assignment?.uploadDate?.split("T")[0]}</p>
                            <p>Due Date: {assignment?.finishDate?.split("T")[0]}</p>
                            <p>Status: <span className={`${style.status} ${assignment?.students[0]?.submitted ? style.statusSubmitted : style.statusPending
                                }`}>
                                {assignment?.students[0]?.submitted ? "Submitted" : "Pending"}
                            </span></p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default ClassroomCourse