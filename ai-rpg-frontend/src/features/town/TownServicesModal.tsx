import React, { useState, useMemo } from 'react';
import { 
  X, ShoppingBag, Hammer, Beer, Compass, Sun, Shield, 
  Sparkles, Heart, Check, ArrowRight, Dices, ChevronRight,
  TrendingDown, TrendingUp, AlertCircle, RefreshCw
} from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { 
  TOWN_MERCHANT_STOCK, 
  BLACKSMITH_SERVICES, 
  TAVERN_SERVICES, 
  TEMPLE_SERVICES, 
  MOUNTS_CATALOG, 
  calculateBuyPrice, 
  calculateSellPrice, 
  playDragonEye, 
  DiceGameResult 
} from '../../services/economy/economyEngine';
import { ActiveBuff } from '../../services/economy/buffEngine';
import { ItemIcon } from '../../components/ui/ItemIcon';

export function translateItemType(type?: string): string {
  if (!type) return 'Předmět';
  const t = type.toLowerCase();
  if (t === 'weapon' || t === 'zbraň') return 'Zbraň';
  if (t === 'armor' || t === 'zbroj') return 'Zbroj';
  if (t === 'shield' || t === 'štít') return 'Štít';
  if (t === 'potion' || t === 'lektvar') return 'Lektvar';
  if (t === 'accessory' || t === 'doplněk') return 'Doplněk';
  if (t === 'valuable' || t === 'cennost') return 'Cennost';
  return type;
}

interface TownServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'market' | 'blacksmith' | 'tavern' | 'stables' | 'temple';

