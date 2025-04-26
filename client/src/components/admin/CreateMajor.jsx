import React, { useEffect, useState } from 'react'
import { Backdrop, Box, ClickAwayListener } from '@mui/material'
import style from '../../styles/createMajor.module.css'
import axios from 'axios'
import { CREATE_MAJOR, GET_UNASSIGNED_COURSES } from '../../constants/endPoint'

const CreateMajor = ({ open, close }) => {
    const [unAssignedCourses, setUnAssignedCourses] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [title, setTitle] = useState("");
    const [maxChoices, setMaxChoices] = useState(0);
    const getUnAssignedCourses = async () => {
        try {
            const { data } = await axios.get(GET_UNASSIGNED_COURSES);
            setUnAssignedCourses(data);
        } catch (error) {
            console.error(error);
        }
    }

    const createMajor = async () => {
        try {
            const { data } = await axios.post(CREATE_MAJOR, { courses: selectedCourses, title: title, max_choices: maxChoices });
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getUnAssignedCourses();
    }, [])

    return (
        <>
            <Backdrop open={open}>
                <ClickAwayListener onClickAway={close}>
                    <Box className={style.modalContent}>
                        <div className={style.modalHeader}>
                            <h1>Create Major</h1>
                        </div>
                        <form onSubmit={() => {
                            createMajor();
                            close();
                        }}>
                            <input type="text" placeholder="Major Name" className={style.inputField} onChange={(e) => setTitle(e.target.value)} />
                            <input type="number" placeholder="Max choices" className={style.inputField} onChange={(e) => setMaxChoices(e.target.value)} />
                            <div>
                                {unAssignedCourses.map((course, index) => {
                                    return <div key={index}>
                                        <input key={index + 1} type="checkbox" id={course._id} onChange={(e) => {
                                            setSelectedCourses((prev) => {
                                                if (e.target.checked) {
                                                    return [...prev, e.target.id]
                                                }
                                                else {
                                                    return prev.filter((id) => id !== e.target.id);
                                                }
                                            })
                                        }} />
                                        <label key={index + 2} htmlFor="">{course.name}</label>
                                    </div>
                                })}
                            </div>
                            <button type="submit" className={style.submitButton}>Create</button>
                        </form>
                    </Box>
                </ClickAwayListener>
            </Backdrop>
        </>
    )
}

export default CreateMajor


// {
//     !user.isCoursesFull && (
//         <div className={style.optionalCourses}>
//             <h4>Select Optional Courses (Max: {maxChoises})</h4>
//             {optionalCourses.map((item, index) => (
//                 <div className={style.option} key={index}>
//                     <input
//                         type="checkbox"
//                         value={item}
//                         onChange={chooseCourses}
//                         checked={chosenCourses.includes(item)}
//                         id={`course-${index}`}
//                     />
//                     <label htmlFor={`course-${index}`}>{item}</label>
//                 </div>
//             ))}
//             <button
//                 onClick={() => {
//                     if (chosenCourses.length === maxChoises) {
//                         updateCourses();
//                         setEffectTrigger(prev => !prev);
//                     } else {
//                         setError(`Please choose ${maxChoises} courses`);
//                     }
//                 }}
//             >
//                 Apply Selection
//             </button>
//             {error && <p className={style.error}>{error}</p>}
//         </div>
//     )
// }