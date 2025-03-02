import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import axios from "axios"
import { NavLink, useNavigate } from 'react-router-dom'
import style from '../styles/login.module.css'
import { IconButton } from '@mui/material'
import { Email } from '@mui/icons-material'
import { ADMIN_LOGIN, LOGIN_URL, TEACHER_LOGIN } from '../constants/endPoint'

const Login = () => {
    const [emailPlaceHolder, setEmailPlaceHolder] = useState("email");
    const [passwordPlaceHolder, setPasswordPlaceHolder] = useState("password");
    const [role, setRole] = useState('student');
    const [loginError, setLoginError] = useState("");
    const navigate = useNavigate();
    axios.defaults.withCredentials = true
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();

    const studentLoging = async () => {
        try {
            setLoginError("");
            const res = await axios.post(LOGIN_URL, watch());
            console.log("logged in successfully");
            reset();
            navigate("/");
        } catch (error) {
            setLoginError(error.response?.data?.msg || "Error logging in");
            console.error("error logging in " + error);
        }
    }

    const teacherLoging = async () => {
        try {
            setLoginError("");
            const { data } = await axios.post(TEACHER_LOGIN, watch());
            console.log("logged in successfully");
            reset();
            navigate("/");
        } catch (error) {
            setLoginError(error.response?.data?.msg || "Error logging in");
            console.error("error logging in " + error);
        }
    }

    const adminLoging = async () => {
        try {
            setLoginError("");
            const res = await axios.post(ADMIN_LOGIN, watch());
            console.log("logged in successfully");
            reset();
            navigate("/");
        } catch (error) {
            setLoginError(error.response?.data?.msg || "Error logging in");
            console.error("error logging in " + error);
        }
    }
    return (
        <>
            <div className={style.container}>
                <form className={style.form} onSubmit={handleSubmit(() => {
                    switch (role) {
                        case "student":
                            studentLoging();
                            break;
                        case "teacher":
                            teacherLoging();
                            break;
                        case "admin":
                            adminLoging();
                            break;

                        default:
                            break;
                    }
                })}>
                    <h1>Login</h1>

                    {loginError && <p className={style.error}>{loginError}</p>}

                    {errors.email && <p className={style.error}>{errors.email.message}</p>}
                    <input onBlurCapture={() => setEmailPlaceHolder("email")} onFocus={() => setEmailPlaceHolder("")} type="email" placeholder={emailPlaceHolder} {...register("email", { required: { value: true, message: "email is required" } })} />

                    {errors.password && <p className={style.error}>{errors.password.message}</p>}
                    <input onBlurCapture={() => setPasswordPlaceHolder("password")} onFocus={() => setPasswordPlaceHolder("")} type="password" placeholder={passwordPlaceHolder} {...register("password", { required: { value: true, message: "password is required" } })} />

                    {role === "teacher" && (
                        <>
                            {errors.teacherPassword && <p className={style.error}>{errors.teacherPassword.message}</p>}
                            <input type="password" {...register("teacherPassword", { required: { value: true, message: "teacher password is required" } })} placeholder='teacher password' />
                        </>
                    )}

                    {role === "admin" && (
                        <>
                            {errors.adminPassword && <p className={style.error}>{errors.adminPassword.message}</p>}
                            <input type="password" {...register("adminPassword", { required: { value: true, message: "admin password is required" } })} placeholder='admin password' />
                        </>
                    )}

                    <select name="" id="" onChange={(e) => setRole(e.target.value)}>
                        <option value="student">student</option>
                        <option value="teacher">teacher</option>
                        <option value="admin">admin</option>
                    </select>
                    <button>login</button>


                    <h3>don't have an account? <NavLink to='/register'>SignUp</NavLink></h3>
                </form>
                <div className={style.welcomeSection}>
                    <h2>WELCOME BACK!</h2>
                    <p>Enter your personal details and start your journey with us</p>
                </div>
            </div>
        </>
    )
}

export default Login