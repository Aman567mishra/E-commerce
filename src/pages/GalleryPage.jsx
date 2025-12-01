import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

import BakeryFooter from '../components/Footer';

// Converts Google Drive view link to direct thumbnail URL
const getImageSrc = (url) => {
  const match = url?.match(/\/file\/d\/(.+?)\/view/);
  if (match) {
    return `https://drive.google.com/thumbnail?id=${match[1]}`;
  }
  return url || "/placeholder.png";
};

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const imgs = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return getImageSrc(data.imageUrl);
        });
        setImages(imgs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching images:", error);
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.5,
      backdropFilter: "blur(0px)"
    },
    visible: { 
      opacity: 1,
      scale: 1,
      backdropFilter: "blur(10px)",
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.5,
      backdropFilter: "blur(0px)",
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <>
    <div 
      className="min-h-screen py-12 px-4 md:px-8 lg:px-16"
      style={{
        background: 'linear-gradient(135deg, #03140f 0%, #082a1d 100%)'
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
            Gallery
          </span>
        </h1>
        <p className="text-emerald-200 text-lg md:text-xl max-w-2xl mx-auto">
          Discover our curated collection of stunning visuals
        </p>
      </motion.div>

      {/* Loading Animation */}
      {loading && (
        <div className="flex justify-center items-center min-h-[400px]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full"
          />
        </div>
      )}

      {/* Gallery Grid */}
      {!loading && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-4 gap-1 sm:gap-2 md:gap-4 lg:gap-6"
        >
          {images.map((src, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              className="group cursor-pointer aspect-square"
              onClick={() => setSelectedImage(src)}
            >
              {/* Mobile Layout - Simple square images */}
              <div className="block md:hidden relative overflow-hidden rounded-lg bg-gradient-to-br from-emerald-900/20 to-teal-900/20 backdrop-blur-sm border border-emerald-800/30 shadow-lg w-full h-full">
                <motion.img
                  src={src}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                  onError={(e) => (e.target.src = "/placeholder.png")}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                />
              </div>

              {/* Desktop Layout - Rich cards with overlays */}
              <div className="hidden md:block relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900/20 to-teal-900/20 backdrop-blur-sm border border-emerald-800/30 shadow-2xl w-full h-full">
                <motion.img
                  src={src}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                  onError={(e) => (e.target.src = "/placeholder.png")}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
                
                {/* Desktop Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      className="text-white"
                    >
                      <h3 className="text-lg font-semibold mb-1">Image {index + 1}</h3>
                      <p className="text-emerald-200 text-sm">Click to view full size</p>
                    </motion.div>
                  </div>
                </div>

                {/* Desktop Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Modal for full-size image */}
      {selectedImage && (
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4"
          style={{ backgroundColor: 'rgba(3, 20, 15, 0.95)' }}
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            className="relative w-full h-full md:max-w-6xl md:max-h-[90vh] rounded-lg md:rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Full size"
              className="w-full h-full object-contain md:object-contain bg-black/20"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 md:top-4 md:right-4 w-8 h-8 md:w-10 md:h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200 text-lg md:text-xl font-bold"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Aesthetic Glitter Background Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Large glitter particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`large-${i}`}
            className="absolute rounded-full bg-gradient-to-r from-emerald-300/30 to-teal-200/30 shadow-lg"
            style={{
              width: Math.random() * 8 + 4 + 'px',
              height: Math.random() * 8 + 4 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
            animate={{
              x: [0, Math.random() * 200 - 100, Math.random() * 150 - 75, 0],
              y: [0, Math.random() * 200 - 100, Math.random() * 150 - 75, 0],
              opacity: [0.3, 1, 0.7, 0.3],
              scale: [1, 1.5, 0.8, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: Math.random() * 10 + 8,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Medium glitter particles */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={`medium-${i}`}
            className="absolute rounded-full bg-gradient-to-r from-emerald-400/25 to-green-300/25 backdrop-blur-sm"
            style={{
              width: Math.random() * 6 + 2 + 'px',
              height: Math.random() * 6 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
            animate={{
              x: [0, Math.random() * 150 - 75, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 150 - 75, Math.random() * 100 - 50, 0],
              opacity: [0.2, 0.8, 0.5, 0.2],
              scale: [0.8, 1.2, 0.9, 0.8],
              rotate: [0, -90, 180, 0],
            }}
            transition={{
              duration: Math.random() * 8 + 6,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Small sparkle particles */}
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={`small-${i}`}
            className="absolute rounded-full bg-gradient-to-r from-teal-300/40 to-emerald-200/40"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
            animate={{
              x: [0, Math.random() * 80 - 40, Math.random() * 60 - 30, 0],
              y: [0, Math.random() * 80 - 40, Math.random() * 60 - 30, 0],
              opacity: [0.1, 1, 0.6, 0.1],
              scale: [0.5, 1.8, 1, 0.5],
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Luxury floating orbs */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full opacity-20"
            style={{
              width: Math.random() * 20 + 10 + 'px',
              height: Math.random() * 20 + 10 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              background: `radial-gradient(circle, rgba(52, 211, 153, 0.4) 0%, rgba(20, 184, 166, 0.2) 50%, transparent 100%)`,
              filter: 'blur(1px)',
            }}
            animate={{
              x: [0, Math.random() * 300 - 150, Math.random() * 200 - 100, 0],
              y: [0, Math.random() * 300 - 150, Math.random() * 200 - 100, 0],
              opacity: [0.1, 0.3, 0.15, 0.1],
              scale: [1, 1.3, 0.7, 1],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Twinkling stars */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute"
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          >
            <div
              className="w-1 h-1 bg-emerald-300 rounded-full relative"
              style={{
                boxShadow: '0 0 6px rgba(52, 211, 153, 0.8), 0 0 12px rgba(52, 211, 153, 0.4)',
              }}
            >
              {/* Star cross effect */}
              <div className="absolute inset-0 w-4 h-px bg-emerald-300/60 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"></div>
              <div className="absolute inset-0 h-4 w-px bg-emerald-300/60 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>

    <BakeryFooter />
</>
    
  );
};

export default GalleryPage;