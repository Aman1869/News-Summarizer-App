import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const categories = [
    { name: 'General', path: '/' },
    { name: 'Business', path: '/category/business' },
    { name: 'Technology', path: '/category/technology' },
    { name: 'Science', path: '/category/science' },
    { name: 'Health', path: '/category/health' },
    { name: 'Sports', path: '/category/sports' },
    { name: 'Entertainment', path: '/category/entertainment' }
  ];

  // Check if we're on the article page to hide the category bar
  const isArticlePage = location.pathname === '/article';

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

  const handleCategoryClick = (path) => {
    navigate(path);
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <>
      <header className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-gray-900 dark:to-gray-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-5">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-extrabold tracking-tight flex items-center group">
              <div className="rounded-md bg-white/10 dark:bg-white/5 p-1.5 mr-3 backdrop-blur-sm transform group-hover:rotate-6 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-100 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 dark:from-white dark:to-gray-400 animate-gradient">News Wise</span>
                <div className="text-xs text-slate-300 dark:text-slate-400 font-normal tracking-normal">Stay informed, stay wise</div>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-slate-800/80 dark:bg-gray-700/70 text-white focus:outline-none backdrop-blur-sm hover:bg-slate-700 dark:hover:bg-gray-600 transition-all duration-300"
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

              {/* Mobile Menu Button */}
              <button 
                className="md:hidden p-2 rounded-full bg-slate-800/80 dark:bg-gray-700/70 backdrop-blur-sm hover:bg-slate-700 dark:hover:bg-gray-600 transition-all duration-300 focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 space-y-2 pb-2 bg-slate-800/80 dark:bg-gray-800/80 backdrop-blur-md rounded-lg p-3">
              {categories.map((category) => (
                <button 
                  key={category.path} 
                  onClick={() => handleCategoryClick(category.path)}
                  className={`block w-full text-left hover:bg-slate-700 dark:hover:bg-gray-700 px-3 py-3 rounded-lg transition-colors duration-300 font-medium
                    ${window.location.pathname === category.path || 
                      (category.path === '/' && window.location.pathname === '/') 
                        ? 'bg-slate-700/50 dark:bg-gray-700/50' 
                        : ''}`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>
      
      {/* Category Pills Container - hidden on article page */}
      {!isArticlePage && (
        <div className="bg-transparent py-4 mt-3">
          <div className="flex justify-center">
            <div className="overflow-x-auto no-scrollbar max-w-full">
              <div className="inline-flex bg-white/90 dark:bg-gray-800/90 backdrop-blur-md py-3 px-6 rounded-full shadow-md border border-gray-100 dark:border-gray-700">
                {categories.map((category, index) => (
                  <React.Fragment key={category.path}>
                    <button
                      onClick={() => handleCategoryClick(category.path)}
                      className={`px-5 py-2 rounded-full transition-all duration-300 text-sm md:text-base font-medium whitespace-nowrap
                        ${location.pathname === category.path || 
                          (category.path === '/' && location.pathname === '/') 
                            ? 'bg-gradient-to-r from-slate-700 to-slate-600 dark:from-slate-600 dark:to-slate-500 text-white shadow-sm' 
                            : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                      {category.name}
                    </button>
                    {index < categories.length - 1 && (
                      <span className="mx-1.5"></span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header; 