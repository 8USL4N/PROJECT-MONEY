// src/components/layout/MainLayout.js
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 mt-16">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}