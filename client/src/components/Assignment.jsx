import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './Header'
import { UPLOAD_FILE } from '../constants/endPoint';
import axios from 'axios';
import { useUserContext } from '../contexts/UserContext';
import Backdrop from '@mui/material/Backdrop';
import { ClickAwayListener } from '@mui/material';
import style from '../styles/assignment.module.css';


const Assignment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { assignment, course, allCourses } = location.state || {};
    const { user } = useUserContext();
    const [imageUrl, setImageUrl] = useState('');
    const [isLarge, setIsLarge] = useState(false);
    const [assignmentImage, setAssignmentImage] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState('');

    useEffect(() => {
        if (assignment?.students[0]?.file) {
            const bytes = new Uint8Array(assignment.students[0].file.data);
            const base64String = btoa(String.fromCharCode.apply(null, bytes));
            const imageUrl = `data:image/png;base64,${base64String}`;
            setAssignmentImage(imageUrl);
        }
    }, [assignment]);

    const uploadFile = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const base64 = e.target.result;
                try {
                    const { data } = await axios.post(UPLOAD_FILE + assignment._id + "/" + user._id, {
                        file: base64.split(',')[1]
                    });
                    console.log(data);
                    // Refresh assignment data or show success message
                } catch (error) {
                    console.error(error);
                }
            }
            reader.readAsDataURL(file);
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFileName(file.name);
            uploadFile(e);
        }
    };

    if (!assignment) {
        navigate('/personal/classroom');
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
                            onClick={() => navigate(`/personal/classroom/${course._id}`, {
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
                    <p className={`${style.status} ${assignment.students[0].submitted ? style.statusSubmitted : style.statusPending}`}>
                        Status: {assignment.students[0].submitted ? "Submitted" : "Pending"}
                    </p>

                    {/* Upload Section */}
                    {(new Date(assignment.finishDate) > new Date()) && (
                        <div className={style.uploadSection}>
                            <h3>Submit Your Work</h3>
                            <label className={style.fileInputLabel}>
                                Choose File
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className={style.fileInput}
                                    accept="image/*"
                                />
                            </label>
                            {selectedFileName && (
                                <p className={style.fileName}>
                                    Selected file: {selectedFileName}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Preview Section */}
                    {assignmentImage && (
                        <div className={style.previewImage}>
                            <img
                                onClick={(e) => {
                                    setImageUrl(e.target.src)
                                    setIsLarge(true)
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
    )
}

export default Assignment