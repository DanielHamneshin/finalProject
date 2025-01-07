import React from 'react'
import style from '../styles/headImage.module.css'

const HeadImage = () => {
    return (
        <div className={style.videoContainer}>
            <video
                className={style.backgroundVideo}
                autoPlay
                loop
                muted
            >
                <source src="/bg1.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <h1>Start your <span className={style.Learning}>Learning</span> journey today</h1>
        </div>
    )
}

export default HeadImage