export const TownServicesModal: React.FC<TownServicesModalProps> = ({ isOpen, onClose }) => {
  const { 
    gold, 
    setGold, 
    inventory, 
    setInventory, 
    equipped, 
    hp, 
    setHp, 
    maxHp, 
    rations, 
    setRations, 
    currentSpellSlots, 
    setCurrentSpellSlots, 
    maxSpellSlots, 
    activeBuffs, 
    addBuff, 
    removeBuff, 
    activeMount, 
    setActiveMount, 
    reputation, 
    currentRegion, 
    playerLocation, 
    worldData, 
    revealHexes 
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<TabType>('market');
  const [marketMode, setMarketMode] = useState<'buy' | 'sell'>('buy');
  const [marketFilter, setMarketFilter] = useState<'all' | 'potions' | 'gear'>('all');
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  // Gambling state
  const [diceBet, setDiceBet] = useState<number>(15);
  const [diceResult, setDiceResult] = useState<DiceGameResult | null>(null);
  const [isRollingDice, setIsRollingDice] = useState<boolean>(false);

  // Determine local kingdom reputation for dynamic pricing
  const localKingdomId = useMemo(() => {
    if (!playerLocation || !worldData?.hex_grid) return null;
    const hex = worldData.hex_grid.find((h: any) => h.q === playerLocation.q && h.r === playerLocation.r);
    return hex?.kingdom_id || null;
  }, [playerLocation, worldData]);

  const currentRep = localKingdomId ? (reputation[localKingdomId] || 0) : 0;

  if (!isOpen) return null;

  const showFeedback = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 4500);
  };

  // 1. Market: Buying items
  const handleBuyItem = (itemDef: any) => {
    const price = calculateBuyPrice(itemDef.basePrice, currentRep);
    if (gold < price) {
      showFeedback(`Nemáš dostatek zlaťáků! Potřebuješ ${price} zl.`, 'error');
      return;
    }

    const maxSlots = 20 + (activeMount?.inventoryBonus || 0);
    if (inventory.length >= maxSlots) {
      showFeedback(`Tvůj batoh je plný! Maximální kapacita je ${maxSlots} položek.`, 'error');
      return;
    }

    setGold((g: number) => Math.max(0, g - price));
    
    // Create inventory item instance
    const newItem = {
      id: `${itemDef.id}_${Date.now()}`,
      name: itemDef.name,
      type: itemDef.type,
      slot: itemDef.slot,
      rarity: itemDef.rarity,
      icon: itemDef.icon,
      sell_price: itemDef.basePrice,
      desc: itemDef.desc,
      attack_bonus: itemDef.attack_bonus || 0,
      damageDice: itemDef.damageDice || null,
      defense_bonus: itemDef.defense_bonus || 0
    };

    setInventory((inv: any[]) => [...inv, newItem]);
    showFeedback(`Zakoupeno: ${itemDef.name} (-${price} 🪙)`, 'success');
  };

  // 2. Market: Selling items
  const handleSellItem = (item: any) => {
    const baseValue = item.sell_price || item.basePrice || 10;
    const payout = calculateSellPrice(baseValue, currentRep);

    // Prevent selling currently equipped item directly without un-equipping
    const isEquipped = Object.values(equipped).includes(item.id);
    if (isEquipped) {
      showFeedback('Předmět máš právě na sobě! Nejprve ho sundej v inventáři.', 'error');
      return;
    }

    setInventory((inv: any[]) => inv.filter((i: any) => i.id !== item.id));
    setGold((g: number) => g + payout);
    showFeedback(`Prodáno: ${item.name} (+${payout} 🪙)`, 'success');
  };

  // 3. Blacksmith: Purchasing upgrades & services
  const handleBlacksmithService = (serviceId: string) => {
    if (serviceId === 'sharpen_weapon') {
      if (gold < 15) {
        showFeedback('Nedostatek zlata na naostření zbraně (15 zl).', 'error');
        return;
      }
      setGold((g: number) => g - 15);
      addBuff({
        id: 'brousena_cepel',
        name: 'Broušená čepel',
        icon: '⚔️',
        description: '+2 k fyzickému zranění.',
        type: 'damage',
        value: 2,
        durationBattles: 3,
        source: 'blacksmith'
      });
      showFeedback('Kovář naostřil tvou zbraň: +2 poškození na 3 souboje! (-15 🪙)', 'success');
    } else if (serviceId === 'reinforce_armor') {
      if (gold < 25) {
        showFeedback('Nedostatek zlata na výztuhu zbroje (25 zl).', 'error');
        return;
      }
      setGold((g: number) => g - 25);
      addBuff({
        id: 'vyztuzena_zbroj',
        name: 'Výztuha zbroje',
        icon: '🛡️',
        description: '+1 k Obrannému číslu (AC).',
        type: 'defense',
        value: 1,
        durationBattles: 3,
        source: 'blacksmith'
      });
      showFeedback('Zbrojíř vyztužil pláty: +1 AC na 3 souboje! (-25 🪙)', 'success');
    } else if (serviceId === 'silver_weapon') {
      if (gold < 50) {
        showFeedback('Nedostatek zlata na stříbření čepele (50 zl).', 'error');
        return;
      }
      setGold((g: number) => g - 50);
      addBuff({
        id: 'stribrna_cepel',
        name: 'Svěcené stříbro',
        icon: '✨',
        description: '+50% poškození nemrtvým a lykantropům.',
        type: 'silvered',
        value: 1,
        durationBattles: 5,
        source: 'blacksmith'
      });
      showFeedback('Čepel byla posvěcena stříbrem: +50% poškození proti nemrtvým na 5 bojů! (-50 🪙)', 'success');
    }
  };

  // 4. Tavern: Room, Rations, Rumors
  const handleTavernService = (serviceId: string) => {
    if (serviceId === 'inn_lodging') {
      if (gold < 10) {
        showFeedback('Nedostatek zlaťáků na pokoj v hostinci (10 zl).', 'error');
        return;
      }
      setGold((g: number) => g - 10);
      setHp(maxHp);
      setCurrentSpellSlots(maxSpellSlots);
      addBuff({
        id: 'odpocinuty_host',
        name: 'Vyspalý do růžova',
        icon: '🛏️',
        description: '+10 dočasných životů z měkkého lůžka v hostinci.',
        type: 'tempHp',
        value: 10,
        durationDays: 1,
        source: 'tavern'
      });
      showFeedback('Prospal ses do sytosti v teple hostince! Životy i kouzla plně obnoveny +10 dočasných HP. (-10 🪙)', 'success');
    } else if (serviceId === 'inn_rations') {
      if (gold < 3) {
        showFeedback('Nedostatek zlaťáků na cestovní příděl (3 zl).', 'error');
        return;
      }
      setGold((g: number) => g - 3);
      setRations((r: number) => r + 1);
      showFeedback('Koupen balíček cestovních zásob (+1 jídlo). (-3 🪙)', 'success');
    } else if (serviceId === 'inn_rumors') {
      if (gold < 12) {
        showFeedback('Hostinský bez 12 zlaťáků nic neprozradí.', 'error');
        return;
      }
      setGold((g: number) => g - 12);
      if (playerLocation) {
        revealHexes(playerLocation.q, playerLocation.r, 2);
      }
      showFeedback('Hostinský ti nad mapou ukázal tajemná místa v okolí! (Mlha neznáma v okruhu 2 hexů odkryta). (-12 🪙)', 'success');
    }
  };

  // 5. Tavern Gambling: Dragon's Eye
  const handlePlayDice = () => {
    if (gold < diceBet) {
      showFeedback(`Nemáš dostatek zlaťáků na sázku ${diceBet} zl!`, 'error');
      return;
    }

    setIsRollingDice(true);
    setTimeout(() => {
      const res = playDragonEye(diceBet);
      setDiceResult(res);
      setGold((g: number) => Math.max(0, g + res.netGold));
      setIsRollingDice(false);

      if (res.outcome === 'jackpot' || res.outcome === 'win') {
        showFeedback(`${res.message} (+${res.netGold} 🪙)`, 'success');
      } else if (res.outcome === 'lose') {
        showFeedback(`${res.message} (${res.netGold} 🪙)`, 'error');
      } else {
        showFeedback(res.message, 'info');
      }
    }, 700);
  };

  // 6. Stables: Purchasing Mount
  const handleBuyMount = (mount: typeof MOUNTS_CATALOG[0]) => {
    if (activeMount?.id === mount.id) {
      showFeedback('Toto zvíře již vlastníš!', 'info');
      return;
    }
    if (gold < mount.price) {
      showFeedback(`Nemáš dostatek zlaťáků na ${mount.name} (${mount.price} zl).`, 'error');
      return;
    }

    setGold((g: number) => g - mount.price);
    setActiveMount(mount);
    showFeedback(`Získal jsi: ${mount.name}! ${mount.description} (-${mount.price} 🪙)`, 'success');
  };

  // 7. Temple: Tithe & Cure
  const handleTempleService = (serviceId: string) => {
    if (serviceId === 'temple_tithe') {
      if (gold < 20) {
        showFeedback('Kněz vyžaduje obětinu 20 zlaťáků.', 'error');
        return;
      }
      setGold((g: number) => g - 20);
      addBuff({
        id: 'solarianovo_pozehnani',
        name: 'Solarianovo požehnání',
        icon: '☀️',
        description: '+1 k hodům na útok a záchranným hodům.',
        type: 'blessing',
        value: 1,
        durationDays: 1,
        source: 'temple'
      });
      showFeedback('Světlonoš přijal tvůj dar: Požehnání inspirace (+1 k hodům na celý den)! (-20 🪙)', 'success');
    } else if (serviceId === 'temple_cure') {
      if (gold < 40) {
        showFeedback('Nedostatek zlaťáků na chrámovou očistu (40 zl).', 'error');
        return;
      }
      setGold((g: number) => g - 40);
      // Remove exhaustion or curse debuffs
      showFeedback('Kněží očistili tvou krev svatou vodou. Všechny nemoci a vyčerpání pominuly! (-40 🪙)', 'success');
    }
  };

  const filteredMarketStock = TOWN_MERCHANT_STOCK.filter(item => {
    if (marketFilter === 'potions') return item.type === 'lektvar';
    if (marketFilter === 'gear') return ['zbraň', 'zbroj', 'štít'].includes(item.type);
    return true;
  });

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[100] flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#f9f6ea] border-4 border-amber-950/80 rounded-2xl w-full max-w-5xl h-[92vh] max-h-[850px] shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden text-amber-950 font-serif relative">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-amber-100 p-4 px-6 border-b-2 border-amber-950 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-400/40 flex items-center justify-center text-xl shadow-inner">
              🏛️
            </div>
            <div>
              <h2 className="font-cinzel text-lg sm:text-2xl font-bold tracking-wider text-amber-200 flex items-center gap-2">
                Městské Služby & Tržnice
              </h2>
              <p className="text-xs text-amber-300/80 font-lora">
                Lokace: <span className="font-bold text-amber-100">{currentRegion || 'Městské hradby'}</span>
                {localKingdomId && (
                  <span className="ml-2 px-2 py-0.5 rounded-full text-[11px] bg-black/30 border border-amber-400/30">
                    Reputace: <span className={currentRep >= 0 ? 'text-green-300' : 'text-red-300'}>{currentRep >= 0 ? `+${currentRep}` : currentRep}</span>
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Player's Purse */}
            <div className="bg-amber-950/80 border border-amber-500/50 px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-amber-300 font-cinzel font-bold text-sm sm:text-base shadow-inner">
              <span>🪙</span>
              <span>{gold}</span>
              <span className="text-xs text-amber-400/70 hidden sm:inline">zl</span>
            </div>

            <button 
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-amber-950/40 hover:bg-red-950 text-amber-300 hover:text-white border border-amber-700/50 transition"
              title="Zavřít tržnici"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Active Buffs & Mount Status Bar */}
        {(activeBuffs.length > 0 || activeMount) && (
          <div className="bg-amber-100/90 border-b border-amber-900/20 px-4 py-2 flex items-center gap-3 overflow-x-auto text-xs shrink-0">
            <span className="font-cinzel font-bold text-amber-900 shrink-0">Aktivní výhody:</span>
            {activeMount && (
              <span className="bg-amber-200/80 border border-amber-700/30 px-2.5 py-1 rounded-lg font-medium text-amber-950 flex items-center gap-1.5 shrink-0">
                <span>{activeMount.icon}</span>
                <span>{activeMount.name} (+{activeMount.inventoryBonus} slotů)</span>
              </span>
            )}
            {activeBuffs.map(b => (
              <span key={b.id} className="bg-amber-200/80 border border-amber-700/30 px-2.5 py-1 rounded-lg font-medium text-amber-950 flex items-center gap-1.5 shrink-0" title={b.description}>
                <span>{b.icon}</span>
                <span>{b.name}</span>
                {b.durationBattles !== undefined && (
                  <span className="bg-amber-800 text-white text-[10px] px-1.5 rounded-full font-bold">
                    {b.durationBattles} {b.durationBattles === 1 ? 'boj' : 'boje'}
                  </span>
                )}
                {b.durationDays !== undefined && (
                  <span className="bg-amber-800 text-white text-[10px] px-1.5 rounded-full font-bold">
                    {b.durationDays} den
                  </span>
                )}
              </span>
            ))}
          </div>
        )}

        {/* Feedback Alert Toast */}
        {feedback && (
          <div className={`mx-4 mt-3 p-3 rounded-xl border text-sm font-medium flex items-center gap-2 shrink-0 animate-in fade-in ${
            feedback.type === 'error' ? 'bg-red-100 border-red-400 text-red-900' :
            feedback.type === 'info' ? 'bg-blue-100 border-blue-400 text-blue-900' :
            'bg-green-100 border-green-400 text-green-900'
          }`}>
            <AlertCircle size={16} className="shrink-0" />
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-amber-900/20 bg-[#efe7d3] px-2 sm:px-6 pt-2 gap-1 sm:gap-2 overflow-x-auto shrink-0 scrollbar-none">
          {[
            { id: 'market', shortLabel: 'Tržiště', label: 'Tržiště & Lektvary', icon: ShoppingBag },
            { id: 'blacksmith', shortLabel: 'Kovář', label: 'Kovářská dílna', icon: Hammer },
            { id: 'tavern', shortLabel: 'Krčma', label: 'Hostinec & Hazard', icon: Beer },
            { id: 'stables', shortLabel: 'Stáje', label: 'Stáje & Oře', icon: Compass },
            { id: 'temple', shortLabel: 'Svatyně', label: 'Svatyně & Požehnání', icon: Sun },
          ].map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as TabType)}
                className={`flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-cinzel font-bold border-t-2 border-x-2 rounded-t-xl transition shrink-0 ${
                  isActive 
                    ? 'bg-[#f9f6ea] border-amber-900/40 text-amber-950 shadow-xs' 
                    : 'border-transparent text-amber-900/70 hover:text-amber-950 hover:bg-amber-200/50'
                }`}
              >
                <Icon size={15} />
                <span className="hidden sm:inline">{t.label}</span>
                <span className="sm:hidden">{t.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f9f6ea]">
          
          {/* TAB 1: MARKET */}
          {activeTab === 'market' && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-amber-100/60 p-3 rounded-xl border border-amber-900/20">
                <div className="flex items-center gap-1.5 bg-amber-200/60 p-1 rounded-lg border border-amber-900/20">
                  <button
                    onClick={() => setMarketMode('buy')}
                    className={`px-4 py-1.5 rounded-md font-cinzel font-bold text-xs sm:text-sm transition ${
                      marketMode === 'buy' ? 'bg-amber-900 text-white shadow-xs' : 'text-amber-950 hover:bg-amber-300/60'
                    }`}
                  >
                    Koupit zboží
                  </button>
                  <button
                    onClick={() => setMarketMode('sell')}
                    className={`px-4 py-1.5 rounded-md font-cinzel font-bold text-xs sm:text-sm transition ${
                      marketMode === 'sell' ? 'bg-amber-900 text-white shadow-xs' : 'text-amber-950 hover:bg-amber-300/60'
                    }`}
                  >
                    Prodat z batohu
                  </button>
                </div>

                {marketMode === 'buy' && (
                  <div className="flex items-center gap-1">
                    {(['all', 'potions', 'gear'] as const).map(f => (
                      <button
                        key={f}
                        onClick={() => setMarketFilter(f)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold font-lora capitalize transition ${
                          marketFilter === f ? 'bg-amber-800 text-white' : 'bg-amber-200/50 text-amber-900 hover:bg-amber-200'
                        }`}
                      >
                        {f === 'all' ? 'Vše' : f === 'potions' ? 'Lektvary' : 'Výstroj'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {marketMode === 'buy' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {filteredMarketStock.map(item => {
                    const price = calculateBuyPrice(item.basePrice, currentRep);
                    const hasDiscount = price < item.basePrice;
                    const hasMarkup = price > item.basePrice;

                    return (
                      <div key={item.id} className="bg-white/70 border border-amber-900/20 rounded-xl p-3.5 flex flex-col justify-between shadow-xs hover:border-amber-700/50 transition">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{item.icon}</span>
                              <div>
                                <h4 className="font-cinzel font-bold text-sm text-amber-950 leading-tight">{item.name}</h4>
                                <span className="text-[10px] text-amber-800/80 uppercase font-semibold">{item.type}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-cinzel font-bold text-amber-900 flex items-center gap-1 justify-end">
                                <span>🪙</span>
                                <span>{price}</span>
                              </div>
                              {hasDiscount && (
                                <span className="text-[10px] text-green-700 font-bold flex items-center gap-0.5 justify-end">
                                  <TrendingDown size={11} /> Sleva ({item.basePrice} zl)
                                </span>
                              )}
                              {hasMarkup && (
                                <span className="text-[10px] text-red-700 font-bold flex items-center gap-0.5 justify-end">
                                  <TrendingUp size={11} /> Přirážka
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-amber-900/80 font-lora mb-3">{item.desc}</p>
                        </div>

                        <button
                          onClick={() => handleBuyItem(item)}
                          disabled={gold < price}
                          className="w-full py-1.5 px-3 bg-amber-800 hover:bg-amber-900 active:bg-amber-950 text-white rounded-lg font-cinzel font-bold text-xs tracking-wider transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                        >
                          <ShoppingBag size={14} />
                          <span>Koupit za {price} zl</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {inventory.length === 0 ? (
                    <div className="text-center py-12 text-amber-800/70 font-lora italic">
                      Váš batoh je zcela prázdný. Nemáte co prodat.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {inventory.map((item, idx) => {
                        const baseVal = item.sell_price || item.basePrice || 10;
                        const sellPrice = calculateSellPrice(baseVal, currentRep);
                        const isEquipped = Object.values(equipped).includes(item.id);

                        return (
                          <div key={`${item.id}_${idx}`} className="bg-white/70 border border-amber-900/20 rounded-xl p-3 flex items-center justify-between shadow-xs">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-lg bg-amber-900/10 border border-amber-900/20 overflow-hidden">
                                <ItemIcon iconName={item.icon || item.type || 'item'} itemId={item.id} size={32} />
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-cinzel font-bold text-xs sm:text-sm text-amber-950 truncate">{item.name}</h4>
                                <span className="text-[10px] text-amber-800/70 block font-lora">
                                  {isEquipped ? '⚔️ Právě nasazeno' : translateItemType(item.type)}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleSellItem(item)}
                              disabled={isEquipped}
                              className="shrink-0 ml-2 py-1 px-3 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-cinzel font-bold text-xs transition disabled:opacity-30 disabled:cursor-not-allowed"
                              title={isEquipped ? 'Nejprve předmět sundej' : `Prodat za ${sellPrice} zl`}
                            >
                              Prodat +{sellPrice} zl
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BLACKSMITH */}
          {activeTab === 'blacksmith' && (
            <div className="flex flex-col gap-4">
              <div className="bg-amber-100/70 border border-amber-900/20 p-4 rounded-xl flex items-center gap-3">
                <span className="text-3xl">⚒️</span>
                <div>
                  <h3 className="font-cinzel font-bold text-base text-amber-950">Městská kovářská výheň</h3>
                  <p className="text-xs text-amber-900/80 font-lora">
                    Kovář dokáže mistrně naostřit čepele, zpevnit nýty na zbroji nebo nanést posvátné stříbro účinné proti stínovým bestiím.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {BLACKSMITH_SERVICES.map(service => (
                  <div key={service.id} className="bg-white/80 border-2 border-amber-900/20 rounded-xl p-4 flex flex-col justify-between shadow-sm hover:border-amber-700/60 transition">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl">{service.icon}</span>
                        <span className="font-cinzel font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-900/20 text-sm">
                          🪙 {service.cost} zl
                        </span>
                      </div>
                      <h4 className="font-cinzel font-bold text-base text-amber-950 mb-1">{service.name}</h4>
                      <p className="text-xs text-amber-900/70 font-lora mb-3">{service.description}</p>
                      <div className="bg-amber-50 border border-amber-700/20 p-2 rounded-lg text-xs font-semibold text-amber-950 mb-4">
                        ✨ {service.effectDescription}
                      </div>
                    </div>

                    <button
                      onClick={() => handleBlacksmithService(service.id)}
                      disabled={gold < service.cost}
                      className="w-full py-2 bg-amber-900 hover:bg-amber-950 text-white rounded-xl font-cinzel font-bold text-xs tracking-wider transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Hammer size={15} />
                      <span>Objednat za {service.cost} zl</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TAVERN & GAMBLING */}
          {activeTab === 'tavern' && (
            <div className="flex flex-col gap-6">
              {/* Tavern Services */}
              <div>
                <h3 className="font-cinzel font-bold text-base text-amber-950 mb-3 flex items-center gap-2">
                  <span>🍺</span> Služby hostinského
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                  {TAVERN_SERVICES.map(service => (
                    <div key={service.id} className="bg-white/80 border border-amber-900/20 rounded-xl p-4 flex flex-col justify-between shadow-xs">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-3xl">{service.icon}</span>
                          <span className="font-cinzel font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-900/20 text-xs">
                            🪙 {service.cost} zl
                          </span>
                        </div>
                        <h4 className="font-cinzel font-bold text-sm text-amber-950 mb-1">{service.name}</h4>
                        <p className="text-xs text-amber-900/70 font-lora mb-2">{service.description}</p>
                        <div className="bg-amber-50 p-2 rounded-lg text-[11px] font-medium text-amber-900 mb-3">
                          {service.effectDescription}
                        </div>
                      </div>

                      <button
                        onClick={() => handleTavernService(service.id)}
                        disabled={gold < service.cost}
                        className="w-full py-1.5 bg-amber-800 hover:bg-amber-900 text-white rounded-lg font-cinzel font-bold text-xs transition disabled:opacity-40"
                      >
                        Zaplatit {service.cost} zl
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tavern Gambling: Dragon's Eye */}
              <div className="bg-gradient-to-br from-amber-950 to-[#2b1810] text-amber-100 p-4 sm:p-5 rounded-2xl border-2 border-amber-600/50 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 border-b border-amber-700/40 pb-3">
                  <div className="flex items-center gap-3">
                    <Dices size={28} className="text-amber-400 animate-bounce shrink-0" />
                    <div>
                      <h4 className="font-cinzel font-bold text-base sm:text-lg text-amber-200">Krčemní kostky: Dračí oko</h4>
                      <p className="text-xs text-amber-300/70 font-lora">
                        3d6 ty vs 3d6 hostinský. Vyšší součet bere bank. Trojice stejných čísel = trojnásobná výhra!
                      </p>
                    </div>
                  </div>

                  {/* Bet Selection */}
                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <span className="text-xs font-cinzel text-amber-300/80">Sázka:</span>
                    {[5, 15, 30].map(bet => (
                      <button
                        key={bet}
                        onClick={() => setDiceBet(bet)}
                        className={`px-3 py-1 rounded-lg text-xs font-cinzel font-bold transition ${
                          diceBet === bet ? 'bg-amber-500 text-amber-950 font-black shadow-md' : 'bg-amber-900/60 text-amber-200 hover:bg-amber-800'
                        }`}
                      >
                        {bet} zl
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dice Arena Display */}
                {diceResult && (
                  <div className="bg-black/40 border border-amber-500/30 p-4 rounded-xl mb-4 flex flex-col sm:flex-row items-center justify-around gap-4 text-center">
                    <div>
                      <span className="text-xs text-amber-300/80 font-cinzel uppercase block mb-1">Tvé kostky</span>
                      <div className="flex gap-2 justify-center mb-1">
                        {diceResult.playerRolls.map((r, i) => (
                          <span key={i} className="w-9 h-9 bg-amber-100 text-amber-950 font-bold font-cinzel text-lg rounded-lg border-2 border-amber-600 flex items-center justify-center shadow-md">
                            {r}
                          </span>
                        ))}
                      </div>
                      <span className="text-sm font-bold text-amber-300">Součet: {diceResult.playerTotal}</span>
                    </div>

                    <div className="text-2xl font-cinzel font-bold text-amber-400">
                      VS
                    </div>

                    <div>
                      <span className="text-xs text-amber-300/80 font-cinzel uppercase block mb-1">Hostinského kostky</span>
                      <div className="flex gap-2 justify-center mb-1">
                        {diceResult.npcRolls.map((r, i) => (
                          <span key={i} className="w-9 h-9 bg-amber-900 text-amber-100 font-bold font-cinzel text-lg rounded-lg border-2 border-amber-700 flex items-center justify-center shadow-md">
                            {r}
                          </span>
                        ))}
                      </div>
                      <span className="text-sm font-bold text-amber-400">Součet: {diceResult.npcTotal}</span>
                    </div>
                  </div>
                )}

                <div className="flex justify-center">
                  <button
                    onClick={handlePlayDice}
                    disabled={isRollingDice || gold < diceBet}
                    className="px-8 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 active:scale-95 text-amber-950 font-cinzel font-bold text-sm tracking-wider rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                  >
                    <Dices size={18} />
                    <span>{isRollingDice ? 'Házím kostkami...' : `Vsadit a hodit (${diceBet} zl)`}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: STABLES */}
          {activeTab === 'stables' && (
            <div className="flex flex-col gap-4">
              <div className="bg-amber-100/70 border border-amber-900/20 p-4 rounded-xl flex items-center gap-3">
                <span className="text-3xl">🐎</span>
                <div>
                  <h3 className="font-cinzel font-bold text-base text-amber-950">Městské stáje a chovy</h3>
                  <p className="text-xs text-amber-900/80 font-lora">
                    Dobré zvíře je základem každé výpravy. Mezek uveze obrovskou kořist, zatímco kůň zkrátí útrapy cestování na mapě na polovinu.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {MOUNTS_CATALOG.map(mount => {
                  const isOwned = activeMount?.id === mount.id;

                  return (
                    <div key={mount.id} className={`bg-white/80 border-2 rounded-xl p-4 flex flex-col justify-between shadow-xs transition ${
                      isOwned ? 'border-green-600 ring-2 ring-green-600/30' : 'border-amber-900/20 hover:border-amber-700/50'
                    }`}>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-4xl">{mount.icon}</span>
                          <span className="font-cinzel font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-900/20 text-sm">
                            🪙 {mount.price} zl
                          </span>
                        </div>
                        <h4 className="font-cinzel font-bold text-base text-amber-950 mb-1">{mount.name}</h4>
                        <p className="text-xs text-amber-900/80 font-lora mb-3">{mount.description}</p>
                        
                        <div className="flex flex-col gap-1.5 mb-4 text-xs font-medium text-amber-950">
                          <div className="flex items-center gap-1.5 bg-amber-50 p-1.5 rounded-lg border border-amber-800/15">
                            <span>🎒</span>
                            <span>Kapacita batohu: <strong>+{mount.inventoryBonus} slotů</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-amber-50 p-1.5 rounded-lg border border-amber-800/15">
                            <span>🗺️</span>
                            <span>Rychlost cestování: <strong>{mount.travelSpeedMultiplier === 0.5 ? '2x rychlejší (0.5 dne/hex)' : 'Standardní'}</strong></span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleBuyMount(mount)}
                        disabled={isOwned || gold < mount.price}
                        className={`w-full py-2 rounded-xl font-cinzel font-bold text-xs tracking-wider transition flex items-center justify-center gap-2 ${
                          isOwned 
                            ? 'bg-green-700 text-white cursor-default' 
                            : 'bg-amber-900 hover:bg-amber-950 text-white disabled:opacity-40 disabled:cursor-not-allowed'
                        }`}
                      >
                        {isOwned ? (
                          <>
                            <Check size={16} />
                            <span>Vlastněno</span>
                          </>
                        ) : (
                          <>
                            <span>Koupit za {mount.price} zl</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: TEMPLE */}
          {activeTab === 'temple' && (
            <div className="flex flex-col gap-4">
              <div className="bg-amber-100/70 border border-amber-900/20 p-4 rounded-xl flex items-center gap-3">
                <span className="text-3xl">⛪</span>
                <div>
                  <h3 className="font-cinzel font-bold text-base text-amber-950">Chrám Světlonoše a Oltář Bohů</h3>
                  <p className="text-xs text-amber-900/80 font-lora">
                    V temném světě Aelthgardu je božská přízeň neocenitelná. Slož obětinu pro božské vedení v boji nebo se očisti od zhoubného moru.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto w-full">
                {TEMPLE_SERVICES.map(service => (
                  <div key={service.id} className="bg-white/80 border-2 border-amber-900/20 rounded-xl p-5 flex flex-col justify-between shadow-sm hover:border-amber-700/60 transition">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-4xl">{service.icon}</span>
                        <span className="font-cinzel font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-lg border border-amber-900/20 text-sm">
                          🪙 {service.cost} zl
                        </span>
                      </div>
                      <h4 className="font-cinzel font-bold text-base text-amber-950 mb-1">{service.name}</h4>
                      <p className="text-xs text-amber-900/70 font-lora mb-3">{service.description}</p>
                      <div className="bg-amber-50 border border-amber-700/20 p-2.5 rounded-lg text-xs font-semibold text-amber-950 mb-4">
                        🕊️ {service.effectDescription}
                      </div>
                    </div>

                    <button
                      onClick={() => handleTempleService(service.id)}
                      disabled={gold < service.cost}
                      className="w-full py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-cinzel font-bold text-xs tracking-wider transition disabled:opacity-40 flex items-center justify-center gap-2"
                    >
                      <span>Obětovat {service.cost} zl</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
