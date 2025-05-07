import axios from 'axios';
import * as cheerio from 'cheerio';
import chardet from 'chardet';
import { franc } from 'franc';

// API Keys from environment variables
const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY;
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

export const fetchNewsByCategory = async (category = 'general') => {
  try {
    const response = await axios.get(`${NEWS_API_BASE_URL}/top-headlines`, {
      params: {
        country: 'us',
        category,
        apiKey: NEWS_API_KEY
      }
    });
    return response.data.articles;
  } catch (error) {
    console.error('Error fetching news by category:', error);
    throw error;
  }
};

export const fetchAllCategories = async () => {
  const categories = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
  const allNews = {};
  
  try {
    for (const category of categories) {
      const articles = await fetchNewsByCategory(category);
      allNews[category] = articles;
    }
    return allNews;
  } catch (error) {
    console.error('Error fetching all categories:', error);
    throw error;
  }
};

export const scrapeArticleContent = async (url, description = '') => {
  try {
    // For development, we can attempt direct scraping
    // In production, this would need to be handled by a backend proxy
    try {
      const response = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        responseType: 'arraybuffer'
      });

      // Handle encoding detection
      let encoding;
      try {
        encoding = chardet.detect(response.data);
      } catch (error) {
        console.warn('Error detecting encoding:', error);
        encoding = 'utf-8';
      }

      const html = response.data.toString(encoding || 'utf-8');
      const $ = cheerio.load(html);

      let mainText = '';
      
      // Try to extract from common article containers
      $('article, .post, .content, .main, .article, .story, .entry-content, .post-content').each((i, elem) => {
        const text = $(elem).text().trim();
        if (text.length > 100) mainText += text + '\n\n';
      });

      // If no content was found, try to extract from paragraphs
      if (!mainText || mainText.length < 200) {
        $('p').each((i, elem) => {
          const text = $(elem).text().trim();
          if (text.length > 50) mainText += text + '\n\n';
        });
      }

      // As a fallback, get the body text
      if (!mainText || mainText.length < 200) {
        mainText = $('body').text().trim();
      }

      // Detect language (optional)
      try {
        // eslint-disable-next-line no-unused-vars
        const language = franc(mainText);
        // We're detecting language but not using it right now
        // This could be used for future features like translation
      } catch (error) {
        console.warn('Error detecting language:', error);
      }

      // Clean up the text
      mainText = mainText
        .replace(/\s+/g, ' ')  // Replace multiple spaces with a single space
        .replace(/\n+/g, '\n\n')  // Replace multiple newlines with double newlines
        .trim();

      return mainText;
    } catch (directError) {
      console.warn('Direct scraping failed, falling back to proxy:', directError);
      
      // Fallback to the proxy approach
      const response = await axios.get(`/api/scrape?url=${encodeURIComponent(url)}`);
      return response.data.content;
    }
  } catch (error) {
    console.error('Error scraping article content:', error);
    
    // If description is provided and not empty, use it as fallback
    if (description && description.trim().length > 0) {
      console.log('Using article description as fallback');
      return description;
    }
    
    return "Could not retrieve the article content due to website restrictions. Please visit the original article using the link below.";
  }
}; 