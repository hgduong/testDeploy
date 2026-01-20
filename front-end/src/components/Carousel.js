import React, { useState, useEffect } from 'react';
import '../assets/styles/Carousel.css';

const Carousel = ({ images = [], interval = 3000 }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images, interval]);

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div className="carousel">
      <div
        className="carousel-track"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((src, i) => (
          <div
            key={i}
            className="carousel-slide"
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>
      {images.length > 1 && (
        <div className="carousel-controls">
          <button onClick={prev}>‹</button>
          <button onClick={next}>›</button>
        </div>
      )}
    </div>
  );
};

export default Carousel;
