import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import axios from "axios"
import { NavLink, useNavigate } from 'react-router-dom'
import style from '../styles/login.module.css'
import { IconButton } from '@mui/material'
import { Email } from '@mui/icons-material'

const Login = () => {
    const [emailPlaceHolder, setEmailPlaceHolder] = useState("email");
    const [passwordPlaceHolder, setPasswordPlaceHolder] = useState("password");
    const navigate = useNavigate();
    axios.defaults.withCredentials = true
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
    const loging = async () => {
        try {
            const res = await axios.post("http://127.0.0.1:5000/auth/login/student", watch());
            console.log("logged in successfully");
            reset();
            navigate("/");
        } catch (error) {
            console.error("error loginng in " + error);
        }
    }
    return (
        <>
            <div className={style.container}>
                <form className={style.form} onSubmit={handleSubmit(loging)}>
                    <h1>Login</h1>

                    <input onBlurCapture={() => setEmailPlaceHolder("email")} onFocus={() => setEmailPlaceHolder("")} type="email" placeholder={emailPlaceHolder} {...register("email")} />
                    <input onBlurCapture={() => setPasswordPlaceHolder("password")} onFocus={() => setPasswordPlaceHolder("")} type="password" placeholder={passwordPlaceHolder} {...register("password")} />

                    <button>login</button>


                    <h3>don't have an account? <NavLink to='/register'>SignUp</NavLink></h3>
                </form>
            </div>
        </>
    )
}

export default Login