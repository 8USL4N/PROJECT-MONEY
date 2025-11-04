// src/components/common/LoadingSpinner.js
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export default function LoadingSpinner() {
  const { isDark } = useTheme();

  return (
    <div className="flex justify-center items-center py-8">
      <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
        isDark ? 'border-cyan-500' : 'border-blue-500'
      }`}></div>
    </div>
  );
}