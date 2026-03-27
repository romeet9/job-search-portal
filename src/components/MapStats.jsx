import React from 'react';

export default function MapStats({ jobs, activeCity }) {
  return (
    <div className="fixed top-6 left-6 z-[1000] flex flex-col gap-2 md:flex-row md:items-center">
       <div className="stat-pill !bg-white !text-black shadow-2xl font-bold flex items-center gap-2">
         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
         {jobs.length} Roles in {activeCity}
       </div>
       <div className="stat-pill glass">Daily Limit: <span className="text-white font-bold ml-1">3</span></div>
       <div className="stat-pill glass">Monthly: <span className="text-white font-bold ml-1">200</span></div>
    </div>
  );
}
