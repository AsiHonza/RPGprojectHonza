import codecs

header = """import React, { useState } from 'react';
import { User, ScrollText, Volume2, VolumeX, Settings2, Menu, Map, Users, Package, MapPin, Sparkles, Heart, Drumstick, BookOpen } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { AnimatePresence, motion } from 'framer-motion';

export const PlayerHeader = ({
  setSettingsOpen,
  setPatchNotesOpen,
  setNpcsOpen,
  setInventoryOpen,
  setJournalOpen,
  setStatsOpen,
  setMapOpen,
  setQuestsOpen,
  setSkillsOpen
}: any) => {
  const { 
    name, level, race, dndClass, hp, xp, 
    musicPlaying, setMusicPlaying, unreadQuests, setUnreadQuests,
    gold, rations, currentRegion, skillPoints, quests, worldData
  } = useGameStore();

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="w-full max-w-7xl bg-rpg-obsidian border-b border-[#2b4c5e] p-3 shadow-2xl flex flex-col gap-2 shrink-0 relative z-40">
      
      {/* Top row */}
      <div className="flex items-center justify-between">
        
        {/* Left: Portrait & Stats */}
        <div className="flex items-center gap-4 flex-1">
          {/* Avatar */}
          <div className="w-14 h-14 bg-gradient-to-br from-[#2b4c5e] to-rpg-obsidian border-2 border-rpg-magic rounded-full flex items-center justify-center text-rpg-paper relative shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <User size={28} />
            <div className="absolute -bottom-1 -right-1 bg-rpg-obsidian text-rpg-magic text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border border-rpg-magic shadow-lg">
              {level}
            </div>
          </div>
          
          {/* Info & Bars */}
          <div className="flex-1 max-w-md flex flex-col justify-center">
            <div className="flex justify-between items-end mb-1">
              <h2 className="font-bold text-xl text-rpg-paper font-cinzel tracking-wider drop-shadow-md leading-none">{name}</h2>
              <span className="text-xs text-rpg-muted font-lora italic leading-none">{race} {dndClass}</span>
            </div>
            
            {/* HP Bar */}
            <div className="w-full bg-[#111827] h-2.5 rounded-full overflow-hidden border border-[#2b4c5e] relative mb-1 shadow-inner">
              <motion.div 
                className="h-full bg-gradient-to-r from-red-800 to-rpg-blood" 
                initial={{ width: 0 }}
                animate={{ width: `${hp}%` }}
                transition={{ duration: 0.5 }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white drop-shadow-md">{hp}/100</span>
            </div>

            {/* XP Bar */}
            <div className="w-full bg-[#111827] h-1.5 rounded-full overflow-hidden border border-[#2b4c5e] relative shadow-inner">
              <motion.div 
                className="h-full bg-gradient-to-r from-yellow-700 to-rpg-magic" 
                initial={{ width: 0 }}
                animate={{ width: `${(xp / (level * 300)) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Right: Quick Actions & Menu Toggle */}
        <div className="flex items-center gap-3 ml-4">
          <div className="hidden sm:flex items-center gap-4 mr-4 text-rpg-muted text-sm font-cinzel">
             <div className="flex items-center gap-1"><Drumstick size={16} className="text-orange-400" /> <span>{rations}</span></div>
             <div className="flex items-center gap-1 text-yellow-500 font-bold"><span className="text-xs">Zlaťáky:</span> <span>{gold}</span></div>
          </div>
          
          {/* Quick HUD Buttons (Desktop only for some) */}
          <button onClick={() => setStatsOpen(true)} className="relative p-2 rounded-full bg-[#2b4c5e]/50 hover:bg-[#2b4c5e] text-rpg-paper transition-all border border-[#455a64] hover:border-rpg-magic shadow-md" title="Vlastnosti postavy">
            <User size={20} />
            {skillPoints > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-rpg-blood text-white text-[10px] rounded-full flex items-center justify-center animate-pulse">{skillPoints}</span>}
          </button>
          
          <button onClick={() => setSkillsOpen(true)} className="relative p-2 rounded-full bg-[#2b4c5e]/50 hover:bg-[#2b4c5e] text-rpg-paper transition-all border border-[#455a64] hover:border-rpg-magic shadow-md" title="Bojové dovednosti">
            <Sparkles size={20} />
          </button>

          <button onClick={() => { setQuestsOpen(true); setUnreadQuests(false); }} className={`relative p-2 rounded-full transition-all border shadow-md ${unreadQuests ? 'bg-rpg-magic/20 text-rpg-magic border-rpg-magic shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-[#2b4c5e]/50 hover:bg-[#2b4c5e] text-rpg-paper border-[#455a64] hover:border-rpg-magic'}`} title="Úkoly">
            <BookOpen size={20} />
            {unreadQuests && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rpg-blood rounded-full animate-ping"></span>}
          </button>

          {/* Master Menu Toggle */}
          <button onClick={toggleMenu} className="p-2 rounded-md bg-rpg-paper text-rpg-obsidian hover:bg-white transition-all shadow-[0_0_10px_rgba(244,236,216,0.2)] ml-2">
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Floating Dropdown Menu (Framer Motion) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[80px] right-4 w-64 bg-rpg-obsidian border-2 border-[#455a64] rounded-lg shadow-2xl flex flex-col z-50 overflow-hidden font-cinzel"
          >
            {/* Mobile-only stats row */}
            <div className="sm:hidden flex justify-between items-center p-4 bg-[#111827] border-b border-[#2b4c5e] text-rpg-muted">
               <div className="flex items-center gap-2"><Drumstick size={16} className="text-orange-400" /> <span>{rations}</span></div>
               <div className="flex items-center gap-2 text-yellow-500 font-bold"><span className="text-xs">Zlaťáky:</span> <span>{gold}</span></div>
            </div>

            <div className="p-2 flex flex-col gap-1">
              {worldData && (
                <button onClick={() => { setMapOpen(true); setMenuOpen(false); }} className="flex items-center gap-3 p-3 rounded hover:bg-[#2b4c5e] text-rpg-paper transition-colors text-left w-full">
                  <Map size={20} className="text-rpg-magic" /> Mapa světa
                </button>
              )}
              <button onClick={() => { setInventoryOpen(true); setMenuOpen(false); }} className="flex items-center gap-3 p-3 rounded hover:bg-[#2b4c5e] text-rpg-paper transition-colors text-left w-full">
                <Package size={20} className="text-[#a8b8c2]" /> Batoh a Vybavení
              </button>
              <button onClick={() => { setJournalOpen(true); setMenuOpen(false); }} className="flex items-center gap-3 p-3 rounded hover:bg-[#2b4c5e] text-rpg-paper transition-colors text-left w-full">
                <ScrollText size={20} className="text-[#a8b8c2]" /> Osobní deník
              </button>
              <button onClick={() => { setNpcsOpen(true); setMenuOpen(false); }} className="flex items-center gap-3 p-3 rounded hover:bg-[#2b4c5e] text-rpg-paper transition-colors text-left w-full">
                <Users size={20} className="text-[#a8b8c2]" /> Známé postavy
              </button>
            </div>
            
            <div className="border-t border-[#455a64] p-2 flex flex-col gap-1 bg-[#111827]">
              <button onClick={() => setMusicPlaying(!musicPlaying)} className="flex items-center gap-3 p-3 rounded hover:bg-[#2b4c5e] text-rpg-muted hover:text-rpg-paper transition-colors text-left w-full">
                {musicPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />} Hudba a Zvuky
              </button>
              <button onClick={() => { setSettingsOpen(true); setMenuOpen(false); }} className="flex items-center gap-3 p-3 rounded hover:bg-[#2b4c5e] text-rpg-muted hover:text-rpg-paper transition-colors text-left w-full">
                <Settings2 size={20} /> Nastavení hry
              </button>
              <button onClick={() => { setPatchNotesOpen(true); setMenuOpen(false); }} className="flex items-center gap-3 p-3 rounded hover:bg-[#2b4c5e] text-rpg-muted hover:text-rpg-paper transition-colors text-left w-full">
                <ScrollText size={20} className="text-rpg-blood" /> Novinky (Patch Notes)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
"""

with codecs.open('src/features/ui/PlayerHeader.tsx', 'w', 'utf-8') as f:
    f.write(header)

print("PlayerHeader rewritten with framer-motion and new UI")
