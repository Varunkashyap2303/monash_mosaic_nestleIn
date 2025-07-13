import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import BookingPage from './pages/BookingPage';
import ConfirmationPage from './pages/ConfirmationPage';
import ProtectedRoute from './components/ProtectedRoute';

function HomeContent() {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-green-100 px-6">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 text-center">
        Welcome to <span className="text-green-600">Nestle-In</span> 🕊️
      </h1>
      <p className="mt-4 text-lg text-gray-600 text-center max-w-md">
        Your personalized hub for smarter living — {isAuthenticated ? 'book your sleeping pod now!' : 'sign up or log in to get started.'}
      </p>
      <div className="mt-6">
        {isAuthenticated ? (
          <a
            href="/book"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full shadow-md transition"
          >
            Book a Pod
          </a>
        ) : (
          <a
            href="/signup"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full shadow-md transition"
          >
            Get Started
          </a>
        )}
      </div>
    </div>
  );
}

function Home() {
  return <HomeContent />;
}

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/book" 
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/confirmation" 
          element={
            <ProtectedRoute>
              <ConfirmationPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AuthProvider>
  );
}