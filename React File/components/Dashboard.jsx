import React, { useState, useEffect } from "react";
//import "./Dashboard.css";
import "./css/a.css";

const images = [
  "https://d3lzcn6mbbadaf.cloudfront.net/media/details/ANI-20240403050710.jpg"
];

const Dashboard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">
  <div className="dashboard-content">
    <div className="slider">
      <img
        src={images[currentIndex]}
        alt="EbixCash"
        className="slider-image"
      />
      <div className="dots">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`dot ${idx === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(idx)}
          ></span>
        ))}
      </div>
    </div>
  </div>
</div>

  );
};

export default Dashboard;
