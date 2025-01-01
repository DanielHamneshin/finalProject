import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import StudentCard from '../components/StudentCard'
import { useUserContext } from '../contexts/UserContext'
import style from '../styles/personal.module.css'
import axios from 'axios'
import { GET_ALL_COURSES_URL, OPTIONAL_COURSES_CHOOSE_URL, OPTIONAL_COURSES_URL } from '../constants/endPoint'
import Feedback from '../components/Feedback'
import StudentClassroom from '../components/StudentClassroom'
import { Outlet, useNavigate } from 'react-router-dom'
// TODO: only added studens card
const PersonalArea = () => {
    const [effectTrigger, setEffectTrigger] = useState(false);
    const [isInFeedback, setIsInFeedback] = useState(true);
    const { user, setUser } = useUserContext();
    const [allCourses, setAllCourses] = useState([]);
    const [optionalCourses, setOptionalCourses] = useState([]);
    const [maxChoises, setMaxChoises] = useState(0);
    const [chosenCourses, setChosenCourses] = useState([]);
    const [currentCourse, setCurrentCourse] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const switchComponents = () => {
        setIsInFeedback((prev) => !prev)
    }

    const getAllCourses = async () => {
        try {
            const { data } = await axios.get(GET_ALL_COURSES_URL + user._id + "/" + user.role);
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


    useEffect(() => {
        if (user.isCoursesFull) {
            getAllCourses();
        } else {
            getOptionalCourses();
        }
    }, [user.isCoursesFull, effectTrigger]);



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

    const navigateToClassroom = () => {
        console.log("Courses being passed:", allCourses); // Debug log
        navigate('/personal/classroom', {
            state: { courses: allCourses }
        });
    };

    // Add this to check when courses are loaded
    useEffect(() => {
        console.log("Current allCourses:", allCourses);
    }, [allCourses]);
    console.log(allCourses);
    // Let's also check your existing course fetching logic


    return (
        <>
            <Header />

            <div className={style.navigationButtons} style={{ marginTop: '100px' }}>
                <button onClick={() => navigate('/personal/feedback')}>
                    Go to Feedback Page
                </button>
                <button onClick={navigateToClassroom}>
                    Go to Classroom Page ({allCourses.length} courses) {/* Debug info */}
                </button>
            </div>
            <Outlet />
        </>
    )
}

export default PersonalArea