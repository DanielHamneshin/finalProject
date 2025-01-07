import React, { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import PersonalArea from './pages/PersonalArea'
import Header from './components/Header'
import Carousel from './components/Carousel'
import { Container, createTheme, ThemeProvider } from '@mui/material'
import { useUserContext } from './contexts/UserContext'
import axios from 'axios'
import NotFound from './pages/NotFound'
import TeacherPersonalArea from './pages/TeacherPersonalArea'
import TeacherClassRoom from './components/teacher/TeacherClassRoom'
import CourseAssignments from './components/teacher/CourseAssignments'
import StudentClassroom from './components/StudentClassroom'
import ClassroomCourse from './components/ClassroomCourse'
import Feedback from './components/Feedback'
import Assignment from './components/Assignment'
import TeacherAssignment from './components/teacher/TeacherAssignment'
import TeacherFeedback from './components/teacher/TeacherFeedback'
import AdminPersonalArea from './pages/AdminPersonalArea'
import PayDebt from './pages/PayDebt'
import PayPal from './components/PayPal'

const MainApp = () => {
    axios.defaults.withCredentials = true
    const { setUser, user } = useUserContext()
    const [isInitialLoad, setIsInitialLoad] = useState(true)

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data } = await axios.get("http://127.0.0.1:5000/authentication")
                setUser(data)
                setIsInitialLoad(false)
            } catch (error) {
                console.error(error)
                setIsInitialLoad(false)
            }
        }

        checkUser()
    }, [isInitialLoad])

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/register' element={<Register />} />
                <Route path='/login' element={<Login />} />
                <Route path='/' element={<Home setIsInitialLoad={setIsInitialLoad} />} />
                {user && user.role === "student" && (
                    <>
                        <Route path='/personal' element={<PersonalArea />} />
                        <Route path='/personal/feedback' element={<Feedback />} />
                        <Route path='/personal/classroom' element={<StudentClassroom />} />
                        <Route
                            path='/personal/classroom/:courseId'
                            element={<ClassroomCourse key={window.location.pathname} />}
                        />
                        <Route path='/personal/classroom/:courseId/assignment/:assignmentId' element={<Assignment />} />
                        {user?.debt > 0 && <Route path='/personal/paydebt' element={<PayPal />} />}
                    </>
                )}
                {user && user.role === "teacher" &&
                    <Route path='/teacherpersonal' element={<TeacherPersonalArea />}>
                        <Route path="classroom" element={<TeacherClassRoom />} />
                        <Route path="classroom/:courseName" element={<CourseAssignments />} />
                        <Route path="classroom/:courseName/assignment/:assignmentId" element={<TeacherAssignment />} />
                        <Route path="feedback" element={<TeacherFeedback />} />
                    </Route>}
                {user && user.role === "admin" &&
                    <Route path='/adminpersonal' element={<AdminPersonalArea />}>
                        {/* Add nested admin routes here if needed */}
                    </Route>
                }
                <Route path='/*' element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}

export default MainApp