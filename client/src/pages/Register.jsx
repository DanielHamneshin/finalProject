import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import axios from "axios"
import { NavLink, useNavigate } from 'react-router-dom';
import style from '../styles/login.module.css'
import { MAJORS_URL, REGISTER_URL } from '../constants/endPoint.js';


const Register = () => {
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
    const [majors, setMajors] = useState([]);
    const [registerError, setRegisterError] = useState("");
    const navigate = useNavigate();


    const getMajors = async () => {
        try {
            const { data } = await axios.get(MAJORS_URL);
            setMajors(data);
        } catch (error) {
            console.error("failed fetching majors: " + error);
        }
    }

    useEffect(() => {
        getMajors();
    }, [])


    const registeration = async () => {
        try {
            setRegisterError("");
            const res = await axios.post(REGISTER_URL, watch());
            console.log("created successfully");
            reset();
            navigate("/login");
        } catch (error) {
            setRegisterError(error.response?.data?.msg || "Error creating account");
            console.error("error creating user " + error);
        }
    }
    return (
        <div className={style.container}>
            <form className={style.form} onSubmit={handleSubmit(registeration)}>
                <h1>Register</h1>
                {registerError && <p className={style.error}>{registerError}</p>}
                {errors.name && <p className={style.error}>{errors.name.message}</p>}
                <input type="text" placeholder='name' {...register("name", { required: { value: true, message: "name is required" } })} />

                {errors.email && <p className={style.error}>{errors.email.message}</p>}
                <input type="email" placeholder='email' {...register("email", { required: { value: true, message: "email is required" } })} />

                {errors.password && <p className={style.error}>{errors.password.message}</p>}
                <input type="password" placeholder='password' {...register("password", { required: { value: true, message: "password is required" } })} />
                {errors.passwordagain && <p className={style.error}>{errors.passwordagain.message}</p>}
                <input type="password" placeholder='password again' {...register("passwordagain", { required: { value: true, message: "please enter your password again" } })} />

                {errors.major && <p className={style.error}>{errors.major.message}</p>}
                <select name="" id="" {...register("major", { required: { value: true, message: "please choose major" } })}>
                    <option value="">select major</option>
                    {majors.map((item, index) => <option value={item} key={index}>{item}</option>)}
                </select>

                <button>register</button>
                <h3>already have an account? <NavLink to='/login'>login</NavLink></h3>
            </form>
            <div className={style.welcomeSection}>
                <h2>HELLO, FRIEND!</h2>
                <p>Fill up your information and start your journey with us</p>
            </div>
        </div>
    )
}

export default Register