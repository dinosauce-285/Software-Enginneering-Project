import React from 'react';
import NavigationBar from './NavigationBar';
import Search from './Search';

export default function AppLayout({ children }) {
  return (
    <div className="w-screen h-screen bg-white flex flex-row overflow-hidden">
      <NavigationBar />
      <div className="flex-1 flex flex-col items-start">
        <Search />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
            {children}
        </main>
      </div>
    </div>
  );
}