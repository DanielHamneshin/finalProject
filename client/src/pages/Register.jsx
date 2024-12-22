import React, { useEffect, useState } from 'react'
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

    useEffect(() => {
        getMajors();
    }, [])


    const registeration = async () => {
        try {
            const res = await axios.post(REGISTER_URL, watch());
            console.log("created successfully");
            reset();
        } catch (error) {
            console.error("error creating user " + error);
        }
    }
    console.log(errors);

    return (
        <>
            <form className={style.form} onSubmit={handleSubmit(registeration)} style={{ marginTop: "150px" }}>

                <h1>Register</h1>
                {errors.name && <p>{errors.name.message}</p>}
                <input type="text" placeholder='name' {...register("name", { required: { value: true, message: "name is required" } })} />

                {errors.email && <p>{errors.email.message}</p>}
                <input type="email" placeholder='email' {...register("email", { required: { value: true, message: "email is required" } })} />

                {errors.password && <p>{errors.password.message}</p>}
                <input type="password" placeholder='password' {...register("password", { required: { value: true, message: "password is required" } })} />
                <input type="password" placeholder='password again' {...register("passwordagain", {})} />

                {errors.major && <p>{errors.major.message}</p>}
                <select name="" id="" {...register("major", { required: { value: true, message: "please choose major" } })}>
                    <option value="">select major</option>
                    {majors.map((item, index) => <option value={item} key={index}>{item}</option>)}
                </select>

                <button>register</button>
                <h3>already have an account? <NavLink to='/login'>login</NavLink></h3>

            </form>
        </>
    )
}

export default Register