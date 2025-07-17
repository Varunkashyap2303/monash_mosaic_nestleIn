import React, { useState, useEffect } from "react";
import { CognitoUser } from "amazon-cognito-identity-js";
import { userPool } from "../lib/aws/cognito";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [step, setStep] = useState("signup"); // "signup" | "confirm" | "done"
  const [msg, setMsg] = useState("");
  const [matchError, setMatchError] = useState("");

  useEffect(() => {
    if (confirmPassword.length > 0 && password !== confirmPassword) {
      setMatchError("Passwords do not match");
    } else {
      setMatchError("");
    }
  }, [password, confirmPassword]);

  const handleSignup = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMsg("❌ Passwords do not match.");
      return;
    }

    setMsg("🔄 Creating account...");
    userPool.signUp(email, password, [], null, (err) => {
      if (err) {
        setMsg("❌ " + err.message);
      } else {
        setMsg("✅ Signup successful! Enter the confirmation code from your email.");
        setStep("confirm");
      }
    });
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    setMsg("🔄 Confirming account...");

    const user = new CognitoUser({ Username: email, Pool: userPool });

    user.confirmRegistration(confirmationCode, true, (err) => {
      if (err) {
        setMsg("❌ " + err.message);
      } else {
        setMsg("✅ Account confirmed! You can now log in.");
        setStep("done");
      }
    });
  };

  return (
    <div className="min-h-screen artistic-bg-2 flex items-center justify-center px-4 py-8">
      {/* Subtle overlay for better text readability */}
      <div className="absolute inset-0 bg-white/5"></div>

      <div className="relative z-10 max-w-md w-full">
        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full shadow-lg mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Nestle-In</h1>
            <p className="text-gray-600">Create your account and start your journey</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                step === "signup" ? "bg-blue-600 text-white" : 
                step === "confirm" ? "bg-green-600 text-white" : 
                "bg-green-600 text-white"
              }`}>
                {step === "signup" ? "1" : step === "confirm" ? "2" : "✓"}
              </div>
              <div className={`w-12 h-1 rounded-full ${
                step === "signup" ? "bg-gray-300" : "bg-green-600"
              }`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                step === "signup" ? "bg-gray-300 text-gray-600" : 
                step === "confirm" ? "bg-blue-600 text-white" : 
                "bg-green-600 text-white"
              }`}>
                {step === "signup" ? "2" : step === "confirm" ? "2" : "✓"}
              </div>
            </div>
          </div>

          {/* Signup Form */}
          {step === "signup" && (
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                      matchError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                {matchError && (
                  <p className="text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {matchError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={!!matchError}
                className={`w-full py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 ${
                  matchError
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white hover:shadow-xl transform hover:-translate-y-0.5"
                }`}
              >
                Create Account
              </button>
            </form>
          )}

          {/* Confirmation Form */}
          {step === "confirm" && (
            <form onSubmit={handleConfirm} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Confirmation Code</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7h3a2 2 0 012 2v6a2 2 0 01-2 2h-3m-6 0H6a2 2 0 01-2-2V9a2 2 0 012-2h3m6 0V5a2 2 0 012-2h3a2 2 0 012 2v2m-6 0h6" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    placeholder="Enter confirmation code"
                    value={confirmationCode}
                    onChange={(e) => setConfirmationCode(e.target.value)}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">Check your email for the confirmation code</p>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Confirm Account
              </button>
            </form>
          )}

          {/* Success Message */}
          {step === "done" && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Account Confirmed!</h3>
              <p className="text-gray-600 mb-6">Your account has been successfully created and confirmed.</p>
              <a
                href="/login"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Sign In Now
              </a>
            </div>
          )}

          {/* Message */}
          {msg && (
            <div className={`mt-6 p-4 rounded-xl text-center text-sm ${
              msg.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' :
              msg.includes('❌') ? 'bg-red-50 text-red-700 border border-red-200' :
              'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              {msg}
            </div>
          )}

          {/* Footer */}
          {step === "signup" && (
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                  Sign in here
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}