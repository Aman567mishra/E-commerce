import React from 'react';
import { useNavigate } from 'react-router-dom';

import cake from '../assets/icons/cake.jpg';
import choco from '../assets/icons/Choco_cake.jpg';
import cookies from '../assets/icons/coockies.jpg';
import cupcake from '../assets/icons/cupcake.jpg';
import deco from '../assets/icons/deco_cake.jpg';
import pastries from '../assets/icons/pastries.jpg';

const categories = [
  { name: 'Cakes', image: cake },
  { name: 'Chocolate', image: choco },
  { name: 'Cookies', image: cookies },
  { name: 'Cupcake', image: cupcake },
  { name: 'Deco cake', image: deco },
  { name: 'Pastries', image: pastries },
];


const CategoryBar = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${categoryName.toLowerCase()}`);
  };

  return (
    <div className="relative shadow-md border-b border-gray-800/20 px-4 sm:px-8 lg:px-16 py-4 sm:py-6 lg:py-8 mb-0 overflow-x-auto scrollbar-hide bg-gradient-to-r from-[#03140f] to-[#082a1d]">
      {/* Glitter Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-white/30 rounded-full blur-sm animate-glitter"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${4 + Math.random() * 6}s`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex gap-4 sm:gap-6 lg:gap-20 justify-start sm:justify-center items-center min-w-[500px] sm:min-w-0">
        {categories.map((category, index) => (
          <div
            key={index}
            className="group flex flex-col items-center cursor-pointer w-14 sm:w-16 hover:scale-110 transition-all duration-300 ease-out"
            onClick={() => handleCategoryClick(category.name)}
          >
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-emerald-400/60 bg-white p-1 flex items-center justify-center overflow-hidden shadow-lg group-hover:shadow-xl group-hover:border-emerald-300 transition-all duration-300">
              {/* Overlay glow */}
              <div className="absolute inset-0 rounded-full bg-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>

              {/* Fallback content */}
              <div className="fallback w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-emerald-200 rounded-full flex items-center justify-center">
                  <span className="text-emerald-700 font-bold text-xs">
                    {category.name.charAt(0)}
                  </span>
                </div>
              </div>

              {/* Image */}
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-1 w-full h-full object-cover rounded-full opacity-90"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const fallback = e.target.parentElement.querySelector('.fallback');
                  if (fallback) fallback.style.display = 'flex';
                }}
                onLoad={(e) => {
                  const fallback = e.target.parentElement.querySelector('.fallback');
                  if (fallback) fallback.style.display = 'none';
                }}
              />
            </div>

            <p className="text-[10px] sm:text-xs font-semibold text-white/90 group-hover:text-emerald-200 text-center capitalize leading-tight transition-colors duration-300 drop-shadow-sm mt-1">
              {category.name.replace('-', ' ')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryBar;
