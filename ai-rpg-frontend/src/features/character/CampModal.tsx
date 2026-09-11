import React, { useState } from 'react';
import { 
  X, Flame, Moon, Heart, Sparkles, Drumstick, ShieldAlert, 
  CheckCircle2, AlertTriangle, Coffee, Hammer, FlaskConical, 
  PackageCheck, Binoculars, Coins, Tent, Sparkle
} from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { CAMP_UPGRADES } from '../../data/campUpgrades';

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
    currentRegion,
    gold,
    setGold,
    inventory,
    setInventory,
    safehouse,
    setSafehouse,
    day,
    addBuff,
    setConsequenceToast
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<'rest' | 'upgrades'>('rest');
  const [resting, setResting] = useState(false);
  const [restFeedback, setRestFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentUpgrades = safehouse?.upgrades || [];
  const hasSupplyStash = currentUpgrades.includes('supply_stash');
  const hasBlacksmith = currentUpgrades.includes('blacksmith_forge');
  const hasScoutPost = currentUpgrades.includes('scout_post');
  const hasAlchemist = currentUpgrades.includes('alchemist_bench');

  const isSafeZone = ['mesto', 'vesnice'].includes(locationType) || hasScoutPost;

  // Alchemist potion production calculation
  const daysSinceHarvest = (day || 1) - (safehouse?.lastHarvestDay || 0);
  const canHarvestPotion = hasAlchemist && daysSinceHarvest >= 2;

  const handleHarvestPotion = () => {
    if (!canHarvestPotion) return;
    const potionItem = {
      id: `potion_alch_${Date.now()}`,
      name: 'Domácí bylinný lektvar',
      desc: 'Čerstvě uvařený lektvar z alchymistické lavice v tvém táboře.',
      description: 'Čerstvě uvařený lektvar z alchymistické lavice v tvém táboře.',
      type: 'lektvar',
      slot: 'žádný',
      rarity: 'common',
      icon: 'Potion',
      sell_price: 12,
      healing_amount: 25,
      attack_bonus: 0,
      defense_bonus: 0
    };

    setInventory((inv: any[]) => [...inv, potionItem]);
    setSafehouse((prev) => ({
      ...prev,
      lastHarvestDay: day || 1
    }));
    setConsequenceToast({ text: '🧪 Vyzvedl jsi čerstvě uvařený Domácí bylinný lektvar (+25 HP)!' });
  };

  const handlePurchaseUpgrade = (upgradeId: string) => {
    const upgrade = CAMP_UPGRADES[upgradeId];
    if (!upgrade) return;
    if (currentUpgrades.includes(upgradeId)) return;
    if (gold < upgrade.cost) {
      setRestFeedback(`Nedostatek zlaťáků! Potřebuješ ${upgrade.cost} 🪙.`);
      setTimeout(() => setRestFeedback(null), 2500);
      return;
    }

    setGold((g: number) => g - upgrade.cost);
    const updatedUpgrades = [...currentUpgrades, upgradeId];
    setSafehouse((prev) => ({
      ...prev,
      upgrades: updatedUpgrades,
      level: Math.max(prev?.level || 1, Math.floor(updatedUpgrades.length / 2) + 1)
    }));

    setConsequenceToast({
      text: `⛺ V táboře bylo postaveno: ${upgrade.name}!`,
      delta: -upgrade.cost
    });
  };

  const handleRest = (type: 'short' | 'long') => {
    // If player has supply stash, long rest costs 1 ration instead of 2!
    let requiredRations = type === 'short' ? 1 : 2;
    if (type === 'long' && hasSupplyStash) {
      requiredRations = 1;
    }

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
          setRestFeedback(`Dlouhý odpočinek dokončen: Plné zdraví (${maxHp} HP), plná kouzla, -${foodToConsume} jídla.`);
        }

        // Apply Blacksmith Buff if unlocked
        if (hasBlacksmith) {
          addBuff({
            id: 'camp_sharp_steel',
            name: 'Broušená ocel',
            icon: '⚔️',
            description: '+1 k fyzickému zranění díky údržbě na polní kovadlině.',
            type: 'damage',
            value: 1,
            durationBattles: 3,
            source: 'camp'
          });
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

  const getUpgradeIcon = (iconName: string) => {
    switch (iconName) {
      case 'FlaskConical': return <FlaskConical size={20} className="text-emerald-600 dark:text-emerald-400" />;
      case 'Hammer': return <Hammer size={20} className="text-amber-600 dark:text-amber-400" />;
      case 'PackageCheck': return <PackageCheck size={20} className="text-amber-700 dark:text-amber-300" />;
      case 'Binoculars': return <Binoculars size={20} className="text-sky-600 dark:text-sky-400" />;
      default: return <Sparkle size={20} className="text-amber-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="w-full max-w-xl bg-[#faf6ea] dark:bg-[#121823] bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] rounded-2xl border-4 border-amber-950/80 dark:border-amber-500/40 shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-[#e2d9c8] max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 py-3.5 flex justify-between items-center border-b-2 border-amber-900/20 dark:border-amber-500/20 bg-amber-950 dark:bg-[#0b0f16] text-amber-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 dark:bg-amber-950/60 rounded-xl border border-amber-500/40 text-amber-400">
              <Flame size={24} className="animate-pulse" />
            </div>
            <div>
              <h2 className="font-cinzel font-bold text-lg sm:text-xl text-amber-200 dark:text-amber-300 tracking-wide">
                Tábor & Útočiště
              </h2>
              <p className="text-xs font-lora text-amber-300/80 dark:text-amber-400/80">
                {currentRegion} • {isSafeZone ? 'Bezpečná zóna' : 'Tábor v divočině'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            disabled={resting}
            className="text-amber-300/70 dark:text-slate-400 hover:text-amber-100 dark:hover:text-amber-300 p-1.5 rounded-xl hover:bg-amber-900/40 dark:hover:bg-[#1c2637] transition cursor-pointer"
            title="Zavřít"
          >
            <X size={22} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-amber-900/20 dark:border-amber-500/20 bg-amber-900/10 dark:bg-[#161f2e] text-xs font-cinzel font-bold">
          <button
            onClick={() => setActiveTab('rest')}
            className={`flex-1 py-2.5 flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'rest' 
                ? 'border-b-2 border-amber-700 dark:border-amber-400 text-amber-950 dark:text-amber-300 bg-amber-100/60 dark:bg-[#1c273a]' 
                : 'text-slate-600 dark:text-slate-400 hover:text-amber-900 dark:hover:text-amber-200'
            }`}
          >
            <Flame size={15} />
            <span>Odpočinek u ohně</span>
          </button>
          <button
            onClick={() => setActiveTab('upgrades')}
            className={`flex-1 py-2.5 flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'upgrades' 
                ? 'border-b-2 border-amber-700 dark:border-amber-400 text-amber-950 dark:text-amber-300 bg-amber-100/60 dark:bg-[#1c273a]' 
                : 'text-slate-600 dark:text-slate-400 hover:text-amber-900 dark:hover:text-amber-200'
            }`}
          >
            <Tent size={15} />
            <span>Vylepšení Útočiště ({currentUpgrades.length}/4)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-4 font-lora overflow-y-auto max-h-[calc(90vh-140px)]">
          {activeTab === 'rest' ? (
            <>
              {/* Zone status banner */}
              <div className={`p-3 rounded-xl border flex items-center gap-3 text-xs leading-relaxed ${
                isSafeZone 
                  ? 'bg-emerald-900/10 dark:bg-emerald-950/40 border-emerald-700/30 dark:border-emerald-500/30 text-emerald-950 dark:text-emerald-300' 
                  : 'bg-amber-900/10 dark:bg-amber-950/40 border-amber-700/30 dark:border-amber-500/30 text-amber-950 dark:text-amber-300'
              }`}>
                {isSafeZone ? (
                  <CheckCircle2 size={20} className="text-emerald-700 dark:text-emerald-400 shrink-0" />
                ) : (
                  <ShieldAlert size={20} className="text-amber-700 dark:text-amber-400 shrink-0" />
                )}
                <div>
                  <strong className="font-cinzel block text-xs">
                    {hasScoutPost ? 'Chráněný tábor (Strážní vyhlídka)' : isSafeZone ? 'Chráněná osada / Hostinec' : 'Tábořiště v neprobádané krajině'}
                  </strong>
                  <span>
                    {isSafeZone 
                      ? 'Zde můžeš v klidu odpočívat bez obav z nočního přepadení.' 
                      : 'V divočině je potřeba udržovat oheň a hlídky. Hrozí probuzení nočními monstry.'}
                  </span>
                </div>
              </div>

              {/* Current Player Resources */}
              <div className="grid grid-cols-3 gap-2 py-2 text-center text-xs font-cinzel font-bold border-y border-amber-900/15 dark:border-amber-500/20">
                <div className="p-2 bg-amber-900/5 dark:bg-[#141c28] rounded-lg border border-amber-900/10 dark:border-amber-500/20">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 block uppercase">Zdraví</span>
                  <span className="text-sm text-red-700 dark:text-red-400 flex items-center justify-center gap-1 mt-0.5">
                    <Heart size={14} /> {hp} / {maxHp}
                  </span>
                </div>
                <div className="p-2 bg-amber-900/5 dark:bg-[#141c28] rounded-lg border border-amber-900/10 dark:border-amber-500/20">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 block uppercase">Kouzla</span>
                  <span className="text-sm text-sky-700 dark:text-sky-400 flex items-center justify-center gap-1 mt-0.5">
                    <Sparkles size={14} /> {currentSpellSlots} / {maxSpellSlots}
                  </span>
                </div>
                <div className="p-2 bg-amber-900/5 dark:bg-[#141c28] rounded-lg border border-amber-900/10 dark:border-amber-500/20">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 block uppercase">Zásoby</span>
                  <span className={`text-sm flex items-center justify-center gap-1 mt-0.5 ${rations > 0 ? 'text-amber-900 dark:text-amber-300' : 'text-red-700 dark:text-red-400 font-black'}`}>
                    <Drumstick size={14} /> {rations} ks
                  </span>
                </div>
              </div>

              {/* Active Camp Perks indicators */}
              {(hasSupplyStash || hasBlacksmith) && (
                <div className="flex flex-wrap gap-2 text-[11px] font-cinzel font-bold">
                  {hasSupplyStash && (
                    <span className="px-2 py-0.5 bg-amber-200/60 dark:bg-amber-950/60 border border-amber-600/30 text-amber-900 dark:text-amber-300 rounded-md flex items-center gap-1">
                      <PackageCheck size={12} /> Zásobárna: Dlouhý odpočinek stojí jen 1 jídlo
                    </span>
                  )}
                  {hasBlacksmith && (
                    <span className="px-2 py-0.5 bg-amber-200/60 dark:bg-amber-950/60 border border-amber-600/30 text-amber-900 dark:text-amber-300 rounded-md flex items-center gap-1">
                      <Hammer size={12} /> Kovárna: Odpočinek přidá buff Broušená ocel (+1 útok)
                    </span>
                  )}
                </div>
              )}

              {/* Rest Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Option A: Short Rest */}
                <div className="bg-[#f5ede0] dark:bg-[#141c28] border-2 border-amber-900/25 dark:border-amber-500/25 rounded-xl p-3.5 flex flex-col justify-between gap-3 shadow-sm hover:border-amber-800 dark:hover:border-amber-500 transition">
                  <div>
                    <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-400 font-cinzel font-bold text-sm mb-1">
                      <Coffee size={16} />
                      <span>Krátký odpočinek</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug">
                      Hodina ošetření ran u ohně. Obnoví <strong>35 % HP</strong> a <strong>1 kouzelný slot</strong>.
                    </p>
                    <div className="mt-2 text-[11px] font-bold text-amber-950 dark:text-amber-200 bg-amber-900/10 dark:bg-amber-950/60 px-2 py-0.5 rounded inline-block">
                      Náklad: 1 jídlo • 1 hodina
                    </div>
                  </div>

                  <button
                    onClick={() => handleRest('short')}
                    disabled={resting}
                    className="w-full py-2 bg-amber-900 hover:bg-amber-950 dark:bg-amber-700 dark:hover:bg-amber-600 text-amber-100 rounded-lg font-cinzel font-bold text-xs tracking-wider transition shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {resting ? 'Odpočíváš...' : 'Rozdělat oheň (1h)'}
                  </button>
                </div>

                {/* Option B: Long Rest */}
                <div className="bg-[#f5ede0] dark:bg-[#141c28] border-2 border-amber-900/25 dark:border-amber-500/25 rounded-xl p-3.5 flex flex-col justify-between gap-3 shadow-sm hover:border-amber-800 dark:hover:border-amber-500 transition">
                  <div>
                    <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-400 font-cinzel font-bold text-sm mb-1">
                      <Moon size={16} />
                      <span>Dlouhý spánek</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug">
                      Celonoční spánek (8h). <strong>Plná obnova všech HP</strong> a <strong>všech kouzelných slotů</strong>.
                    </p>
                    <div className="mt-2 text-[11px] font-bold text-amber-950 dark:text-amber-200 bg-amber-900/10 dark:bg-amber-950/60 px-2 py-0.5 rounded inline-block">
                      Náklad: {hasSupplyStash ? '1 jídlo (sleva z udírny)' : '2 jídla'} • 8 hodin
                    </div>
                  </div>

                  <button
                    onClick={() => handleRest('long')}
                    disabled={resting}
                    className="w-full py-2 bg-amber-950 hover:bg-black dark:bg-[#1c2637] dark:hover:bg-[#25334a] text-amber-200 dark:text-amber-300 border border-amber-700/40 dark:border-amber-500/40 rounded-lg font-cinzel font-bold text-xs tracking-wider transition shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {resting ? 'Spíš...' : 'Ulehnout ke spánku (8h)'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Upgrades Safehouse Header */}
              <div className="p-3 bg-amber-100/60 dark:bg-[#161f2e] border border-amber-900/20 dark:border-amber-500/30 rounded-xl flex items-center justify-between">
                <div>
                  <h3 className="font-cinzel font-bold text-sm text-amber-950 dark:text-amber-200">
                    Útočiště dobrodruha (Úroveň {safehouse?.level || 1})
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Postav stálé budovy v táboře pro trvalé pasivní bonusy a zásoby.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 font-cinzel font-bold text-amber-900 dark:text-amber-300 bg-amber-200/60 dark:bg-black/40 px-2.5 py-1 rounded-lg text-xs">
                  <Coins size={14} className="text-yellow-600" />
                  <span>{gold} Zl.</span>
                </div>
              </div>

              {/* Alchemist Harvesting Widget */}
              {hasAlchemist && (
                <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                  canHarvestPotion 
                    ? 'bg-emerald-100/80 dark:bg-emerald-950/50 border-emerald-600/40 text-emerald-950 dark:text-emerald-200' 
                    : 'bg-slate-100 dark:bg-slate-900/50 border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <FlaskConical size={20} className={canHarvestPotion ? 'text-emerald-600 animate-bounce' : 'text-slate-400'} />
                    <div>
                      <div className="font-cinzel font-bold text-xs">
                        {canHarvestPotion ? '🧪 Lektvar je připraven k vyzvednutí!' : '🧪 Alchymistická lavice vaří lektvar...'}
                      </div>
                      <div className="text-[11px]">
                        {canHarvestPotion 
                          ? 'Varný kotlík dokončil várku bylinného lektvaru (+25 HP).' 
                          : `Další lektvar bude hotový za ${Math.max(1, 2 - daysSinceHarvest)} den/dny.`}
                      </div>
                    </div>
                  </div>
                  {canHarvestPotion && (
                    <button
                      onClick={handleHarvestPotion}
                      className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-cinzel font-bold text-xs shadow-sm transition cursor-pointer"
                    >
                      Vyzvednout
                    </button>
                  )}
                </div>
              )}

              {/* List of Camp Upgrades */}
              <div className="space-y-3 pt-1">
                {Object.values(CAMP_UPGRADES).map((upgrade) => {
                  const isBuilt = currentUpgrades.includes(upgrade.id);
                  const canAfford = gold >= upgrade.cost;

                  return (
                    <div 
                      key={upgrade.id}
                      className={`p-3.5 rounded-xl border-2 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                        isBuilt
                          ? 'bg-amber-500/10 dark:bg-[#141d2a] border-emerald-600/40 dark:border-emerald-500/40'
                          : 'bg-[#f5ede0] dark:bg-[#141c28] border-amber-900/20 dark:border-amber-500/20 hover:border-amber-700 dark:hover:border-amber-500'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 bg-white dark:bg-[#1b2535] rounded-xl border border-amber-900/15 dark:border-amber-500/25 shadow-xs shrink-0">
                          {getUpgradeIcon(upgrade.iconName)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-cinzel font-bold text-sm text-amber-950 dark:text-amber-200">
                              {upgrade.name}
                            </h4>
                            <span className="text-[10px] font-cinzel font-bold px-1.5 py-0.2 bg-amber-200/60 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 rounded border border-amber-900/10">
                              {upgrade.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 leading-snug">
                            {upgrade.description}
                          </p>
                          <p className="text-[11px] italic text-slate-500 dark:text-slate-400 mt-1">
                            "{upgrade.flavor}"
                          </p>
                        </div>
                      </div>

                      <div className="w-full sm:w-auto shrink-0 flex items-center justify-end">
                        {isBuilt ? (
                          <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-cinzel font-bold text-xs bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-600/30">
                            <CheckCircle2 size={14} />
                            <span>Postaveno</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handlePurchaseUpgrade(upgrade.id)}
                            disabled={!canAfford}
                            className={`w-full sm:w-auto px-3.5 py-1.5 rounded-lg font-cinzel font-bold text-xs transition shadow-sm flex items-center justify-center gap-1.5 ${
                              canAfford
                                ? 'bg-amber-800 hover:bg-amber-700 text-white cursor-pointer'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-300 dark:border-slate-700'
                            }`}
                          >
                            <Coins size={13} className="text-yellow-400" />
                            <span>Postavit ({upgrade.cost} Zl.)</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Feedback notification banner */}
          {restFeedback && (
            <div className="p-3 bg-emerald-950 text-emerald-100 rounded-xl text-center text-xs font-cinzel font-bold border border-emerald-500 animate-fade-in shadow-lg">
              {restFeedback}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t-2 border-amber-900/20 dark:border-amber-500/20 bg-amber-900/5 dark:bg-amber-950/20 flex justify-between items-center text-xs font-lora text-slate-700 dark:text-slate-400">
          <span>Aelthgard • Přežití a táboření</span>
          <button
            onClick={onClose}
            disabled={resting}
            className="px-4 py-1.5 bg-amber-900/20 dark:bg-amber-950/40 hover:bg-amber-900/30 dark:hover:bg-amber-900/60 text-amber-950 dark:text-amber-200 rounded-xl font-cinzel font-bold text-xs tracking-wider transition cursor-pointer"
          >
            Odejít z tábora
          </button>
        </div>

      </div>
    </div>
  );
};
