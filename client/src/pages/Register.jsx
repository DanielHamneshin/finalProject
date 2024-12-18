import React from 'react'
import { useForm } from "react-hook-form"
import axios from "axios"
import { NavLink } from 'react-router-dom';
import style from '../styles/login.module.css'


const Register = () => {
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
    const registeration = async () => {
        try {
            const res = await axios.post("http://127.0.0.1:5000/auth/register", watch());
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
                <input type="text" placeholder='name' {...register("name", { min: { value: 6, message: "minimum 6" } })} />
                <input type="email" placeholder='email' {...register("email")} />
                <input type="password" placeholder='password' {...register("password")} />
                <input type="password" placeholder='password again' {...register("passwordagain")} />

                <button>register</button>
                <h3>already have an account? <NavLink to='/login'>login</NavLink></h3>

            </form>
        </>
    )
}

export default Register