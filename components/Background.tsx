import React from 'react';

export const Background: React.FC = () => (
  <div className="fixed inset-0 w-full h-full overflow-hidden -z-10 transition-colors duration-1000 bg-[#f8fafc] dark:bg-[#020617]">
    <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-purple-400 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 dark:opacity-20 animate-blob"></div>
    <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-yellow-200 dark:bg-yellow-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 dark:opacity-20 animate-blob animation-delay-2000"></div>
    <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 dark:opacity-20 animate-blob animation-delay-4000"></div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-100/20 dark:bg-blue-900/10 rounded-full filter blur-[120px]"></div>
  </div>
);