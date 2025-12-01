import React, { useEffect, useState } from 'react';

const Dark = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Toggle the "dark" class on <html> tag
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center px-6 py-4 bg-white text-black dark:bg-gradient-to-r dark:from-[#03140f] dark:to-[#082a1d] dark:text-white transition-colors duration-500 shadow-md">
        <h1 className="text-xl font-bold">My Website</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm hover:opacity-80"
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      {/* Main Content */}
      <div className="p-8 bg-white text-black dark:bg-[#03140f] dark:text-white transition-all duration-500 min-h-screen">
        <p className="text-lg">
          This is a {darkMode ? 'Dark' : 'Light'} Mode view.
        </p>
      </div>
    </div>
  );
};

export default Dark;
