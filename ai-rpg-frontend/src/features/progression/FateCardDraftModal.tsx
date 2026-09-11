'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, RefreshCw, Flame, Shield, Skull, Sun, 
  Music, Compass, ShieldAlert, Zap, Ghost, Trees, 
  Wind, MessageSquare, Eye, Heart, Moon, Coins, Info, Check
} from 'lucide-react';
import { FateCard, getRandomFateCardDraft } from '@/data/fateCards';
import { useGameStore } from '@/store/gameStore';

// Helper to map card icon name to Lucide component
function renderCardIcon(iconName: string, size = 32) {
  switch (iconName) {
    case 'Flame': return <Flame size={size} className="text-orange-400" />;
    case 'Shield': return <Shield size={size} className="text-cyan-400" />;
    case 'Skull': return <Skull size={size} className="text-emerald-400" />;
    case 'Sparkles': return <Sparkles size={size} className="text-amber-300" />;
    case 'Sun': return <Sun size={size} className="text-yellow-400" />;
    case 'Music': return <Music size={size} className="text-pink-400" />;
    case 'Compass': return <Compass size={size} className="text-teal-400" />;
    case 'ShieldAlert': return <ShieldAlert size={size} className="text-yellow-300" />;
    case 'Zap': return <Zap size={size} className="text-amber-400" />;
    case 'Ghost': return <Ghost size={size} className="text-purple-400" />;
    case 'Trees': return <Trees size={size} className="text-emerald-500" />;
    case 'Wind': return <Wind size={size} className="text-sky-300" />;
    case 'MessageSquare': return <MessageSquare size={size} className="text-blue-300" />;
    case 'Eye': return <Eye size={size} className="text-indigo-400" />;
    case 'Heart': return <Heart size={size} className="text-rose-400" />;
    case 'Moon': return <Moon size={size} className="text-indigo-300" />;
    case 'Coins': return <Coins size={size} className="text-yellow-400" />;
    default: return <Sparkles size={size} className="text-amber-300" />;
  }
}

