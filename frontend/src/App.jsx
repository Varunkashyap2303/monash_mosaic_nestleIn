import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import BookingPage from './pages/BookingPage';
import ChatbotPage from './pages/ChatbotPage';
import ConfirmationPage from './pages/ConfirmationPage';
import MapDemo from './components/MapDemo';
import ProtectedRoute from './components/ProtectedRoute';

function HomeContent() {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen artistic-bg-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Subtle overlay for better text readability */}
        <div className="absolute inset-0 bg-white/5"></div>
        
        <div className="relative z-10 flex flex-col justify-center items-center min-h-screen px-6">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo/Icon */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-2xl mb-6">
                <span className="text-3xl text-white">🕊️</span>
              </div>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Nestle-In
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Your personalized hub for smarter living — {isAuthenticated ? 'chat with our AI assistant!' : 'sign up or log in to get started.'}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isAuthenticated ? (
                <a
                  href="/chatbot"
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <span className="mr-2">Start Chatting</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              ) : (
                <>
                  <a
                    href="/signup"
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                  >
                    <span className="mr-2">Get Started</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                  <a
                    href="/login"
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-full shadow-lg hover:shadow-xl hover:border-gray-300 transform hover:-translate-y-1 transition-all duration-300"
                  >
                    Sign In
                  </a>
                </>
              )}
            </div>
            
            {/* Features */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Secure Authentication</h3>
                <p className="text-gray-600">Built with AWS Cognito for enterprise-grade security</p>
              </div>
              
              <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">AI Assistant</h3>
                <p className="text-gray-600">Intelligent chatbot powered by AWS Lambda</p>
              </div>
              
              <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Lightning Fast</h3>
                <p className="text-gray-600">Optimized for speed and performance</p>
              </div>
            </div>
          </div>
        </div>
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
        <Route path="/map-demo" element={<MapDemo />} />
        <Route 
          path="/booking" 
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chatbot" 
          element={
            <ProtectedRoute>
              <ChatbotPage />
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