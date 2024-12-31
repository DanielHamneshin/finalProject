import React, { useState } from 'react'
import events from '../../../data/events.json'
import style from '../styles/events.module.css'
import { Backdrop, Box, ClickAwayListener } from '@mui/material'
import Event from './Event'

const Events = () => {
    const [event, setEvent] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = (event) => {
        setEvent({ ...event });
        setIsOpen(true);
    }
    return (
        <>
            <div className={style.eventsContainer}>
                {events.map((item, index) => {
                    return (
                        <div className={style.miniEvent} onClick={() => handleClick(item)} key={index}>
                            <div className={style.eventImage}>
                                <img src={item.image} alt={item.eventName} />
                            </div>
                            <h4>{item.eventName}</h4>
                            <h4>Date: {item.date}</h4>
                            <h5>Location: {item.location}</h5>
                            <div className={style.shortDescription}>
                                <p>{item.shortDescription}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
            {isOpen &&
                <Backdrop open={isOpen} className={style.eventBackdrop}>
                    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
                        <Box sx={{
                            width: "90%",
                            maxWidth: "900px",
                            maxHeight: "calc(100vh - 140px)",
                            bgcolor: "white",
                            borderRadius: "15px",
                            overflow: "auto",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                            marginTop: "70px",
                            marginBottom: "50px",
                            '&::-webkit-scrollbar': {
                                width: '8px',
                            },
                            '&::-webkit-scrollbar-track': {
                                background: '#f1f1f1',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: '#888',
                                borderRadius: '4px',
                            },
                            '&::-webkit-scrollbar-thumb:hover': {
                                background: '#555',
                            },
                        }}>
                            <Event event={event} />
                        </Box>
                    </ClickAwayListener>
                </Backdrop>
            }
        </>
    )
}

export default Events