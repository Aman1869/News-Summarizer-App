import axios from 'axios';

// API Key from environment variables
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export const summarizeContent = async (content) => {
  try {
    // Truncate content if it's too long (Gemini has token limits)
    const truncatedContent = content.length > 30000 
      ? content.substring(0, 30000) + '...' 
      : content;
    
    const promptText = `Summarize the following news article in 3-4 concise paragraphs. Focus on the main points, key facts, and conclusions:

${truncatedContent}`;

    console.log("Calling Gemini API for summarization...");
    
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: promptText
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log("Gemini API response received:", response.status);
    
    if (!response.data || !response.data.candidates || !response.data.candidates[0] || 
        !response.data.candidates[0].content || !response.data.candidates[0].content.parts) {
      console.error('Unexpected response structure from Gemini API:', response.data);
      return 'Failed to generate summary: Unexpected API response format';
    }
    
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error summarizing with Gemini API:', error);
    
    if (error.response) {
      console.error('API Error Response:', error.response.data);
      return `Failed to generate summary: ${error.response.data?.error?.message || 'API error'}`;
    } else if (error.request) {
      console.error('No response received:', error.request);
      return 'Failed to generate summary: No response from API server';
    } else {
      console.error('Error setting up request:', error.message);
      return `Failed to generate summary: ${error.message}`;
    }
  }
}; 