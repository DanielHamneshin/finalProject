import React, { useEffect, useState } from 'react'
import { GET_ASSIGNMENTS_BY_COURSE, UPLOAD_FILE } from '../constants/endPoint';
import axios from 'axios';
import { useUserContext } from '../contexts/UserContext';
import Backdrop from '@mui/material/Backdrop';
import { ClickAwayListener } from '@mui/material';

const ClassroomCourse = ({ course, closeCourse }) => {
    const [imageUrl, setImageUrl] = useState('');
    const [isLarge, setIsLarge] = useState(false);
    const { user } = useUserContext();
    const [assignments, setAssignments] = useState([]);
    const [assignmentImages, setAssignmentImages] = useState({});

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

    const uploadFile = async (e, assignment) => {
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
                    await getAssignmentsByCourse();
                } catch (error) {
                    console.error(error);
                }
            }
            reader.readAsDataURL(file);
        }
    }

    useEffect(() => {
        assignments.forEach(assignment => {
            if (assignment.students[0]?.file) {
                const bytes = new Uint8Array(assignment.students[0].file.data);
                const base64String = btoa(String.fromCharCode.apply(null, bytes));
                const imageUrl = `data:image/png;base64,${base64String}`;
                setAssignmentImages(prev => ({
                    ...prev,
                    [assignment._id]: imageUrl
                }));
            }
        });
    }, [assignments]);

    return (
        <>
            {assignments.map((assignment, index) => (
                <div key={assignment._id}>
                    <h2>{assignment.title}</h2>
                    <p>{assignment.uploadDate}</p>
                    <p>{assignment.finishDate.split("T")[0]}</p>
                    <p>{assignment.students[0].submitted.toString()}</p>
                    {/* <h2>{course.teacher}</h2> */}
                    {<input type="file" onChange={(e) => uploadFile(e, assignment)} />}

                    {assignmentImages[assignment._id] && (
                        <img
                            onClick={(e) => {
                                setImageUrl(e.target.src)
                                setIsLarge(true)
                            }}
                            src={assignmentImages[assignment._id]}
                            alt={`Assignment ${assignment.title}`}
                            style={{ maxWidth: '300px' }}
                        />
                    )}
                </div>
            ))}
            <button onClick={closeCourse}>close</button>
            {isLarge && <Backdrop open={isLarge} >
                <ClickAwayListener onClickAway={() => setIsLarge(false)}>
                    <img
                        src={imageUrl}
                        alt="Assignment"
                        style={{
                            maxWidth: '95vw',
                            maxHeight: '95vh',
                            width: '80vw',
                            height: '85vh',
                            objectFit: 'contain',
                            margin: 'auto',
                            marginTop: '10vh'
                        }}
                    />
                </ClickAwayListener>
            </Backdrop>}
        </>
    )
}

export default ClassroomCourse