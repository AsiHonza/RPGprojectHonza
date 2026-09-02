import React, { useState } from 'react';
import { User, Drumstick, BookOpen, ScrollText, Volume2, VolumeX, Settings2, Menu, Map, Users, Package, MapPin, Sparkles, Heart } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export const PlayerHeader = ({
  setSettingsOpen,
  setPatchNotesOpen,
  setNpcsOpen,
  setInventoryOpen,
  setJournalOpen,
  setStatsOpen,
  setSkillsOpen,
  setMapOpen,
  setQuestsOpen
}: any) => {
  const { name, level, race, dndClass, hp, xp, musicPlaying, setMusicPlaying, unreadQuests, setUnreadQuests, gold, rations, currentRegion, skillPoints, quests, worldData } = useGameStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
      <div className="w-full max-w-7xl bg-[#f4f1e1] border border-[#90a4ae] rounded-lg p-2 md:p-4 shadow-lg flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#b74b4b] rounded-full flex items-center justify-center text-[#f4f1e1] relative">
              <User size={24} />
              <div className="absolute -bottom-2 -right-2 bg-[#d4af37] text-[#1b262c] text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-[#f4f1e1]">
                {level}
              </div>
            </div>
            <div>
              <h2 className="font-bold text-xl text-[#2b4c5e] font-medieval">{name}</h2>
              <p className="text-sm text-[#455a64] font-serif">{race} {dndClass}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4 text-[#2b4c5e]">
            {/* Status (HP & Food) */}
            <div className="flex items-center gap-4 text-sm sm:text-base mr-0 sm:mr-4">
              <div className="flex items-center gap-1 font-bold text-[#b74b4b]"><Drumstick size={18} /> <span key={`food-${rations}`} className="animate-flash">{rations}</span></div>
              <div className="flex items-center gap-1 font-bold text-[#b74b4b]"><Heart size={18} /> <span>{hp}/100</span></div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap sm:flex-nowrap justify-end gap-2 relative">
              <button onClick={() => setStatsOpen(true)} className="hidden sm:flex items-center gap-1 font-bold text-[#2b4c5e] hover:text-[#b74b4b] transition cursor-pointer bg-[#e3dcc8] px-2 py-1 rounded border border-[#90a4ae] relative" title="Vlastnosti postavy">
                <User size={18} />
                {skillPoints > 0 && <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center animate-bounce">{skillPoints}</span>}
              </button>
              
              <button onClick={() => setSkillsOpen(true)} className="flex items-center gap-1 font-bold text-[#2b4c5e] hover:text-[#b74b4b] transition cursor-pointer bg-[#e3dcc8] px-2 py-1 rounded border border-[#90a4ae] relative" title="Bojové dovednosti">
                <Sparkles size={18} />
              </button>
              
              <button onClick={() => { setQuestsOpen(true); setUnreadQuests(false); }} className={`relative flex items-center gap-1 font-bold transition cursor-pointer bg-[#e3dcc8] px-2 py-1 rounded border ${unreadQuests ? 'text-[#d4af37] border-[#d4af37] shadow-[0_0_10px_#d4af37]' : 'text-[#2b4c5e] hover:text-[#b74b4b] border-[#90a4ae]'}`} title="Úkoly">
                <BookOpen size={18} />
                {unreadQuests && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-[#f4f1e1] animate-pulse"></span>}
                {!unreadQuests && quests.filter(q => q.stav === 'aktivni').length > 0 && <span className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 text-white text-[10px] rounded-full flex items-center justify-center">{quests.filter(q => q.stav === 'aktivni').length}</span>}
              </button>
              
                                          {worldData && (
                <button onClick={() => setMapOpen(true)} className="flex items-center gap-1 font-bold text-[#2b4c5e] hover:text-[#b74b4b] transition cursor-pointer bg-[#e3dcc8] px-2 py-1 rounded border border-[#90a4ae]" title="Mapa světa">
                  <Map size={18} />
                </button>
              )}
              <button onClick={() => setNpcsOpen(true)} className="flex items-center gap-1 font-bold text-[#2b4c5e] hover:text-[#b74b4b] transition cursor-pointer bg-[#e3dcc8] px-2 py-1 rounded border border-[#90a4ae]" title="Známé postavy">
                <Users size={18} />
              </button>
              <button onClick={() => setInventoryOpen(true)} className="flex items-center gap-1 font-bold text-[#2b4c5e] hover:text-[#b74b4b] transition cursor-pointer bg-[#e3dcc8] px-2 py-1 rounded border border-[#90a4ae]" title="Batoh">
                <Package size={18} />
              </button>

              <button onClick={() => setJournalOpen(true)} className="hidden sm:flex items-center gap-1 font-bold text-[#2b4c5e] hover:text-[#b74b4b] transition cursor-pointer bg-[#e3dcc8] px-2 py-1 rounded border border-[#90a4ae] relative" title="Deník příběhu">
                <ScrollText size={18} />
              </button>
              <button onClick={() => setMusicPlaying(!musicPlaying)} className="hidden sm:flex items-center gap-1 font-bold text-[#2b4c5e] hover:text-[#b74b4b] transition cursor-pointer bg-[#e3dcc8] px-2 py-1 rounded border border-[#90a4ae]" title="Hudba">
                {musicPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
                          {/* Patch Notes Button */}
            <button onClick={() => setPatchNotesOpen(true)} className="text-[#b74b4b] hover:text-[#d4af37] transition flex items-center gap-1 font-bold bg-[#1b262c] px-2 py-1 rounded border border-[#90a4ae]" title="Novinky ve hře">
              <ScrollText size={20} />
              <span className="hidden sm:inline text-xs uppercase">Novinky</span>
            </button>
            <button onClick={() => setSettingsOpen(true)} className="hidden sm:flex items-center gap-1 font-bold text-[#2b4c5e] hover:text-[#b74b4b] transition cursor-pointer bg-[#e3dcc8] px-2 py-1 rounded border border-[#90a4ae]" title="Nastavení">
                <Settings2 size={18} />
              </button>

              {/* Mobile Hamburger */}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="sm:hidden flex items-center gap-1 font-bold text-[#f4f1e1] hover:text-[#d4af37] transition cursor-pointer bg-[#2b4c5e] px-2 py-1 rounded border border-[#455a64]">
                <Menu size={18} />
              </button>

              {/* Mobile Dropdown */}
              {mobileMenuOpen && (
                <div className="absolute right-0 top-10 w-48 bg-[#f4f1e1] border-2 border-[#90a4ae] rounded shadow-xl p-2 flex flex-col gap-2 z-50 sm:hidden">
                  <button onClick={() => { setStatsOpen(true); setMobileMenuOpen(false); }} className="flex justify-between items-center text-[#2b4c5e] hover:bg-[#e3dcc8] p-2 rounded transition">
                    <span className="font-bold flex items-center gap-2"><User size={18} /> Vlastnosti</span>
                    {skillPoints > 0 && <span className="w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center animate-bounce">{skillPoints}</span>}
                  </button>
                  <button onClick={() => { setJournalOpen(true); setMobileMenuOpen(false); }} className="flex items-center gap-2 text-[#2b4c5e] hover:bg-[#e3dcc8] p-2 rounded transition font-bold text-left">
                    <ScrollText size={18} /> Deník
                  </button>
                  <button onClick={() => { setMusicPlaying(!musicPlaying); setMobileMenuOpen(false); }} className="flex items-center gap-2 text-[#2b4c5e] hover:bg-[#e3dcc8] p-2 rounded transition font-bold text-left">
                    {musicPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />} Hudba
                  </button>
                  <button onClick={() => { setSettingsOpen(true); setMobileMenuOpen(false); }} className="flex items-center gap-2 text-[#2b4c5e] hover:bg-[#e3dcc8] p-2 rounded transition font-bold text-left">
                    <Settings2 size={18} /> Nastavení
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* XP Bar */}
        <div className="w-full bg-[#e3dcc8] h-2 mt-2 rounded-full overflow-hidden border border-[#90a4ae] relative">
          <div className="h-full bg-gradient-to-r from-[#d4af37] to-[#b59226] transition-all duration-500" style={{width: `${(xp / (level * 100)) * 100}%`}}></div>
        </div>
        <div className="text-right text-[10px] text-[#455a64] -mt-1 font-bold"><span key={`xp-${xp}`} className="animate-flash">{xp}</span> / {level * 300} XP</div>

      </div>
  );
};
