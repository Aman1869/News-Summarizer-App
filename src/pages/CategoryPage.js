import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NewsCard from '../components/NewsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchNewsByCategory } from '../services/gnewsService';

const CategoryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');

    if (!categoryParam) {
      navigate('/');
      return;
    }

    setCategory(categoryParam);
    
    const loadNews = async () => {
      try {
        setLoading(true);
        console.log(`Loading ${categoryParam} news from GNews API...`);
        
        const newsArticles = await fetchNewsByCategory(categoryParam);
        
        if (newsArticles && newsArticles.length > 0) {
          console.log(`Successfully loaded ${newsArticles.length} ${categoryParam} news articles`);
          setArticles(newsArticles);
        } else {
          setError(`No articles could be found for ${categoryParam}. Please check your API key and internet connection.`);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading news:', err);
        
        if (err.message && err.message.includes('rate limit')) {
          setError('GNews API rate limit exceeded. Please try again later.');
        } else if (err.message && err.message.includes('Missing GNews API key')) {
          setError('Missing GNews API key. Please add your API key to the .env file.');
        } else {
          setError(`Failed to load news: ${err.message || 'Unknown error'}`);
        }
        
        setLoading(false);
      }
    };

    loadNews();
  }, [location.search, navigate]);

  // Capitalize first letter for display
  const formatCategoryName = (cat) => {
    if (!cat) return '';
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-indigo-900 dark:text-purple-200">{formatCategoryName(category)} News</h1>
        <LoadingSpinner />
        <p className="text-center mt-4 text-gray-600 dark:text-gray-300">Loading news articles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-indigo-900 dark:text-purple-200">{formatCategoryName(category)} News</h1>
        <div className="border px-4 py-3 rounded bg-red-100 dark:bg-red-900/30 border-red-400 dark:border-red-700 text-red-700 dark:text-red-300">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
        
        {error.includes('Missing GNews API key') && (
          <div className="mt-4 bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-lg font-semibold mb-2 text-indigo-900 dark:text-indigo-300">How to Get and Configure a GNews API Key</h2>
            <ol className="list-decimal pl-5 mb-4 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Visit <a href="https://gnews.io/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">GNews.io</a> and sign up for an account</li>
              <li>After signing up, go to your dashboard to find your API key</li>
              <li>Copy your API key</li>
              <li>Create or open the <code className="bg-gray-100 dark:bg-gray-900 px-1 py-0.5 rounded">.env</code> file in your project's root directory</li>
              <li>Add the following line to your .env file:
                <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded mt-1 overflow-x-auto text-gray-800 dark:text-gray-300">
                  REACT_APP_GNEWS_API_KEY=your_gnews_api_key_here
                </pre>
              </li>
              <li>Save the file and restart your application</li>
            </ol>
            <p className="text-gray-700 dark:text-gray-400">
              Note: The GNews free tier allows 100 API calls per day. You may want to consider subscribing to a paid plan for more requests.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-indigo-900 dark:text-purple-200">{formatCategoryName(category)} News</h1>
      
      {articles.length === 0 ? (
        <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded">
          <p>No news articles found for {category}. Please try another category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {articles.map((article, index) => (
            <NewsCard key={index} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage; 