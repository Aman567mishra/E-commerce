import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import cake from '../assets/icons/cake.jpg';
import choco from '../assets/icons/Choco_cake.jpg';
import cookies from '../assets/icons/coockies.jpg';
import cupcake from '../assets/icons/cupcake.jpg';
import deco from '../assets/icons/deco_cake.jpg';
import pastries from '../assets/icons/pastries.jpg';

const categories = [
  { name: 'Cakes', image: cake, color: 'bg-rose-50' },
  { name: 'Chocolate', image: choco, color: 'bg-amber-50' },
  { name: 'Cookies', image: cookies, color: 'bg-orange-50' },
  { name: 'Cupcake', image: cupcake, color: 'bg-pink-50' },
  { name: 'Deco Cake', image: deco, color: 'bg-purple-50' }, 
  { name: 'Pastries', image: pastries, color: 'bg-yellow-50' },
];

const CategoryBar = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(null);

  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName);
    navigate(`/category/${categoryName.toLowerCase().replace(' ', '-')}`);
  };

  return (
    <div className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-1 md:px-4">
        
        {/* GRID LAYOUT: 6 columns, tighter gap on mobile */}
        <div className="grid grid-cols-6 gap-1 md:gap-4 py-2 md:py-3 align-top">
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => handleCategoryClick(category.name)}
              className="group flex flex-col md:flex-row items-center justify-start md:justify-center cursor-pointer p-0.5 md:p-1 h-full"
            >
              {/* Icon Container - Smaller on Mobile */}
              <div 
                className={`relative 
                  w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 
                  rounded-full ${category.color} border border-gray-200 
                  overflow-hidden transition-transform duration-200 group-hover:scale-110
                  ${activeCategory === category.name ? 'ring-2 ring-amber-400 scale-110' : ''}
                  mb-1 md:mb-0 md:mr-2 flex-shrink-0`}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text Label - Visible & Smaller on Mobile */}
              <span 
                className={`
                  text-[9px] sm:text-xs md:text-sm font-medium text-center md:text-left
                  leading-none md:leading-normal
                  whitespace-normal
                  w-full md:w-auto
                  transition-colors duration-200
                  ${activeCategory === category.name ? 'text-orange-600 font-bold' : 'text-gray-600'}
                  group-hover:text-gray-900
                `}
              >
                {category.name}
              </span>

              {/* Active Indicator (Desktop Only) */}
              {activeCategory === category.name && (
                <div className="hidden md:block absolute -bottom-[13px] w-full h-0.5 bg-orange-500 rounded-t-full"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;