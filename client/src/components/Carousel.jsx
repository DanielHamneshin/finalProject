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
        autoplaySpeed: 3000, // Autoplay interval (ms)
        arrows: true, // Show navigation arrows
        centerMode: true,  // Added center mode
        centerPadding: '0',
        focusOnSelect: true,
        className: "center",
        responsive: [
            {
                breakpoint: 1200, // Large screens
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    centerMode: true,
                }
            },
            {
                breakpoint: 992, // Medium screens
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    centerMode: false,
                    arrows: true,
                }
            },
            {
                breakpoint: 768, // Small screens
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerMode: true,
                    arrows: false, // Hide arrows on mobile
                    centerPadding: '40px'
                }
            },
            {
                breakpoint: 480, // Extra small screens
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerMode: true,
                    arrows: false,
                    centerPadding: '20px'
                }
            }
        ]
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
                        src="/uni1.jpg"

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
                        src="./uni2.jpg"
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
                        src="./uni3.jpg"
                        alt=""
                        style={{ width: "100%", height: "auto" }}
                    />
                </Box>
            </Slider>
        </Box>
    );
};

export default Carousel;