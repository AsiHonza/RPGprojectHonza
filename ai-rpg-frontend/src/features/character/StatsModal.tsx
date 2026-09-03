import React from 'react';
import { X, User } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export const StatsModal = ({ isOpen, onClose }: any) => {
  const { stats, setStats, skillPoints, setSkillPoints } = useGameStore();

  if (!isOpen) return null;

  return (
        <div className="fixed inset-0 bg-[#e5dfc5] flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg bg-[#2b4c5e] rounded-lg border-4 border-[#90a4ae] shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-[#e3dcc8] p-4 flex justify-between items-center border-b-4 border-[#90a4ae]">
              <div className="flex items-center gap-2 text-[#b74b4b] font-bold text-2xl uppercase tracking-widest">
                <User size={28} /> Vlastnosti
              </div>
              <button onClick={() => onClose()} className="text-[#2b4c5e] hover:text-[#b74b4b] transition">
                <X size={28} />
              </button>
            </div>
            
            <div className="p-6 bg-[#1e3746] flex flex-col gap-6">
              <div className="flex justify-between items-center bg-[#1b262c] border-2 border-[#455a64] p-4 rounded text-[#90a4ae]">
                <div>
                  <h3 className="font-bold text-lg text-[#f4f1e1]">Základní atributy</h3>
                  <p className="text-sm">Vylepšete si statistiky pro hody kostkou.</p>
                </div>
                <div className="text-right">
                  <div className="text-sm">Nevyužité body</div>
                  <div className="text-2xl font-bold text-[#d4af37]">{skillPoints}</div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  { key: 'str', label: 'Síla (STR)' },
                  { key: 'dex', label: 'Obratnost (DEX)' },
                  { key: 'con', label: 'Odolnost (CON)' },
                  { key: 'intel', label: 'Inteligence (INT)' },
                  { key: 'wis', label: 'Moudrost (WIS)' },
                  { key: 'cha', label: 'Charisma (CHA)' },
                ].map((stat) => (
                  <div key={stat.key} className="flex justify-between items-center bg-[#2b4c5e] p-3 rounded border border-[#455a64]">
                    <span className="font-bold text-[#f4f1e1] uppercase w-1/2">{stat.label}</span>
                    <span className="font-bold text-[#90a4ae] text-xl w-1/4 text-center">{stats[stat.key as keyof typeof stats]}</span>
                    <button 
                      onClick={() => {
                        if (skillPoints > 0) {
                          setStats({ ...stats, [stat.key]: stats[stat.key as keyof typeof stats] + 1 });
                          setSkillPoints((p: any) => p - 1);
                        }
                      }}
                      disabled={skillPoints <= 0}
                      className="bg-[#d4af37] text-[#1b262c] font-bold w-8 h-8 rounded flex items-center justify-center hover:bg-[#f4f1e1] disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

  );
};
