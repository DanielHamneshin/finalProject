import { DensityMedium, HomeOutlined } from '@mui/icons-material';
import { Backdrop, Box, ClickAwayListener, Drawer, IconButton, List, ListItem, ListItemText } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const SideBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate()

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    const handleClose = () => {
        setIsOpen(false);
    };
    return (
        <>
            <IconButton
                onClick={toggleDrawer}
                sx={{
                    position: "fixed",
                    top: 12,
                    left: 0,
                    zIndex: 1201, // Keeps button above the sidebar
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                }}
            >
                <DensityMedium sx={{ fontSize: "50px" }} />
            </IconButton>

            {isOpen && (
                <Backdrop open={isOpen} sx={{ zIndex: 1200 }}>
                    <ClickAwayListener onClickAway={handleClose}>
                        <Box>
                            <Drawer
                                variant="persistent"
                                anchor="left"
                                open={isOpen}
                                sx={{
                                    width: 240,
                                    flexShrink: 0,
                                    '& .MuiDrawer-paper': {
                                        width: 240,
                                        boxSizing: 'border-box',
                                        transition: 'width 0.3s ease',
                                    },
                                }}
                            >
                                <List sx={{ marginTop: '50px', cursor: 'pointer' }}>
                                    <ListItem button="true" onClick={() => navigate("/")}>
                                        <HomeOutlined></HomeOutlined>
                                        <ListItemText primary="Home" />
                                    </ListItem>
                                    <ListItem button="true">
                                        <ListItemText primary="Profile" />
                                    </ListItem>
                                    <ListItem button="true">
                                        <ListItemText primary="Settings" />
                                    </ListItem>
                                    <ListItem button="true">
                                        <ListItemText primary="Logout" />
                                    </ListItem>
                                </List>
                            </Drawer>
                        </Box>
                    </ClickAwayListener>
                </Backdrop>
            )}
        </>
    )
}

export default SideBar