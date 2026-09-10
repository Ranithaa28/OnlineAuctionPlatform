import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaDollarSign, FaInfoCircle, FaTag, FaImage, FaArrowLeft } from "react-icons/fa";
import { createAuction, uploadAuctionImage } from "../services/auctionService";
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
// import { useNotifications } from '../context/NotificationContext';

const CreateAuction = () => {
  const navigate = useNavigate();
  //const { addNotification } = useNotifications();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDateTime: "",
    endDateTime: "",
    basePrice: "",
    image: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: files && files.length > 0 ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        const auctionData = {
          title: formData.title,
          description: formData.description,
          startDateTime: formData.startDateTime,
          endDateTime: formData.endDateTime,
          basePrice: formData.basePrice,
          createdBy: `${user.firstName} ${user.lastName}`
        };

        const createdAuction = await createAuction(auctionData);

        if (formData.image) {
          await uploadAuctionImage(createdAuction.data.id, formData.image);
        }
        
        toast.success("Auction created successfully!");
        //addNotification('Auction created successfully! It is now live.', 'success');
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-6">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex items-center text-gray-500 hover:text-blue-600-600 transition-colors mb-6"
          >
            <FaArrowLeft className="mr-2" /> Back to Dashboard
          </button>

          <div className="bg-white rounded-2xl shadow-md-lg overflow-hidden">
            <div className="p-8">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Create New Auction
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title Input */}
                <div>
                  <label className="flex items-center gap-2 text-gray-800 text-sm font-medium mb-2">
                    <FaTag className="text-blue-600-500" /> Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    className="w-full p-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Description Input */}
                <div>
                  <label className="flex items-center gap-2 text-gray-800 text-sm font-medium mb-2">
                    <FaInfoCircle className="text-blue-600-500" /> Description
                  </label>
                  <textarea
                    name="description"
                    className="w-full p-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 h-32"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Date Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-gray-800 text-sm font-medium mb-2">
                      <FaCalendarAlt className="text-blue-600-500" /> Start Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      name="startDateTime"
                      className="w-full p-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      value={formData.startDateTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-gray-800 text-sm font-medium mb-2">
                      <FaCalendarAlt className="text-blue-600-500" /> End Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      name="endDateTime"
                      className="w-full p-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      value={formData.endDateTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Price and Image Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-gray-800 text-sm font-medium mb-2">
                      <FaDollarSign className="text-blue-600-500" /> Base Price
                    </label>
                    <input
                      type="number"
                      name="basePrice"
                      className="w-full p-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      value={formData.basePrice}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-gray-800 text-sm font-medium mb-2">
                      <FaImage className="text-blue-600-500" /> Upload Image
                    </label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleChange}
                      className="w-full p-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-6 pt-6">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="w-1/2 py-4 bg-gray-50 text-gray-500 rounded-full hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-4 bg-theme-gradient text-white rounded-full hover:opacity-90 transition-opacity font-medium"
                  >
                    Create Auction
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateAuction;
