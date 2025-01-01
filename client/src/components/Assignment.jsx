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

    if (!assignment) {
        navigate('/personal/classroom');
        return null;
    }

    return (
        <>
            <Header />
            <div className={style.container} style={{ marginTop: '100px' }}>
                <button
                    onClick={() => navigate(`/personal/classroom/${course._id}`, {
                        state: { course, allCourses }
                    })}
                    className={style.backButton}
                >
                    Back to Course
                </button>

                <h2>{assignment.title}</h2>
                <p>Submitted: {assignment.students[0].submitted.toString()}</p>
                <input type="file" onChange={uploadFile} />

                {assignmentImage && (
                    <img
                        onClick={(e) => {
                            setImageUrl(e.target.src)
                            setIsLarge(true)
                        }}
                        src={assignmentImage}
                        alt={`Assignment ${assignment.title}`}
                        style={{ maxWidth: '300px', width: '300px', height: '200px' }}
                    />
                )}

                {isLarge && (
                    <Backdrop open={isLarge}>
                        <ClickAwayListener onClickAway={() => setIsLarge(false)}>
                            <img
                                src={imageUrl}
                                alt="Assignment"
                                style={{
                                    maxWidth: '95vw',
                                    maxHeight: '95vh',
                                    width: '80vw',
                                    height: '70vh',
                                    objectFit: 'contain',
                                    margin: 'auto',
                                    marginTop: '15vh'
                                }}
                            />
                        </ClickAwayListener>
                    </Backdrop>
                )}
            </div>
        </>
    )
}

export default Assignment