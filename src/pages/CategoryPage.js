import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NewsCard from '../components/NewsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchNewsByCategory } from '../services/newsService';

const CategoryPage = () => {
  const { category } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format the category name to be capitalized
  const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);

  useEffect(() => {
    const loadCategoryNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const newsArticles = await fetchNewsByCategory(category);
        setArticles(newsArticles);
        setLoading(false);
      } catch (err) {
        setError('Failed to load news for this category. Please try again later.');
        setLoading(false);
        console.error(`Error loading ${category} news:`, err);
      }
    };

    loadCategoryNews();
  }, [category]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{formattedCategory} News</h1>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{formattedCategory} News</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{formattedCategory} News</h1>
      
      {articles && articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <NewsCard key={index} article={article} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-100 p-6 rounded-lg">
          <p className="text-lg">No articles available for this category.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage; 