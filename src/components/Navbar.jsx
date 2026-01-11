import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import logo from "/logoM.png";

const Navbar = () => {
  const { user, loginWithGoogle, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [cartCountAnimated, setCartCountAnimated] = useState(false);

  // Get cart data - handle both possible property names from CartContext
  const cartData = useCart();
  const cartItems = cartData?.cartItems || cartData?.cart || [];

  // Calculate total items in cart
  const cartCount = Array.isArray(cartItems) 
    ? cartItems.reduce((total, item) => total + (item?.quantity || 0), 0)
    : 0;

  // Animate cart count when it changes
  useEffect(() => {
    if (cartCount > 0) {
      setCartCountAnimated(true);
      const timer = setTimeout(() => setCartCountAnimated(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  const categories = {
    Cakes: [
      "Vanilla", "Chocolate", "Black Forest", "Chocolate Truffle", "Chocolate Mousse",
      "Pineapple", "Strawberry", "Butterscotch", "Red Velvet",
    ],
    "Muffins & Cupcakes": [
      "Vanilla Muffin", "Chocolate Muffin", "Red Velvet Muffin", "Whipcream Cupcake",
      "Buttercream Cupcake", "Red Velvet Cream", "Cheese Cupcake",
    ],
    Cookies: [
      "Weight", "Choco Chip", "Nankhatai", "Jim Jam", "Custard", "Jeera", "Thandai",
    ],
    "Healthy Cookies": ["Oats", "Ragi", "Wheat Coin", "Jowar", "Coconut", "Almond", "Crunchy Nuts"],
  };

  return (
    <nav
      className="backdrop-blur-md shadow-lg border border-emerald-200/10 sticky top-0 z-50 rounded-b-2xl"
      style={{
        background: "linear-gradient(135deg, #03140f 0%, #082a1d 100%)"
      }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <img
              src={logo}
              alt="Zentra Bakery"
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover"
            />
            <Link
              to="/"
              className="text-lg sm:text-xl font-bold text-white hover:text-emerald-300 transition-colors"
            >
              <span className="hidden sm:inline">So Fresh Delights</span>
              <span className="sm:hidden">SFD</span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link
              to="/"
              className="text-white/80 hover:text-emerald-300 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group hover:bg-white/10"
            >
              Home
              <span className="absolute bottom-1 left-0 w-0 h-0.5 bg-emerald-300 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <Link
                className="text-white/80 hover:text-emerald-300 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group flex items-center hover:bg-white/10"
              >
                Categories
                <svg
                  className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                <span className="absolute bottom-1 left-0 w-0 h-0.5 bg-emerald-300 transition-all duration-300 group-hover:w-full"></span>
              </Link>

              {/* Dropdown Menu */}
              <div
                className={`absolute left-1/2 transform -translate-x-1/2 mt-2 transition-all duration-300 ${
                  isDropdownOpen
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-2"
                }`}
              >
                <div className="bg-[#0b2018]/60 backdrop-blur-lg text-white rounded-xl shadow-2xl border border-emerald-500/20 py-6 px-8 min-w-max">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {Object.entries(categories).map(([category, items]) => (
                      <div key={category} className="min-w-0">
                        <h3 className="font-semibold text-emerald-200 mb-3 text-sm uppercase tracking-wide border-b border-emerald-400 pb-2">
                          {category}
                        </h3>
                        <ul className="space-y-2">
                          {items.map((item) => (
                            <li key={item}>
                              <Link
                                to={`/category/${item
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")}`}
                                className="text-white/80 hover:text-lime-300 text-sm transition-all duration-200 block py-1 hover:pl-2 hover:bg-white/10 rounded px-2 -mx-2"
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Link
              to="/offers"
              className="text-white/80 hover:text-emerald-300 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group hover:bg-white/10"
            >
              Offers
              <span className="absolute bottom-1 left-0 w-0 h-0.5 bg-emerald-300 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/about"
              className="text-white/80 hover:text-emerald-300 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group hover:bg-white/10"
            >
              About
              <span className="absolute bottom-1 left-0 w-0 h-0.5 bg-emerald-300 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link
              to="/cart"
              className="relative p-2 text-white/80 hover:text-emerald-300 transition-colors duration-200 hover:bg-white/10 rounded-lg"
            >
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2.5-5M7 13l-2.5 5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
                />
              </svg>
              {/* Enhanced cart count with animation */}
              {cartCount > 0 && (
                <span 
                  className={`absolute -top-1 -right-1 bg-emerald-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold transition-all duration-300 shadow-lg ${
                    cartCountAnimated ? 'scale-125 bg-emerald-400 shadow-emerald-400/50' : 'scale-100'
                  }`}
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  {user.photoURL && (
                    <img
                      src={user.photoURL}
                      alt="profile"
                      className="h-7 w-7 sm:h-8 sm:w-8 rounded-full border-2 border-emerald-300 object-cover"
                    />
                  )}
                  <span className="text-white text-xs sm:text-sm font-medium">
                    {user.displayName}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-sm transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="hidden md:block bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-md"
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-white hover:text-emerald-300 hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg
                className={`h-5 w-5 transition-transform duration-300 ${
                  isOpen ? "rotate-45" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-screen opacity-100 pb-4" : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="px-2 pt-2 space-y-1 bg-white/10 backdrop-blur-md rounded-xl mt-2 border border-white/10 text-white">
            {/* Mobile Cart Link with count */}
            <Link
              to="/cart"
              className="flex items-center justify-between px-3 py-2 text-white hover:text-emerald-300 hover:bg-white/10 rounded-lg transition duration-200"
              onClick={() => setIsOpen(false)}
            >
              <span className="flex items-center">
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2.5-5M7 13l-2.5 5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
                  />
                </svg>
                Cart
              </span>
              {cartCount > 0 && (
                <span className="bg-emerald-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            <Link
              to="/"
              className="block px-3 py-2 text-white hover:text-emerald-300 hover:bg-white/10 rounded-lg transition duration-200"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>

            {/* Mobile Dropdown */}
            <div className="space-y-1">
              <button
                onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
                className="w-full flex justify-between items-center px-3 py-2 text-white hover:text-emerald-300 hover:bg-white/10 rounded-lg transition duration-200"
              >
                Categories
                <svg
                  className={`h-4 w-4 transition-transform ${
                    isMobileCategoriesOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Mobile Categories Content with Smooth Scroll */}
              <div
                className={`transition-all duration-500 ease-out ${
                  isMobileCategoriesOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                <div 
                  className={`pl-4 pr-2 space-y-3 py-2 overflow-y-auto max-h-80 ${
                    isMobileCategoriesOpen ? 'scroll-smooth' : ''
                  }`}
                  style={{
                    scrollBehavior: 'smooth',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#10b981 transparent'
                  }}
                >
                  {Object.entries(categories).map(([category, items]) => (
                    <div key={category} className="space-y-2">
                      <h4 className="font-medium text-emerald-300 text-xs uppercase tracking-wide border-l-2 border-emerald-400 pl-2 sticky top-0 bg-[#0b2018]/80 backdrop-blur-sm py-1">
                        {category}
                      </h4>
                      <div className="grid grid-cols-2 gap-1 pl-2">
                        {items.map((item) => (
                          <Link
                            key={item}
                            to={`/category/${item.toLowerCase().replace(/\s+/g, "-")}`}
                            className="text-xs text-white/80 hover:text-lime-300 py-1.5 px-2 hover:bg-white/10 rounded-md transition-all duration-200 block hover:scale-105 active:scale-95"
                            onClick={() => {
                              setIsOpen(false);
                              setIsMobileCategoriesOpen(false);
                            }}
                          >
                            {item}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Link
              to="/offers"
              className="block px-3 py-2 text-white hover:text-emerald-300 hover:bg-white/10 rounded-lg transition duration-200"
              onClick={() => setIsOpen(false)}
            >
              Offers
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 text-white hover:text-emerald-300 hover:bg-white/10 rounded-lg transition duration-200"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>

            {/* Mobile Auth */}
            <div className="pt-3 border-t border-white/20 mt-3">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center px-3 py-2">
                    {user.photoURL && (
                      <img
                        src={user.photoURL}
                        alt="profile"
                        className="h-8 w-8 rounded-full border-2 border-emerald-300 mr-3 object-cover"
                      />
                    )}
                    <span className="text-white font-medium text-sm truncate">
                      {user.displayName}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-white hover:text-emerald-300 hover:bg-white/10 rounded-lg transition duration-200 text-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    loginWithGoogle();
                    setIsOpen(false);
                  }}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2.5 rounded-lg font-medium transition-colors duration-200 text-sm shadow-sm"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scroll-smooth::-webkit-scrollbar {
          width: 4px;
        }
        .scroll-smooth::-webkit-scrollbar-track {
          background: transparent;
        }
        .scroll-smooth::-webkit-scrollbar-thumb {
          background: #10b981;
          border-radius: 2px;
        }
        .scroll-smooth::-webkit-scrollbar-thumb:hover {
          background: #059669;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;