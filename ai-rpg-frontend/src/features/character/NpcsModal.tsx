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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="w-full max-w-2xl bg-[#faf6ea] dark:bg-[#0f141d] bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] rounded-2xl border-4 border-amber-950/80 dark:border-amber-600/40 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-slate-900 dark:text-[#e2d9c8]">
        
        {/* Header */}
        <div className="px-5 py-4 flex justify-between items-center border-b-2 border-amber-900/20 dark:border-amber-500/20 bg-amber-900/5 dark:bg-[#141b26]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-900/15 dark:bg-amber-950/40 rounded-xl border border-amber-900/25 dark:border-amber-500/30 text-amber-950 dark:text-amber-200">
              <Users size={24} />
            </div>
            <div>
              <h2 className="font-cinzel font-bold text-xl sm:text-2xl text-amber-950 dark:text-amber-200 tracking-wide">
                Deník Postav
              </h2>
              <p className="text-xs font-lora text-slate-700 dark:text-slate-400">
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
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-900/30 dark:border-amber-600/30 bg-[#f4ecd8] dark:bg-[#1a2332] hover:bg-white dark:hover:bg-[#222e42] text-xs font-cinzel font-bold text-amber-950 dark:text-amber-200 transition shadow-sm cursor-pointer" 
                title="Zobrazit na mapě světa"
              >
                <Map size={14} /> <span>Mapa světa</span>
              </button>
            )}
            <button 
              onClick={() => onClose()} 
              className="text-amber-900/70 dark:text-slate-400 hover:text-amber-950 dark:hover:text-amber-200 p-1.5 rounded-xl hover:bg-amber-900/10 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Zavřít"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
          {npcs.length === 0 ? (
            <div className="text-center p-8 bg-[#faf6ea] dark:bg-[#141b26] border border-amber-900/15 dark:border-amber-500/20 rounded-2xl flex flex-col items-center my-6">
              <div className="w-14 h-14 rounded-full bg-amber-900/15 dark:bg-amber-950/40 flex items-center justify-center text-amber-900 dark:text-amber-300 mb-3 border border-amber-900/20 dark:border-amber-500/30">
                <Users size={28} />
              </div>
              <h3 className="font-cinzel font-bold text-amber-950 dark:text-amber-200 text-base mb-1">
                Zatím jsi nepotkal nikoho významného
              </h3>
              <p className="font-lora text-xs sm:text-sm text-slate-700 dark:text-slate-400 max-w-md italic">
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
                    className="bg-[#faf6ea] dark:bg-[#141b26] border-2 border-amber-900/20 dark:border-amber-500/25 rounded-xl p-4 flex flex-col justify-between gap-3 shadow-sm hover:border-amber-900/40 dark:hover:border-amber-500/45 transition relative overflow-hidden"
                  >
                    <div className="space-y-2">
                      {/* Name & Badges */}
                      <div className="flex justify-between items-start gap-2 border-b border-amber-900/15 dark:border-amber-500/20 pb-2">
                        <div>
                          <h3 className="font-cinzel font-bold text-base text-amber-950 dark:text-amber-200 leading-tight">{npc.jmeno}</h3>
                          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 text-[11px] font-cinzel font-semibold mt-0.5">
                            <MapPin size={12} className="text-amber-800 dark:text-amber-400 shrink-0" />
                            <span>{npc.lokace_nazev || npc.lokace || 'Neznámá lokace'}</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <span className={`text-[10px] uppercase tracking-wider font-cinzel font-bold px-2 py-0.5 rounded-md border shrink-0 ${
                            isFriendly 
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border-emerald-400 dark:border-emerald-600' 
                              : isHostile 
                              ? 'bg-red-100 dark:bg-red-950/60 text-red-900 dark:text-red-300 border-red-400 dark:border-red-600' 
                              : 'bg-amber-100/90 dark:bg-amber-950/60 text-amber-950 dark:text-amber-200 border-amber-700/30 dark:border-amber-600/40'
                          }`}>
                            {npc.vztah || 'Neutrální'}
                          </span>
                          <span className={`text-[9.5px] font-cinzel font-bold px-1.5 py-0.5 rounded border ${trustBadge.color} dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700`}>
                            {trustBadge.label}
                          </span>
                        </div>
                      </div>

                      {/* Personality & Mannerisms */}
                      {npc.povaha && (
                        <div className="bg-amber-900/5 dark:bg-amber-950/40 border border-amber-900/15 dark:border-amber-500/20 rounded-lg p-2 text-xs font-lora">
                          <span className="font-cinzel font-bold text-amber-950 dark:text-amber-300 text-[10px] uppercase tracking-wider block mb-0.5 flex items-center gap-1">
                            🎭 Vystupování & Manýry:
                          </span>
                          <p className="text-slate-800 dark:text-slate-300 italic leading-snug">
                            {npc.povaha}
                          </p>
                        </div>
                      )}

                      {/* Description */}
                      <p className="font-lora text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                        {npc.popis}
                      </p>

                      {/* Secret / Deep Motivation Seal */}
                      {npc.odhalene_tajemstvi ? (
                        <div className="bg-amber-100/90 dark:bg-amber-950/50 border border-amber-500/50 dark:border-amber-500/30 rounded-lg p-2.5 shadow-xs">
                          <span className="font-cinzel font-bold text-amber-950 dark:text-amber-300 text-[11px] flex items-center gap-1.5 mb-1 uppercase tracking-wide">
                            <Unlock size={13} className="text-amber-800 dark:text-amber-400" /> Odhalené Tajemství:
                          </span>
                          <p className="font-lora text-xs text-amber-950 dark:text-amber-200 font-medium italic leading-relaxed">
                            {npc.odhalene_tajemstvi}
                          </p>
                        </div>
                      ) : (
                        <div className="bg-stone-200/50 dark:bg-slate-800/50 border border-amber-900/10 dark:border-slate-700 rounded-lg p-2 flex items-center justify-between text-[10.5px] text-slate-600 dark:text-slate-400 font-lora">
                          <span className="flex items-center gap-1.5">
                            <Lock size={12} className="text-amber-900/50 dark:text-amber-400/50" /> Skryté motivy:
                          </span>
                          <span className="italic text-[10px] text-slate-500 dark:text-slate-400">Dosud neodhaleno</span>
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
        <div className="px-5 py-3 border-t-2 border-amber-900/20 dark:border-amber-500/20 bg-amber-900/5 dark:bg-[#141b26] flex justify-between items-center text-xs font-lora text-slate-700 dark:text-slate-400">
          <span>Celkem zaznamenaných postav: {npcs.length}</span>
          <button
            onClick={() => onClose()}
            className="px-4 py-1.5 bg-amber-900 dark:bg-amber-800 hover:bg-amber-950 dark:hover:bg-amber-700 text-amber-100 rounded-xl font-cinzel font-bold text-xs tracking-wider transition shadow-sm cursor-pointer"
          >
            Zavřít
          </button>
        </div>

      </div>
    </div>
  );
};
