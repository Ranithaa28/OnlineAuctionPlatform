import React, { useState, useEffect } from 'react';
import { FaGavel, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { API_BASE, WS_BASE } from '../config/apiConfig';


const RecentBids = ({ userId }) => {
  const [recentBids, setRecentBids] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/bids/user/${userId}`)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data.data)) {
          setRecentBids(data.data.slice(0, 5)); // Show only last 5 bids
        }
      })
      .catch(error => console.error('Error fetching recent bids:', error));
  }, [userId]);

  return (
    <div className="space-y-4">
      {recentBids.length > 0 ? (
        recentBids.map(bid => (
          <div
            key={bid.id}
            className="bg-gray-50 p-6 rounded-lg cursor-pointer hover:bg-gray-50"
            onClick={() => navigate(`/auctions/${bid.auctionId}`)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center text-green-500">
                <FaGavel className="mr-2" />
                <span className="font-bold">${bid.amount}</span>
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <FaClock className="mr-2" />
                <span>{new Date(bid.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">No recent bids</p>
      )}
    </div>
  );
};

export default RecentBids;