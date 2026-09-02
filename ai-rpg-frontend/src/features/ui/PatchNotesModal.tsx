import React from 'react';
import { X, ScrollText } from 'lucide-react';
import { PATCH_NOTES } from '../../data/patchNotes';

export const PatchNotesModal = ({ isOpen, onClose }: any) => {
  if (!isOpen) return null;

  return (
        <div className="absolute inset-0 bg-black/80 z-[110] flex items-center justify-center p-4 font-serif">
          <div className="bg-[#f4f1e1] border-2 border-[#b74b4b] rounded max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden bg-[url('/assets/parchment.jpg')] bg-cover">
            <div className="flex justify-between items-center p-4 border-b-2 border-[#b74b4b] bg-[#1b262c]/90">
              <div className="flex items-center gap-2 text-[#d4af37] font-bold text-2xl uppercase tracking-widest font-medieval">
                <ScrollText size={28} /> Kronika Změn (Patchnotes)
              </div>
              <button onClick={() => onClose()} className="text-[#90a4ae] hover:text-[#b74b4b] transition">
                <X size={28} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-8">
              {PATCH_NOTES.map((patch: any, idx: number) => (
                <div key={idx} className="bg-[#1b262c]/10 border border-[#90a4ae] rounded p-5 shadow-sm">
                  <div className="flex justify-between items-end border-b border-[#90a4ae] pb-2 mb-4">
                    <h2 className="text-[#b74b4b] font-bold text-xl font-medieval tracking-wide">{patch.version}</h2>
                    <span className="text-[#455a64] text-xs font-bold uppercase">{patch.date}</span>
                  </div>
                  <ul className="space-y-3">
                    {patch.changes.map((change: any, cIdx: number) => (
                      <li key={cIdx} className="text-[#2b4c5e] flex gap-3 text-sm md:text-base leading-relaxed">
                        <span className="shrink-0 text-lg mt-[-2px]">{change.split(' ')[0]}</span>
                        <span>{change.substring(change.indexOf(' ') + 1)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

  );
};
