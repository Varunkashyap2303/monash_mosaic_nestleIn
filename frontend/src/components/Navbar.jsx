import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
      <h1 className="text-xl font-bold text-green-700">Nestle-In</h1>
      <div className="space-x-4">
        <Link to="/" className="text-gray-700 hover:text-green-700">Home</Link>
        <Link to="/login" className="text-gray-700 hover:text-green-700">Sign In</Link>
        <Link to="/signup" className="text-gray-700 hover:text-green-700">Sign Up</Link>
        <Link to="/book" className="text-gray-700 hover:text-green-700">Book a pod</Link>
      </div>
    </nav>
  );
}