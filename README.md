# News Summarization and Categorization Web App

A React.js application that fetches news articles from the News API, allows reading the full content, and uses Google Gemini API to summarize article content.

## Features

- **News Aggregation**: Displays news articles from various categories on the landing page.
- **Category Navigation**: Browse news by specific categories.
- **Article Detail View**: Read the full content of articles.
- **Summarization**: Uses Google Gemini API to summarize article content with a single click.
- **Responsive Design**: Works on desktop and mobile devices.

## Prerequisites

- Node.js and npm installed on your machine
- News API key (from [newsapi.org](https://newsapi.org/))
- Google Gemini API key (from [Google AI Studio](https://ai.google.dev/))

## Setup Instructions

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```
   npm install
   ```
4. Set up environment variables:
   - Create a `.env` file in the root directory with the following variables:
   ```
   REACT_APP_NEWS_API_KEY=your_news_api_key_here
   REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   - Get your News API key from [newsapi.org](https://newsapi.org/)
   - Get your Gemini API key from [Google AI Studio](https://ai.google.dev/)

5. Start the development server:
   ```
   npm start
   ```

## Important Notes

- The News API's free tier only allows requests from localhost in development environments. For production, you'll need a paid subscription.
- Web scraping has limitations due to CORS policies. In a production environment, you would need a backend proxy server to handle the scraping properly.

## Technologies Used

- React.js
- React Router
- Tailwind CSS
- News API
- Google Gemini API
- Axios for HTTP requests
- Cheerio for HTML parsing

## License

This project is licensed under the MIT License.