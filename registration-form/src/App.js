// src/App.js (полная версия)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LoginForm from './components/auth/LoginForm';
import RegistrationForm from './components/auth/RegistrationForm';
import Dashboard from './components/dashboard/Dashboard';
import Trading from './components/trading/Trading';
import Portfolio from './components/portfolio/Portfolio';
import Analytics from './components/analytics/Analytics';
import Backtest from './components/backtest/Backtest';
import Models from './components/models/Models';
import MarketData from './components/market/MarketData';
import MainLayout from './components/layout/MainLayout';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
          document.documentElement.classList.contains('dark') 
            ? 'border-cyan-400' 
            : 'border-blue-500'
        }`}></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
          document.documentElement.classList.contains('dark') 
            ? 'border-green-400' 
            : 'border-pink-500'
        }`}></div>
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Routes>
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginForm />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <RegistrationForm />
                  </PublicRoute>
                }
              />
              
              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Dashboard />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trading"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Trading />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portfolio"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Portfolio />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/market"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <MarketData />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/models"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Models />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/backtest"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Backtest />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Analytics />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;