import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaSearch } from 'react-icons/fa';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl font-bold text-blue-600 mb-6">404</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Page Not Found</h1>
        <p className="text-gray-500 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center px-6 py-4 bg-blue-600 text-white rounded-lg hover-bg-blue-600 transition-colors"
          >
            <FaHome className="mr-2" />
            Go Home
          </button>
          <button
            onClick={() => navigate('/auctions')}
            className="flex items-center justify-center px-6 py-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <FaSearch className="mr-2" />
            Browse Auctions
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
