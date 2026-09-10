import React, { useState } from "react";
import { FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authService";
import { toast } from "react-toastify";

const SigninForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userData = await loginUser(formData);
      setUser(userData);
      toast.success("Login successful!");
      if (userData.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.message || "Failed to login");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md-lg w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 background-animate">
          <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent inline-block">
            Welcome Back
          </span>
        </h2>
        <p className="text-gray-500">Sign in to continue to Auction Bazaar</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <p className="text-center mt-6 text-gray-500">
        Don't have an account?{' '}
        <Link to="/signup" className="text-blue-600-600 hover:text-blue-600-700 font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default SigninForm;
