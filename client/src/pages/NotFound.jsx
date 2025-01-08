import React from 'react';
import { useNavigate } from 'react-router-dom';
import style from '../styles/notFound.module.css';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className={style.container}>
            <div className={style.content}>
                <h1>404</h1>
                <h2>Oops! Page Not Found</h2>
                <p>The page you are looking for might have been removed,
                    had its name changed, or is temporarily unavailable.</p>

                <div className={style.illustration}>
                    <div className={style.circle}></div>
                    <div className={style.clipper}>
                        <div className={style.paper}>
                            <div className={style.face}>
                                <div className={style.eyes}>
                                    <div className={style.eye}></div>
                                    <div className={style.eye}></div>
                                </div>
                                <div className={style.rosyCheeks}></div>
                                <div className={style.mouth}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    className={style.homeButton}
                    onClick={() => navigate('/')}
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default NotFound;