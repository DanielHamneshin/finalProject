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
    const [assignmentFileImage, setAssignmentFileImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (assignment?.students[0]?.file) {
            const bytes = new Uint8Array(assignment.students[0].file.data);
            const base64String = btoa(String.fromCharCode.apply(null, bytes));
            const imageUrl = `data:image/png;base64,${base64String}`;
            setAssignmentImage(imageUrl);
        }

        if (assignment?.file) {
            const bytes = new Uint8Array(assignment.file.data);
            const base64String = btoa(String.fromCharCode.apply(null, bytes));
            const imageUrl = `data:image/png;base64,${base64String}`;
            setAssignmentFileImage(imageUrl);
        }
    }, [assignment]);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setSelectedFileName(file.name);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!selectedFile) return;

        setIsSubmitting(true);
        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const base64 = e.target.result;
                try {
                    const { data } = await axios.post(
                        UPLOAD_FILE + assignment._id + "/" + user._id,
                        { file: base64.split(',')[1] }
                    );

                    // Update the assignment image immediately
                    setAssignmentImage(previewImage);

                    // Clear all file-related states
                    setSelectedFile(null);
                    setSelectedFileName('');
                    setPreviewImage(null);

                    console.log("File uploaded successfully");
                } catch (error) {
                    console.error("Error uploading file:", error);
                }
            };
            reader.readAsDataURL(selectedFile);
        } catch (error) {
            console.error("Error preparing file:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getGradeClass = (grade) => {
        if (!grade) return '';
        const numGrade = Number(grade);
        if (numGrade < 55) return style.gradeFail;
        if (numGrade < 70) return style.gradeWarning;
        if (numGrade < 85) return style.gradeGood;
        return style.gradeExcellent;
    };

    if (!assignment) {
        navigate('/personal/classroom');
        return null;
    }

    console.log(assignment);
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
                    {/* Info and File Preview Flex Container */}
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        {/* Left side - Assignment Information */}
                        <div style={{ flex: '1' }}>
                            <h2>Assignment Information</h2>
                            <p>Description: {assignment.description}</p>
                            <p>Upload Date: {assignment?.uploadDate?.split('T')[0]}</p>
                            <p>Finish Date: {assignment?.finishDate?.split('T')[0]}</p>
                            <p className={`${style.status} ${assignment?.students[0]?.submitted ? style.statusSubmitted : style.statusPending}`}>
                                Status: {assignment?.students[0]?.submitted ? "Submitted" : "Pending"}
                            </p>
                            <p>Grade: <span className={`${style.grade} ${getGradeClass(assignment?.students[0]?.grade)}`}>
                                {assignment?.students[0]?.grade || 'Not graded'}
                            </span></p>
                        </div>

                        {/* Right side - Assignment File Preview */}
                        {assignmentFileImage && (
                            <div style={{ textAlign: 'center', margin: 0 }}>
                                <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>Assignment File</p>
                                <img
                                    className={style.scaleImage}
                                    onClick={(e) => {
                                        setImageUrl(e.target.src)
                                        setIsLarge(true)
                                    }}
                                    src={assignmentFileImage}
                                    alt="Assignment File"
                                />
                            </div>
                        )}
                    </div>

                    {/* Upload Section */}
                    {(new Date(assignment.finishDate) > new Date()) && (
                        <div className={style.uploadSection}>
                            <h3>Submit Your Work</h3>
                            <label className={style.fileInputLabel}>
                                Choose File
                                <input
                                    type="file"
                                    onChange={handleFileSelect}
                                    className={style.fileInput}
                                    accept="image/*"
                                />
                            </label>
                            {selectedFileName && (
                                <p className={style.fileName}>
                                    Selected file: {selectedFileName}
                                </p>
                            )}

                            {/* Preview Section */}
                            {previewImage && (
                                <div className={style.previewSection}>
                                    <h4>Preview</h4>
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className={style.previewImage}
                                    />
                                </div>
                            )}

                            {/* Submit Button */}
                            {selectedFile && (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className={style.submitButton}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
                                </button>
                            )}
                        </div>
                    )}

                    {/* Student Submission Preview */}
                    {assignmentImage && (
                        <div style={{ textAlign: 'center', margin: 0 }}>
                            <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>Your Submission</p>
                            <img
                                className={style.scaleImage}
                                onClick={(e) => {
                                    setImageUrl(e.target.src)
                                    setIsLarge(true)
                                }}
                                src={assignmentImage}
                                alt="Student Submission"
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