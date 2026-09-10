import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import AuctionImage from './AuctionImage';
import BidHistory from './BidHistory';
import { FaClock, FaGavel, FaArrowLeft } from 'react-icons/fa';
import Navbar from './Navbar';
import Footer from './Footer';
import { API_BASE, WS_BASE } from '../config/apiConfig';



const AuctionDetails = () => {
  const { auctionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

        const [auctionResponse, bidsResponse] = await Promise.all([
          fetch(`${API_BASE}/auctions/${auctionId}`),
          fetch(`${API_BASE}/bids/auction/${auctionId}`, { headers: authHeader })
        ]);

        const auctionData = await auctionResponse.json();
        const bidsData = await bidsResponse.json();

        if (auctionData.data) {
          setAuction(auctionData.data);
        }
        if (Array.isArray(bidsData.data)) {
          setBids(bidsData.data);
        }
      } catch (error) {
        toast.error('Error loading auction details');
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // WebSocket Connection
    const socket = new SockJS(`${WS_BASE}`);
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      stompClient.subscribe(`/topic/auctions/${auctionId}/bids`, (message) => {
        if (message.body) {
          const newBid = JSON.parse(message.body);
          setBids((prevBids) => {
            // Check if bid already exists
            if (prevBids.some(bid => bid.id === newBid.id)) {
              return prevBids;
            }
            return [...prevBids, newBid].sort((a, b) => b.amount - a.amount);
          });
        }
      });
    }, (error) => {
      console.error('WebSocket Error:', error);
    });

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, [auctionId]);

  const handleBidAmountChange = (e) => {
    setBidAmount(e.target.value);
  };

  const handleCreateBid = async () => {
    if (!user) {
      toast.error('You must be logged in to place a bid');
      navigate('/signin');
      return;
    }

    if (!bidAmount || bidAmount <= 0) {
      toast.error('Please enter a valid bid amount');
      return;
    }

    const currentHighest = getCurrentHighestBid();
    if (parseFloat(bidAmount) <= currentHighest) {
      toast.error(`Bid amount must be higher than $${currentHighest}`);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/bids`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          auctionId: parseInt(auctionId),
          amount: parseFloat(bidAmount),
        })
      });

      const result = await response.json();

      if (response.ok) {
        setBidAmount(''); // Clear input field
        toast.success('🎉 Bid placed successfully!');
        // Note: We don't need to manually fetch bids here anymore
        // because the WebSocket will push the new bid to us automatically.
      } else {
        toast.error(result.error || result.message || 'Error placing bid');
      }
    } catch (error) {
      toast.error('Failed to place bid. Please try again.');
      console.error('Error:', error);
    }
  };

  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const endTime = new Date(auction.endDateTime).getTime();
    const timeLeft = endTime - now;

    if (timeLeft < 0) return 'Auction Ended';

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}d ${hours}h ${minutes}m`;
  };

  const getCurrentHighestBid = () => {
    if (bids.length === 0) return auction.basePrice;
    return Math.max(...bids.map(bid => bid.amount));
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center h-screen">
        <div className="animate-spin rounded-circle h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="d-flex d-flex-column align-items-center justify-content-center h-screen">
        <p className="fs-4 text-secondary mb-3">Auction not found</p>
        <button
          onClick={() => navigate('/auctions')}
          className="d-flex align-items-center text-primary hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" /> Back to Auctions
        </button>
      </div>
    );
  }

  return (
    <div className="vh-100 bg-light">
      <Navbar />
      <div className="max-w-7xl mx-auto px-3 py-8">
        <button
          onClick={() => navigate(-1)}
          className="d-flex align-items-center text-secondary hover:text-primary-600 mb-3 transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-d-none">
          <div className="md:d-flex">
            {/* Left side - Image */}
            <div className="md:w-1/2 p-4">
              <AuctionImage auctionId={auction.id} />
            </div>

            {/* Right side - Details */}
            <div className="md:w-1/2 p-4">
              <h1 className="fs-2 fw-bold mb-3 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                {auction.title}
              </h1>

              {/* Creator Info Card */}
              <div className="bg-light rounded-xl p-3 mb-4">
                <div className="d-flex align-items-center text-secondary">
                  <div className="w-10 h-10 bg-theme-gradient rounded-circle d-flex align-items-center justify-content-center text-white fw-semibold">
                    {auction.createdBy?.charAt(0) || 'U'}
                  </div>
                  <div className="ml-3">
                    <div className="fs-6 text-secondary">Created by</div>
                    <div className="font-medium text-primary-600">{auction.createdBy}</div>
                  </div>
                </div>
              </div>

              {/* Current Bid & Time Left Card */}
              <div className="bg-light rounded-xl p-4 mb-4">
                <div className="d-grid d-grid-cols-2 gap-3">
                  <div>
                    <div className="text-secondary mb-1 d-flex align-items-center">
                      <FaGavel className="mr-2 text-primary-500" />
                      Current Bid
                    </div>
                    <div className="fs-3 fw-bold text-primary-600">
                      ${getCurrentHighestBid()}
                    </div>
                  </div>
                  <div>
                    <div className="text-secondary mb-1 d-flex align-items-center">
                      <FaClock className="mr-2 text-secondary-500" />
                      Time Left
                    </div>
                    <div className="fs-3 fw-bold text-secondary-600">
                      {calculateTimeLeft()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Card */}
              <div className="bg-light rounded-xl p-4 mb-4">
                <h2 className="fs-4 fw-semibold mb-2 text-dark">Description</h2>
                <p className="text-secondary">{auction.description}</p>
              </div>

              {/* Bid Input or Winner Display */}
              {new Date().getTime() > new Date(auction.endDateTime).getTime() ? (
                <div className="bg-red-50 rounded-xl p-4 border border-red-100 text-center">
                  <h3 className="text-xl font-bold text-red-600 mb-2 flex items-center justify-center gap-2">
                    <FaGavel /> Auction Ended
                  </h3>
                  {bids.length > 0 ? (
                    <div>
                      <p className="text-gray-700 mb-1">The winning bid was <span className="font-bold text-green-600">${getCurrentHighestBid()}</span></p>
                      <p className="text-gray-600 text-sm">Winner: {bids.reduce((max, bid) => bid.amount > max.amount ? bid : max, bids[0]).createdBy}</p>
                    </div>
                  ) : (
                    <p className="text-gray-600">This auction ended with no bids.</p>
                  )}
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <input
                    type="number"
                    placeholder="Enter bid amount"
                    value={bidAmount}
                    onChange={handleBidAmountChange}
                    className="d-flex-1 p-3 border rounded-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button
                    onClick={handleCreateBid}
                    className="px-4 py-3 bg-theme-gradient text-white rounded-3 hover:opacity-90 transition-opacity font-medium"
                  >
                    Place Bid
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bid History Section */}
          <div className="p-4 border-t border-gray-100">
            <BidHistory auctionId={auction.id} realTimeBids={bids} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AuctionDetails;