import React from 'react'
import { DensityMedium, AccountCircle, Logout, Login, DarkModeOutlined, LightModeOutlined } from '@mui/icons-material'
import { AppBar, Box, IconButton, Toolbar } from '@mui/material';
import SideBar from './SideBar';
import { useUserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
const Header = () => {
    const { user, setUser } = useUserContext();

    const logout = async () => {
        try {
            await axios.post("http://127.0.0.1:5000/auth/logout")
            setUser(null);
            navigate("/")
        } catch (error) {
            console.error(error);

        }
    }

    const navigate = useNavigate()
    return (
        <AppBar>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", bgcolor: "white" }}>
                {user && <h1 style={{ color: "black", marginLeft: "50px" }}>Hello {user.name}</h1>}
                <IconButton onClick={() => navigate(user ? "/personal" : "/login")} sx={{
                    marginLeft: "auto",
                    marginRight: "15px"
                }}><AccountCircle /></IconButton>
                <IconButton sx={{ marginRight: "-20px" }} onClick={() => user ? logout() : navigate("/login")}>{user ? <Logout /> : <Login />}</IconButton>
                <SideBar />
            </Toolbar>
        </AppBar>
    )
}

export default Header