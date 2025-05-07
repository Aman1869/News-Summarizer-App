import React, { useState, useEffect } from 'react';
import NewsCategorySection from '../components/NewsCategorySection';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchAllCategories } from '../services/newsService';

const HomePage = () => {
  const [allNews, setAllNews] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        const newsData = await fetchAllCategories();
        setAllNews(newsData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load news. Please try again later.');
        setLoading(false);
        console.error('Error loading news:', err);
      }
    };

    loadNews();
  }, []);

  // Order categories with general first, then others alphabetically
  const orderedCategories = [
    'general', 
    ...Object.keys(allNews)
      .filter(cat => cat !== 'general')
      .sort()
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Latest News</h1>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Latest News</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Latest News</h1>
      
      {orderedCategories.map(category => (
        allNews[category] && (
          <NewsCategorySection 
            key={category}
            category={category}
            articles={allNews[category]}
          />
        )
      ))}
    </div>
  );
};

export default HomePage; 