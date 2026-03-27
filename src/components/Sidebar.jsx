import React, { useState } from 'react';
import JobCard from './JobCard';
import { Search, X, ChevronLeft } from 'lucide-react';

export default function Sidebar({ jobs, selectedJobId, onSelect, activeCity, onCityChange }) {
  const [search, setSearch] = useState('');
  const selectedJob = jobs.find(j => j.id === selectedJobId);

  const filteredJobs = jobs.filter(j => 
    j.company_name.toLowerCase().includes(search.toLowerCase()) ||
    j.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="w-[400px] h-full glass border-r border-white/10 flex flex-col z-[2000]">
      {/* Header */}
      <div className="p-6 border-b border-white/5 bg-surface/50 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 glass rounded-xl flex items-center justify-center">
             <div className="w-5 h-5 bg-white rotate-45 rounded-sm" />
          </div>
          <span className="text-xl font-display font-bold">DesignJobs<span className="text-white/40">.</span>in</span>
        </div>

        {/* City Tabs */}
        <div className="flex bg-white/5 p-1 rounded-xl mb-6">
           {['bengaluru', 'mumbai', 'delhi'].map(city => (
             <button
               key={city}
               onClick={() => onCityChange(city)}
               className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeCity === city ? 'bg-white text-black shadow-xl' : 'text-text-secondary hover:text-white'}`}
             >
               {city}
             </button>
           ))}
        </div>

        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-white transition-colors" />
          <input 
            type="text"
            placeholder="Search companies, roles..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-white/20 transition-all font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && <X className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted cursor-pointer" onClick={() => setSearch('')} />}
        </div>
      </div>

      {/* List / Detail */}
      <div className="flex-grow overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {selectedJob ? (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <button 
              onClick={() => onSelect(null)}
              className="flex items-center gap-2 text-sm text-text-muted hover:text-white mb-6 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back to listings
            </button>
            
            <div className="space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-20 h-20 glass rounded-2xl p-4">
                    <img src={selectedJob.logo_url} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-display font-bold leading-tight">{selectedJob.company_name}</h2>
                    <p className="text-accent/80 font-semibold">{selectedJob.title}</p>
                  </div>
               </div>
               
               <div className="flex gap-2">
                 <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-medium border border-white/10">{selectedJob.location}</span>
                 <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-medium border border-white/10">Full-time</span>
               </div>

               <div className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedJob.description}
               </div>

               <a 
                href={selectedJob.apply_url} 
                target="_blank"
                className="block w-full py-4 bg-white text-black font-bold text-center rounded-2xl hover:bg-white/90 transition-all hover:scale-[1.02] shadow-xl"
               >
                 Apply for this role
               </a>
            </div>
          </div>
        ) : (
          filteredJobs.map(job => (
            <JobCard 
              key={job.id} 
              job={job} 
              selected={job.id === selectedJobId} 
              onClick={() => onSelect(job.id)} 
            />
          ))
        )}
      </div>
    </aside>
  );
}
