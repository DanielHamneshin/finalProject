import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../Header';
import style from '../../styles/teacherAssignment.module.css';
import { Backdrop, ClickAwayListener } from '@mui/material';

const TeacherAssignment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { assignment, course, allCourses } = location.state || {};
    const [assignmentImage, setAssignmentImage] = useState(null);
    const [isLarge, setIsLarge] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        if (assignment?.file?.data) {
            const bytes = new Uint8Array(assignment.file.data);
            const base64String = btoa(String.fromCharCode.apply(null, bytes));
            const imageUrl = `data:image/png;base64,${base64String}`;
            setAssignmentImage(imageUrl);
        }
    }, [assignment]);

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
                            <h1>{assignment.title}</h1>
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
                    <p>Due Date: {new Date(assignment.finishDate).toLocaleDateString()}</p>
                    <p>Description: {assignment.description}</p>

                    {/* Preview Section */}
                    {assignmentImage && (
                        <div className={style.previewImage}>
                            <img
                                onClick={(e) => {
                                    setImageUrl(e.target.src);
                                    setIsLarge(true);
                                }}
                                src={assignmentImage}
                                alt={`Assignment ${assignment.title}`}
                            />
                        </div>
                    )}

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