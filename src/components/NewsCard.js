import React from 'react';
import { Link } from 'react-router-dom';

const NewsCard = ({ article }) => {
  // Encode the article object as a URL parameter
  const encodedArticle = encodeURIComponent(JSON.stringify(article));
  
  // Format published date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 dark:border dark:border-gray-700 flex flex-col h-full group">
      <div className="relative overflow-hidden aspect-video">
        {article.urlToImage ? (
          <>
            <img 
              src={article.urlToImage} 
              alt={article.title} 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/640x360?text=No+Image+Available';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Source badge */}
        <div className="absolute top-3 left-3 bg-slate-700/90 text-white text-xs font-semibold py-1 px-2 rounded-md backdrop-blur-sm">
          {article.source?.name || 'Unknown'}
        </div>
        
        {/* Date badge */}
        <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-gray-800/90 text-slate-700 dark:text-slate-200 text-xs font-medium py-1 px-2 rounded-md backdrop-blur-sm">
          {formatDate(article.publishedAt)}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h2 className="text-xl font-bold mb-3 line-clamp-2 text-slate-800 dark:text-white group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors duration-300">
          {article.title}
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 text-sm flex-grow">
          {article.description || 'No description available.'}
        </p>
        
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
          {article.author && (
            <div className="flex items-center mr-3 bg-slate-100 dark:bg-slate-700/30 px-2 py-1 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="truncate max-w-[160px]">{article.author}</span>
            </div>
          )}
        </div>
        
        <Link 
          to={`/article?data=${encodedArticle}`} 
          className="relative w-full inline-block text-center bg-gradient-to-r from-slate-700 to-slate-600 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-300 overflow-hidden group-hover:shadow-md"
        >
          <span className="relative z-10">Read More</span>
          <span className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-700 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
        </Link>
      </div>
    </div>
  );
};

export default NewsCard; 