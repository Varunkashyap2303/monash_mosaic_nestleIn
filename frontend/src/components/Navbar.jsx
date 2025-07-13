import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
      <h1 className="text-xl font-bold text-green-700">Nestle-In</h1>
      <div className="space-x-4">
        <Link to="/" className="text-gray-700 hover:text-green-700">Home</Link>
        {isAuthenticated ? (
          <>
            <Link to="/book" className="text-gray-700 hover:text-green-700">Book a pod</Link>
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-green-700 bg-transparent border-none cursor-pointer"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-green-700">Sign In</Link>
            <Link to="/signup" className="text-gray-700 hover:text-green-700">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}