import React, { useState, useEffect, useRef } from "react";
import { FiChevronLeft, FiChevronRight, FiPause, FiPlay } from "react-icons/fi";
import Banner1 from "../assets/images/Banner1.png";
import Banner2 from "../assets/images/Banner2.png";
import Banner3 from "../assets/images/Banner3.jpg";

import { Card, CardContent } from "@mui/material";

// Sample data - replace with your own content
const carouselItems = [
  {
    id: 1,
    title: "First Slide",
    description: "This is the first carousel item.",
    image: Banner1,
  },
  {
    id: 2,
    title: "Second Slide",
    description: "This is the second carousel item.",
    image: Banner2,
  },
  {
    id: 3,
    title: "Third Slide",
    description: "This is the third carousel item.",
    image: Banner3,
  },
];

const BannerCarousal = ({
  autoplayInterval = 3000, // Default 3 seconds
  pauseOnHover = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef(null);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
  };

  const startAutoplay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
    }, autoplayInterval);
  };

  const stopAutoplay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  // Start autoplay when component mounts or when isPlaying changes
  useEffect(() => {
    if (isPlaying) {
      startAutoplay();
    } else {
      stopAutoplay();
    }

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, autoplayInterval]);

  // Pause autoplay on hover if enabled
  const handleMouseEnter = () => {
    if (pauseOnHover) {
      stopAutoplay();
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover && isPlaying) {
      startAutoplay();
    }
  };

  return (
    <div
      className=" w-full h-[40vh]  relative  mx-auto "
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardContent className="p-0 h-full h">
        {/* Carousel Item */}
        <div className=" w-full  h-full">
          <img
            src={carouselItems[currentIndex].image}
            alt={carouselItems[currentIndex].title}
            className="w-full object-cover transition-transform duration-500"
          />
        </div>
      </CardContent>

      {/* Navigation Buttons */}
      <div className="absolute top-2/4    w-full flex justify-between px-4">
        <button
          onClick={handlePrev}
          className="bg-white/50 w hover:bg-white/70 rounded-full p-2 transition-colors"
        >
          <FiChevronLeft className="w-8 h-8 text-gray-800" />
        </button>
        <button
          onClick={handleNext}
          className="bg-white/50  hover:bg-white/70 rounded-full p-2 transition-colors"
        >
          <FiChevronRight className="w-8 h-8 text-gray-800" />
        </button>
      </div>

      {/* Indicator Dots and Play/Pause */}
      <div className="flex justify-center items-center mt-4 space-x-4">
        <div className="flex space-x-2">
          {carouselItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-3 w-3 rounded-full transition-all ${
                index === currentIndex ? "bg-blue-600 w-6" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerCarousal;
