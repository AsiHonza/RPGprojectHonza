import React from 'react';
import { X, BookOpen, ScrollText, User, Sparkles } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToQuests?: () => void;
}

export const JournalModal: React.FC<JournalModalProps> = ({ isOpen, onClose, onSwitchToQuests }) => {
  const { journal, name, race, dndClass, level } = useGameStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="w-full max-w-2xl bg-[#f9f6e6]/95 backdrop-blur-xl rounded-2xl border border-amber-900/20 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-slate-900">
        
        {/* Header */}
        <div className="px-5 py-4 flex justify-between items-center border-b border-amber-900/15 bg-gradient-to-r from-amber-900/5 via-transparent to-amber-900/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-xl border border-amber-900/15 text-amber-900">
              <BookOpen size={24} />
            </div>
            <div>
              <h2 className="font-cinzel font-bold text-xl sm:text-2xl text-amber-950 tracking-wide">
                Kronika Příběhu
              </h2>
              <p className="text-xs font-lora text-slate-600">
                Zápisy osudu a historie tvého putování
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onSwitchToQuests && (
              <button
                onClick={() => {
                  onClose();
                  onSwitchToQuests();
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-900/15 bg-white/60 hover:bg-white text-xs font-cinzel font-bold text-amber-900 transition shadow-sm"
                title="Přejít do knihy úkolů"
              >
                <ScrollText size={14} /> Kniha úkolů
              </button>
            )}
            <button 
              onClick={onClose} 
              className="text-amber-900/60 hover:text-amber-950 p-1.5 rounded-xl hover:bg-amber-900/10 transition"
              title="Zavřít"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          
          {/* Hero Identity Plaque */}
          <div className="bg-white/80 border border-amber-900/15 rounded-xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-900/20 flex items-center justify-center text-amber-900 font-cinzel font-bold text-xl shadow-inner">
                {name ? name.charAt(0).toUpperCase() : <User size={20} />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-cinzel font-bold text-lg text-amber-950">{name || "Bezejmenný hrdina"}</h3>
                  <span className="text-[11px] font-cinzel font-bold px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-900/20 rounded-md">
                    Úroveň {level || 1}
                  </span>
                </div>
                <p className="font-lora text-xs sm:text-sm text-slate-700 mt-0.5">
                  <span className="font-bold text-amber-900">{race}</span> • <span className="font-bold text-amber-900">{dndClass}</span>
                </p>
              </div>
            </div>

            {onSwitchToQuests && (
              <button
                onClick={() => {
                  onClose();
                  onSwitchToQuests();
                }}
                className="sm:hidden w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-amber-900/20 bg-amber-100/60 text-xs font-cinzel font-bold text-amber-950"
              >
                <ScrollText size={14} /> Otevřít úkoly
              </button>
            )}
          </div>

          {/* Chapters of the Journey */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-amber-800" />
              <h3 className="font-cinzel font-bold text-sm tracking-wider uppercase text-amber-950">
                Příběh a vývoj událostí
              </h3>
            </div>

            <div className="flex flex-col gap-3.5">
              {journal.map((entry, i) => (
                <div 
                  key={i} 
                  className="bg-white/70 border border-amber-900/15 rounded-xl p-4 sm:p-5 shadow-sm relative overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-amber-900/10 pb-2 mb-3">
                    <span className="text-xs font-cinzel font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-600 inline-block" />
                      Kapitola {i + 1}
                    </span>
                    <span className="text-[11px] font-lora text-slate-500 italic">Zápis z putování</span>
                  </div>
                  <p className="font-lora text-sm sm:text-base text-slate-800 leading-relaxed italic">
                    {entry}
                  </p>
                </div>
              ))}

              {journal.length === 0 && (
                <div className="text-center p-8 bg-white/50 border border-amber-900/10 rounded-2xl flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 mb-2.5">
                    <BookOpen size={24} />
                  </div>
                  <h4 className="font-cinzel font-bold text-amber-950 text-base mb-1">
                    Kronika je zatím prázdná
                  </h4>
                  <p className="font-lora text-sm text-slate-600 max-w-sm italic">
                    Tvůj velký příběh se teprve začíná psát. Každá výprava a každé rozhodnutí v Aethelgardu zanechá stopu na těchto stránkách.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-amber-900/10 bg-amber-900/5 flex justify-between items-center text-xs font-lora text-slate-600">
          <span>Počet kapitol: {journal.length}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-amber-800 hover:bg-amber-700 text-white rounded-xl font-cinzel font-bold text-xs tracking-wider transition shadow-sm"
          >
            Zavřít
          </button>
        </div>

      </div>
    </div>
  );
};
