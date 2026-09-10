import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGavel, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-theme-gradient/95 backdrop-blur-md text-white shadow-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <FaGavel className="text-3xl group-hover:rotate-12 transition-transform" />
            <span className="text-2xl font-bold">Auction Bazaar</span>
          </Link>
          <div className="flex gap-4">
            {user ? (
              <>
                {user.role === 'ADMIN' && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="px-6 py-2 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 transition-colors shadow-sm hover:shadow"
                  >
                    Admin Dashboard
                  </button>
                )}
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-2 bg-white text-theme-primary rounded-full hover:bg-gray-50 transition-colors shadow-sm hover:shadow"
                >
                  Dashboard
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/signin')}
                  className="flex items-center gap-2 px-6 py-2 bg-white text-theme-primary rounded-full hover:bg-gray-50 transition-colors shadow-sm hover:shadow"
                >
                  <FaSignInAlt /> Sign In
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="flex items-center gap-2 px-6 py-2 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-theme-primary transition-colors"
                >
                  <FaUserPlus /> Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
