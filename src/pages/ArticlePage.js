import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { scrapeArticleContent } from '../services/newsService';
import { summarizeContent } from '../services/geminiService';

const ArticlePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [summarizing, setSummarizing] = useState(false);
  const [error, setError] = useState(null);
  const [scrapingError, setScrapingError] = useState(false);
  const [showSummary, setShowSummary] = useState(true);
  const [copiedText, setCopiedText] = useState('');
  const summaryRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    // Hide category bar on article page
    const categoryBar = document.querySelector('.sticky.top-0.z-50');
    if (categoryBar) {
      categoryBar.style.display = 'none';
    }

    // Cleanup function to restore category bar when leaving the page
    return () => {
      if (categoryBar) {
        categoryBar.style.display = 'block';
      }
    };
  }, []);

  useEffect(() => {
    const fetchArticleData = async () => {
      try {
        // Parse the article data from URL parameters
        const searchParams = new URLSearchParams(location.search);
        const articleData = searchParams.get('data');
        
        if (!articleData) {
          setError('Article data not found.');
          setLoading(false);
          return;
        }
        
        const parsedArticle = JSON.parse(decodeURIComponent(articleData));
        setArticle(parsedArticle);
        
        // Scrape the full content from the article URL
        setLoading(true);
        try {
          console.log('Scraping content from URL:', parsedArticle.url);
          const scrapedContent = await scrapeArticleContent(parsedArticle.url, parsedArticle.description);
          
          // Check if content is one of the error messages
          const isErrorMessage = 
            (typeof scrapedContent === 'string') && 
            (scrapedContent.includes('could not be retrieved') || 
             scrapedContent.includes('Failed to retrieve') ||
             scrapedContent.length < 100);
          
          // Check if we got the description as fallback (by comparing with the actual description)
          const isDescriptionFallback = 
            (typeof scrapedContent === 'string') && 
            (parsedArticle.description && scrapedContent === parsedArticle.description);
          
          if (isErrorMessage && parsedArticle.description) {
            // Use description as fallback if scraping failed and description exists
            console.log('Using article description as fallback after failed scraping');
            setContent(parsedArticle.description);
            setScrapingError(true);
          } else if (isDescriptionFallback) {
            // If we got the description back, it means scraping failed but we're using description
            console.log('Using article description as fallback (returned from scrapeArticleContent)');
            setContent(scrapedContent);
            setScrapingError(true);
          } else if (scrapedContent && scrapedContent.length > 100) {
            // Successfully scraped content
            console.log('Successfully scraped content, length:', scrapedContent.length);
            setContent(scrapedContent);
            setScrapingError(false);
          } else {
            // No valid content or description available
            console.warn('Scraped content too short or empty:', scrapedContent);
            setContent('Content could not be retrieved. This may be due to the website\'s scraping protection or CORS policy. Please visit the original article.');
            setScrapingError(true);
          }
        } catch (scrapingErr) {
          console.error('Error during content scraping:', scrapingErr);
          
          // If scraping failed but we have a description, use it
          if (parsedArticle.description) {
            console.log('Using article description after scraping error');
            setContent(parsedArticle.description);
            setScrapingError(true);
          } else {
            setContent('Failed to retrieve article content. Please check the original source.');
            setScrapingError(true);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading article:', err);
        setError('Failed to load article content. Please try again later.');
        setLoading(false);
      }
    };

    fetchArticleData();
  }, [location.search]);

  const handleSummarize = async () => {
    // If content is empty, don't allow summarization
    // But allow summarization if we're using the description (which is valid content)
    const isUsingDescription = content === article.description && content.length > 0;
    
    if (!content || summarizing || (scrapingError && !isUsingDescription)) return;
    
    try {
      setSummarizing(true);
      setSummary('');
      setShowSummary(true);
      
      console.log('Sending content for summarization, length:', content.length);
      const summarized = await summarizeContent(content);
      
      if (typeof summarized === 'string' && summarized.length > 0) {
        setSummary(summarized);
      } else {
        console.error('Invalid summary returned:', summarized);
        setError('Failed to generate a summary. The API returned an invalid response.');
      }
      
      setSummarizing(false);
    } catch (err) {
      console.error('Error summarizing article:', err);
      setError('Failed to summarize article. Please try again.');
      setSummarizing(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopiedText(type);
        setTimeout(() => setCopiedText(''), 2000);
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button 
          onClick={goBack} 
          className="mb-4 flex items-center text-slate-600 hover:text-slate-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Loading article content...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button 
          onClick={goBack} 
          className="mb-4 flex items-center text-slate-600 hover:text-slate-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <p>{error || 'Article not found.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <button 
        onClick={goBack} 
        className="mb-6 flex items-center text-slate-600 hover:text-slate-800 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to News
      </button>

      <article className="mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
        {/* Article Image Header */}
        {article.urlToImage && (
          <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
            <img 
              src={article.urlToImage} 
              alt={article.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/1200x800?text=No+Image';
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white shadow-text">{article.title}</h1>
            </div>
          </div>
        )}
        
        {!article.urlToImage && (
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-3xl font-bold mb-4 text-slate-800 dark:text-white">{article.title}</h1>
          </div>
        )}

        <div className="p-6">
          {/* Article Meta */}
          <div className="mb-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex flex-wrap items-center text-gray-600 dark:text-gray-300 gap-y-2">
              <div className="flex items-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <span className="font-medium">{article.source?.name || 'Unknown source'}</span>
              </div>
              <div className="flex items-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>
                  {new Date(article.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              {article.author && (
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{article.author}</span>
                </div>
              )}
            </div>
            <div className="mt-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 underline"
              >
                Visit Original Article
              </a>
            </div>
          </div>

          {/* Summarize Section */}
          <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-200 dark:border-slate-600">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center text-slate-700 dark:text-slate-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="font-medium">AI-powered summarization with Google Gemini</span>
              </div>
              
              <button
                onClick={handleSummarize}
                disabled={summarizing || !content || (scrapingError && content !== article.description)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center ${
                  summarizing 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : (scrapingError && content !== article.description)
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-slate-700 hover:bg-slate-800 text-white shadow-sm'
                }`}
                title={scrapingError && content !== article.description ? "Summarization unavailable when content can't be scraped" : ""}
              >
                {summarizing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Summarizing...
                  </>
                ) : (
                  <>
                    {summary ? 'Regenerate Summary' : 'Summarize Article'}
                  </>
                )}
              </button>
            </div>
            
            {scrapingError && content === article.description && (
              <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                Using article description for summarization as the full content couldn't be retrieved.
              </p>
            )}
            
            {scrapingError && content !== article.description && (
              <p className="mt-2 text-sm text-red-600">
                Summarization is unavailable because the article content could not be retrieved.
              </p>
            )}
          </div>

          {/* View Toggle Buttons - Only show if summary exists */}
          {summary && (
            <div className="flex mb-6 justify-center">
              <div className="inline-flex rounded-md shadow-sm bg-gray-100 dark:bg-gray-800 p-1">
                <button
                  onClick={() => setShowSummary(true)}
                  className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${
                    showSummary 
                      ? 'bg-white dark:bg-gray-700 text-slate-800 dark:text-white shadow-sm' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  Summary View
                </button>
                <button
                  onClick={() => setShowSummary(false)}
                  className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${
                    !showSummary 
                      ? 'bg-white dark:bg-gray-700 text-slate-800 dark:text-white shadow-sm' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  Full Article
                </button>
              </div>
            </div>
          )}

          {/* Summary Section */}
          {summary && showSummary && (
            <div className="mb-10 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md transition-all duration-300" ref={summaryRef}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center text-slate-800 dark:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Summary
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => copyToClipboard(summary, 'summary')}
                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 flex items-center text-sm border border-slate-200 dark:border-slate-600 rounded-md px-3 py-1.5 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    {copiedText === 'summary' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <div className="prose max-w-none dark:prose-invert">
                {summary.split('\n').map((paragraph, idx) => (
                  paragraph ? (
                    paragraph.trim().startsWith('-') || paragraph.trim().startsWith('•') ? 
                    <ul key={idx} className="list-disc ml-6 mb-4">
                      <li>{paragraph.trim().substring(1).trim()}</li>
                    </ul> :
                    <p key={idx} className="mb-4">{paragraph}</p>
                  ) : null
                ))}
              </div>
            </div>
          )}

          {/* Content Section */}
          {(!summary || !showSummary) && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md p-6 mb-8" ref={contentRef}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center text-slate-800 dark:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  Full Article
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => copyToClipboard(content, 'content')}
                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 flex items-center text-sm border border-slate-200 dark:border-slate-600 rounded-md px-3 py-1.5 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    {copiedText === 'content' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 italic border-l-4 border-slate-300 dark:border-slate-600 pl-3">
                {content === article.description 
                  ? "Showing article description from News API as the original content couldn't be retrieved."
                  : "This content is fetched from the original article source."}
              </div>

              <div className="prose max-w-none dark:prose-invert max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                {content ? (
                  content.includes('could not be retrieved') || content.includes('Failed to retrieve') ? (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-100 dark:border-yellow-800 mb-4">
                      <p className="text-yellow-700 dark:text-yellow-300">{content}</p>
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="mt-2 inline-block text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 underline"
                      >
                        Read the original article
                      </a>
                    </div>
                  ) : (
                    content.split('\n').map((paragraph, idx) => (
                      paragraph.trim() ? <p key={idx} className="mb-4">{paragraph}</p> : null
                    ))
                  )
                ) : (
                  <p>No content available. <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 underline">Read the original article</a>.</p>
                )}
              </div>
            </div>
          )}

          {/* Footer with Link to Original */}
          <div className="flex justify-between items-center mt-8 mb-4 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
            <p>News Wise © {new Date().getFullYear()}</p>
            <p>Powered by News API & Google Gemini</p>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ArticlePage; 