import React, { useState, useEffect } from 'react';
import MapView from './components/MapView';
import Sidebar from './components/Sidebar';
import LuxuryDrawer from './components/LuxuryDrawer';
import RefreshButton from './components/RefreshButton';
import MapStats from './components/MapStats';
import { useJobs } from './hooks/useJobs';

export default function App() {
  const [activeCity, setActiveCity] = useState('bengaluru');
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  const { jobs, loading, stats } = useJobs(activeCity);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative w-full h-[100dvh] bg-surface flex overflow-hidden">
      {/* Background Map */}
      <div className="flex-grow relative h-full">
        <MapView 
          jobs={jobs} 
          activeCity={activeCity}
          selectedJobId={selectedJobId}
          onMarkerClick={setSelectedJobId}
        />
        
        {/* Fixed Overlays */}
        {!loading && (
          <>
            <MapStats jobs={jobs} activeCity={activeCity} />
            <RefreshButton />
          </>
        )}

        {/* Loading State */}
        {loading && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[5000] flex items-center justify-center">
             <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
                <p className="text-white font-medium">Discovering roles in {activeCity}...</p>
             </div>
          </div>
        )}
      </div>

      {/* Adaptive Sidebar/Drawer */}
      {isMobile ? (
        <LuxuryDrawer 
          jobs={jobs}
          selectedJobId={selectedJobId}
          onClose={() => setSelectedJobId(null)}
        />
      ) : (
        <Sidebar 
          jobs={jobs}
          selectedJobId={selectedJobId}
          onSelect={setSelectedJobId}
          activeCity={activeCity}
          onCityChange={setActiveCity}
        />
      )}
    </div>
  );
}
