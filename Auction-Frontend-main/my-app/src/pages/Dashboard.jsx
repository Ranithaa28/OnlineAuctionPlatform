import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaGavel, FaPlus, FaUser, FaArrowRight, FaList, FaSignOutAlt, FaHistory, FaEdit } from "react-icons/fa";
import { getUserAuctions } from "../services/auctionService";
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [userAuctions, setUserAuctions] = useState([]);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    try {
      logout();
      navigate("/signin");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error logging out");
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        if (!user) {
          navigate("/signin");
          return;
        }
        const userName = `${user.firstName} ${user.lastName}`;
        const result = await getUserAuctions(userName);
        if (result && result.data) {
          setUserAuctions(result.data.slice(0, 5));
        }
      } catch (error) {
        toast.error("Error fetching auctions");
        console.error("Error fetching auctions:", error);
      }
    };
    fetchAuctions();
  }, [user, navigate]);

  const getStatus = (startDateTime, endDateTime) => {
    const now = new Date();
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    if (now < start) return <span className="status-upcoming">Upcoming</span>;
    if (now > end) return <span className="status-ended">Ended</span>;
    return <span className="status-active">Active</span>;
  };

  const menuItems = [
    {
      title: "Browse Auctions",
      icon: <FaGavel className="w-8 h-8" />,
      path: "/auctions",
      description: "View and bid on available auctions",
      gradient: "bg-gradient-to-br from-indigo-500 to-blue-500"
    },
    {
      title: "Create Auction",
      icon: <FaPlus className="w-8 h-8" />,
      path: "/create-auction",
      description: "Create a new auction listing",
      gradient: "bg-gradient-to-br from-emerald-500 to-teal-500"
    },
    {
      title: "My Auctions",
      icon: <FaList className="w-8 h-8" />,
      path: "/user-auctions",
      description: "Manage your auction listings",
      gradient: "bg-gradient-to-br from-violet-500 to-purple-500"
    },
    {
      title: "Profile",
      icon: <FaUser className="w-8 h-8" />,
      path: "/profile",
      description: "View and edit your profile",
      gradient: "bg-gradient-to-br from-amber-500 to-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Welcome, {user?.firstName}!
              </h1>
              <p className="text-gray-500 mt-1">Manage your auctions and bids</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-6 py-4 bg-white border border-gray-200 text-gray-800 rounded-full hover:bg-gray-50 hover:border-gray-300 transition transform hover:scale-105 shadow-md-sm"
            >
              <FaSignOutAlt className="mr-2 text-gray-500" /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {menuItems.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              className={`${item.gradient} rounded-2xl shadow-md-lg p-8 cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-md-xl text-white hover:scale-105`}
            >
              <div className="mb-6 opacity-90">{item.icon}</div>
              <h3 className="text-2xl font-bold mb-6">{item.title}</h3>
              <p className="text-white/80">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="mt-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center">
              <FaHistory className="mr-3 text-gray-500-600" /> Recent Activity
            </h2>
            <button
              onClick={() => navigate('/user-auctions')}
              className="px-6 py-4 bg-blue-600-600 text-white rounded-full hover:bg-blue-600-700 transition transform hover:scale-105 shadow-md inline-flex items-center"
            >
              View All <FaArrowRight className="ml-2" />
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-md-lg overflow-hidden border border-gray-100">
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Base Price</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userAuctions.map((auction) => (
                      <tr key={auction.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{auction.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-theme-primary font-semibold">
                          ${auction.basePrice}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(auction.startDateTime).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(auction.endDateTime).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatus(auction.startDateTime, auction.endDateTime)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => navigate(`/update-auction/${auction.id}`)}
                              className="p-2 bg-theme-secondary bg-opacity-20 text-theme-secondary rounded-lg hover:bg-opacity-30 transition"
                            >
                              <FaEdit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => navigate(`/auctions/${auction.id}`)}
                              className="p-2 bg-theme-primary bg-opacity-20 text-theme-primary rounded-lg hover:bg-opacity-30 transition"
                            >
                              <FaGavel className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {userAuctions.length === 0 && (
                <div className="text-center py-12">
                  <FaGavel className="mx-auto h-12 w-12 text-theme-secondary mb-6" />
                  <p className="text-gray-500 text-lg mb-6">No auctions yet. Create your first auction!</p>
                  <button
                    onClick={() => navigate('/create-auction')}
                    className="px-6 py-4 bg-theme-primary text-white rounded-full hover:bg-theme-primary-dark transition transform hover:scale-105"
                  >
                    Create Auction
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
