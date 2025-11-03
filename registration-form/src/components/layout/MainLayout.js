import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64"> {/* Adjust margin based on sidebar width */}
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}