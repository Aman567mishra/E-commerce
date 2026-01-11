import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import "./Banner.css";

const BottomBanner = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // 🔥 Fetch banners from Firebase - ONLY MIDDLE BANNERS
  useEffect(() => {
    const fetchBanners = async () => {
      const q = query(
        collection(db, "banners"),
        where("active", "==", true),
        where("displayPosition", "==", "Middle")
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
    <div style={{
      margin: '30px 0',
      padding: '20px 0',
      borderTop: '2px dashed #ccc',
      borderBottom: '2px dashed #ccc',
      position: 'relative'
    }}>
      <div className="banner-container" style={{ margin: 0 }}>
        <img
          src={banners[currentIndex]}
          alt="Bottom Banner"
          className={`banner-image ${fade ? "fade-in" : "fade-out"}`}
        />
      </div>
    </div>
  );
};

export default BottomBanner;