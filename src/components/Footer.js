import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Link to="/" className="font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
              NewsWise
            </Link>
            <span>•</span>
            <span>{new Date().getFullYear()}</span>
          </div>
          
          <div className="text-xs text-slate-400 dark:text-slate-500">
            Powered by News API
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 