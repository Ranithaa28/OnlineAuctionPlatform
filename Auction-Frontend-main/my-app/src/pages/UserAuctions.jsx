import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaArrowLeft, FaPlus } from "react-icons/fa";
import { getUserAuctions, deleteAuction } from "../services/auctionService";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const UserAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAuctions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userName = `${user.firstName} ${user.lastName}`;
        const userAuctions = await getUserAuctions(userName);
        setAuctions(userAuctions.data);
      } catch (error) {
        toast.error("Error fetching auctions: " + error.message);
      }
    };
    fetchUserAuctions();
  }, []);

  const handleDelete = async (auctionId) => {
    if (window.confirm('Are you sure you want to delete this auction?')) {
      try {
        await deleteAuction(auctionId);
        setAuctions(auctions.filter((auction) => auction.id !== auctionId));
        toast.success("Auction deleted successfully!");
      } catch (error) {
        toast.error("Error deleting auction: " + error.message);
      }
    }
  };

  const getStatus = (startDateTime, endDateTime) => {
    const now = new Date();
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    if (now < start) return <span className="status-upcoming">Upcoming</span>;
    if (now > end) return <span className="status-ended">Ended</span>;
    return <span className="status-active">Active</span>;
  };

  const handleCardClick = (auctionId, event) => {
    // Prevent navigation if clicking on action buttons
    if (event.target.closest('button')) {
      return;
    }
    navigate(`/auctions/${auctionId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="flex items-center text-gray-500 hover:text-blue-600-600 transition-colors"
            >
              <FaArrowLeft className="mr-2" /> Back to Dashboard
            </button>
            <button
              onClick={() => navigate('/create-auction')}
              className="px-6 py-2 bg-theme-gradient text-white rounded-full hover:opacity-90 transition-all shadow-md flex items-center gap-2"
            >
              <FaPlus /> Create New Auction
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-md-lg p-8">
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Your Auctions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {auctions.map((auction) => (
                <div
                  key={auction.id}
                  onClick={(e) => handleCardClick(auction.id, e)}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-md-lg transition-all hover:-translate-y-1 cursor-pointer"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-6 text-blue-600-600">{auction.title}</h3>
                    
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex justify-between">
                        <span>Base Price:</span>
                        <span className="font-medium text-gray-800">${auction.basePrice}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Start Date:</span>
                        <span>{new Date(auction.startDateTime).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>End Date:</span>
                        <span>{new Date(auction.endDateTime).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span>Status:</span>
                        {getStatus(auction.startDateTime, auction.endDateTime)}
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/update-auction/${auction.id}`);
                        }}
                        className="p-2 bg-secondary-50 text-gray-500-600 rounded-lg hover:bg-secondary-100 transition-colors"
                        title="Edit Auction"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(auction.id);
                        }}
                        className="p-2 bg-red-500-50 text-red-500-600 rounded-lg hover:bg-red-500-100 transition-colors"
                        title="Delete Auction"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {auctions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-6">No auctions found. Start creating your first auction!</p>
                <button
                  onClick={() => navigate('/create-auction')}
                  className="px-6 py-4 bg-theme-gradient text-white rounded-full hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                >
                  <FaPlus /> Create Auction
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserAuctions;
