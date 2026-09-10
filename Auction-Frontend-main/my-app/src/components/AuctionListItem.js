import React, { useState } from 'react';
import AuctionImage from './AuctionImage';
import BidHistory from './BidHistory';

const AuctionListItem = ({ auction }) => {
  const [showBidHistory, setShowBidHistory] = useState(false);

  const toggleBidHistory = () => {
    setShowBidHistory(!showBidHistory);
  };

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white flex flex-col md:flex-row">
      <div className="md:w-1/2">
        <AuctionImage auctionId={auction.id} />
      </div>
      <div className="md:w-1/2 md:pl-4">
        <h3 className="text-xl font-bold mb-2">{auction.title}</h3>
        <p className="text-gray-800 mb-2">{auction.description}</p>
        <p className="text-gray-800 mt-2">Starting Bid: ${auction.basePrice}</p>
        <p className="text-gray-800">Start Date: {new Date(auction.startDateTime).toLocaleString()}</p>
        <p className="text-gray-800">End Date: {new Date(auction.endDateTime).toLocaleString()}</p>
        <button
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md"
          onClick={toggleBidHistory}
        >
          {showBidHistory ? 'Hide Bid History' : 'Show Bid History'}
        </button>
        {showBidHistory && <BidHistory auctionId={auction.id} />}
      </div>
    </div>
  );
};

export default AuctionListItem;
