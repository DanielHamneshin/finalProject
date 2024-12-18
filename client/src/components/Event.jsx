import React from 'react'
import style from '../styles/events.module.css'


const Event = ({ event }) => {
    return (
        <>
            <div className={style.event}>
                <h2>{event.eventName}</h2>
                <h4>Date: {event.date}</h4>
                <h5>Location: {event.location}</h5>
                <h2>Price: {event.price}</h2>
                <h2>Orgenizers: {event.organizers}</h2>
                <h2>Target audience: {event.targetAudience}</h2>
                <h2>description: {event.longDescription}</h2>
            </div>
        </>
    )
}

export default Event