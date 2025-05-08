import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-4xl font-bold mb-4 text-slate-800 dark:text-gray-200">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">The page you are looking for does not exist or has been moved.</p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-gradient-to-r from-slate-700 to-gray-600 text-white rounded-lg hover:from-slate-800 hover:to-gray-700 transition-all duration-300 shadow-md"
      >
        Return to Home
      </Link>
    </div>
  );
};

export default NotFoundPage; 