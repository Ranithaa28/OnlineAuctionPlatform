import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaDollarSign, FaInfoCircle, FaTag, FaArrowLeft, FaImage } from "react-icons/fa";
import { updateAuctionDetails, getAuctionDetails } from "../services/auctionService";
import { useNavigate, useParams } from "react-router-dom";
import AuctionImage from "../components/AuctionImage";
import { toast } from 'react-toastify';

const UpdateAuction = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDateTime: "",
    endDateTime: "",
    basePrice: "",
    modifiedBy: ""
  });
  const navigate = useNavigate();
  const { auctionId } = useParams();

  useEffect(() => {
    const fetchAuctionDetails = async () => {
      try {
        const auction = await getAuctionDetails(auctionId);
        setFormData({
          title: auction.title,
          description: auction.description,
          startDateTime: auction.startDateTime,
          endDateTime: auction.endDateTime,
          basePrice: auction.basePrice,
          modifiedBy: `${auction.modifiedBy}`
        });
      } catch (error) {
        alert("Error fetching auction details: " + error.message);
      }
    };
    fetchAuctionDetails();
  }, [auctionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        formData.modifiedBy = `${user.firstName} ${user.lastName}`.trim();
        await updateAuctionDetails(auctionId, formData);
        toast.success("Auction updated successfully!");
        navigate("/user-auctions");
      } else {
        toast.error("Please log in first.");
        navigate("/signin");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate('/user-auctions')} 
            className="flex items-center text-gray-500 hover:text-gray-800"
          >
            <FaArrowLeft className="mr-2" /> Back to My Auctions
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md-lg overflow-hidden">
          <div className="md:flex">
            {/* Left side - Current Image */}
            <div className="md:w-1/3 p-6 bg-gray-50">
              <h3 className="text-lg font-semibold mb-6 flex items-center">
                <FaImage className="mr-2" /> Current Image
              </h3>
              <div className="rounded-lg overflow-hidden">
                <AuctionImage auctionId={auctionId} />
              </div>
            </div>

            {/* Right side - Update Form */}
            <div className="md:w-2/3 p-6">
              <h2 className="text-2xl font-bold mb-6">Update Auction</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-gray-500 mb-2">
                    <FaTag /> Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    className="w-full p-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-500 mb-2">
                    <FaInfoCircle /> Description
                  </label>
                  <textarea
                    name="description"
                    className="w-full p-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-gray-500 mb-2">
                      <FaCalendarAlt /> Start Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      name="startDateTime"
                      className="w-full p-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.startDateTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-gray-500 mb-2">
                      <FaCalendarAlt /> End Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      name="endDateTime"
                      className="w-full p-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.endDateTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-500 mb-2">
                    <FaDollarSign /> Base Price
                  </label>
                  <input
                    type="number"
                    name="basePrice"
                    className="w-full p-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.basePrice}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex gap-6">
                  <button
                    type="button"
                    onClick={() => navigate('/user-auctions')}
                    className="w-1/2 py-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-4 bg-blue-600 text-white rounded-lg hover-bg-blue-600 transition-colors"
                  >
                    Update Auction
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateAuction;
