import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NewsCategorySection = () => {
  const location = useLocation();
  const { pathname, search } = location;

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

  return (
    <div className="sticky top-0 z-40 bg-transparent py-3 backdrop-blur-sm">
      <div className="container mx-auto">
        <div className="flex justify-center overflow-x-auto scrollbar-hide">
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
    </div>
  );
};

export default NewsCategorySection; 