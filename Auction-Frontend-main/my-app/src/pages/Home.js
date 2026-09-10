import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGavel, FaShieldAlt, FaClock, FaUsers, FaArrowRight, FaStar, FaTrophy } from 'react-icons/fa';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import AuctionImage from '../components/AuctionImage';
import { API_BASE, WS_BASE } from '../config/apiConfig';


const Home = () => {
  const [featuredAuctions, setFeaturedAuctions] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/auctions`)
      .then(response => response.json())
      .then(result => {
        if (Array.isArray(result.data)) {
          // Get only active and APPROVED auctions and limit to 3 for featured section
          const activeAuctions = result.data
            .filter(auction => 
              auction.status === 'APPROVED' &&
              new Date(auction.startDateTime) <= new Date() && 
              new Date(auction.endDateTime) >= new Date()
            )
            .slice(0, 3);
          setFeaturedAuctions(activeAuctions);
        }
      })
      .catch(error => console.error('Error fetching auctions:', error));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        {/* Hero Section */}
        <div className="relative bg-theme-gradient text-white overflow-hidden">
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
          <div className="max-w-7xl mx-auto px-4 py-24 sm:py-32 relative">
            <div className="text-center space-y-8">
              <div className="animate-fadeIn">
                <h1 className="text-5xl sm:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
                  Discover & Bid on
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 drop-shadow-sm mt-2">Amazing Items</span>
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
                  Join the most exciting online auction platform and find unique treasures
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/auctions"
                  className="bg-white text-theme-primary px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition transform hover:scale-105 shadow-lg inline-flex items-center"
                >
                  Browse Auctions <FaArrowRight className="ml-2" />
                </Link>
                <Link
                  to="/create-auction"
                  className="bg-white/10 backdrop-blur-md border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/20 hover:border-white transition transform hover:scale-105 inline-flex items-center shadow-lg"
                >
                  Start Selling <FaGavel className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { number: "10K+", label: "Active Users" },
                { number: "50K+", label: "Auctions Completed" },
                { number: "$2M+", label: "Items Sold" },
                { number: "99%", label: "Satisfied Customers" },
              ].map((stat, index) => (
                <div key={index} className="text-center p-6 hover:transform hover:scale-105 transition duration-300">
                  <div className="text-4xl font-bold text-theme-primary mb-2">{stat.number}</div>
                  <div className="text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Auctions */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center">
              <FaStar className="text-yellow-400 mr-3" />
              Featured Auctions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredAuctions.map((auction) => (
                <div key={auction.id} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
                  <div className="h-48">
                    <AuctionImage auctionId={auction.id} />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{auction.title}</h3>
                    <p className="text-theme-primary font-bold">Starting bid: ${auction.basePrice}</p>
                    <p className="text-gray-500 text-sm mb-4">
                      Ends: {new Date(auction.endDateTime).toLocaleDateString()}
                    </p>
                    <Link 
                      to={`/auctions/${auction.id}`} 
                      className="mt-4 inline-block bg-theme-primary text-white px-4 py-2 rounded hover:bg-theme-secondary transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                to="/auctions"
                className="inline-flex items-center bg-theme-secondary text-white px-6 py-3 rounded-full hover:bg-theme-primary transition"
              >
                View All Auctions <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>

        {/* Key Features with improved styling */}
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 flex items-center justify-center">
              <FaTrophy className="text-yellow-400 mr-3" />
              Why Choose Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { icon: FaShieldAlt, title: "Secure Bidding", desc: "Advanced encryption and secure payment processing" },
                { icon: FaClock, title: "Real-time Updates", desc: "Instant notifications and live auction tracking" },
                { icon: FaUsers, title: "Active Community", desc: "Join thousands of passionate collectors and sellers" },
              ].map((feature, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 text-center transform hover:-translate-y-2 transition duration-300 shadow-lg hover:shadow-2xl border border-gray-100 group">
                  <div className="bg-theme-secondary/10 w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 group-hover:bg-theme-secondary group-hover:text-white transition-colors duration-300">
                    <feature.icon className="text-3xl text-theme-secondary group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Call to Action */}
        <div className="bg-theme-gradient-reverse text-white py-24">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Start Bidding?</h2>
            <p className="mb-10 text-xl text-gray-200 max-w-2xl mx-auto">
              Join Auction Bazaar today and discover a world of unique items waiting for your bid
            </p>
            <Link to="/signup" className="bg-white text-theme-primary px-10 py-4 rounded-full font-semibold hover:bg-gray-50 transition transform hover:scale-105 inline-flex items-center">
              Get Started Now <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;