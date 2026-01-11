import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Link } from "react-router-dom";
import "./stack.css";

// Inject custom animations only once
const styles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.85; }
    50% { opacity: 0.35; }
  }
  .animate-pulse-opacity {
    animation: pulse 4s ease-in-out infinite;
  }
`;
if (typeof document !== "undefined" && !document.getElementById("float-animations")) {
  const styleSheet = document.createElement("style");
  styleSheet.id = "float-animations";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

const StackCardCollection = () => {
  const [products, setProducts] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  useEffect(() => {
    const fetchRandomProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));
        const allProducts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        const shuffled = allProducts.sort(() => 0.5 - Math.random());
        
        // Slice exactly 8 items
        const randomProducts = shuffled.slice(0, 8); 
        
        setProducts(randomProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-2 border-gray-200 border-t-2 border-t-green-600"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-white">
        <p className="text-gray-600">No products found</p>
      </div>
    );
  }

  return (
    <div className="bg-white py-8 md:py-12 px-4 relative overflow-hidden">
      {/* Background Decorative Emojis */}
      <div className="absolute top-8 left-8 text-4xl md:text-5xl text-gray-200 animate-bounce">🎂</div>
      <div className="absolute top-12 right-12 text-3xl md:text-4xl text-gray-200 animate-pulse-opacity">🧁</div>
      <div className="absolute bottom-12 left-12 text-4xl md:text-5xl text-gray-200 animate-bounce delay-1000">🍪</div>
      <div className="absolute bottom-16 right-8 text-2xl md:text-3xl text-gray-200 animate-pulse-opacity delay-500">🍰</div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-pink-300 rounded-full animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-green-300 rounded-full animate-float delay-700"></div>
        <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-pink-200 rounded-full animate-float delay-300"></div>
        <div className="absolute bottom-1/4 right-1/3 w-1.5 h-1.5 bg-green-400 rounded-full animate-float delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">
            Fresh treats made daily just for you
          </h2>

          <div className="flex justify-center items-center gap-6 mb-6">
            <div className="h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent w-12 md:w-20"></div>
            <span className="text-xl text-pink-500">✨</span>
            <div className="h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent w-12 md:w-20"></div>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 mb-8">
            <span className="flex items-center gap-2 text-gray-600">
              <span className="text-lg">🏆</span> Premium Quality
            </span>
            <span className="flex items-center gap-2 text-gray-600">
              <span className="text-lg">🚚</span> Fresh Delivery
            </span>
            <span className="flex items-center gap-2 text-gray-600">
              <span className="text-lg">💝</span> Made with Love
            </span>
          </div>
        </div>

        {/* Cards Stack */}
        <div className="flex justify-center items-center">
          <div
            className="relative cursor-pointer transition-all duration-700 ease-out mx-auto stack-up"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              width: isHovered ? (isMobile ? "100%" : "850px") : (isMobile ? "240px" : "300px"),
              height: isMobile ? "180px" : "320px",
            }}
          >
            {products.map((product, index) => {
              const total = products.length;
              const mid = Math.floor(total / 2);

              const stackedStyle = {
                transform: `translateX(${(index - mid) * 15}px) translateY(${(index - mid) * (isMobile ? 12 : 8)}px) rotate(${(index - mid) * (isMobile ? 1 : 10)}deg)`,
                zIndex: total - Math.abs(index - mid),
              };

              const spreadStyle = {
                transform: `translateX(${(index - mid) * (isMobile ? 40 : -100)}px) translateY(${Math.sin((index - mid) * 0.5) * (isMobile ? 10 : -20)}px) rotate(${(index - mid) * (isMobile ? 2 : -5)}deg)`,
                zIndex: total - Math.abs(index - mid),
              };

              return (
                <div
                  key={product.id}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out hover:scale-105 group"
                  style={{
                    ...(!isHovered ? stackedStyle : spreadStyle),
                    transitionDelay: `${index * 60}ms`,
                  }}
                >
                  <div
                    className="relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
                    style={{
                      width: isMobile ? "120px" : "160px",
                      height: isMobile ? "160px" : "220px",
                      borderRadius: "18px",
                      background: `linear-gradient(135deg, ${
                        index % 4 === 0
                          ? "#E6FFFA, #C6F6D5" 
                          : index % 4 === 1
                          ? "#FFF5F7, #FED7E2" 
                          : index % 4 === 2
                          ? "#F0FFF4, #C6F6D5" 
                          : "#FFF5F7, #FBD5E1" 
                      })`,
                      border: "2px solid rgba(255, 255, 255, 0.9)",
                      boxShadow:
                        "0 15px 30px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
                    }}
                  >
                    {/* Decorative Icons */}
                    <div className="absolute inset-0 opacity-30">
                      <div className="absolute top-2 right-2 text-sm">{["🍰", "🧁", "🍪", "🎂"][index % 4]}</div>
                      <div className="absolute bottom-2 left-2 text-xs">{["✨", "💫", "⭐"][index % 3]}</div>
                      <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-white/20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    </div>

                    {/* Image */}
                    <div className="absolute inset-3 flex items-center justify-center">
                      <div className="relative w-full h-full">
                        <img
                          src={product.imageUrl || "/placeholder.png"}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-xl shadow-md"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.png";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-white/10 rounded-xl"></div>

                        <div className="absolute top-1 right-1 bg-white/95 rounded-full px-1.5 py-0.5 text-[10px] font-bold text-green-700 shadow-sm border border-green-200">
                          Fresh!
                        </div>

                        <div className="absolute bottom-2 left-2 right-2 text-center">
                          <div className="bg-white/85 rounded-lg p-1 mb-1 border border-pink-200">
                            <p className="text-pink-600 font-bold text-xs">Fresh</p>
                          </div>
                          <h4 className="text-white font-bold text-sm md:text-base drop-shadow-lg line-clamp-1">
                            {product.name}
                          </h4>
                        </div>
                      </div>
                    </div>

                    {/* Glow Effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-8 md:mt-12">
          <Link to="/category/cakes">
            <button className="bg-gradient-to-r from-green-600 to-pink-500 text-white px-8 py-3 rounded-full font-bold text-base hover:from-green-700 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Order Your Favorites Now
            </button>
          </Link>
          <p className="mt-3 text-xs md:text-sm text-gray-600">
            ⏰ Same day delivery available
          </p>
        </div>
      </div>
    </div>
  );
};

export default StackCardCollection;