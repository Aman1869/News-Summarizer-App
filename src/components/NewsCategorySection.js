import React from 'react';
import { Link } from 'react-router-dom';
import NewsCard from './NewsCard';

const NewsCategorySection = ({ category, articles }) => {
  // Format the category name to be capitalized
  const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
  
  // Generate path for "View All" link
  const categoryPath = category === 'general' ? '/' : `/category/${category}`;
  
  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <div className="relative flex items-center">
          <h2 className="text-2xl md:text-3xl font-bold dark:text-white relative">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-300 dark:to-slate-500 animate-gradient">
              {formattedCategory}
            </span>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-slate-700 to-transparent dark:from-slate-500 dark:to-transparent rounded-full"></div>
          </h2>
          {category !== 'general' && (
            <div className="ml-3 rounded-full bg-slate-100 dark:bg-slate-800 h-6 px-2 flex items-center">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {articles?.length || 0} articles
              </span>
            </div>
          )}
        </div>
        
        <Link 
          to={categoryPath}
          className="text-sm text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-300 font-medium hover-underline-animation flex items-center transition-colors"
        >
          View All
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
      
      {articles && articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.slice(0, 6).map((article, index) => (
            <NewsCard key={`${category}-${index}`} article={article} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col items-center justify-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <p className="text-gray-600 dark:text-gray-300 font-medium mb-2">No articles available</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center max-w-md">
              We couldn't find any articles for the {formattedCategory} category. Please check back later.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsCategorySection; 