import React from 'react';
import { 
  Heart, Sparkles, Drumstick, MapPin, Map, Package, 
  ScrollText, ShoppingBag, Flame, User, Shield, Compass, 
  Sword, CheckCircle2, ChevronRight, Award
} from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { SeamlessVideo } from '../../components/ui/SeamlessVideo';

interface DesktopSidePanelProps {
  onOpenInventory: () => void;
  onOpenMap: () => void;
  onOpenQuests: () => void;
  onOpenTownServices: () => void;
  onOpenCamp: () => void;
  onOpenStats: () => void;
  onOpenSkills: () => void;
}

const getAvatarVideo = (r?: string) => {
  if (!r) return null;
  const lower = r.toLowerCase();
  const normalized = lower.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (normalized.includes('clovek') || lower.includes('human')) return '/video/avatars/clovek.mp4';
  if (normalized.includes('trpasl') || lower.includes('dwarf')) return '/video/avatars/trpaslik.mp4';
  if (normalized.includes('drak') || lower.includes('dragon')) return '/video/avatars/drakorozeny.mp4';
  if (lower.includes('tiefling')) return '/video/avatars/tiefling.mp4';
  if (normalized.includes('ork') || lower.includes('orc')) return '/video/avatars/pulork.mp4';
  if (normalized.includes('pulcik') || lower.includes('halfling')) return '/video/avatars/pulcik.mp4';
  if (normalized.includes('gnom') || lower.includes('gnome')) return '/video/avatars/gnom.mp4';
  if (normalized.includes('elf')) return '/video/avatars/elf.mp4';
  return null;
};

