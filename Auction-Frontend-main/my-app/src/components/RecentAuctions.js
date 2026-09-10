import React, { useState, useEffect } from 'react';
import { FaGavel, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AuctionImage from './AuctionImage';
import { API_BASE, WS_BASE } from '../config/apiConfig';


const RecentAuctions = () => {
  const [recentAuctions, setRecentAuctions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/auctions/recent`)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data.data)) {
          setRecentAuctions(data.data.slice(0, 6)); // Show only last 6 auctions
        }
      })
      .catch(error => console.error('Error fetching recent auctions:', error));
  }, []);

  const calculateTimeLeft = (endDateTime) => {
    const now = new Date().getTime();
    const endTime = new Date(endDateTime).getTime();
    const timeLeft = endTime - now;
    
    if (timeLeft < 0) return 'Ended';
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    return `${days} days left`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recentAuctions.map(auction => (
        <div
          key={auction.id}
          className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-md-lg transition-all"
          onClick={() => navigate(`/auctions/${auction.id}`)}
        >
          <div className="h-48 relative overflow-hidden">
            <AuctionImage auctionId={auction.id} />
          </div>
          <div className="p-6">
            <h3 className="font-bold text-lg mb-2 truncate">{auction.title}</h3>
            <div className="flex justify-between items-center">
              <div className="flex items-center text-green-500">
                <FaGavel className="mr-2" />
                <span className="font-bold">${auction.basePrice}</span>
              </div>
              <div className="flex items-center text-blue-600">
                <FaClock className="mr-2" />
                <span>{calculateTimeLeft(auction.endDateTime)}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentAuctions;