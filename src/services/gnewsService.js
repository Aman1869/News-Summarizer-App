import axios from 'axios';
import * as cheerio from 'cheerio';

// GNews API Key from environment variables
const GNEWS_API_KEY = process.env.REACT_APP_GNEWS_API_KEY;
const GNEWS_API_BASE_URL = 'https://gnews.io/api/v4';

// Debug logging
console.log('=== GNews API Configuration ===');
console.log('GNews API key exists:', !!GNEWS_API_KEY);
console.log('GNews API key value:', GNEWS_API_KEY ? `${GNEWS_API_KEY.substring(0, 8)}...` : 'not set');

/**
 * Map our app categories to GNews categories
 * @param {string} category - Our app category
 * @returns {string} - GNews category
 */
const mapCategory = (category) => {
  const categoryMapping = {
    business: 'business',
    entertainment: 'entertainment',
    general: 'general',
    health: 'health',
    science: 'science',
    sports: 'sports',
    technology: 'technology',
    world: 'world',
    nation: 'nation',
  };
  
  return categoryMapping[category] || 'general';
};

/**
 * Fetches news articles for a specific category
 * @param {string} category - The category to fetch (business, entertainment, etc)
 * @returns {Promise<Array>} - Array of article objects
 */
export const fetchNewsByCategory = async (category = 'general') => {
  console.log(`Fetching news for category: ${category}`);

  try {
    if (!GNEWS_API_KEY) {
      console.error('No GNews API key found. Please add a valid key to your .env file.');
      throw new Error('Missing GNews API key. Please check your configuration.');
    }

    const apiCategory = mapCategory(category);
    console.log(`Mapped category '${category}' to GNews category '${apiCategory}'`);
    
    // Make the API request
    const url = `${GNEWS_API_BASE_URL}/top-headlines`;
    const params = {
      token: GNEWS_API_KEY,
      topic: apiCategory,
      lang: 'en',
      country: 'us',
      max: 10  // Number of articles to retrieve
    };
    
    console.log('API Request URL:', url);
    console.log('API Request Params:', {...params, token: `${params.token.substring(0, 8)}...`});
    
    const response = await axios.get(url, { 
      params,
      timeout: 10000, // 10 second timeout
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('GNews API response status:', response.status);
    
    // Check if we got valid data
    if (response.data && response.data.articles && response.data.articles.length > 0) {
      console.log(`Successfully fetched ${response.data.articles.length} articles from GNews`);
      console.log('First article:', response.data.articles[0].title);
      
      // Transform response to match our app's expected format
      const articles = response.data.articles.map(article => ({
        author: article.source?.name || '',
        content: article.content || article.description || '',
        description: article.description || article.content || '',
        publishedAt: article.publishedAt,
        source: { id: null, name: article.source?.name || 'Unknown' },
        title: article.title,
        url: article.url,
        urlToImage: article.image || null
      }));
      
      console.log(`Processed ${articles.length} articles`);
      return articles;
    } else {
      console.warn('GNews API returned no articles for category:', category);
      console.warn('API Response:', response.data);
      return []; // Return empty array for this category
    }
  } catch (error) {
    console.error('Error fetching news:', error.message);
    
    // Check for specific error types
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
      
      // Check for common GNews error responses
      if (error.response.status === 403) {
        throw new Error('API access forbidden. Please check your GNews API key.');
      } else if (error.response.status === 429) {
        throw new Error('GNews API rate limit exceeded. Please try again later.');
      }
    }
    
    // For the first category, throw the error to show the user
    if (category === 'general') {
      throw error;
    }
    
    // For other categories, just return empty array to prevent app crashes
    return [];
  }
};

/**
 * Fetches news for all categories
 * @returns {Promise<Object>} - Object with category keys and article arrays
 */
export const fetchAllCategories = async () => {
  const categories = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
  const allNews = {};
  let fetchedAnything = false;
  
  try {
    // Try general category first as a test
    try {
      console.log('Fetching general category first to test API access');
      allNews['general'] = await fetchNewsByCategory('general');
      
      if (allNews['general'] && allNews['general'].length > 0) {
        fetchedAnything = true;
        console.log(`Successfully fetched ${allNews['general'].length} articles for general`);
      }
    } catch (error) {
      console.error('Error fetching general category:', error.message);
      throw error;
    }
    
    // Fetch the rest of the categories
    for (const category of categories) {
      // Skip general as we already fetched it
      if (category === 'general') continue;
      
      try {
        console.log(`Fetching category: ${category}`);
        const articles = await fetchNewsByCategory(category);
        allNews[category] = articles;
        
        if (articles && articles.length > 0) {
          fetchedAnything = true;
          console.log(`Successfully fetched ${articles.length} articles for ${category}`);
        } else {
          console.warn(`No articles fetched for ${category}`);
        }
      } catch (error) {
        console.error(`Error fetching ${category}:`, error.message);
        allNews[category] = [];
      }
    }
    
    if (!fetchedAnything) {
      console.error('Failed to fetch any articles from any category');
      throw new Error('No articles could be fetched from any category. Please check your API key and network connection.');
    }
    
    return allNews;
  } catch (error) {
    console.error('Error fetching all categories:', error.message);
    throw error;
  }
};

/**
 * Scrapes content from an article URL
 * @param {string} url - The URL to scrape
 * @param {string} description - Fallback description if scraping fails
 * @returns {Promise<string>} - The scraped content
 */
export const scrapeArticleContent = async (url, description = '') => {
  try {
    // If we already have content from the API
    if (description && description.length > 300) {
      console.log('Using existing content from API response');
      return description;
    }
    
    // Check if URL is valid
    if (!url || !url.startsWith('http')) {
      throw new Error('Invalid URL provided');
    }

    // Use allOrigins as a CORS proxy
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    
    // Attempt scraping through proxy
    const response = await axios.get(proxyUrl, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 15000 // 15 second timeout
    });

    // Process the HTML content
    const html = response.data;
    const $ = cheerio.load(html);

    // Remove unwanted elements that typically contain non-article content
    $('script, style, nav, header, footer, aside, .ads, .advertisement, .banner, .promotion, .cookie-notice, .cookie-banner, .popup, .modal').remove();

    let mainText = '';
    
    // Try to find the article content using common article selectors
    const articleSelectors = [
      'article', '.article', '.post', '.content', '.main', '.story', '.entry-content', 
      '.post-content', '[itemprop="articleBody"]', '.article-body', '.article-content',
      '.story-body', '#article-body', '.story-content', '.news-content'
    ];
    
    // Join all selectors
    const combinedSelector = articleSelectors.join(', ');
    
    // First try to get content from article containers
    $(combinedSelector).each((i, elem) => {
      // Extract all paragraph text from this container
      $(elem).find('p').each((j, para) => {
        const text = $(para).text().trim();
        if (text.length > 30) mainText += text + '\n\n';
      });
    });

    // If no content was found, try to extract from all paragraphs
    if (!mainText || mainText.length < 200) {
      $('p').each((i, elem) => {
        const text = $(elem).text().trim();
        if (text.length > 30) mainText += text + '\n\n';
      });
    }

    // Clean up the text
    mainText = mainText
      .replace(/\s+/g, ' ')  // Replace multiple spaces with a single space
      .replace(/\n+/g, '\n\n')  // Replace multiple newlines with double newlines
      .trim();

    // If we still don't have good content, use the description
    if (!mainText || mainText.length < 200) {
      if (description && description.trim().length > 0) {
        console.log('No content scraped, using description as fallback');
        return description;
      } else {
        return "Could not retrieve the article content. Please visit the original article using the link below.";
      }
    }

    return mainText;
  } catch (error) {
    console.error('Error scraping article content:', error.message);
    
    // If description is provided and not empty, use it as fallback
    if (description && description.trim().length > 0) {
      console.log('Using article description as fallback after error');
      return description;
    }
    
    return "Could not retrieve the article content due to website restrictions. Please visit the original article using the link below.";
  }
}; 