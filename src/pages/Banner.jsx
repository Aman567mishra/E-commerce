import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import "./Banner.css";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // 🔥 Fetch banners from Firebase - ONLY TOP BANNERS
  useEffect(() => {
    const fetchBanners = async () => {
      const q = query(
        collection(db, "banners"),
        where("active", "==", true),
        where("displayPosition", "==", "Top")
      );

      const snap = await getDocs(q);
      const list = snap.docs.map(doc => doc.data().imageUrl);
      setBanners(list);
    };

    fetchBanners();
  }, []);

  // 🔄 Rotation logic
  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
        setFade(true);
      }, 500);

    }, 5000);

    return () => clearInterval(interval);
  }, [banners]);

  if (banners.length === 0) return null;

  return (
    <div className="banner-container">
      <img
        src={banners[currentIndex]}
        alt="Banner"
        className={`banner-image ${fade ? "fade-in" : "fade-out"}`}
      />
    </div>
  );
};

export default Banner;