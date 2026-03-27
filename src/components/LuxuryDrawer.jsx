import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LuxuryDrawer({ jobs, selectedJobId, onClose }) {
  const selectedJob = jobs.find(j => j.id === selectedJobId);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: selectedJobId ? "0%" : "calc(100% - 60px)" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100) onClose();
        }}
        className="fixed bottom-0 left-0 right-0 h-[85vh] glass luxury-shadow rounded-t-3xl z-[3000] flex flex-col overflow-hidden"
      >
        {/* Drag Handle */}
        <div className="w-full h-12 flex items-center justify-center cursor-grab active:cursor-grabbing border-b border-white/5">
          <div className="w-12 h-1.5 bg-white/20 rounded-full" />
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6 scroll-smooth">
          {selectedJob ? (
            <div className="space-y-6">
               <button onClick={onClose} className="text-sm text-text-muted hover:text-white transition-colors">← Back to list</button>
               <div className="flex items-center gap-4">
                  <div className="w-16 h-16 glass rounded-2xl p-3">
                    <img src={selectedJob.logo_url} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold leading-tight">{selectedJob.company_name}</h2>
                    <p className="text-accent/80 font-medium">{selectedJob.title}</p>
                  </div>
               </div>
               <div className="prose prose-invert max-w-none text-text-secondary text-sm leading-relaxed">
                  {selectedJob.description}
               </div>
               <a 
                href={selectedJob.apply_url} 
                target="_blank" 
                className="block w-full py-4 bg-white text-black font-bold text-center rounded-2xl hover:bg-white/90 transition-all hover:scale-[1.02]"
               >
                 Apply for this role
               </a>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-xl font-display font-bold px-1">Available Roles ({jobs.length})</h3>
              <div className="grid gap-3">
                {jobs.map(job => (
                  <div 
                    key={job.id} 
                    className="p-4 glass rounded-2xl flex gap-4 hover:border-white/20 transition-all active:scale-95 cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-white/5 rounded-xl p-2 shrink-0">
                      <img src={job.logo_url} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h4 className="font-bold">{job.company_name}</h4>
                      <p className="text-xs text-text-secondary">{job.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Backdrop Blur */}
      {selectedJobId && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/20 backdrop-blur-md z-[2500]"
        />
      )}
    </AnimatePresence>
  );
}
