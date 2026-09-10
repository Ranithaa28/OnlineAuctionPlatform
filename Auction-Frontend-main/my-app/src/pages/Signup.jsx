import React from "react";
import SignupForm from "../components/SignupForm";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Signup = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <SignupForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
