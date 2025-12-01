import React, { useEffect, useState } from 'react';
import banner1 from '../assets/banners/banner1.png';
import banner2 from '../assets/banners/banner2.png';
// Add more banners or gifs here
import './Banner.css';

const banners = [banner1, banner2];

const Banner = () => {
  const [currentBanner, setCurrentBanner] = useState(null);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    // Pick an initial banner
    const initialBanner = banners[Math.floor(Math.random() * banners.length)];
    setCurrentBanner(initialBanner);

    const interval = setInterval(() => {
      setFade(false); // start fade-out

      setTimeout(() => {
        const randomBanner = banners[Math.floor(Math.random() * banners.length)];
        setCurrentBanner(randomBanner);
        setFade(true); // fade-in
      }, 500); // wait half a second to change banner

    }, 5000); // every 20 sec

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="banner-container">
      <img
        src={currentBanner}
        alt="Banner"
        className={`banner-image ${fade ? 'fade-in' : 'fade-out'}`}
      />
    </div>
  );
};

export default Banner;
