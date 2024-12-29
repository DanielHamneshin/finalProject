import React, { useEffect } from 'react'
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

const MainApp = () => {
    axios.defaults.withCredentials = true
    const { setUser, user } = useUserContext()


    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data } = await axios.get("http://127.0.0.1:5000/authentication")
                setUser(data);
            } catch (error) {
                console.error(error);
            }
        }

        checkUser();

    }, [])
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/register' element={<Register />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/' element={<Home />} />
                    {user && user.role === "student" && <Route path='/personal' element={<PersonalArea />} />}
                    {user && user.role === "teacher" && <Route path='/teacherpersonal' element={<TeacherPersonalArea />} />}
                    <Route path='/*' element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default MainApp