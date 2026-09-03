import React from 'react';
import { X, ScrollText } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export const JournalModal = ({ isOpen, onClose }: any) => {
  const { journal, name, race, dndClass } = useGameStore();

  if (!isOpen) return null;

  return (
        <div className="fixed inset-0 bg-[#e5dfc5] flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl bg-[#2b4c5e] rounded-lg border-4 border-[#90a4ae] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="bg-[#e3dcc8] p-4 flex justify-between items-center border-b-4 border-[#90a4ae]">
              <div className="flex items-center gap-2 text-[#b74b4b] font-bold text-2xl uppercase tracking-widest">
                <ScrollText size={28} /> Deník postavy
              </div>
              <button onClick={() => onClose()} className="text-[#2b4c5e] hover:text-[#b74b4b] transition">
                <X size={28} />
              </button>
            </div>
            <div className="p-6 bg-[#1e3746] overflow-y-auto">
              <div className="mb-6 pb-4 border-b border-[#455a64]">
                <h3 className="text-[#d4af37] font-bold text-xl mb-2 font-medieval">Identita</h3>
                <p className="text-[#f4f1e1] italic text-lg">Jméno: {name} | Rasa: {race} | Třída: {dndClass}</p>
              </div>
              <h3 className="text-[#d4af37] font-bold text-xl mb-4 font-medieval">Příběh a vývoj událostí</h3>
              <div className="flex flex-col gap-4">
                {journal.map((entry, i) => (
                  <div key={i} className="bg-[#1b262c] p-4 rounded-lg border border-[#455a64] text-[#90a4ae] italic shadow-inner">
                    <div className="text-xs text-[#b74b4b] font-bold uppercase mb-1">Kapitola {i + 1}</div>
                    {entry}
                  </div>
                ))}
                {journal.length === 0 && <div className="text-center text-[#90a4ae] italic">Tvůj příběh se teprve začíná psát...</div>}
              </div>
            </div>
          </div>
        </div>

  );
};
