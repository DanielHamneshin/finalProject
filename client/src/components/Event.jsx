import React from 'react'
import style from '../styles/events.module.css'

const Event = ({ event }) => {
    return (
        <div className={style.event}>
            <div className={style.eventDetailImage}>
                <img src={event.image} alt={event.eventName} />
            </div>

            <h2>{event.eventName}</h2>

            <div className={style.eventInfo}>
                <div>
                    <h4>📅 Date</h4>
                    <h5>{event.date}</h5>
                </div>

                <div>
                    <h4>📍 Location</h4>
                    <h5>{event.location}</h5>
                </div>

                <div>
                    <h4>💰 Price</h4>
                    <div className={style.priceTag}>
                        {event.price === 0 ? 'Free' : `$${event.price}`}
                    </div>
                </div>

                <div className={style.organizers}>
                    <h4>👥 Organizers</h4>
                    <h5>{event.organizers}</h5>
                </div>
            </div>

            <div className={style.targetAudience}>
                <h4>🎯 Target Audience</h4>
                <h5>{event.targetAudience}</h5>
            </div>

            <div className={style.eventDescription}>
                <h4>📝 Description</h4>
                <p>{event.longDescription}</p>
            </div>
        </div>
    )
}

export default Event