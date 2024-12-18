import React from "react";
import Slider from "react-slick";
import { Box } from "@mui/material";


const Carousel = () => {
    // Settings for the carousel
    const settings = {
        dots: true, // Show navigation dots
        infinite: true, // Infinite scrolling
        speed: 500, // Animation speed
        slidesToShow: 3, // Slides visible at once
        slidesToScroll: 1, // Slides to scroll at once
        autoplay: true, // Enable autoplay
        autoplaySpeed: 2500, // Autoplay interval (ms)
        arrows: true, // Show navigation arrows
    };

    return (
        <Box sx={{ width: "80%", margin: "0 auto", paddingTop: 4 }}>
            <Slider {...settings}>
                <Box
                    sx={{
                        height: "300px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 10px", // Add padding between slides
                    }}
                >
                    <img
                        src=""
                        alt="Slide 1"
                        style={{ width: "100%", height: "auto" }}
                    />
                </Box>
                <Box
                    sx={{
                        height: "300px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 10px", // Add padding between slides
                    }}
                >
                    <img
                        src="https://via.placeholder.com/600x300/32CD32/000000?text=Slide+2"
                        alt=""
                        style={{ width: "100%", height: "auto", }}
                    />
                </Box>
                <Box
                    sx={{
                        height: "300px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 10px", // Add padding between slides
                    }}
                >
                    <img
                        src="https://via.placeholder.com/600x300/F08080/000000?text=Slide+3"
                        alt=""
                        style={{ width: "100%", height: "auto" }}
                    />
                </Box>
            </Slider>
        </Box>
    );
};

export default Carousel;