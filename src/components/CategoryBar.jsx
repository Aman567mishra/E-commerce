import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import cake from '../assets/icons/cake.jpg';
import choco from '../assets/icons/Choco_cake.jpg';
import cookies from '../assets/icons/coockies.jpg';
import cupcake from '../assets/icons/cupcake.jpg';
import deco from '../assets/icons/deco_cake.jpg';
import pastries from '../assets/icons/pastries.jpg';

const categories = [
  { name: 'Cakes', image: cake, color: 'bg-gradient-to-br from-rose-50 to-rose-100' },
  { name: 'Chocolate', image: choco, color: 'bg-gradient-to-br from-amber-50 to-amber-100' },
  { name: 'Cookies', image: cookies, color: 'bg-gradient-to-br from-orange-50 to-orange-100' },
  { name: 'Cupcake', image: cupcake, color: 'bg-gradient-to-br from-pink-50 to-pink-100' },
  { name: 'Deco cake', image: deco, color: 'bg-gradient-to-br from-purple-50 to-purple-100' },
  { name: 'Pastries', image: pastries, color: 'bg-gradient-to-br from-yellow-50 to-yellow-100' },
];

const CategoryBar = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(null);

  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName);
    navigate(`/category/${categoryName.toLowerCase().replace(' ', '-')}`);
  };

  return (
    <div className="w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-center py-3">
          <div className="flex items-center gap-4 md:gap-8">
            {categories.map((category, index) => (
              <div
                key={index}
                className="group relative"
                onClick={() => handleCategoryClick(category.name)}
              >
                {/* Compact Nav Item */}
                <div className={`flex items-center gap-2 px-4 py-3 rounded-lg cursor-pointer 
                  transition-all duration-200 hover:bg-gray-50 
                  ${activeCategory === category.name ? 'bg-gradient-to-r from-amber-50 to-orange-50 shadow-sm' : ''}`}>
                  
                  {/* Small Circular Icon */}
                  <div className={`relative w-8 h-8 rounded-full ${category.color} border border-gray-200 
                    overflow-hidden transition-transform duration-300 group-hover:scale-110
                    ${activeCategory === category.name ? 'scale-110 ring-1 ring-amber-400' : ''}`}>
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const parent = e.target.parentElement;
                        const fallback = document.createElement('div');
                        fallback.className = `w-full h-full ${category.color} rounded-full flex items-center justify-center`;
                        fallback.innerHTML = `<span class="text-xs font-bold text-gray-700">${category.name.charAt(0)}</span>`;
                        parent.appendChild(fallback);
                      }}
                    />
                  </div>
                  
                  {/* Category Label */}
                  <span className={`text-sm font-medium text-gray-700 group-hover:text-gray-900 
                    transition-colors duration-200 hidden sm:block
                    ${activeCategory === category.name ? 'font-bold text-gray-900' : ''}`}>
                    {category.name}
                  </span>
                </div>
                
                {/* Active Indicator */}
                {activeCategory === category.name && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 
                    w-10 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;