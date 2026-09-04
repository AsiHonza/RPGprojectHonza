import React, { useState } from 'react';
import { X, ScrollText, CheckCircle2, AlertCircle, Clock, BookOpen, Sparkles } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

interface QuestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToJournal?: () => void;
}

export const QuestsModal: React.FC<QuestsModalProps> = ({ isOpen, onClose, onSwitchToJournal }) => {
  const { quests } = useGameStore();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  if (!isOpen) return null;

  const activeQuests = quests.filter(q => q.stav === 'aktivni' || (!q.stav?.includes('spln') && !q.stav?.includes('selh')));
  const completedQuests = quests.filter(q => q.stav === 'splneno' || q.stav === 'splněno');
  const failedQuests = quests.filter(q => q.stav === 'selhani' || q.stav === 'selhání');

  const filteredQuests = quests.filter(q => {
    const isCompleted = q.stav === 'splneno' || q.stav === 'splněno';
    const isFailed = q.stav === 'selhani' || q.stav === 'selhání';
    const isActive = !isCompleted && !isFailed;

    if (filter === 'active') return isActive;
    if (filter === 'completed') return isCompleted;
    return true;
  });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="w-full max-w-2xl bg-[#f9f6e6]/95 backdrop-blur-xl rounded-2xl border border-amber-900/20 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-900">
        
        {/* Header */}
        <div className="px-5 py-4 flex justify-between items-center border-b border-amber-900/15 bg-gradient-to-r from-amber-900/5 via-transparent to-amber-900/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-xl border border-amber-900/15 text-amber-900">
              <ScrollText size={24} />
            </div>
            <div>
              <h2 className="font-cinzel font-bold text-xl sm:text-2xl text-amber-950 tracking-wide">
                Kniha Úkolů
              </h2>
              <p className="text-xs font-lora text-slate-600">
                Aktivní výzvy a poslání tvého hrdiny
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onSwitchToJournal && (
              <button
                onClick={() => {
                  onClose();
                  onSwitchToJournal();
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-900/15 bg-white/60 hover:bg-white text-xs font-cinzel font-bold text-amber-900 transition shadow-sm"
                title="Přejít do kroniky příběhu"
              >
                <BookOpen size={14} /> Kronika příběhu
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

        {/* Filter Pills */}
        <div className="px-5 py-2.5 bg-amber-900/5 border-b border-amber-900/10 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-2 text-xs font-cinzel font-bold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg transition ${
                filter === 'all'
                  ? 'bg-amber-800 text-white shadow-sm'
                  : 'bg-white/60 text-slate-700 hover:bg-white border border-amber-900/10'
              }`}
            >
              Všechny ({quests.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
                filter === 'active'
                  ? 'bg-amber-800 text-white shadow-sm'
                  : 'bg-white/60 text-slate-700 hover:bg-white border border-amber-900/10'
              }`}
            >
              <Clock size={13} />
              Aktivní ({activeQuests.length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
                filter === 'completed'
                  ? 'bg-amber-800 text-white shadow-sm'
                  : 'bg-white/60 text-slate-700 hover:bg-white border border-amber-900/10'
              }`}
            >
              <CheckCircle2 size={13} />
              Splněné ({completedQuests.length})
            </button>
          </div>

          {onSwitchToJournal && (
            <button
              onClick={() => {
                onClose();
                onSwitchToJournal();
              }}
              className="sm:hidden text-[11px] font-cinzel font-bold text-amber-900 underline flex items-center gap-1"
            >
              <BookOpen size={12} /> Kronika
            </button>
          )}
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
          {filteredQuests.length === 0 ? (
            <div className="p-8 text-center bg-white/50 border border-amber-900/10 rounded-2xl my-6 flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 mb-3">
                <ScrollText size={28} />
              </div>
              <h3 className="font-cinzel font-bold text-amber-950 text-lg mb-1">
                {filter === 'completed'
                  ? 'Zatím nemáš žádné dokončené úkoly'
                  : filter === 'active'
                  ? 'Žádné aktivní úkoly'
                  : 'Zatím nemáš žádné úkoly v deníku'}
              </h3>
              <p className="font-lora text-slate-600 text-sm max-w-md">
                Prozkoumej okolí, promluv s obyvateli vesnic a měst nebo navštiv významná místa na mapě. Dobrodružství na sebe nenechá dlouho čekat!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              {filteredQuests.map((quest, idx) => {
                const isCompleted = quest.stav === 'splneno' || quest.stav === 'splněno';
                const isFailed = quest.stav === 'selhani' || quest.stav === 'selhání';

                return (
                  <div
                    key={quest.id || idx}
                    className={`p-4 sm:p-5 rounded-xl border transition shadow-sm ${
                      isCompleted
                        ? 'bg-emerald-50/70 border-emerald-600/30'
                        : isFailed
                        ? 'bg-red-50/70 border-red-600/30 opacity-75'
                        : 'bg-white/80 border-amber-900/20 hover:border-amber-700/40 shadow-sm'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-cinzel font-bold text-lg text-amber-950">
                          {quest.nazev}
                        </span>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-cinzel font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border w-fit ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-500/40'
                            : isFailed
                            ? 'bg-red-100 text-red-900 border-red-500/40'
                            : 'bg-amber-100 text-amber-900 border-amber-700/30 animate-pulse'
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle2 size={13} /> Splněno
                          </>
                        ) : isFailed ? (
                          <>
                            <AlertCircle size={13} /> Selhalo
                          </>
                        ) : (
                          <>
                            <Sparkles size={13} className="text-amber-700" /> Aktivní úkol
                          </>
                        )}
                      </span>
                    </div>

                    <p className="font-lora text-sm sm:text-base text-slate-800 leading-relaxed">
                      {quest.popis}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-amber-900/10 bg-amber-900/5 flex justify-between items-center text-xs font-lora text-slate-600">
          <span>Celkem úkolů v knize: {quests.length}</span>
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
