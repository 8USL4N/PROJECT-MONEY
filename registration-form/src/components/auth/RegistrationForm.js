// src/components/auth/RegistrationForm.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    tinkoff_token: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth();
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
      await register(formData);
      alert("Регистрация успешна! Пожалуйста, войдите в систему.");
      navigate("/login");
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      setError(
        error.response?.data?.detail ||
        error.message ||
        "Ошибка регистрации. Пожалуйста, проверьте ваши данные и попробуйте снова."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-purple-50 to-pink-100'
    }`}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ${
            isDark
              ? 'bg-gradient-to-r from-green-400 to-cyan-500'
              : 'bg-gradient-to-r from-purple-500 to-pink-600'
          }`}>
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>Присоединяйтесь к нам</h1>
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Создайте учетную запись чтобы начать</p>
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
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className={`h-5 w-5 transition-colors duration-300 ${
                    isDark ? 'text-gray-400' : 'text-gray-400'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Имя пользователя"
                  required
                  className={`w-full pl-10 pr-4 py-3 rounded-2xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                    isDark
                      ? 'bg-gray-700/50 border-gray-600 text-white focus:ring-cyan-500'
                      : 'bg-white/50 border-gray-200 text-gray-900 focus:ring-purple-500'
                  } border`}
                />
              </div>

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
                  placeholder="Адрес электронной почты"
                  required
                  className={`w-full pl-10 pr-4 py-3 rounded-2xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                    isDark
                      ? 'bg-gray-700/50 border-gray-600 text-white focus:ring-cyan-500'
                      : 'bg-white/50 border-gray-200 text-gray-900 focus:ring-purple-500'
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
                  placeholder="Пароль"
                  required
                  className={`w-full pl-10 pr-4 py-3 rounded-2xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                    isDark
                      ? 'bg-gray-700/50 border-gray-600 text-white focus:ring-cyan-500'
                      : 'bg-white/50 border-gray-200 text-gray-900 focus:ring-purple-500'
                  } border`}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className={`h-5 w-5 transition-colors duration-300 ${
                    isDark ? 'text-gray-400' : 'text-gray-400'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="tinkoff_token"
                  value={formData.tinkoff_token}
                  onChange={handleChange}
                  placeholder="Токен Тинькофф Инвестиций (опционально)"
                  className={`w-full pl-10 pr-4 py-3 rounded-2xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                    isDark
                      ? 'bg-gray-700/50 border-gray-600 text-white focus:ring-cyan-500'
                      : 'bg-white/50 border-gray-200 text-gray-900 focus:ring-purple-500'
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
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Создание аккаунта...
                </div>
              ) : (
                "Создать аккаунт"
              )}
            </button>

            <div className={`text-center text-sm pt-4 border-t transition-colors duration-300 ${
              isDark 
                ? 'text-gray-400 border-gray-700' 
                : 'text-gray-600 border-gray-200'
            }`}>
              Уже есть аккаунт?{" "}
              <Link
                to="/login"
                className={`font-semibold transition-colors duration-300 ${
                  isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-purple-600 hover:text-purple-700'
                }`}
              >
                Войти
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}