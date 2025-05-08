import React, { useRef, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NewsCategorySection = () => {
  const location = useLocation();
  const { pathname, search } = location;
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Define the categories
  const categories = [
    { id: 'general', name: 'General' },
    { id: 'business', name: 'Business' },
    { id: 'entertainment', name: 'Entertainment' },
    { id: 'health', name: 'Health' },
    { id: 'science', name: 'Science' },
    { id: 'sports', name: 'Sports' },
    { id: 'technology', name: 'Technology' }
  ];

  // Check if a category is active
  const isActive = (categoryId) => {
    if (pathname === '/' && categoryId === 'general') return true;
    if (pathname === '/category' && search === `?category=${categoryId}`) return true;
    return false;
  };

  // Handle scroll event to show/hide scroll indicators
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10); // Small buffer
  };

  // Scroll container left or right
  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = 200; // Adjust scroll amount as needed
    const newScrollLeft = direction === 'left' 
      ? scrollContainerRef.current.scrollLeft - scrollAmount 
      : scrollContainerRef.current.scrollLeft + scrollAmount;
    
    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  // Check scroll position on initial load and window resize
  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  return (
    <div className="sticky top-0 z-40 bg-white/50 dark:bg-gray-900/50 py-3 backdrop-blur-sm">
      <div className="container mx-auto px-1 sm:px-4 relative">
        {/* Left scroll indicator */}
        {showLeftArrow && (
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 hidden sm:block"
            aria-label="Scroll categories left"
          >
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-700/80 dark:bg-gray-800/80 text-white shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </button>
        )}
        
        {/* Scrollable container */}
        <div 
          className="overflow-x-auto scrollbar-hide py-1"
          ref={scrollContainerRef}
          onScroll={handleScroll}
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <div className="flex justify-start sm:justify-center">
            <div className="inline-flex flex-nowrap space-x-2 px-2 py-1 bg-slate-700/60 dark:bg-gray-800/60 rounded-full shadow-md border border-gray-300/10 dark:border-gray-600/20">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={category.id === 'general' ? '/' : `/category?category=${category.id}`}
                  className={`${
                    isActive(category.id)
                      ? 'bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 text-slate-800 dark:text-white shadow-md'
                      : 'text-white hover:bg-slate-600/70 dark:hover:bg-gray-700/70 hover:shadow-sm'
                  } px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap`}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right scroll indicator */}
        {showRightArrow && (
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 hidden sm:block"
            aria-label="Scroll categories right"
          >
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-700/80 dark:bg-gray-800/80 text-white shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        )}

        {/* Mobile swipe hint (shown initially, then fades out) */}
        <div className="sm:hidden text-center mt-1">
          <span className="text-xs text-gray-500 dark:text-gray-400 italic animate-pulse">
            Swipe to see more categories
          </span>
        </div>
      </div>
    </div>
  );
};

export default NewsCategorySection; 