// src/components/common/ErrorMessage.js
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export default function ErrorMessage({ message }) {
  const { isDark } = useTheme();

  return (
    <div className={`border px-4 py-3 rounded-2xl mb-4 transition-colors duration-300 ${
      isDark
        ? 'bg-red-900/50 border-red-800 text-red-300'
        : 'bg-red-100 border-red-400 text-red-700'
    }`}>
      {message}
    </div>
  );
}