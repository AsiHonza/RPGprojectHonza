import React, { useState } from 'react';
import { X, BookOpen, ScrollText, User, Sparkles, Shield, Compass, Flame, History, Award } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { WORLD_LORE } from '../../data/worldLore';

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToQuests?: () => void;
}

export const JournalModal: React.FC<JournalModalProps> = ({ isOpen, onClose, onSwitchToQuests }) => {
  const { journal, chronicle, reputation, worldFlags, name, race, dndClass, level } = useGameStore();
  const [activeTab, setActiveTab] = useState<'journal' | 'chronicle' | 'factions'>('journal');

  if (!isOpen) return null;

  const getReputationBadge = (val: number) => {
    if (val <= -20) return { label: 'Nepřátelský', color: 'bg-red-900/15 text-red-700 border-red-300' };
    if (val < 0) return { label: 'Obezřetný', color: 'bg-amber-900/15 text-amber-800 border-amber-300' };
    if (val === 0) return { label: 'Neutrální', color: 'bg-slate-100 text-slate-700 border-slate-300' };
    if (val < 20) return { label: 'Přátelský', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    return { label: 'Uctívaný Spojenec', color: 'bg-amber-100 text-amber-900 border-amber-400 font-bold' };
  };

  const FACTION_KEYS: Record<string, string> = {
    'valerium': 'Valerijské Impérium',
    'solarian': 'Svatá říše Solariova',
    'vyldia': 'Kmeny z Hlubokých hvozdů',
    'svobodna_mesta': 'Svobodná města',
    'karantena': 'Karanténní Zóna',
    'zelezny_prah': 'Železný Práh',
    'utociste': 'Tajemné Útočiště',
    'kull': 'Kult Pána Stínů (Kull)'
  };

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 select-none">
      <div className="w-full max-w-2xl bg-[#faf6ea] bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] rounded-2xl border-4 border-amber-950/80 shadow-2xl overflow-hidden flex flex-col max-h-[88vh] text-slate-900">
        
        {/* Header */}
        <div className="px-5 py-4 flex justify-between items-center border-b-2 border-amber-900/20 bg-amber-900/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-900/15 rounded-xl border border-amber-900/25 text-amber-950">
              <BookOpen size={24} />
            </div>
            <div>
              <h2 className="font-cinzel font-bold text-xl sm:text-2xl text-amber-950 tracking-wide">
                Kronika Legendy
              </h2>
              <p className="text-xs font-lora text-slate-700">
                Paměť světa, tvé činy a vztahy s mocnými Aelthgardu
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
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-900/30 bg-[#f4ecd8] hover:bg-white text-xs font-cinzel font-bold text-amber-950 transition shadow-sm cursor-pointer"
                title="Přejít do knihy úkolů"
              >
                <ScrollText size={14} /> Kniha úkolů
              </button>
            )}
            <button 
              onClick={onClose} 
              className="text-amber-900/70 hover:text-amber-950 p-1.5 rounded-xl hover:bg-amber-900/10 transition cursor-pointer"
              title="Zavřít"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-amber-900/20 bg-[#f2eada] px-4 pt-2 gap-2 text-xs font-cinzel font-bold">
          <button
            onClick={() => setActiveTab('journal')}
            className={`px-4 py-2 rounded-t-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'journal' 
                ? 'bg-[#faf6ea] text-amber-950 border-t-2 border-x-2 border-amber-900/40 font-black shadow-sm' 
                : 'text-slate-600 hover:text-amber-900'
            }`}
          >
            <ScrollText size={14} /> Zápisy z cest ({journal.length})
          </button>
          <button
            onClick={() => setActiveTab('chronicle')}
            className={`px-4 py-2 rounded-t-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'chronicle' 
                ? 'bg-[#faf6ea] text-amber-950 border-t-2 border-x-2 border-amber-900/40 font-black shadow-sm' 
                : 'text-slate-600 hover:text-amber-900'
            }`}
          >
            <History size={14} /> Kronika Světa ({chronicle.length})
          </button>
          <button
            onClick={() => setActiveTab('factions')}
            className={`px-4 py-2 rounded-t-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'factions' 
                ? 'bg-[#faf6ea] text-amber-950 border-t-2 border-x-2 border-amber-900/40 font-black shadow-sm' 
                : 'text-slate-600 hover:text-amber-900'
            }`}
          >
            <Shield size={14} /> Frakce & Reputace
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5">
          
          {/* Hero Plaque */}
          <div className="bg-[#f5ede0] border border-amber-900/20 rounded-xl p-3.5 sm:p-4 shadow-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-900/15 border border-amber-900/25 flex items-center justify-center text-amber-950 font-cinzel font-bold text-lg shadow-inner">
                {name ? name.charAt(0).toUpperCase() : <User size={18} />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-cinzel font-bold text-base sm:text-lg text-amber-950">{name || "Bezejmenný hrdina"}</h3>
                  <span className="text-[10px] font-cinzel font-bold px-2 py-0.5 bg-amber-900/15 text-amber-950 border border-amber-900/25 rounded-md">
                    Úroveň {level || 1}
                  </span>
                </div>
                <p className="font-lora text-xs text-slate-700 mt-0.5">
                  <span className="font-bold text-amber-900">{race}</span> • <span className="font-bold text-amber-900">{dndClass}</span>
                </p>
              </div>
            </div>
            {worldFlags.length > 0 && (
              <span className="text-[11px] font-cinzel font-bold text-amber-900 bg-amber-100/80 px-2.5 py-1 rounded-lg border border-amber-900/20 hidden sm:inline-block">
                🚩 {worldFlags.length} známých faktů
              </span>
            )}
          </div>

          {/* TAB 1: Journal Notes */}
          {activeTab === 'journal' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-amber-800" />
                <h3 className="font-cinzel font-bold text-xs tracking-wider uppercase text-amber-950">
                  Podrobné zápisy dobrodruha
                </h3>
              </div>

              {journal.map((entry, i) => (
                <div 
                  key={i} 
                  className="bg-[#faf6ea] border border-amber-900/20 rounded-xl p-4 shadow-sm relative overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-amber-900/15 pb-1.5 mb-2.5">
                    <span className="text-xs font-cinzel font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-700 inline-block" />
                      Zápis #{i + 1}
                    </span>
                    <span className="text-[10px] font-lora text-slate-500 italic">Osobní deník</span>
                  </div>
                  <p className="font-lora text-xs sm:text-sm text-slate-800 leading-relaxed italic">
                    {entry}
                  </p>
                </div>
              ))}

              {journal.length === 0 && (
                <div className="text-center p-8 bg-[#faf6ea] border border-amber-900/15 rounded-2xl flex flex-col items-center">
                  <BookOpen size={24} className="text-amber-800 mb-2" />
                  <h4 className="font-cinzel font-bold text-amber-950 text-sm mb-1">
                    Zápisník je zatím prázdný
                  </h4>
                  <p className="font-lora text-xs text-slate-600 max-w-sm italic">
                    Významné události se zde automaticky zaznamenají během tvého putování.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Chronicle Timeline (L2 Rolling Memory) */}
          {activeTab === 'chronicle' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <History size={16} className="text-amber-800" />
                <h3 className="font-cinzel font-bold text-xs tracking-wider uppercase text-amber-950">
                  Časová osa milníků (Dlouhodobá paměť světa)
                </h3>
              </div>

              <div className="relative pl-6 border-l-2 border-amber-900/30 space-y-4">
                {chronicle.map((item, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-amber-700 border-2 border-[#faf6ea]" />
                    <div className="bg-[#faf6ea] border border-amber-900/20 rounded-xl p-3.5 shadow-sm">
                      <span className="text-[10px] font-cinzel font-bold text-amber-900 uppercase tracking-widest block mb-1">
                        Epocha #{idx + 1}
                      </span>
                      <p className="font-lora text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                        {item}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {chronicle.length === 0 && (
                <div className="text-center p-8 bg-[#faf6ea] border border-amber-900/15 rounded-2xl flex flex-col items-center">
                  <History size={24} className="text-amber-800 mb-2" />
                  <h4 className="font-cinzel font-bold text-amber-950 text-sm mb-1">
                    Kronika se teprve píše
                  </h4>
                  <p className="font-lora text-xs text-slate-600 max-w-sm italic">
                    Jakmile odehraješ několik tahů, Pán jeskyně zde začne automaticky tvořit ucelenou kroniku tvé legendy.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Faction Standings & Karma */}
          {activeTab === 'factions' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-amber-800" />
                <h3 className="font-cinzel font-bold text-xs tracking-wider uppercase text-amber-950">
                  Vztahy s Královstvími a Kulty
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {Object.entries(FACTION_KEYS).map(([fKey, fName]) => {
                  const val = reputation[fKey] || 0;
                  const badge = getReputationBadge(val);
                  return (
                    <div 
                      key={fKey} 
                      className="bg-[#faf6ea] border border-amber-900/20 rounded-xl p-3 shadow-sm flex items-center justify-between gap-3"
                    >
                      <div>
                        <strong className="font-cinzel text-xs sm:text-sm text-amber-950 block">{fName}</strong>
                        <span className="text-[10px] font-lora text-slate-600">
                          {fKey === 'kull' ? 'Božský kult stínů a moci' : 'Svrchované království Aelthgardu'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-cinzel font-bold px-2 py-0.5 rounded-md border ${badge.color}`}>
                          {badge.label}
                        </span>
                        <span className="text-xs font-mono font-bold text-amber-950 w-9 text-right">
                          {val > 0 ? `+${val}` : val}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t-2 border-amber-900/20 bg-amber-900/5 flex justify-between items-center text-xs font-lora text-slate-700">
          <span>Aelthgard • Vědomí Světa</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-amber-900 hover:bg-amber-950 text-amber-100 rounded-xl font-cinzel font-bold text-xs tracking-wider transition shadow-sm cursor-pointer"
          >
            Zavřít
          </button>
        </div>

      </div>
    </div>
  );
};
