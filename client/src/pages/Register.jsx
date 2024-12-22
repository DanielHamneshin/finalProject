import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import axios from "axios"
import { NavLink } from 'react-router-dom';
import style from '../styles/login.module.css'
import { MAJORS_URL, REGISTER_URL } from '../constants/endPoint.js';


const Register = () => {
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
    const [majors, setMajors] = useState([]);


    const getMajors = async () => {
        try {
            const { data } = await axios.get(MAJORS_URL);
            setMajors(data);
        } catch (error) {
            console.error("failed fetching majors: " + error);
        }
    }


    const registeration = async () => {
        try {
            const res = await axios.post(REGISTER_URL, watch());
            console.log("created successfully");
            reset();
        } catch (error) {
            console.error("error creating user " + error);
        }
    }
    return (
        <>
            <form className={style.form} onSubmit={handleSubmit(registeration)} style={{ marginTop: "150px" }}>

                <h1>Register</h1>
                <input type="text" placeholder='name' {...register("name", { min: { message: "minimum 6" } })} />
                <input type="email" placeholder='email' {...register("email")} />
                <input type="password" placeholder='password' {...register("password")} />
                <input type="password" placeholder='password again' {...register("passwordagain")} />
                <select name="" id="" {...register("major", { required: true })}>
                    <option value="">select major</option>
                    {majors.map((item, index) => <option value={item.title} key={index}>{item.title}</option>)}
                </select>

                <button>register</button>
                <h3>already have an account? <NavLink to='/login'>login</NavLink></h3>

            </form>
        </>
    )
}

export default Register