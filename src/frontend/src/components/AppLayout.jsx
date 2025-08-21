import React from 'react';
import NavigationBar from './NavigationBar';
import Search from './Search';

export default function AppLayout({ children }) {
  return (
    <div className="w-screen h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-row overflow-hidden">
      {/* Sidebar */}
      <NavigationBar />

      {/* Main area */}
      <div className="flex-1 flex flex-col items-stretch">
        {/* Search bar */}
        <Search />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 ">
          <div className="w-full max-w-9xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