export const DesktopSidePanel: React.FC<DesktopSidePanelProps> = ({
  onOpenInventory,
  onOpenMap,
  onOpenQuests,
  onOpenTownServices,
  onOpenCamp,
  onOpenStats,
  onOpenSkills,
}) => {
  const { 
    name, level, race, dndClass, hp, maxHp, xp, 
    gold, rations, skillPoints, currentSpellSlots, maxSpellSlots,
    currentRegion, locationType, pointsOfInterest, 
    quests, activeBuffs, activeMount, worldData, playerLocation,
    reputation
  } = useGameStore();

  const xpNeeded = level * 500;
  const xpPercent = Math.min(100, Math.floor((xp / xpNeeded) * 100));
  const hpPercent = Math.min(100, Math.floor((hp / maxHp) * 100));
  const isInTown = ['mesto', 'vesnice'].includes(locationType);

  // Active quests
  const activeQuests = quests.filter(q => q.stav === 'aktivni' || (!q.stav?.includes('spln') && !q.stav?.includes('selh')));

  return (
    <aside className="hidden lg:flex flex-col gap-3.5 h-full w-full max-w-[380px] xl:max-w-[420px] shrink-0 font-serif select-none overflow-y-auto custom-scrollbar pr-1">
      
      {/* 1. Hero Identity & Vitals Card */}
      <div className="bg-[#f9f6e6]/80 backdrop-blur-md border border-amber-900/20 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar / Animated Video */}
          <div 
            onClick={onOpenStats}
            className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-600/70 shadow-md relative shrink-0 cursor-pointer group"
            title="Klikni pro detailní statistiky hrdiny"
          >
            <img 
              src={`https://image.pollinations.ai/prompt/vibrant%20fable%20style%20magical%20fantasy%20portrait%20of%20a%20${encodeURIComponent(race)}%20${encodeURIComponent(dndClass)}%20RPG%20character?width=128&height=128&nologo=true&seed=42`} 
              alt={name} 
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
            />
            {getAvatarVideo(race) && (
              <SeamlessVideo src={getAvatarVideo(race)!} className="absolute inset-0 w-full h-full" />
            )}
            <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-xs text-[10px] text-amber-300 font-cinzel font-bold text-center py-0.5">
              Lv.{level}
            </div>
          </div>

          {/* Hero Name & Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 
                onClick={onOpenStats}
                className="font-cinzel font-bold text-lg text-amber-950 truncate hover:text-amber-700 cursor-pointer transition leading-tight"
              >
                {name}
              </h3>
              {skillPoints > 0 && (
                <button
                  onClick={onOpenSkills}
                  className="px-2 py-0.5 bg-amber-700 hover:bg-amber-800 text-white rounded-full font-cinzel font-bold text-[10px] animate-pulse shadow-xs shrink-0"
                  title={`${skillPoints} volných dovednostních bodů`}
                >
                  +{skillPoints} b.
                </button>
              )}
            </div>
            <p className="text-xs text-amber-900/80 font-lora">
              {race} • {dndClass}
            </p>
            
            {/* Quick purse & rations */}
            <div className="flex items-center gap-3 mt-1.5 text-xs font-cinzel font-bold text-amber-950">
              <span className="flex items-center gap-1" title="Zlaťáky v měšci">
                <span>🪙</span> <span>{gold} zl</span>
              </span>
              <span className="flex items-center gap-1" title="Cestovní dávky jídla">
                <Drumstick size={13} className={rations < 2 ? 'text-red-700 animate-pulse' : 'text-orange-700'} />
                <span>{rations}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Health Bar */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs font-cinzel font-bold">
            <span className="flex items-center gap-1 text-red-900">
              <Heart size={13} className="text-red-600 fill-red-600" />
              <span>Životy (HP)</span>
            </span>
            <span className={hp <= 25 ? 'text-red-700 font-black animate-pulse' : 'text-amber-950'}>
              {hp} / {maxHp}
            </span>
          </div>
          <div className="w-full h-2.5 bg-amber-950/20 rounded-full overflow-hidden border border-amber-900/20">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${
                hpPercent > 50 ? 'bg-gradient-to-r from-red-600 to-red-500' :
                hpPercent > 25 ? 'bg-gradient-to-r from-orange-600 to-amber-500' :
                'bg-gradient-to-r from-red-700 to-red-900 animate-pulse'
              }`}
              style={{ width: `${hpPercent}%` }}
            />
          </div>
        </div>

        {/* Spell Slots if caster */}
        {maxSpellSlots > 0 && (
          <div className="flex items-center justify-between text-xs font-cinzel font-bold bg-amber-100/60 px-3 py-1.5 rounded-xl border border-amber-900/10">
            <span className="flex items-center gap-1.5 text-indigo-900">
              <Sparkles size={13} className="text-indigo-600" />
              <span>Kouzelné sloty</span>
            </span>
            <div className="flex gap-1">
              {Array.from({ length: maxSpellSlots }).map((_, i) => (
                <span 
                  key={i} 
                  className={`w-2.5 h-2.5 rounded-full border border-indigo-600 transition ${
                    i < currentSpellSlots ? 'bg-indigo-600 shadow-[0_0_6px_rgba(79,70,229,0.6)]' : 'bg-transparent opacity-30'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* XP Progress */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center justify-between text-[10px] font-cinzel font-bold text-amber-900/70">
            <span>Zkušenosti (XP)</span>
            <span>{xp} / {xpNeeded}</span>
          </div>
          <div className="w-full h-1 bg-amber-950/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-600 transition-all duration-300"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Active Buffs & Transport Strip */}
      {(activeBuffs.length > 0 || activeMount) && (
        <div className="bg-[#f9f6ea]/85 border border-amber-900/15 rounded-2xl p-3 shadow-md flex flex-col gap-2">
          <div className="text-[11px] font-cinzel font-bold text-amber-900 uppercase tracking-wider flex items-center justify-between">
            <span>Aktivní bonusy a zvíře</span>
            <span className="text-amber-700/60">{activeBuffs.length + (activeMount ? 1 : 0)}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {activeMount && (
              <span className="bg-amber-200/80 border border-amber-700/30 text-amber-950 text-xs px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 shadow-2xs">
                <span>{activeMount.icon}</span>
                <span>{activeMount.name}</span>
                <span className="bg-amber-800/20 px-1 rounded text-[10px] font-bold">+{activeMount.inventoryBonus} sl.</span>
              </span>
            )}
            {activeBuffs.map(b => (
              <span 
                key={b.id} 
                className="bg-amber-200/80 border border-amber-700/30 text-amber-950 text-xs px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 shadow-2xs"
                title={b.description}
              >
                <span>{b.icon}</span>
                <span>{b.name}</span>
                {b.durationBattles !== undefined && (
                  <span className="bg-amber-800 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                    {b.durationBattles} {b.durationBattles === 1 ? 'boj' : 'boje'}
                  </span>
                )}
                {b.durationDays !== undefined && (
                  <span className="bg-amber-800 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                    {b.durationDays} den
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 3. Location & Navigation Card */}
      <div className="bg-[#f9f6e6]/80 backdrop-blur-md border border-amber-900/20 rounded-2xl p-3.5 shadow-md flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <MapPin size={16} className="text-amber-800 shrink-0" />
            <span className="font-cinzel font-bold text-sm text-amber-950 truncate">
              {currentRegion || 'Divočina Aelthgardu'}
            </span>
          </div>
          <span className="text-[10px] font-cinzel font-bold px-2 py-0.5 rounded-full bg-amber-200/80 border border-amber-900/20 text-amber-900 uppercase">
            {locationType === 'mesto' ? 'Město' : locationType === 'vesnice' ? 'Vesnice' : 'Divočina'}
          </span>
        </div>

        {pointsOfInterest.length > 0 && (
          <div className="text-xs text-amber-900/80 font-lora">
            <span className="font-bold text-amber-950">Význačná místa: </span>
            {pointsOfInterest.join(', ')}
          </div>
        )}

        {/* Direct Action Hub */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={onOpenMap}
            className="py-1.5 px-2.5 bg-amber-100 hover:bg-amber-200/80 border border-amber-900/20 rounded-xl font-cinzel font-bold text-xs text-amber-950 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Map size={14} className="text-amber-800" />
            <span>Mapa světa</span>
          </button>
          
          <button
            onClick={onOpenInventory}
            className="py-1.5 px-2.5 bg-amber-100 hover:bg-amber-200/80 border border-amber-900/20 rounded-xl font-cinzel font-bold text-xs text-amber-950 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Package size={14} className="text-amber-800" />
            <span>Batoh & Výbava</span>
          </button>

          <button
            onClick={onOpenCamp}
            className="py-1.5 px-2.5 bg-amber-100 hover:bg-amber-200/80 border border-amber-900/20 rounded-xl font-cinzel font-bold text-xs text-amber-950 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Flame size={14} className="text-amber-600" />
            <span>Tábořiště</span>
          </button>

          {isInTown ? (
            <button
              onClick={onOpenTownServices}
              className="py-1.5 px-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-cinzel font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer animate-pulse"
            >
              <ShoppingBag size={14} />
              <span>Tržnice & Kovář</span>
            </button>
          ) : (
            <button
              onClick={onOpenQuests}
              className="py-1.5 px-2.5 bg-amber-100 hover:bg-amber-200/80 border border-amber-900/20 rounded-xl font-cinzel font-bold text-xs text-amber-950 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <ScrollText size={14} className="text-amber-800" />
              <span>Kniha úkolů</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. Active Quests Tracker Card */}
      <div className="bg-[#f9f6e6]/80 backdrop-blur-md border border-amber-900/20 rounded-2xl p-4 shadow-md flex-1 min-h-[160px] flex flex-col">
        <div className="flex items-center justify-between border-b border-amber-900/15 pb-2 mb-2.5">
          <div className="flex items-center gap-1.5 font-cinzel font-bold text-xs text-amber-950 uppercase tracking-wider">
            <ScrollText size={14} className="text-amber-800" />
            <span>Sledované úkoly</span>
          </div>
          <button
            onClick={onOpenQuests}
            className="text-[11px] font-cinzel font-bold text-amber-800 hover:text-amber-950 flex items-center gap-0.5 transition"
          >
            <span>Všechny ({activeQuests.length})</span>
            <ChevronRight size={12} />
          </button>
        </div>

        {activeQuests.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center p-4 text-xs font-lora italic text-amber-900/60">
            Žádné aktivní úkoly. Prozkoumej okolí nebo promluv s obyvateli.
          </div>
        ) : (
          <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar flex-1 pr-1">
            {activeQuests.slice(0, 3).map((quest, idx) => (
              <div 
                key={quest.id || idx}
                onClick={onOpenQuests}
                className="bg-white/60 hover:bg-white/90 border border-amber-900/15 hover:border-amber-600/50 p-2.5 rounded-xl transition cursor-pointer shadow-2xs"
              >
                <div className="flex items-start justify-between gap-1.5">
                  <h4 className="font-cinzel font-bold text-xs text-amber-950 leading-tight truncate">
                    {quest.nazev || quest.title || 'Neznámý úkol'}
                  </h4>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1" />
                </div>
                {(quest.popis || quest.cile) && (
                  <p className="text-[11px] text-amber-900/80 font-lora line-clamp-2 mt-1 leading-snug">
                    {quest.cile || quest.popis}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </aside>
  );
};
