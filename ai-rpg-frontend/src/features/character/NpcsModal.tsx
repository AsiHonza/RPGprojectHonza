import React from 'react';
import { X, Users, Map, MapPin, Lock, Unlock, Shield, HeartHandshake, Sparkles } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export const NpcsModal = ({ isOpen, onClose, setMapOpen }: any) => {
  const { npcs, worldData } = useGameStore();

  if (!isOpen) return null;

  const getTrustBadge = (trust: number = 0) => {
    if (trust >= 6) return { label: `Důvěrník (+${trust})`, color: 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold' };
    if (trust >= 2) return { label: `Vstřícný (+${trust})`, color: 'bg-emerald-50 text-emerald-800 border-emerald-300' };
    if (trust <= -5) return { label: `Nepřítel (${trust})`, color: 'bg-red-100 text-red-900 border-red-400 font-bold' };
    if (trust < 0) return { label: `Obezřetný (${trust})`, color: 'bg-amber-100 text-amber-900 border-amber-300' };
    return { label: 'Neutrální (0)', color: 'bg-slate-100 text-slate-700 border-slate-300' };
  };

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="w-full max-w-2xl bg-[#faf6ea] bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] rounded-2xl border-4 border-amber-950/80 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-slate-900">
        
        {/* Header */}
        <div className="px-5 py-4 flex justify-between items-center border-b-2 border-amber-900/20 bg-amber-900/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-900/15 rounded-xl border border-amber-900/25 text-amber-950">
              <Users size={24} />
            </div>
            <div>
              <h2 className="font-cinzel font-bold text-xl sm:text-2xl text-amber-950 tracking-wide">
                Deník Postav
              </h2>
              <p className="text-xs font-lora text-slate-700">
                Obyvatelé Aelthgardu, jejich osobnosti, důvěra a skryté motivy
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
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-900/30 bg-[#f4ecd8] hover:bg-white text-xs font-cinzel font-bold text-amber-950 transition shadow-sm cursor-pointer" 
                title="Zobrazit na mapě světa"
              >
                <Map size={14} /> <span>Mapa světa</span>
              </button>
            )}
            <button 
              onClick={() => onClose()} 
              className="text-amber-900/70 hover:text-amber-950 p-1.5 rounded-xl hover:bg-amber-900/10 transition cursor-pointer"
              title="Zavřít"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
          {npcs.length === 0 ? (
            <div className="text-center p-8 bg-[#faf6ea] border border-amber-900/15 rounded-2xl flex flex-col items-center my-6">
              <div className="w-14 h-14 rounded-full bg-amber-900/15 flex items-center justify-center text-amber-900 mb-3 border border-amber-900/20">
                <Users size={28} />
              </div>
              <h3 className="font-cinzel font-bold text-amber-950 text-base mb-1">
                Zatím jsi nepotkal nikoho významného
              </h3>
              <p className="font-lora text-xs sm:text-sm text-slate-700 max-w-md italic">
                Cestuj po městech, vesnicích i tajemných koutech říše. Každá potkaná bytost, spojenec či nepřítel bude zaznamenána zde.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {npcs.map((npc: any, idx: number) => {
                const relationship = (npc.vztah || "Neutrální").toLowerCase();
                const isFriendly = relationship.includes('přát') || relationship.includes('spoj') || relationship.includes('důvěr');
                const isHostile = relationship.includes('nepř') || relationship.includes('zrád') || relationship.includes('hroz');
                const trustBadge = getTrustBadge(npc.duvera || 0);

                return (
                  <div 
                    key={idx} 
                    className="bg-[#faf6ea] border-2 border-amber-900/20 rounded-xl p-4 flex flex-col justify-between gap-3 shadow-sm hover:border-amber-900/40 transition relative overflow-hidden"
                  >
                    <div className="space-y-2">
                      {/* Name & Badges */}
                      <div className="flex justify-between items-start gap-2 border-b border-amber-900/15 pb-2">
                        <div>
                          <h3 className="font-cinzel font-bold text-base text-amber-950 leading-tight">{npc.jmeno}</h3>
                          <div className="flex items-center gap-1 text-slate-600 text-[11px] font-cinzel font-semibold mt-0.5">
                            <MapPin size={12} className="text-amber-800 shrink-0" />
                            <span>{npc.lokace_nazev || npc.lokace || 'Neznámá lokace'}</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <span className={`text-[10px] uppercase tracking-wider font-cinzel font-bold px-2 py-0.5 rounded-md border shrink-0 ${
                            isFriendly 
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-400' 
                              : isHostile 
                              ? 'bg-red-100 text-red-900 border-red-400' 
                              : 'bg-amber-100/90 text-amber-950 border-amber-700/30'
                          }`}>
                            {npc.vztah || 'Neutrální'}
                          </span>
                          <span className={`text-[9.5px] font-cinzel font-bold px-1.5 py-0.5 rounded border ${trustBadge.color}`}>
                            {trustBadge.label}
                          </span>
                        </div>
                      </div>

                      {/* Personality & Mannerisms */}
                      {npc.povaha && (
                        <div className="bg-amber-900/5 border border-amber-900/15 rounded-lg p-2 text-xs font-lora">
                          <span className="font-cinzel font-bold text-amber-950 text-[10px] uppercase tracking-wider block mb-0.5 flex items-center gap-1">
                            🎭 Vystupování & Manýry:
                          </span>
                          <p className="text-slate-800 italic leading-snug">
                            {npc.povaha}
                          </p>
                        </div>
                      )}

                      {/* Description */}
                      <p className="font-lora text-xs sm:text-sm text-slate-800 leading-relaxed">
                        {npc.popis}
                      </p>

                      {/* Secret / Deep Motivation Seal */}
                      {npc.odhalene_tajemstvi ? (
                        <div className="bg-amber-100/90 border border-amber-500/50 rounded-lg p-2.5 shadow-xs">
                          <span className="font-cinzel font-bold text-amber-950 text-[11px] flex items-center gap-1.5 mb-1 uppercase tracking-wide">
                            <Unlock size={13} className="text-amber-800" /> Odhalené Tajemství:
                          </span>
                          <p className="font-lora text-xs text-amber-950 font-medium italic leading-relaxed">
                            {npc.odhalene_tajemstvi}
                          </p>
                        </div>
                      ) : (
                        <div className="bg-stone-200/50 border border-amber-900/10 rounded-lg p-2 flex items-center justify-between text-[10.5px] text-slate-600 font-lora">
                          <span className="flex items-center gap-1.5">
                            <Lock size={12} className="text-amber-900/50" /> Skryté motivy:
                          </span>
                          <span className="italic text-[10px] text-slate-500">Dosud neodhaleno</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t-2 border-amber-900/20 bg-amber-900/5 flex justify-between items-center text-xs font-lora text-slate-700">
          <span>Celkem zaznamenaných postav: {npcs.length}</span>
          <button
            onClick={() => onClose()}
            className="px-4 py-1.5 bg-amber-900 hover:bg-amber-950 text-amber-100 rounded-xl font-cinzel font-bold text-xs tracking-wider transition shadow-sm cursor-pointer"
          >
            Zavřít
          </button>
        </div>

      </div>
    </div>
  );
};
