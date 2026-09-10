import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CreateAuction from "./pages/CreateAuction";
import UpdateAuction from "./pages/UpdateAuction";
import UserAuctions from "./pages/UserAuctions";
import AuctionList from './components/AuctionList'; // Updated import path
import AuctionDetails from './components/AuctionDetails';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute'; // Updated import path
import Home from "./pages/Home";
import './index.css';
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <AuthProvider>

        <Router>
          <div className="vh-100 d-d-flex d-flex-column">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/admin" element={
  <PrivateRoute>
    <AdminDashboard />
  </PrivateRoute>
} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/create-auction" element={<CreateAuction />} />
              <Route path="/update-auction/:auctionId" element={<UpdateAuction />} />
              <Route path="/user-auctions" element={
                <PrivateRoute>
                  <UserAuctions />
                </PrivateRoute>
              } />
              <Route path="/auctions" element={<AuctionList />} />
              <Route path="/auctions/:auctionId" element={<AuctionDetails />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </div>
          <ToastContainer 
            position="top-right" 
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </Router>
    
    </AuthProvider>
  );
}

export default App;
