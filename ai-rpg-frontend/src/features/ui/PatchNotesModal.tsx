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
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] flex items-center justify-center p-4 font-lora"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="bg-rpg-obsidian border-2 border-rpg-magic rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-[0_0_40px_rgba(197,160,89,0.3)] overflow-hidden"
          >
            <div className="flex justify-between items-center p-5 border-b border-[#2b4c5e] bg-[#111827]">
              <div className="flex items-center gap-3 text-rpg-magic font-bold text-2xl uppercase tracking-widest font-cinzel">
                <ScrollText size={28} /> Kronika Změn (Patchnotes)
              </div>
              <button onClick={() => onClose()} className="text-rpg-muted hover:text-rpg-blood transition-colors">
                <X size={28} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-8 bg-gradient-to-b from-[#111827] to-rpg-obsidian text-rpg-paper">
              {PATCH_NOTES.map((patch: any, idx: number) => (
                <div key={idx} className="bg-[#111827] border border-[#2b4c5e] rounded-lg p-5 shadow-lg">
                  <div className="flex justify-between items-end border-b border-[#2b4c5e] pb-3 mb-5">
                    <h2 className="text-rpg-magic font-bold text-2xl font-cinzel tracking-wide drop-shadow-sm">{patch.version}</h2>
                    <span className="text-rpg-muted text-sm font-bold uppercase">{patch.date}</span>
                  </div>
                  
                  {/* Optional title */}
                  {patch.title && <h3 className="text-rpg-paper font-bold font-lora text-lg mb-4 italic">{patch.title}</h3>}
                  
                  <ul className="space-y-4">
                    {patch.changes.map((change: any, cIdx: number) => (
                      <li key={cIdx} className="text-[#e5e7eb] flex flex-col gap-1 text-[15px] leading-relaxed">
                        <span className="font-bold text-rpg-magic font-cinzel tracking-wider text-sm">{change.category}</span>
                        <ul className="list-disc list-inside space-y-2 ml-2">
                          {change.items.map((item: string, iIdx: number) => (
                            <li key={iIdx} className="text-[#d1d5db]">{item}</li>
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
