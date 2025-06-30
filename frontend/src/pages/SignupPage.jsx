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
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Join Nestle-In</h1>
        <p className="text-sm text-center text-gray-500 mb-6">Sign up and confirm your email to get started</p>

        {step === "signup" && (
          <form onSubmit={handleSignup} className="space-y-5">
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {matchError && (
              <p className="text-sm text-red-600 -mt-3">{matchError}</p>
            )}
            <button
              type="submit"
              disabled={!!matchError}
              className={`w-full py-2 rounded-lg font-medium transition ${
                matchError
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              Create Account
            </button>
          </form>
        )}

        {step === "confirm" && (
          <form onSubmit={handleConfirm} className="space-y-5">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
              placeholder="Confirmation Code"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
            >
              Confirm Account
            </button>
          </form>
        )}

        {step === "done" && (
          <p className="text-green-600 font-medium text-center mt-4">
            🎉 Your account is confirmed! You can now{" "}
            <a href="/login" className="underline text-blue-600">
              log in
            </a>.
          </p>
        )}

        {msg && <p className="text-center text-sm text-gray-600 mt-4">{msg}</p>}
      </div>
    </div>
  );
}