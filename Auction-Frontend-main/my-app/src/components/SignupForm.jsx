import { useState } from "react";
import { FaEnvelope, FaLock, FaPhone, FaUser, FaSpinner } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import React from "react";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    createdBy: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "firstName" || name === "lastName") {
      const newFormData = { ...formData, [name]: value };
      newFormData.createdBy = `${newFormData.firstName} ${newFormData.lastName}`.trim();
      setFormData(newFormData);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(formData);
      toast.success("Registration successful!");
      navigate("/signin");
    } catch (error) {
      toast.error(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md-lg w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 background-animate">
          <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent inline-block">
            Create Account
          </span>
        </h2>
        <p className="text-gray-500">Join Auction Bazaar today</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-gray-800 text-sm font-medium mb-2">
              <FaUser className="text-gray-400" /> First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-gray-800 text-sm font-medium mb-2">
              <FaUser className="text-gray-400" /> Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-gray-800 text-sm font-medium mb-2">
            <FaEnvelope className="text-gray-400" /> Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-gray-800 text-sm font-medium mb-2">
            <FaPhone className="text-gray-400" /> Phone Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full p-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-gray-800 text-sm font-medium mb-2">
            <FaLock className="text-gray-400" /> Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-theme-gradient text-white p-6 rounded-full hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <p className="text-center mt-6 text-gray-500">
        Already have an account?{' '}
        <Link to="/signin" className="text-blue-600-600 hover:text-blue-600-700 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default SignupForm;
