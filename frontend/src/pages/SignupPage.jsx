import React, { useState } from "react";
import { CognitoUser } from "amazon-cognito-identity-js";
import { userPool } from "../lib/aws/cognito";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [step, setStep] = useState("signup"); // "signup" or "confirm"
  const [msg, setMsg] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    setMsg("🔄 Creating account...");

    userPool.signUp(email, password, [], null, (err, result) => {
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

    const user = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    user.confirmRegistration(confirmationCode, true, (err, result) => {
      if (err) {
        setMsg("❌ " + err.message);
      } else {
        setMsg("✅ Account confirmed! You can now log in.");
        setStep("done");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create an account</h2>

        {step === "signup" && (
          <form onSubmit={handleSignup} className="space-y-5">
            <input
              type="email"
              className="w-full px-4 py-2 border rounded"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="w-full px-4 py-2 border rounded"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
              Create Account
            </button>
          </form>
        )}

        {step === "confirm" && (
          <form onSubmit={handleConfirm} className="space-y-5">
            <input
              type="text"
              className="w-full px-4 py-2 border rounded"
              placeholder="Confirmation Code"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              required
            />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
              Confirm Account
            </button>
          </form>
        )}

        {msg && <p className="text-center text-sm text-gray-600 mt-4">{msg}</p>}
      </div>
    </div>
  );
}