import React, { useState, useEffect } from 'react';
import { IoIosArrowUp } from 'react-icons/io';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set up scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    
    // Clean up the event listener
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-slate-700/80 to-slate-600/80 dark:from-slate-600/70 dark:to-slate-500/70 backdrop-blur-sm text-white p-3 rounded-full shadow-lg hover:from-slate-800/90 hover:to-slate-700/90 dark:hover:from-slate-700/80 dark:hover:to-slate-600/80 transition-all duration-300 z-50"
          aria-label="Scroll to top"
        >
          <IoIosArrowUp className="text-xl" />
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton; 