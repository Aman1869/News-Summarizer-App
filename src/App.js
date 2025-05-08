import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ArticlePage from './pages/ArticlePage';
import CategoryPage from './pages/CategoryPage';
import NotFoundPage from './pages/NotFoundPage';
import ScrollToTopButton from './components/ScrollToTopButton';
import NewsCategorySection from './components/NewsCategorySection';

// Component to conditionally render NewsCategorySection
const AppContent = () => {
  const location = useLocation();
  const isArticlePage = location.pathname === '/article';

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <Header />
      {!isArticlePage && (
        <div className="mt-2">
          <NewsCategorySection />
        </div>
      )}
      <main className="flex-grow py-8 dark:text-gray-100 container mx-auto px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/article" element={<ArticlePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
    /* Remove background decorative elements that might cause blur */
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
