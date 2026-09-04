import React from 'react';
import { X, Users, Map, MapPin } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export const NpcsModal = ({ isOpen, onClose, setMapOpen }: any) => {
  const { npcs, worldData } = useGameStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-2xl bg-[#f9f6e6]/95 backdrop-blur-xl rounded-2xl border border-amber-900/20 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-slate-900">
        
        {/* Header */}
        <div className="px-5 py-4 flex justify-between items-center border-b border-amber-900/15 bg-gradient-to-r from-amber-900/5 via-transparent to-amber-900/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-xl border border-amber-900/15 text-amber-900">
              <Users size={24} />
            </div>
            <div>
              <h2 className="font-cinzel font-bold text-xl sm:text-2xl text-amber-950 tracking-wide">
                Deník Postav
              </h2>
              <p className="text-xs font-lora text-slate-600">
                Obyvatelé Aethelgardu, na které jsi při svých cestách narazil
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {worldData && (
              <button 
                onClick={() => {
                  onClose();
                  setMapOpen(true);
                }} 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-900/15 bg-white/60 hover:bg-white text-xs font-cinzel font-bold text-amber-900 transition shadow-sm" 
                title="Zobrazit na mapě světa"
              >
                <Map size={14} /> <span className="hidden sm:inline">Mapa světa</span>
              </button>
            )}
            <button 
              onClick={() => onClose()} 
              className="text-amber-900/60 hover:text-amber-950 p-1.5 rounded-xl hover:bg-amber-900/10 transition"
              title="Zavřít"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
          {npcs.length === 0 ? (
            <div className="text-center p-8 bg-white/50 border border-amber-900/10 rounded-2xl flex flex-col items-center my-6">
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 mb-3">
                <Users size={28} />
              </div>
              <h3 className="font-cinzel font-bold text-amber-950 text-base mb-1">
                Zatím jsi nepotkal nikoho významného
              </h3>
              <p className="font-lora text-sm text-slate-600 max-w-md italic">
                Cestuj po městech, vesnicích i tajemných koutech říše. Každá potkaná bytost, spojenec či nepřítel bude zaznamenána zde.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {npcs.map((npc: any, idx: number) => {
                const relationship = (npc.vztah || "Neutrální").toLowerCase();
                const isFriendly = relationship.includes('přát') || relationship.includes('spoj') || relationship.includes('důvěr');
                const isHostile = relationship.includes('nepř') || relationship.includes('zrád') || relationship.includes('hroz');

                return (
                  <div 
                    key={idx} 
                    className="bg-white/80 border border-amber-900/15 rounded-xl p-4 flex flex-col justify-between gap-2.5 shadow-sm hover:border-amber-700/40 transition"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-1.5">
                        <h3 className="font-cinzel font-bold text-base text-amber-950">{npc.jmeno}</h3>
                        <span className={`text-[10px] uppercase tracking-wider font-cinzel font-bold px-2 py-0.5 rounded-md border shrink-0 ${
                          isFriendly 
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-500/40' 
                            : isHostile 
                            ? 'bg-red-100 text-red-900 border-red-500/40' 
                            : 'bg-amber-100 text-amber-900 border-amber-700/30'
                        }`}>
                          {npc.vztah || 'Neutrální'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-slate-500 text-xs font-cinzel font-bold mb-2">
                        <MapPin size={13} className="text-amber-800 shrink-0" />
                        <span>{npc.lokace || 'Neznámá lokace'}</span>
                      </div>

                      <p className="font-lora text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                        {npc.popis}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-amber-900/10 bg-amber-900/5 flex justify-between items-center text-xs font-lora text-slate-600">
          <span>Celkem zaznamenaných postav: {npcs.length}</span>
          <button
            onClick={() => onClose()}
            className="px-4 py-1.5 bg-amber-800 hover:bg-amber-700 text-white rounded-xl font-cinzel font-bold text-xs tracking-wider transition shadow-sm"
          >
            Zavřít
          </button>
        </div>

      </div>
    </div>
  );
};

