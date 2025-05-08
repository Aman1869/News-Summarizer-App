import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setDarkMode(savedMode === 'true');
    } else {
      // Use system preference as fallback
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);

  // Update document when dark mode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <header className="bg-slate-800 dark:bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-5">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-extrabold tracking-tight flex items-center group">
            <div className="rounded-lg overflow-hidden bg-slate-700 dark:bg-gray-800 p-2 mr-3 transform group-hover:rotate-6 transition-all duration-300 border border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white group-hover:text-gray-200 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <div>
              <span className="text-white">News Wise</span>
              <div className="text-xs text-gray-300 dark:text-gray-400 font-normal tracking-normal italic">Stay informed, stay wise</div>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-2.5 rounded-full bg-slate-700 dark:bg-gray-800 text-white focus:outline-none hover:bg-slate-600 dark:hover:bg-gray-700 transition-all duration-300 shadow-md border border-white/10"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 