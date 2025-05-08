import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="relative">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-200 dark:border-gray-800"></div>
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-slate-600 dark:border-slate-400 absolute inset-0"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner; 