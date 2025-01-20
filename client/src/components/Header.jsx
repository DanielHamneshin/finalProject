import React, { useState } from 'react'
import {
    DensityMedium,
    AccountCircle,
    Logout,
    Login,
    NotificationsOutlined
} from '@mui/icons-material'
import { AppBar, Box, IconButton, Toolbar, Badge, Popover } from '@mui/material';
import SideBar from './SideBar';
import { useUserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import logo from '../assets/LaStudentLogo.svg'; // Import your logo
import PayPal from '../components/PayPal';
const Header = () => {
    const { user, setUser } = useUserContext();
    const firstName = user ? user.name.split(" ")[0] : "";
    const lastName = user ? user.name.split(" ")[1] : "";
    const [anchorEl, setAnchorEl] = useState(null);
    const hasDebt = user?.role === "student" && user?.debt > 0;

    const handleNotificationClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

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
                {/* Logo with updated margin */}
                <IconButton
                    onClick={() => navigate('/')}
                    sx={{
                        padding: 0,
                        marginLeft: '-30px',
                        marginRight: '20px',
                        '&:hover': {
                            backgroundColor: 'transparent'
                        }
                    }}
                >
                    <img
                        src={logo}
                        alt="Logo"
                        style={{
                            height: '80px',
                            width: 'auto',
                            cursor: 'pointer'
                        }}
                    />
                </IconButton>

                {/* Welcome message */}
                {user && <h1 style={{ color: "black" }}>Hello {user.name}</h1>}

                <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                    {/* Notification Bell */}
                    {user && (
                        <IconButton
                            onClick={handleNotificationClick}
                            sx={{
                                marginRight: "15px",
                                width: "60px",
                                height: "60px"
                            }}
                        >
                            <Badge
                                badgeContent={hasDebt ? 1 : 0}
                                color="error"
                                sx={{
                                    '& .MuiBadge-badge': {
                                        fontSize: '14px',
                                        height: '22px',
                                        minWidth: '22px',
                                        padding: '0 6px'
                                    }
                                }}
                            >
                                <NotificationsOutlined
                                    sx={{
                                        width: "40px",
                                        height: "40px",
                                        color: "#1a73e8"
                                    }}
                                />
                            </Badge>
                        </IconButton>
                    )}

                    {/* Notification Popover */}
                    {user?.debt > 0 && <Popover
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <Box sx={notificationStyles.container}>
                            {hasDebt && (
                                <div className="notification-item">
                                    <h3>Outstanding Payment</h3>
                                    <p>You have an outstanding payment of ₪{user.debt}</p>
                                    <PayPal />
                                </div>
                            )}
                        </Box>
                    </Popover>}

                    <IconButton
                        onClick={() => {
                            if (user) {
                                if (user.role === "student") navigate("/personal")
                                if (user.role === "teacher") navigate("/teacherpersonal")
                                if (user.role === "admin") navigate("/adminpersonal")
                            }
                            else {
                                navigate("/login")
                            }
                        }}
                        sx={{
                            marginLeft: "auto",
                            marginRight: "15px",
                            width: "85px",
                            height: "85px",
                            borderRadius: "50%"
                        }}
                    >
                        {user ?
                            <img
                                style={{ width: "70px", height: "70px", borderRadius: "50%" }}
                                src={user.img ? user.img : `https://avatar.iran.liara.run/username?username=${firstName}+${lastName}`}
                                alt=""
                            /> :
                            <AccountCircle sx={{ width: "70px", height: "70px" }} />
                        }
                    </IconButton>

                    <IconButton
                        sx={{ marginRight: "-20px" }}
                        onClick={() => user ? logout() : navigate("/login")}
                    >
                        {user ? <Logout sx={{ width: "50px", height: "50px" }} /> : <Login sx={{ width: "50px", height: "50px" }} />}
                    </IconButton>
                </div>
            </Toolbar>
        </AppBar>
    )
}

// Styles object
const notificationStyles = {
    container: {
        padding: '20px',
        maxWidth: '300px',
        '& .notification-item': {
            textAlign: 'center'
        },
        '& h3': {
            color: '#1a73e8',
            marginBottom: '10px'
        },
        '& p': {
            marginBottom: '15px',
            color: '#666'
        }
    },
    payButton: {
        background: '#1a73e8',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '20px',
        cursor: 'pointer',
        fontWeight: '500',
        transition: 'background-color 0.3s ease',
        '&:hover': {
            background: '#1557b0'
        }
    }
}

export default Header