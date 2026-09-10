import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClock, FaGavel } from 'react-icons/fa';
import AuctionImage from './AuctionImage';

const AuctionCard = ({ auction }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/auctions/${auction.id}`);
  };

  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const endTime = new Date(auction.endDateTime).getTime();
    const timeLeft = endTime - now;
    
    if (timeLeft < 0) return 'Ended';
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    return `${days} days left`;
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-md-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-gray-100 group"
      onClick={handleClick}
    >
      <div className="relative h-56 overflow-hidden">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
        <div className="w-full h-full transform group-hover:scale-110 transition-transform duration-500">
          <AuctionImage auctionId={auction.id} />
        </div>
        <div className="absolute top-4 right-4 z-20">
          <span className="bg-white/90 backdrop-blur-sm px-6 py-1 rounded-full text-xs font-bold text-theme-primary shadow-md-sm">
            Featured
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-theme-primary transition-colors">{auction.title}</h3>
        <p className="text-gray-500 mb-8 line-clamp-2 text-sm leading-relaxed">{auction.description}</p>
        
        <div className="flex justify-between items-center mb-6 bg-gray-50 p-6 rounded-lg border border-gray-100">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">Current Bid</span>
            <div className="flex items-center text-theme-primary">
              <FaGavel className="mr-2" />
              <span className="font-bold text-lg">${auction.basePrice}</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">Time Left</span>
            <div className="flex items-center text-theme-secondary">
              <FaClock className="mr-2" />
              <span className="font-bold">{calculateTimeLeft()}</span>
            </div>
          </div>
        </div>
        
        <button className="w-full bg-theme-primary text-white py-4 rounded-xl font-semibold shadow-md shadow-md-theme-primary/30 hover:bg-theme-primary/90 hover:shadow-md-lg hover:shadow-md-theme-primary/40 transition-all duration-300">
          Place Bid
        </button>
      </div>
    </div>
  );
};

export default AuctionCard;