export const FateCardDraftModal: React.FC = () => {
  const { 
    fateDraftOpen, setFateDraftOpen, 
    activeDraftCards, setActiveDraftCards, 
    addPerk, perks, dndClass, level,
    rerollsAvailable, setRerollsAvailable
  } = useGameStore();

  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<FateCard | null>(null);
  const [isRerolling, setIsRerolling] = useState(false);

  if (!fateDraftOpen || !activeDraftCards || activeDraftCards.length === 0) {
    return null;
  }

  const handleSelect = (card: FateCard) => {
    setSelectedCard(card);
    setTimeout(() => {
      addPerk(card);
      setSelectedCard(null);
      setFateDraftOpen(false);
    }, 400);
  };

  const handleReroll = () => {
    if (rerollsAvailable <= 0 || isRerolling) return;
    setIsRerolling(true);
    setRerollsAvailable(r => Math.max(0, r - 1));

    const ownedIds = perks.map(p => p.id);
    const newDraft = getRandomFateCardDraft(dndClass, ownedIds, 3);

    setTimeout(() => {
      setActiveDraftCards(newDraft);
      setIsRerolling(false);
    }, 300);
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return { text: 'LEGENDÁRNÍ', border: 'border-yellow-500/80 shadow-[0_0_25px_rgba(234,179,8,0.35)]', bg: 'bg-gradient-to-b from-yellow-950/90 via-slate-900 to-black', textCol: 'text-amber-400' };
      case 'epic':
        return { text: 'EPICKÁ', border: 'border-purple-500/80 shadow-[0_0_20px_rgba(168,85,247,0.3)]', bg: 'bg-gradient-to-b from-purple-950/90 via-slate-900 to-black', textCol: 'text-purple-300' };
      case 'rare':
        return { text: 'VZÁCNÁ', border: 'border-blue-500/80 shadow-[0_0_15px_rgba(59,130,246,0.25)]', bg: 'bg-gradient-to-b from-blue-950/90 via-slate-900 to-black', textCol: 'text-blue-300' };
      default:
        return { text: 'BĚŽNÁ', border: 'border-slate-600 shadow-md', bg: 'bg-gradient-to-b from-slate-900/90 via-slate-950 to-black', textCol: 'text-slate-300' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-5xl flex flex-col items-center gap-6 my-auto text-amber-100 font-cinzel select-none"
      >
        {/* Header Title */}
        <div className="text-center flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2 text-amber-400 text-xs tracking-widest font-bold uppercase bg-amber-950/40 px-3 py-1 rounded-full border border-amber-600/30">
            <Sparkles size={14} className="animate-spin text-amber-400" />
            Krize Osudu • Dosažena {level}. Úroveň
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 drop-shadow-md">
            Znamení Přediva Osudu
          </h2>
          <p className="text-xs sm:text-sm font-lora text-amber-200/70 max-w-lg">
            Zvol si jednu cestu, kterou se tvá bytost promění. Toto rozhodnutí je trvalé a ovlivní tvůj boj i příběh.
          </p>
        </div>

        {/* 3 Fate Cards Draft */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl px-2">
          {activeDraftCards.map((card, idx) => {
            const badge = getRarityBadge(card.rarity);
            const isHovered = hoveredCardId === card.id;
            const isChosen = selectedCard?.id === card.id;

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.15 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onMouseEnter={() => setHoveredCardId(card.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                onClick={() => handleSelect(card)}
                className={`relative flex flex-col justify-between rounded-2xl border-2 p-5 cursor-pointer transition-all duration-300 ${badge.border} ${badge.bg} ${isChosen ? 'ring-4 ring-amber-400 scale-105' : ''}`}
                style={{ minHeight: '430px' }}
              >
                {/* Top Badge: Rarity & Tag */}
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded-md bg-black/60 border border-white/10 ${badge.textCol}`}>
                    {badge.text}
                  </span>
                  <span className="text-[10px] font-bold text-amber-300/80 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-600/30">
                    {card.tag}
                  </span>
                </div>

                {/* Card Icon & Name */}
                <div className="flex flex-col items-center text-center gap-3 my-2">
                  <div className="w-16 h-16 rounded-2xl bg-black/50 border border-amber-500/30 flex items-center justify-center shadow-inner">
                    {renderCardIcon(card.icon, 34)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-amber-100 tracking-wide">
                      {card.name}
                    </h3>
                    {card.classReq && (
                      <span className="text-[11px] font-lora italic text-amber-400/80">
                        Pouze pro: {card.classReq}
                      </span>
                    )}
                  </div>
                </div>

                {/* Short Description */}
                <div className="bg-black/40 border border-white/5 rounded-xl p-3 my-2 text-center">
                  <p className="text-xs font-lora text-amber-100/90 leading-relaxed">
                    {card.shortDesc}
                  </p>
                </div>

                {/* Flavor Lore */}
                <p className="text-[11px] font-lora italic text-amber-200/50 text-center px-1 mb-3">
                  {card.flavorText}
                </p>

                {/* Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(card);
                  }}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-1.5 ${
                    card.rarity === 'legendary' 
                      ? 'bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950'
                      : 'bg-amber-900/60 hover:bg-amber-800 text-amber-200 border border-amber-600/40'
                  }`}
                >
                  <Check size={14} /> Přijmout Znamení
                </button>

                {/* Interactive Tooltip on Hover/Tap */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute left-0 right-0 -bottom-2 translate-y-full z-30 p-3 bg-[#0d121c] border-2 border-amber-500/50 rounded-xl shadow-2xl text-left flex flex-col gap-1.5 text-xs pointer-events-none"
                    >
                      <div className="flex items-center gap-1.5 text-amber-400 font-bold border-b border-amber-500/20 pb-1">
                        <Info size={13} /> Podrobný rozbor Znamení
                      </div>
                      <div>
                        <span className="font-bold text-amber-300">⚔️ Mechanika: </span>
                        <span className="font-lora text-slate-300">{card.mechanicsDetail}</span>
                      </div>
                      <div>
                        <span className="font-bold text-blue-300">📜 Kampaň & Offline: </span>
                        <span className="font-lora text-slate-300">{card.offlineEffectDesc}</span>
                      </div>
                      <div>
                        <span className="font-bold text-emerald-300">💡 Synergie: </span>
                        <span className="font-lora text-slate-300">{card.synergyTip}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Reroll Button */}
        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={handleReroll}
            disabled={rerollsAvailable <= 0 || isRerolling}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-amber-300 border border-amber-600/30 hover:border-amber-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg cursor-pointer"
          >
            <RefreshCw size={15} className={isRerolling ? 'animate-spin' : ''} />
            <span>Zamíchat Osud (Zbývá: {rerollsAvailable})</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
