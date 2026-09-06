import React from 'react';
import { X, ScrollText } from 'lucide-react';
import { PATCH_NOTES } from '../../data/patchNotes';
import { motion, AnimatePresence } from 'framer-motion';

export const PatchNotesModal = ({ isOpen, onClose }: any) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[110] flex items-center justify-center p-4 font-lora"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="bg-[#faf6ea] dark:bg-[#0f141d] border-2 border-amber-900/40 dark:border-amber-500/30 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-900 dark:text-[#e2d9c8]"
          >
            <div className="flex justify-between items-center p-5 border-b-2 border-amber-900/20 dark:border-amber-500/20 bg-amber-900/10 dark:bg-[#141b26]">
              <div className="flex items-center gap-3 text-amber-950 dark:text-amber-200 font-bold text-xl sm:text-2xl uppercase tracking-widest font-cinzel">
                <ScrollText size={26} className="text-amber-800 dark:text-amber-400" /> Kronika Změn (Patchnotes)
              </div>
              <button onClick={() => onClose()} className="text-amber-900/60 dark:text-slate-400 hover:text-amber-950 dark:hover:text-amber-200 transition-colors p-1.5 rounded-lg hover:bg-amber-900/10 dark:hover:bg-slate-800">
                <X size={26} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6 bg-[#faf6ea]/80 dark:bg-[#0f141d]">
              {PATCH_NOTES.map((patch: any, idx: number) => (
                <div key={idx} className="bg-white/80 dark:bg-[#141b26] border border-amber-900/20 dark:border-amber-600/30 rounded-2xl p-5 shadow-sm">
                  <div className="flex justify-between items-end border-b border-amber-900/15 dark:border-amber-500/20 pb-3 mb-4">
                    <h2 className="text-amber-950 dark:text-amber-300 font-bold text-xl font-cinzel tracking-wide drop-shadow-xs">{patch.version}</h2>
                    <span className="text-slate-500 dark:text-slate-400 text-xs font-cinzel font-bold uppercase">{patch.date}</span>
                  </div>
                  
                  {/* Optional title */}
                  {patch.title && <h3 className="text-amber-900 dark:text-amber-200 font-bold font-lora text-base mb-3 italic">{patch.title}</h3>}
                  
                  <ul className="space-y-3">
                    {patch.changes.map((change: any, cIdx: number) => (
                      <li key={cIdx} className="flex flex-col gap-1 text-sm leading-relaxed">
                        <span className="font-bold text-amber-900 dark:text-amber-400 font-cinzel tracking-wider text-xs">{change.category}</span>
                        <ul className="list-disc list-inside space-y-1.5 ml-2 text-slate-700 dark:text-slate-300">
                          {change.items.map((item: string, iIdx: number) => (
                            <li key={iIdx}>{item}</li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
