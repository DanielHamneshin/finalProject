import React, { useState } from 'react'
import events from '../../../data/events.json'
import style from '../styles/events.module.css'
import { Backdrop, Box, ClickAwayListener } from '@mui/material'
import Event from './Event'

const Events = () => {
    const [event, setEvent] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isRotate, setIsRotate] = useState(false);

    const handleClick = (event) => {
        setEvent({ ...event });
        setIsOpen(true);
    }
    return (
        <>
            <div className={style.eventsContainer}>
                {events.map((item, index) => {
                    return <div className={`${style.miniEvent} ${isRotate ? style.rotate : ""}`} onClick={() => handleClick(item)} key={index} onMouseOver={() => setIsRotate(true)} onMouseOut={() => setIsRotate(false)}>
                        <h4>{item.eventName}</h4>
                        <h4>Date: {item.date}</h4>
                        <h5>Location: {item.location}</h5>
                    </div>
                })}
            </div>
            {isOpen &&
                <Backdrop open={isOpen}>
                    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
                        <Box sx={{ width: "75vh", border: "2px solid black", bgcolor: "antiquewhite", height: "60vh", overflow: "auto" }}>
                            <Event event={event} />
                        </Box>
                    </ClickAwayListener>
                </Backdrop>
            }
        </>
    )
}

export default Events