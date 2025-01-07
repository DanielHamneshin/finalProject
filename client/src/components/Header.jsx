import React from 'react'
import { DensityMedium, AccountCircle, Logout, Login, DarkModeOutlined, LightModeOutlined } from '@mui/icons-material'
import { AppBar, Box, IconButton, Toolbar } from '@mui/material';
import SideBar from './SideBar';
import { useUserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
const Header = () => {
    const { user, setUser } = useUserContext();
    const firstName = user ? user.name.split(" ")[0] : "";
    const lastName = user ? user.name.split(" ")[1] : "";
    const logout = async () => {
        try {
            await axios.post("http://127.0.0.1:5000/auth/logout");
            setUser(null);
            navigate("/")
        } catch (error) {
            console.error(error);
        }
    }

    const navigate = useNavigate()
    return (
        <AppBar>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", bgcolor: "white", height: "120px" }}>
                {user && <h1 style={{ color: "black", marginLeft: "50px" }}>Hello {user.name}</h1>}
                <IconButton onClick={() => {
                    if (user) {
                        if (user.role === "student") navigate("/personal")
                        if (user.role === "teacher") navigate("/teacherpersonal")
                        if (user.role === "admin") navigate("/adminpersonal")
                    }
                    else {
                        navigate("/login")
                    }
                }} sx={{
                    marginLeft: "auto",
                    marginRight: "15px",
                    width: "85px",
                    height: "85px",
                    borderRadius: "50%"
                }}>{user ? <img style={{ width: "70px", height: "70px", borderRadius: "50%" }} src={user.img ? user.img : `https://avatar.iran.liara.run/username?username=${firstName}+${lastName}`} alt="" /> : <AccountCircle sx={{ width: "70px", height: "70px" }} />}</IconButton>
                <IconButton sx={{ marginRight: "-20px" }} onClick={() => user ? logout() : navigate("/login")}>{user ? <Logout sx={{ width: "50px", height: "50px" }} /> : <Login sx={{ width: "50px", height: "50px" }} />}</IconButton>
                <SideBar />
            </Toolbar>
        </AppBar>
    )
}

export default Header