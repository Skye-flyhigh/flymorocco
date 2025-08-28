"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VaultLogin() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/vault/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        router.push("/vault/dashboard");
      } else {
        setError("Invalid password");
      }
    } catch (error) {
      setError("Authentication failed: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral to-neutral-content flex items-center justify-center p-4">
      <div className="bg-base-100/10 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md border border-base-100/20">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold text-base-100 mb-2">
            Flymorocco Vault
          </h1>
          <p className="text-slate-300">Business Intelligence Dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-200 mb-2"
            >
              Master Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-base-100/10 border border-base-100/20 rounded-lg text-base-100 placeholder-base-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Enter vault password"
              required
            />
          </div>

          {error && (
            <div className="text-error-content text-sm text-center bg-error/30 border border-error/50 rounded-lg py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Authenticating...
              </>
            ) : (
              "Access Vault"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-neutral">
          Secure access to business intelligence and booking management
        </div>
      </div>
    </div>
  );
}
