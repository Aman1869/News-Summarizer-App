const { createProxyMiddleware } = require('http-proxy-middleware');
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = function(app) {
  // Handle scraping requests
  app.use('/api/scrape', async (req, res) => {
    try {
      const url = decodeURIComponent(req.query.url);
      console.log(`Scraping content from: ${url}`);
      
      // Parse URL to get domain
      const domain = new URL(url).hostname;
      
      // Set up browser-like headers
      const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.google.com/',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      };
      
      try {
        // Fetch the HTML content
        const response = await axios.get(url, {
          headers,
          timeout: 10000
        });
        
        const html = response.data;
        const $ = cheerio.load(html);
        
        // Remove non-content elements
        $('script, style, nav, header, footer, aside, iframe, noscript, svg, form, button').remove();
        
        // Remove common ad and non-content classes
        $('.ad, .ads, .advertisement, .banner, .promo, .sidebar, .comments, .share, .social').remove();
        
        // Remove images, videos, and other media
        $('img, video, audio').remove();
        
        // Extract content from paragraphs
        const paragraphs = [];
        $('p').each((i, el) => {
          const text = $(el).text().trim();
          if (text.length > 30) {
            paragraphs.push(text);
          }
        });
        
        // Join paragraphs with double newlines
        let content = paragraphs.join('\n\n');
        
        // Clean up content
        content = content
          .replace(/\s+/g, ' ')
          .replace(/\n\s+/g, '\n\n')
          .replace(/\n{3,}/g, '\n\n')
          .trim();
        
        if (!content || content.length < 100) {
          return res.json({
            content: `Could not extract content from ${domain}. The site may use JavaScript to load content or have anti-scraping protection.`
          });
        }
        
        res.json({ content });
        
      } catch (error) {
        console.error('Error fetching content:', error.message);
        res.status(200).json({
          content: `Could not retrieve content from ${domain}. This may be due to the website's protection or CORS policy. Please visit the original article.`
        });
      }
    } catch (error) {
      console.error('Error in scraping route:', error.message);
      res.status(200).json({
        content: "An error occurred while trying to retrieve the article content. Please visit the original article."
      });
    }
  });
}; 