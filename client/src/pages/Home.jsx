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


const Home = () => {
    const { user, setUser } = useUserContext()
    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data } = await axios.get("http://127.0.0.1:5000/authentication")
                setUser(data);
            } catch (error) {
                console.error(error);
            }
        }

        checkUser();

    }, [])
    return (
        <div>
            <Header />
            <HeadImage />
            <Carousel />
            <Events />
            <Footer />
        </div>
    )
}

export default Home