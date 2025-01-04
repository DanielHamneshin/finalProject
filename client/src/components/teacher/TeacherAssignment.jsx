import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../Header';
import style from '../../styles/teacherAssignment.module.css';
import { Backdrop, ClickAwayListener } from '@mui/material';
import { GRADE_ASSIGNMENT } from '../../constants/endPoint';
import axios from 'axios';

const TeacherAssignment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { assignment, course, allCourses } = location.state || {};
    const [assignmentImage, setAssignmentImage] = useState(null);
    const [isLarge, setIsLarge] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [assignmentState, setAssignmentState] = useState(assignment);
    const [grades, setGrades] = useState(() => {
        return assignmentState?.students?.map(() => ({ grade: '', student_id: '' })) || [];
    });

    useEffect(() => {
        if (assignmentState?.file?.data) {
            const bytes = new Uint8Array(assignmentState.file.data);
            const base64String = btoa(String.fromCharCode.apply(null, bytes));
            const imageUrl = `data:image/png;base64,${base64String}`;
            setAssignmentImage(imageUrl);
        }
    }, [assignmentState]);

    const handleStudentClick = (student) => {
        if (student?.file?.data) {
            const bytes = new Uint8Array(student.file.data);
            const base64String = btoa(String.fromCharCode.apply(null, bytes));
            const imageUrl = `data:image/png;base64,${base64String}`;
            setImageUrl(imageUrl);
            setIsLarge(true);
        }
    };

    const handleGradeChange = (e, studentId, index) => {
        const newGrades = [...grades];
        newGrades[index] = {
            grade: e.target.value,
            student_id: studentId
        };
        setGrades(newGrades);
    };

    const handleGradeSubmit = async (index) => {
        try {
            if (grades[index].grade && grades[index].student_id && assignmentState.students[index].submitted) {
                const { data } = await axios.put(GRADE_ASSIGNMENT + assignmentState._id, grades[index]);
                console.log(data);
                setAssignmentState(data);
            } else {
                console.log("Please fill all the fields");
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (!assignment) {
        navigate('/teacherpersonal/classroom');
        return null;
    }
    return (
        <>
            <Header />
            <div className={style.container}>
                {/* Header Section */}
                <div className={style.headerPaper}>
                    <div className={style.headerContent}>
                        <div>
                            <h1>{assignmentState.title}</h1>
                            <p>Assignment Details</p>
                        </div>
                        <button
                            onClick={() => navigate(`/teacherpersonal/classroom/${course.name}`, {
                                state: { course, allCourses }
                            })}
                            className={style.backButton}
                        >
                            Back to Course
                        </button>
                    </div>
                </div>

                {/* Content Section */}
                <div className={style.content}>
                    <h2>Assignment Information</h2>
                    <p>Uploaded Date: {new Date(assignmentState.uploadDate).toLocaleDateString()}</p>
                    <p>Due Date: {new Date(assignmentState.finishDate).toLocaleDateString()}</p>
                    <p>Description: {assignmentState.description}</p>

                    {/* Preview Section */}
                    {assignmentImage && (
                        <div className={style.previewImage}>
                            <img
                                onClick={(e) => {
                                    setImageUrl(e.target.src);
                                    setIsLarge(true);
                                }}
                                src={assignmentImage}
                                alt={`Assignment ${assignmentState.title}`}
                            />
                        </div>
                    )}

                    {/* Students Section */}
                    <div className={style.studentsGrid}>
                        {assignmentState.students.map((student, index) => (
                            <div key={index} className={style.studentCard}>
                                <p className={style.studentName}>{student.student_details.name}</p>
                                <p className={style.studentGrade}>
                                    Grade: {student.grade || 'Not graded'}
                                </p>
                                <p className={`${style.submissionStatus} ${student.submitted ? style.statusSubmitted : style.statusPending}`}>
                                    {student.submitted ? "Submitted" : "Not Submitted"}
                                </p>
                                {!student.grade && (
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <input
                                            className={style.gradeInput}
                                            type="number"
                                            min={0}
                                            max={100}
                                            placeholder="Grade"
                                            value={grades[index]?.grade || ''}
                                            onChange={(e) => handleGradeChange(e, student.student_details._id, index)}
                                        />
                                        <button
                                            disabled={!grades[index]?.grade || !grades[index]?.student_id || !assignmentState.students[index].submitted}
                                            className={style.gradeButton}
                                            onClick={() => handleGradeSubmit(index)}
                                        >
                                            Submit Grade
                                        </button>
                                    </div>
                                )}
                                {student.file?.data && (
                                    <button
                                        className={style.viewFileButton}
                                        onClick={() => handleStudentClick(student)}
                                    >
                                        View Submission
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Large Image Modal */}
                    {isLarge && (
                        <Backdrop open={isLarge}>
                            <ClickAwayListener onClickAway={() => setIsLarge(false)}>
                                <img
                                    src={imageUrl}
                                    alt="Assignment"
                                    className={style.modalImage}
                                />
                            </ClickAwayListener>
                        </Backdrop>
                    )}
                </div>
            </div>
        </>
    );
};

export default TeacherAssignment;