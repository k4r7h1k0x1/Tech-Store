"use client";

import { useState } from "react";
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signUp, login } from "@/app/lib/authService";
import { useAuth } from "@/app/context/AuthContext";

export default function AuthModal({ isOpen, onClose, onSignupSuccess }) {
  const { setUser, fetchOrders } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const clearError = () => setError("");
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearError();
    try {
      const user = await login(loginData.email, loginData.password);
      setUser(user);
      await fetchOrders();
      setLoginData({ email: "", password: "" });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── SIGN UP ────────────────────────────────────────────
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    clearError();
    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const user = await signUp(
        signupData.name,
        signupData.email,
        signupData.password,
      );
      setUser(user);
      setSignupData({ name: "", email: "", password: "", confirmPassword: "" });
      if (onSignupSuccess) onSignupSuccess();

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── RESET PASSWORD (placeholder — no email service wired up) ──
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError(
      "Password reset is not available yet. Please contact support at support@techstore.com",
    );
  };

  if (!isOpen) return null;

  // ── RESET PASSWORD VIEW ──────────────────────────────
  if (showReset) {
    return (
      <>
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          onClick={onClose}
        />
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 text-white font-semibold">
                T
              </div>
              <span className="text-lg font-semibold text-gray-900">
                TechStore
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
              Reset Password
            </h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              Enter your email and we&apos;ll send a reset link.
            </p>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl text-sm font-semibold"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Request Reset"
                )}
              </Button>
              <button
                type="button"
                onClick={() => {
                  setShowReset(false);
                  clearError();
                }}
                className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                ← Back to Login
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 text-white font-semibold">
              T
            </div>
            <span className="text-lg font-semibold text-gray-900">
              TechStore
            </span>
          </div>

          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => {
                setActiveTab("login");
                clearError();
              }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === "login" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setActiveTab("signup");
                clearError();
              }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === "signup" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
              {error}
            </div>
          )}

          {activeTab === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    required
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowReset(true);
                    clearError();
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {" "}
                    Sign In <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-xs text-gray-500">or continue with</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  disabled
                  title="Coming soon"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-400 opacity-50 cursor-not-allowed"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  disabled
                  title="Coming soon"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-400 opacity-50 cursor-not-allowed"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  Apple
                </button>
              </div>
            </form>
          )}

          {activeTab === "signup" && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={signupData.name}
                    onChange={(e) =>
                      setSignupData({ ...signupData, name: e.target.value })
                    }
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData({ ...signupData, email: e.target.value })
                    }
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData({ ...signupData, password: e.target.value })
                    }
                    required
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={signupData.confirmPassword}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label
                  htmlFor="terms"
                  className="text-xs text-gray-500 cursor-pointer"
                >
                  I agree to the{" "}
                  <span className="text-blue-600 hover:underline">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-blue-600 hover:underline">
                    Privacy Policy
                  </span>
                </label>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {" "}
                    Create Account <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
