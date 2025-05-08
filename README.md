# News Summarization and Categorization Web App

A React.js application that fetches news articles from GNews API, allows reading the full content, and uses Google Gemini API to summarize article content.

## Features

- **News Aggregation**: Displays news articles from various categories on the landing page.
- **Category Navigation**: Browse news by specific categories.
- **Article Detail View**: Read the full content of articles.
- **Summarization**: Uses Google Gemini API to summarize article content with a single click.
- **Responsive Design**: Works on desktop and mobile devices.

## Prerequisites

- Node.js and npm installed on your machine
- API key from one of the news services:
  - GNews API key (from [gnews.io](https://gnews.io/))
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
   # Choose the following API keys:
    
   # GNews API Key (100 requests/day on free tier)
   REACT_APP_GNEWS_API_KEY=your_gnews_api_key_here
   
   # Google Gemini API key (required for summarization)
   REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   - Get your GNews API key from [gnews.io](https://gnews.io/)
   - Get your Gemini API key from [Google AI Studio](https://ai.google.dev/)

5. Start the development server:
   ```
   npm start
   ```


## Production Deployment

This application can be deployed in production environments :

- **GNews**: 100 requests per day on free tier

Both services offer paid plans with higher request limits for production use.

## Important Notes

- Web scraping has limitations due to CORS policies. In cases where the API doesn't provide full content, a proxy service is used to attempt scraping.
- If you encounter rate limit errors, you may need to wait for the limit to reset (usually 24 hours) or switch to a different API.

## Technologies Used

- React.js
- React Router
- Tailwind CSS
- GNews APIs
- Google Gemini API
- Axios for HTTP requests
- Cheerio for HTML parsing

## License

This project is licensed under the MIT License.
