import React, { useState } from "react";
import {
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import { userPool } from "../lib/aws/cognito";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setMsg("🔄 Logging in...");

    const user = new CognitoUser({ Username: email, Pool: userPool });
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    user.authenticateUser(authDetails, {
      onSuccess: () => setMsg("✅ Logged in!"),
      onFailure: (err) => setMsg("❌ " + err.message),
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">Please sign in to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
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
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
            Sign In
          </button>
          <p className="text-center text-sm text-gray-600 mt-2">{msg}</p>
        </form>
      </div>
    </div>
  );
}