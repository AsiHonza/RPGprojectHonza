import React from 'react';
import { X, User, Sparkles, Plus } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export const StatsModal = ({ isOpen, onClose }: any) => {
  const { stats, setStats, skillPoints, setSkillPoints } = useGameStore();

  if (!isOpen) return null;

  const statDetails: Record<string, { label: string; desc: string }> = {
    str: { label: 'Síla (STR)', desc: 'Boj zblízka, těžké zbraně, atletika' },
    dex: { label: 'Obratnost (DEX)', desc: 'Uhýbání, střelba, plížení a reflexy' },
    con: { label: 'Odolnost (CON)', desc: 'Životy, vytrvalost, odolnost jedům' },
    intel: { label: 'Inteligence (INT)', desc: 'Znalost magie, historie, logika' },
    wis: { label: 'Moudrost (WIS)', desc: 'Vnímání, intuice, léčení a přežití' },
    cha: { label: 'Charisma (CHA)', desc: 'Vyjednávání, přesvědčování, klamání' },
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="w-full max-w-lg bg-[#f9f6e6]/95 backdrop-blur-xl rounded-2xl border border-amber-900/20 shadow-2xl overflow-hidden flex flex-col text-slate-900">
        
        {/* Header */}
        <div className="px-5 py-4 flex justify-between items-center border-b border-amber-900/15 bg-gradient-to-r from-amber-900/5 via-transparent to-amber-900/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-xl border border-amber-900/15 text-amber-900">
              <User size={24} />
            </div>
            <div>
              <h2 className="font-cinzel font-bold text-xl sm:text-2xl text-amber-950 tracking-wide">
                Vlastnosti Hrdiny
              </h2>
              <p className="text-xs font-lora text-slate-600">
                Atributy ovlivňující hody kostkou v příběhu
              </p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="text-amber-900/60 hover:text-amber-950 p-1.5 rounded-xl hover:bg-amber-900/10 transition"
            title="Zavřít"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto max-h-[75vh] custom-scrollbar">
          
          {/* Skill Points Banner */}
          <div className="flex justify-between items-center bg-white/80 border border-amber-900/15 p-4 rounded-xl shadow-sm">
            <div>
              <h3 className="font-cinzel font-bold text-base text-amber-950 flex items-center gap-1.5">
                <Sparkles size={16} className="text-amber-700" />
                Základní atributy
              </h3>
              <p className="text-xs font-lora text-slate-600">Vylepšete si schopnosti pro překonávání překážek.</p>
            </div>
            <div className="text-right pl-3 border-l border-amber-900/10">
              <div className="text-[10px] uppercase font-cinzel font-bold text-slate-500">Volné body</div>
              <div className="text-2xl font-cinzel font-bold text-amber-900">{skillPoints}</div>
            </div>
          </div>

          {/* Stats List */}
          <div className="flex flex-col gap-2.5">
            {Object.entries(statDetails).map(([key, info]) => {
              const val = stats[key as keyof typeof stats] ?? 10;
              const mod = Math.floor((val - 10) / 2);

              return (
                <div 
                  key={key} 
                  className="flex justify-between items-center bg-white/70 hover:bg-white/90 p-3 sm:p-3.5 rounded-xl border border-amber-900/15 shadow-xs transition"
                >
                  <div className="flex-1 pr-2">
                    <span className="font-cinzel font-bold text-amber-950 text-sm block">
                      {info.label}
                    </span>
                    <span className="text-[11px] font-lora text-slate-500 block">
                      {info.desc}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="font-cinzel font-bold text-amber-950 text-lg">
                        {val}
                      </span>
                      <span className="text-xs font-lora font-bold text-slate-500 ml-1.5">
                        ({mod >= 0 ? `+${mod}` : mod})
                      </span>
                    </div>

                    <button 
                      onClick={() => {
                        if (skillPoints > 0) {
                          setStats({ ...stats, [key]: val + 1 });
                          setSkillPoints((p: any) => p - 1);
                        }
                      }}
                      disabled={skillPoints <= 0}
                      className="w-8 h-8 rounded-lg bg-amber-800 hover:bg-amber-700 text-white font-bold flex items-center justify-center transition shadow disabled:opacity-30 disabled:cursor-not-allowed"
                      title={skillPoints > 0 ? `Zvýšit ${info.label}` : 'Nemáš volné body'}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-amber-900/10 bg-amber-900/5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-800 hover:bg-amber-700 text-white rounded-xl font-cinzel font-bold text-xs tracking-wider transition shadow-sm"
          >
            Hotovo
          </button>
        </div>

      </div>
    </div>
  );
};

