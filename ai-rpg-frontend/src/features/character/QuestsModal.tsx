import React from 'react';
import { X, BookOpen } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export const QuestsModal = ({ isOpen, onClose }: any) => {
  const { quests } = useGameStore();

  if (!isOpen) return null;

  return (
        <div className="fixed inset-0 bg-[#e5dfc5] flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl bg-[#2b4c5e] rounded-lg border-4 border-[#90a4ae] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#e3dcc8] p-4 flex justify-between items-center border-b-4 border-[#90a4ae]">
              <div className="flex items-center gap-2 text-[#b74b4b] font-bold text-2xl uppercase tracking-widest">
                <BookOpen size={28} /> Deník úkolů
              </div>
              <button onClick={() => onClose()} className="text-[#2b4c5e] hover:text-[#b74b4b] transition">
                <X size={28} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-[url('/assets/parchment.jpg')] bg-cover bg-center">
              {quests.length === 0 ? (
                <div className="text-center text-[#455a64] font-bold mt-10">Zatím nemáš žádné úkoly.</div>
              ) : (
                <div className="flex flex-col gap-4">
                  {quests.map(quest => (
                    <div key={quest.id} className={`p-4 border-2 rounded ${quest.stav === 'splneno' ? 'bg-[#2a3f2a]/90 border-[#4a7f4a] text-[#d4af37]' : quest.stav === 'selhani' ? 'bg-[#3f2a2a]/90 border-[#b74b4b] text-[#78909c]' : 'bg-[#1b262c]/90 border-[#90a4ae] text-[#f4f1e1]'}`}>
                      <div className="flex justify-between items-start mb-2">
                         <h3 className="font-bold text-xl">{quest.nazev}</h3>
                         <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${quest.stav === 'splneno' ? 'bg-[#4a7f4a] text-slate-900' : quest.stav === 'selhani' ? 'bg-[#b74b4b] text-slate-900' : 'bg-[#d4af37] text-black'}`}>
                            {quest.stav === 'splneno' ? 'Splněno' : quest.stav === 'selhani' ? 'Selhání' : 'Aktivní'}
                         </span>
                      </div>
                      <p className={quest.stav === 'aktivni' ? 'text-[#90a4ae]' : 'text-opacity-80'}>{quest.popis}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

  );
};
