import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";


const TrendyPosters = () => {
  const [posters, setPosters] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);

  // Fetch Posters
  useEffect(() => {
    const fetchPosters = async () => {
      try {
        const q = query(collection(db, "posters"), where("active", "==", true));
        const querySnapshot = await getDocs(q);
        const fetchedPosters = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosters(fetchedPosters);
      } catch (error) {
        console.error("Error fetching posters:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosters();
  }, []);

  // Auto-change image every 5 seconds (paused on hover)
  useEffect(() => {
    if (posters.length === 0 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % posters.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [posters.length, isHovered]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + posters.length) % posters.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % posters.length);
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#fffcf5]">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mb-4"></div>
          <p className="text-amber-800 font-medium">Loading our fresh creations...</p>
        </div>
      </div>
    );
  }

  if (posters.length === 0) return null;

  return (
    <div>
    <div 
      ref={containerRef}
      // CHANGED: Removed gradient 'from-amber-50 via-white' to remove the top-to-middle layer effect.
      // Now using a solid clean bakery cream color.
      className="min-h-screen w-full bg-[#fffcf5] flex items-center py-16 md:py-20"
      style={{ minHeight: '100vh' }}
    >

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* LEFT: Rotating Poster Gallery */}
          <div 
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Gallery Container */}
            <div className="relative group">
              
              {/* Main Image Frame */}
              <div className="relative bg-white p-6 rounded-2xl shadow-2xl transform transition-transform duration-500 group-hover:scale-[1.02]">
                
                {/* Ornate Border */}
                <div className="absolute inset-0 border-2 border-amber-100 rounded-2xl pointer-events-none"></div>
                
                {/* Image Container */}
                <div className="relative overflow-hidden rounded-xl shadow-inner h-[375px] md:h-[500px] mx-auto w-2/3 bg-gray-50">

                  {posters.map((poster, index) => (
                    <div
                      key={poster.id}
                      className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                        index === currentIndex 
                          ? "opacity-100 scale-100" 
                          : "opacity-0 scale-105"
                      }`}
                    >
                      <img
                        src={poster.imageUrl}
                        alt="Artisanal Bakery Creation"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {/* REMOVED: The shadow gradient layer that was here */}
                    </div>
                  ))}
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 left-10 w-20 h-8 bg-amber-100 transform -rotate-6 shadow-lg rounded-md"></div>
                <div className="absolute -top-4 right-10 w-20 h-8 bg-amber-100 transform rotate-6 shadow-lg rounded-md"></div>
                
                {/* Push Pin */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <div className="relative">
                    <div className="w-6 h-6 bg-amber-600 rounded-full shadow-xl"></div>
                    <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
                  </div>
                </div>

                {/* Navigation Controls */}
                {posters.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                      aria-label="Previous image"
                    >
                      <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={handleNext}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                      aria-label="Next image"
                    >
                      <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Progress Indicators */}
              {posters.length > 1 && (
                <div className="flex justify-center mt-8 space-x-3">
                  {posters.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`relative w-10 h-1 rounded-full transition-all duration-300 ${
                        currentIndex === idx 
                          ? "bg-amber-600" 
                          : "bg-amber-200 hover:bg-amber-300"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    >
                      {currentIndex === idx && (
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-amber-600 rounded-full shadow-md border-2 border-white"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Professional Content */}
          <div className="space-y-8 md:space-y-10">
            
            {/* Header Section */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full border border-amber-200">
                <div className="w-2 h-2 bg-amber-600 rounded-full animate-pulse"></div>
                <span className="text-sm font-bold tracking-wider uppercase text-amber-700">
                  Limited Time Offer
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-amber-900 leading-tight">
                Artisanal Excellence
                <span className="block text-amber-600">
                  In Every Bite
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
                Handcrafted by master bakers using premium ingredients sourced from local farms. 
                Experience the perfect balance of tradition and innovation in our signature collection.
              </p>
            </div>

            {/* Trust Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-amber-100">
              
              <div className="text-center p-4 bg-white rounded-xl border border-amber-100 hover:shadow-lg transition-shadow">
                <div className="text-3xl font-bold text-amber-600">
                  24h
                </div>
                <div className="text-sm font-semibold text-gray-700 mt-1">Freshness Guarantee</div>
              </div>

              <div className="text-center p-4 bg-white rounded-xl border border-amber-100 hover:shadow-lg transition-shadow">
                <div className="text-3xl font-bold text-amber-600">
                  100%
                </div>
                <div className="text-sm font-semibold text-gray-700 mt-1">Natural Ingredients</div>
              </div>

              <div className="text-center p-4 bg-white rounded-xl border border-amber-100 hover:shadow-lg transition-shadow">
                <div className="text-3xl font-bold text-amber-600">
                  45min
                </div>
                <div className="text-sm font-semibold text-gray-700 mt-1">Express Delivery</div>
              </div>

              <div className="text-center p-4 bg-white rounded-xl border border-amber-100 hover:shadow-lg transition-shadow">
                <div className="text-3xl font-bold text-amber-600">
                  4.9★
                </div>
                <div className="text-sm font-semibold text-gray-700 mt-1">Customer Rating</div>
              </div>

            </div>

            {/* Key Features */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-amber-900">What Makes Us Exceptional:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-white border border-amber-100 hover:bg-amber-50 transition-colors">
                  <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-800">European-style artisan baking techniques</span>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-white border border-amber-100 hover:bg-amber-50 transition-colors">
                  <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-800">Locally sourced organic ingredients</span>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-white border border-amber-100 hover:bg-amber-50 transition-colors">
                  <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-800">Custom orders for special occasions</span>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-white border border-amber-100 hover:bg-amber-50 transition-colors">
                  <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-800">Eco-friendly packaging & delivery</span>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="space-y-6 pt-4">
              <div className="bg-white p-6 rounded-xl border border-amber-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-2xl font-bold text-amber-900">Today's Special</div>
                    <div className="text-sm text-amber-700">Only for the first 50 orders</div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="flex-1 bg-amber-600 text-white font-bold py-4 px-8 rounded-xl hover:bg-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 group">
                    <span className="flex items-center justify-center gap-2">
                      Order Now
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </button>
                  
                  <button className="px-6 py-4 border-2 border-amber-600 text-amber-700 font-bold rounded-xl hover:bg-amber-50 transition-all duration-300 hover:border-amber-600 group">
                    <span className="flex items-center justify-center gap-2">
                      View Menu
                      <svg className="w-5 h-5 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                </div>
                
                <div className="text-center mt-4">
                  <div className="inline-flex items-center gap-2 text-sm text-amber-700">
                    <svg className="w-4 h-4 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                    </svg>
                    <span>Limited spots available • Order now to secure your delivery slot</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
          
        </div>

      </div>
      
    </div>
   
    </div>
    
   
  
  );
  
};






export default TrendyPosters;