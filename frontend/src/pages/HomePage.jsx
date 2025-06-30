import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center p-10 bg-white rounded-2xl shadow-xl border border-gray-200">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to Nestle-In</h1>
        <p className="text-gray-600 text-lg mb-8">
          Your gateway to secure authentication and seamless access. Built with AWS Cognito and React.
        </p>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}