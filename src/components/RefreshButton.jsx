import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';

export default function RefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Hard reload for now per user request, but React-ready
    setTimeout(() => window.location.reload(), 500);
  };

  return (
    <button 
      onClick={handleRefresh}
      className="fixed bottom-6 right-6 w-14 h-14 glass rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 active:scale-90 transition-all z-[3000]"
    >
      <RefreshCw className={`w-6 h-6 ${isRefreshing ? 'animate-spin' : ''}`} />
    </button>
  );
}
