import React from 'react';

export default function JobCard({ job, selected, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${selected ? 'bg-white/10 border-white/20 shadow-2xl scale-[1.02]' : 'bg-white/5 border-transparent hover:border-white/10 hover:bg-white/[0.07]'}`}
    >
      <div className="flex gap-4 items-center">
        <div className="w-12 h-12 glass rounded-xl p-2 shrink-0">
          <img src={job.logo_url} className="w-full h-full object-contain rounded-md" />
        </div>
        <div className="flex-grow min-w-0">
          <h4 className="font-bold text-sm truncate">{job.company_name}</h4>
          <p className="text-xs text-text-secondary truncate">{job.title}</p>
        </div>
        <div className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
          {job.location?.split(',')[0] || 'Remote'}
        </div>
      </div>
    </div>
  );
}
