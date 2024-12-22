import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import StudentCard from '../components/StudentCard'
import { useUserContext } from '../contexts/UserContext'
import style from '../styles/personal.module.css'
import axios from 'axios'
import { GET_ALL_COURSES_URL, OPTIONAL_COURSES_CHOOSE_URL, OPTIONAL_COURSES_URL } from '../constants/endPoint'
import Feedback from '../components/Feedback'
// TODO: only added studens card
const PersonalArea = () => {
    const { user, setUser } = useUserContext();
    const [allCourses, setAllCourses] = useState([]);
    const [optionalCourses, setOptionalCourses] = useState([]);
    const [maxChoises, setMaxChoises] = useState(0);
    const [chosenCourses, setChosenCourses] = useState([]);
    const [currentCourse, setCurrentCourse] = useState("");
    const [error, setError] = useState("");

    const getAllCourses = async () => {
        try {
            const { data } = await axios.get(GET_ALL_COURSES_URL + user._id);
            setAllCourses(data);
        } catch (error) {
            console.error(error);
        }
    }




    const getOptionalCourses = async () => {
        try {
            const { data } = await axios.get(OPTIONAL_COURSES_URL + user._id);
            setOptionalCourses(data.courses);
            setMaxChoises(data.max);
        } catch (error) {
            console.error(error);
        }
    }

    const updateCourses = async () => {
        try {
            const { data } = await axios.put(OPTIONAL_COURSES_CHOOSE_URL + user._id, { courses: chosenCourses });
            setUser(data);
            console.log("updated");

        } catch (error) {
            console.error(error);
        }
    }

    !user.isCoursesFull && useEffect(() => {// If the user didnt choose all his courses yet give him the optional courses
        getOptionalCourses();
    }, []);

    user.isCoursesFull && useEffect(() => {// If the student already chose his courses present him all his courses
        getAllCourses();
    }, []);


    const chooseCourses = (e) => {
        const { value, checked } = e.target; // Get the value and checked state of the checkbox
        setError("");
        setChosenCourses((prev) => {
            if (checked) {
                // Add the course if it's checked
                return [...prev, value];
            } else {
                // Remove the course if it's unchecked
                return prev.filter((course) => course !== value);
            }
        });
    };



    return (
        <>
            <Header />
            <main className={style.main}>
                {user.isCoursesFull && <select name="" id="" onChange={(e) => setCurrentCourse(e.target.value)}>
                    <option value="">Select course</option>
                    {allCourses.map((course, index) => <option value={course} key={index}>{course}</option>)}
                </select>}


                {!user.isCoursesFull && <div className={style.optionalCourses}>
                    <h4>select optional courses max: {maxChoises}</h4>
                    {optionalCourses.map((item, index) => {
                        return (
                            <div className={style.option} key={index}>
                                <input
                                    type="checkbox"
                                    value={item} // Set the value to the course name
                                    onChange={chooseCourses}
                                    checked={chosenCourses.includes(item)} // Sync with state
                                />
                                <label htmlFor="">{item}</label>
                            </div>
                        );
                    })}
                    <button onClick={() => {
                        if (chosenCourses.length == maxChoises) {
                            updateCourses();
                        }
                        else {
                            setError(`please choose ${maxChoises} courses`);
                        }
                    }}>aplly</button>
                    {error && <p>{error}</p>}
                </div>}

                <Feedback />
            </main>
        </>
    )
}

export default PersonalArea