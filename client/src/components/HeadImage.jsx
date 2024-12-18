import React from 'react'
import style from '../styles/header.module.css'

const HeadImage = () => {
    return (
        <div className={style.LastudentMainImg}>
            <h1 className={style.headLine}> Start your <span className={style.Learning}>Learning</span> journey today</h1>
        </div>
    )
}

export default HeadImage