import React, { useEffect } from 'react'
import Loader from '../components/Loader'
import Carousel from '../components/Carousel'
import HeadImage from '../components/HeadImage'
import Events from '../components/Events'
import SideBar from '../components/SideBar'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { useUserContext } from '../contexts/UserContext'
import axios from 'axios'
import style from '../styles/home.module.css'


const Home = ({ setIsInitialLoad }) => {
    const { user, setUser } = useUserContext()
    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data } = await axios.get("http://127.0.0.1:5000/authentication")
                setUser(data);
                setIsInitialLoad(true)
            } catch (error) {
                console.error(error);
            }
            finally {
                setIsInitialLoad(true)
            }
        }

        checkUser();

    }, [])
    return (
        <div>
            <Header />
            <HeadImage />
            <Carousel />
            <div className={style.quoteContainer}>
                <h2>
                    <span className={style.highlight}>Studying</span> is where
                    <span className={style.highlight}> hard work</span> meets
                    <span className={style.highlight}> inspiration</span> to create
                    <span className={style.highlight}> endless opportunities.</span>
                </h2>
            </div>
            <Events />
            <Footer />
        </div>
    )
}

export default Home