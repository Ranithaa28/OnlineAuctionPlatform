import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuctionCard from './AuctionCard';
import FilterSearch from './FilterSearch';
import { FaGavel } from 'react-icons/fa';
import { API_BASE, WS_BASE } from '../config/apiConfig';


const AuctionList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [auctions, setAuctions] = useState([]);
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/auctions`);
      const result = await response.json();
      if (Array.isArray(result.data)) {
        const approvedAuctions = result.data.filter(auction => auction.status === 'APPROVED');
        setAuctions(approvedAuctions);
        setFilteredAuctions(approvedAuctions);
      }
    } catch (error) {
      console.error('Error fetching auctions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredAuctions(auctions);
      return;
    }

    const searchResults = auctions.filter(auction => {
      const searchTermLower = searchTerm.toLowerCase();
      const title = auction.title?.toLowerCase() || '';
      const description = auction.description?.toLowerCase() || '';
      
      return title.includes(searchTermLower) || 
             description.includes(searchTermLower);
    });
    
    setFilteredAuctions(searchResults);
  };

  const handleFilter = (filter) => {
    const now = new Date();
    let filtered = [...auctions];

    switch (filter) {
      case 'active':
        filtered = auctions.filter(auction => 
          new Date(auction.startDateTime) <= now && 
          new Date(auction.endDateTime) >= now
        );
        break;
      case 'upcoming':
        filtered = auctions.filter(auction => 
          new Date(auction.startDateTime) > now
        );
        break;
      case 'completed':
        filtered = auctions.filter(auction => 
          new Date(auction.endDateTime) < now
        );
        break;
      default:
        filtered = auctions;
    }
    setFilteredAuctions(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-theme-gradient text-white shadow-md mb-8">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <FaGavel className="text-2xl" />
              <span className="text-3xl font-bold">Auction Bazaar</span>
            </Link>
            <div className="flex gap-6">
              {user ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-2 bg-white text-theme-primary rounded-full hover:bg-gray-50 transition-colors"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/signin')}
                    className="px-6 py-2 bg-white text-theme-primary rounded-full hover:bg-gray-50 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    className="px-6 py-2 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-theme-primary transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <FilterSearch onSearch={handleSearch} onFilter={handleFilter} />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-theme-primary mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading auctions...</p>
          </div>
        ) : (
          <>
            {filteredAuctions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAuctions.map(auction => (
                  <AuctionCard key={auction.id} auction={auction} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FaGavel className="mx-auto h-12 w-12 text-gray-400 mb-6" />
                <p className="text-gray-500 text-lg">No auctions found matching your criteria.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AuctionList;