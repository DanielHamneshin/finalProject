import React from 'react'
import Loader from '../components/Loader'
import Carousel from '../components/Carousel'
import HeadImage from '../components/HeadImage'
import Events from '../components/Events'
import SideBar from '../components/SideBar'
import Footer from '../components/Footer'
import Header from '../components/Header'


const Home = () => {
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