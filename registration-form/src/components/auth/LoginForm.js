// src/components/auth/LoginForm.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch (error) {
      console.error('Login error:', error);
      setError(
        error.response?.data?.detail ||
        error.message ||
        "Login failed. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const useTestCredentials = () => {
    setFormData({
      email: "test@example.com",
      password: "testpassword123"
    });
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ${
            isDark
              ? 'bg-gradient-to-r from-green-400 to-cyan-500'
              : 'bg-gradient-to-r from-blue-500 to-purple-600'
          }`}>
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>Welcome Back</h1>
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Sign in to your account to continue</p>
          
          {process.env.NODE_ENV === 'development' && (
            <button
              type="button"
              onClick={useTestCredentials}
              className={`mt-2 text-xs underline transition-colors duration-300 ${
                isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-700'
              }`}
            >
              Use Test Credentials
            </button>
          )}
        </div>

        <div className={`rounded-3xl shadow-2xl border p-8 backdrop-blur-lg transition-colors duration-300 ${
          isDark
            ? 'bg-gray-800/80 border-gray-700'
            : 'bg-white/80 border-white/20'
        }`}>
          {error && (
            <div className={`mb-4 p-4 rounded-2xl border transition-colors duration-300 ${
              isDark
                ? 'bg-red-900/50 border-red-800'
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className={`text-sm font-medium transition-colors duration-300 ${
                  isDark ? 'text-red-300' : 'text-red-700'
                }`}>{error}</span>
              </div>
              <div className={`mt-2 text-xs transition-colors duration-300 ${
                isDark ? 'text-red-400' : 'text-red-600'
              }`}>
                Tip: Make sure your backend server is running on http://localhost:8000
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className={`h-5 w-5 transition-colors duration-300 ${
                    isDark ? 'text-gray-400' : 'text-gray-400'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className={`w-full pl-10 pr-4 py-3 rounded-2xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                    isDark
                      ? 'bg-gray-700/50 border-gray-600 text-white focus:ring-cyan-500'
                      : 'bg-white/50 border-gray-200 text-gray-900 focus:ring-blue-500'
                  } border`}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className={`h-5 w-5 transition-colors duration-300 ${
                    isDark ? 'text-gray-400' : 'text-gray-400'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className={`w-full pl-10 pr-4 py-3 rounded-2xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                    isDark
                      ? 'bg-gray-700/50 border-gray-600 text-white focus:ring-cyan-500'
                      : 'bg-white/50 border-gray-200 text-gray-900 focus:ring-blue-500'
                  } border`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                isDark
                  ? 'bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </button>

            <div className={`text-center text-sm pt-4 transition-colors duration-300 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Don't have an account?{" "}
              <Link
                to="/register"
                className={`font-semibold transition-colors duration-300 ${
                  isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                Sign up now
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}