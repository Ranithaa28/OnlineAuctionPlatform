import React from "react";
import SigninForm from "../components/SigninForm";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Signin = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <SigninForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signin;
