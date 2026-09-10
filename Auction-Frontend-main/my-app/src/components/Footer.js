import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-xl font-bold">Auction Bazaar</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted platform for discovering and bidding on unique items from around the world.
            </p>
            <div className="flex justify-center md:justify-start gap-4 pt-2">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FaGithub className="text-2xl" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedin className="text-2xl" />
              </a>
              <a href="mailto:contact@auctionbazaar.com" className="text-gray-400 hover:text-white transition-colors">
                <FaEnvelope className="text-2xl" />
              </a>
            </div>
          </div>
          
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/auctions" className="text-gray-400 hover:text-white transition-colors">Browse Auctions</Link></li>
              <li><Link to="/create-auction" className="text-gray-400 hover:text-white transition-colors">Start Selling</Link></li>
              <li><Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">My Dashboard</Link></li>
            </ul>
          </div>

          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Auction Bazaar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
