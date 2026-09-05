import React, { useState } from 'react';
import { X, Flame, Moon, Sun, Heart, Sparkles, Drumstick, ShieldAlert, CheckCircle2, AlertTriangle, Coffee } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

interface CampModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestComplete?: (restType: 'short' | 'long', foodUsed: number, hpGained: number, slotsGained: number) => void;
}

export const CampModal: React.FC<CampModalProps> = ({ isOpen, onClose, onRestComplete }) => {
  const { 
    hp, 
    setHp, 
    maxHp, 
    rations, 
    setRations, 
    currentSpellSlots, 
    setCurrentSpellSlots, 
    maxSpellSlots, 
    locationType,
    currentRegion 
  } = useGameStore();

  const [resting, setResting] = useState(false);
  const [restFeedback, setRestFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const isSafeZone = ['mesto', 'vesnice'].includes(locationType);

  const handleRest = (type: 'short' | 'long') => {
    const requiredRations = type === 'short' ? 1 : 2;
    const hasEnoughFood = rations >= requiredRations;
    const foodToConsume = hasEnoughFood ? requiredRations : rations;

    setResting(true);

    setTimeout(() => {
      let hpHealed = 0;
      let slotsHealed = 0;

      if (hasEnoughFood) {
        setRations((r: number) => Math.max(0, r - foodToConsume));
        if (type === 'short') {
          const healAmount = Math.max(25, Math.floor(maxHp * 0.35));
          const newHp = Math.min(maxHp, hp + healAmount);
          hpHealed = newHp - hp;
          setHp(newHp);

          if (maxSpellSlots > 0 && currentSpellSlots < maxSpellSlots) {
            slotsHealed = 1;
            setCurrentSpellSlots((s: number) => Math.min(maxSpellSlots, s + 1));
          }
          setRestFeedback(`Krátký odpočinek dokončen: +${hpHealed} HP, +${slotsHealed} kouzelný slot, -${foodToConsume} jídlo.`);
        } else {
          hpHealed = maxHp - hp;
          setHp(maxHp);
          slotsHealed = maxSpellSlots - currentSpellSlots;
          setCurrentSpellSlots(maxSpellSlots);
          setRestFeedback(`Dlouhý odpočinek dokončen: Plné zdraví (${maxHp} HP), plné kouzla, -${foodToConsume} jídla.`);
        }
      } else {
        // Starvation / insufficient food penalty
        if (rations > 0) setRations(0);
        const slightHeal = 10;
        const newHp = Math.min(maxHp, hp + slightHeal);
        hpHealed = newHp - hp;
        setHp(newHp);
        setRestFeedback(`Odpočinek nalačno: Nedostatek jídla! Tělo zregenerovalo pouze +${hpHealed} HP a probouzíš se hladový.`);
      }

      setResting(false);
      if (onRestComplete) {
        onRestComplete(type, foodToConsume, hpHealed, slotsHealed);
      }
      setTimeout(() => {
        setRestFeedback(null);
        onClose();
      }, 1400);
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="w-full max-w-lg bg-[#faf6ea] bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] rounded-2xl border-4 border-amber-950/80 shadow-2xl overflow-hidden flex flex-col text-slate-900">
        
        {/* Header */}
        <div className="px-5 py-4 flex justify-between items-center border-b-2 border-amber-900/20 bg-amber-950 text-amber-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-xl border border-amber-500/40 text-amber-400">
              <Flame size={24} className="animate-pulse" />
            </div>
            <div>
              <h2 className="font-cinzel font-bold text-xl text-amber-200 tracking-wide">
                Táboření a Odpočinek
              </h2>
              <p className="text-xs font-lora text-amber-300/80">
                {currentRegion} • {isSafeZone ? 'Bezpečná zóna' : 'Tábor v divočině'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            disabled={resting}
            className="text-amber-300/70 hover:text-amber-100 p-1.5 rounded-xl hover:bg-amber-900/40 transition cursor-pointer"
            title="Zavřít"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 font-lora">
          {/* Zone status banner */}
          <div className={`p-3 rounded-xl border flex items-center gap-3 text-xs leading-relaxed ${
            isSafeZone 
              ? 'bg-emerald-900/10 border-emerald-700/30 text-emerald-950' 
              : 'bg-amber-900/10 border-amber-700/30 text-amber-950'
          }`}>
            {isSafeZone ? (
              <CheckCircle2 size={20} className="text-emerald-700 shrink-0" />
            ) : (
              <ShieldAlert size={20} className="text-amber-700 shrink-0" />
            )}
            <div>
              <strong className="font-cinzel block text-xs">
                {isSafeZone ? 'Chráněná osada / Hostinec' : 'Tábořiště v neprobádané krajině'}
              </strong>
              <span>
                {isSafeZone 
                  ? 'Zde můžeš v klidu odpočívat bez obav z přepadení hlídkami či šelmami.' 
                  : 'V divočině je potřeba udržovat oheň a hlídky. Hrozí probuzení nočními monstry.'}
              </span>
            </div>
          </div>

          {/* Current Player Resources */}
          <div className="grid grid-cols-3 gap-2 py-2 text-center text-xs font-cinzel font-bold border-y border-amber-900/15">
            <div className="p-2 bg-amber-900/5 rounded-lg border border-amber-900/10">
              <span className="text-[10px] text-slate-600 block uppercase">Zdraví</span>
              <span className="text-sm text-red-700 flex items-center justify-center gap-1 mt-0.5">
                <Heart size={14} /> {hp} / {maxHp}
              </span>
            </div>
            <div className="p-2 bg-amber-900/5 rounded-lg border border-amber-900/10">
              <span className="text-[10px] text-slate-600 block uppercase">Kouzla</span>
              <span className="text-sm text-sky-700 flex items-center justify-center gap-1 mt-0.5">
                <Sparkles size={14} /> {currentSpellSlots} / {maxSpellSlots}
              </span>
            </div>
            <div className="p-2 bg-amber-900/5 rounded-lg border border-amber-900/10">
              <span className="text-[10px] text-slate-600 block uppercase">Zásoby</span>
              <span className={`text-sm flex items-center justify-center gap-1 mt-0.5 ${rations > 0 ? 'text-amber-900' : 'text-red-700 font-black'}`}>
                <Drumstick size={14} /> {rations} ks
              </span>
            </div>
          </div>

          {/* Low food warning */}
          {rations < 2 && (
            <div className="p-2.5 bg-amber-100 border border-amber-700/30 rounded-lg text-xs text-amber-950 flex items-center gap-2 font-medium">
              <AlertTriangle size={16} className="text-amber-700 shrink-0" />
              <span>
                {rations === 1 
                  ? 'Zbývá ti pouze 1 zásoba jídla – stačí na Krátký odpočinek.' 
                  : 'Nemáš žádné jídlo! Odpočinek nalačno tě zcela nevyléčí a hrozí vyčerpání.'}
              </span>
            </div>
          )}

          {/* Rest Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Option A: Short Rest */}
            <div className="bg-[#f5ede0] border-2 border-amber-900/25 rounded-xl p-3.5 flex flex-col justify-between gap-3 shadow-sm hover:border-amber-800 transition">
              <div>
                <div className="flex items-center gap-1.5 text-amber-900 font-cinzel font-bold text-sm mb-1">
                  <Coffee size={16} />
                  <span>Krátký odpočinek</span>
                </div>
                <p className="text-xs text-slate-700 leading-snug">
                  Hodina ošetření ran u ohně. Obnoví <strong>35 % HP</strong> a <strong>1 kouzelný slot</strong>.
                </p>
                <div className="mt-2 text-[11px] font-bold text-amber-950 bg-amber-900/10 px-2 py-0.5 rounded inline-block">
                  Náklad: 1 jídlo • 1 hodina
                </div>
              </div>

              <button
                onClick={() => handleRest('short')}
                disabled={resting}
                className="w-full py-2 bg-amber-900 hover:bg-amber-950 text-amber-100 rounded-lg font-cinzel font-bold text-xs tracking-wider transition shadow-sm cursor-pointer disabled:opacity-50"
              >
                {resting ? 'Odpočíváš...' : 'Rozdělat oheň (1h)'}
              </button>
            </div>

            {/* Option B: Long Rest */}
            <div className="bg-[#f5ede0] border-2 border-amber-900/25 rounded-xl p-3.5 flex flex-col justify-between gap-3 shadow-sm hover:border-amber-800 transition">
              <div>
                <div className="flex items-center gap-1.5 text-amber-900 font-cinzel font-bold text-sm mb-1">
                  <Moon size={16} />
                  <span>Dlouhý spánek</span>
                </div>
                <p className="text-xs text-slate-700 leading-snug">
                  Celonoční spánek (8h). <strong>Plná obnova všech HP</strong> a <strong>všech kouzelných slotů</strong>.
                </p>
                <div className="mt-2 text-[11px] font-bold text-amber-950 bg-amber-900/10 px-2 py-0.5 rounded inline-block">
                  Náklad: 2 jídla • 8 hodin
                </div>
              </div>

              <button
                onClick={() => handleRest('long')}
                disabled={resting}
                className="w-full py-2 bg-amber-950 hover:bg-black text-amber-200 border border-amber-700/40 rounded-lg font-cinzel font-bold text-xs tracking-wider transition shadow-sm cursor-pointer disabled:opacity-50"
              >
                {resting ? 'Spíš...' : 'Ulehnout ke spánku (8h)'}
              </button>
            </div>
          </div>

          {/* Rest Feedback notification */}
          {restFeedback && (
            <div className="p-3 bg-emerald-950 text-emerald-100 rounded-xl text-center text-xs font-cinzel font-bold border border-emerald-500 animate-fade-in shadow-lg">
              {restFeedback}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t-2 border-amber-900/20 bg-amber-900/5 flex justify-between items-center text-xs font-lora text-slate-700">
          <span>Aelthgard • Přežití a táboření</span>
          <button
            onClick={onClose}
            disabled={resting}
            className="px-4 py-1.5 bg-amber-900/20 hover:bg-amber-900/30 text-amber-950 rounded-xl font-cinzel font-bold text-xs tracking-wider transition cursor-pointer"
          >
            Odejít od ohně
          </button>
        </div>

      </div>
    </div>
  );
};
