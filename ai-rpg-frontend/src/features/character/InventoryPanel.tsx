import React from 'react';
import { ItemIcon } from '../../components/ui/ItemIcon';
import { X, Package, Shield, Swords, Sparkles, Heart, Plus, Trash2 } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

const RARITY_MAP: Record<string, { label: string; border: string; text: string; bg: string }> = {
  common: { label: 'Běžný', border: 'border-amber-900/20', text: 'text-slate-700', bg: 'bg-amber-100/70' },
  uncommon: { label: 'Magický', border: 'border-emerald-600/40', text: 'text-emerald-800', bg: 'bg-emerald-100/80' },
  rare: { label: 'Vzácný', border: 'border-sky-600/40', text: 'text-sky-800', bg: 'bg-sky-100/80' },
  epic: { label: 'Epický', border: 'border-purple-600/40', text: 'text-purple-800', bg: 'bg-purple-100/80' },
  legendary: { label: 'Legendární', border: 'border-amber-600/60', text: 'text-amber-900', bg: 'bg-amber-200/90' },
};

export const InventoryPanel = ({ isOpen, onClose, selectedItem, setSelectedItem }: any) => {
  const { 
    inventory, 
    setInventory, 
    equipped, 
    setEquipped, 
    gold, 
    hp, 
    setHp, 
    maxHp, 
    stats, 
    setStats, 
    skillPoints, 
    setSkillPoints 
  } = useGameStore();

  if (!isOpen) return null;

  // Calculate Equipped Items & Combat Stats
  const equippedItems = inventory.filter(i => Object.values(equipped).includes(i.id));
  const weaponBonus = equippedItems.reduce((acc, i) => acc + (Number(i.attack_bonus) || 0), 0);
  const armorBonus = equippedItems.reduce((acc, i) => acc + (Number(i.defense_bonus) || 0), 0);
  
  const strMod = Math.floor(((stats?.str ?? 10) - 10) / 2);
  const dexMod = Math.floor(((stats?.dex ?? 10) - 10) / 2);
  const totalAttack = Math.max(0, strMod) + weaponBonus;
  const totalAc = 10 + Math.max(0, dexMod) + armorBonus;

  const spendSkillPoint = (statKey: string) => {
    if (skillPoints <= 0) return;
    setStats({ ...stats, [statKey]: (stats[statKey] || 10) + 1 });
    setSkillPoints((sp: number) => Math.max(0, sp - 1));
  };

  const usePotion = (item: any) => {
    const healVal = item.healing_amount || 25;
    setHp((h: number) => Math.min(maxHp, h + healVal));
    setInventory((inv: any[]) => inv.filter(i => i.id !== item.id));
    setSelectedItem(null);
  };

  const dropItem = (item: any) => {
    setEquipped((eq: any) => {
      const newEq = { ...eq };
      Object.keys(newEq).forEach(k => {
        if (newEq[k] === item.id) newEq[k] = null;
      });
      return newEq;
    });
    setInventory((inv: any[]) => inv.filter(i => i.id !== item.id));
    setSelectedItem(null);
  };

  const getRarityConfig = (rarity?: string) => {
    const key = (rarity || 'common').toLowerCase();
    return RARITY_MAP[key] || RARITY_MAP['common'];
  };

  const renderSlot = (slotKey: string, slotName: string, defaultIcon: string) => {
    const itemId = equipped[slotKey];
    const item = inventory.find(i => i.id === itemId);
    const rConfig = item ? getRarityConfig(item.rarity) : null;

    return (
      <div 
        className={`w-16 h-16 bg-[#fcfbf7] border-2 rounded-xl flex flex-col justify-center items-center cursor-pointer transition relative shadow-sm
          ${item ? `${rConfig?.border} hover:border-amber-700` : 'border-amber-900/15 hover:border-amber-700/40'}
          ${selectedItem?.id === itemId ? 'ring-2 ring-amber-800' : ''}
        `}
        onClick={() => setSelectedItem(item || null)}
        title={item ? `${item.name} (${slotName})` : slotName}
      >
        {item ? (
          <>
            <ItemIcon iconName={item.icon || defaultIcon} itemId={item.id} className="transform scale-75" />
            <span className="text-[9px] font-cinzel font-bold text-amber-950 truncate max-w-[56px] text-center px-0.5">{item.name}</span>
          </>
        ) : (
          <span className="text-slate-400 text-[10px] uppercase font-cinzel font-bold tracking-tighter">{slotName}</span>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="w-full max-w-5xl bg-[#f9f6e6]/95 backdrop-blur-xl rounded-2xl border border-amber-900/20 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-900">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-900/5 via-transparent to-amber-900/5 px-6 py-4 flex justify-between items-center border-b border-amber-900/15">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-xl border border-amber-900/15 text-amber-900">
              <Package size={24} />
            </div>
            <div>
              <h2 className="font-cinzel font-bold text-xl sm:text-2xl text-amber-950 tracking-wide">
                Inventář a Výstroj
              </h2>
              <p className="text-xs font-lora text-slate-600">
                Správa předmětů, zbraní a bojových atributů
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 border border-amber-900/20 rounded-xl font-cinzel font-bold text-amber-950 text-sm shadow-inner">
              <span className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-black text-[10px]">Z</span>
              <span>{gold} Zl.</span>
            </div>

            <button 
              onClick={() => onClose()} 
              className="text-amber-900/60 hover:text-amber-950 p-1.5 rounded-xl hover:bg-amber-900/10 transition"
              title="Zavřít"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Modal Body - 3 Columns */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col lg:flex-row gap-5 custom-scrollbar">
          
          {/* Column 1: Equipment & Stats */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Equipment Grid */}
            <div className="bg-white/70 border border-amber-900/15 p-4 rounded-xl flex flex-col items-center gap-3 shadow-sm">
              <h3 className="text-amber-950 uppercase font-cinzel font-bold text-xs tracking-widest border-b border-amber-900/10 w-full text-center pb-2">
                Bojová Výstroj
              </h3>
              
              <div className="grid grid-cols-3 gap-3">
                <div></div>
                {renderSlot('hlava', 'Hlava', 'Shirt')}
                <div></div>

                {renderSlot('hlavní ruka', 'Zbraň', 'Sword')}
                {renderSlot('hruď', 'Zbroj', 'Shirt')}
                {renderSlot('druhá ruka', 'Štít', 'Shield')}

                {renderSlot('prsten', 'Prsten', 'Ring')}
                {renderSlot('krk', 'Amulet', 'Ring')}
                <div></div>
              </div>
            </div>

            {/* Combat Totals & RPG Stats */}
            <div className="bg-white/70 border border-amber-900/15 p-4 rounded-xl text-slate-800 flex flex-col gap-3 shadow-sm">
              <h3 className="uppercase font-cinzel font-bold text-xs tracking-widest text-amber-950 border-b border-amber-900/10 pb-2">
                Atributy a Boj
              </h3>

              {/* Combat Summary Badges */}
              <div className="grid grid-cols-2 gap-2 bg-[#fcfbf7] p-2.5 rounded-xl border border-amber-900/15">
                <div className="flex items-center gap-2">
                  <Swords size={20} className="text-amber-700 shrink-0" />
                  <div>
                    <div className="text-[10px] uppercase font-cinzel font-bold text-slate-500">Celkový Útok</div>
                    <div className="font-cinzel font-bold text-base text-amber-950">+{totalAttack}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={20} className="text-sky-700 shrink-0" />
                  <div>
                    <div className="text-[10px] uppercase font-cinzel font-bold text-slate-500">Třída Zbroje (AC)</div>
                    <div className="font-cinzel font-bold text-base text-sky-950">{totalAc}</div>
                  </div>
                </div>
              </div>

              {/* Health */}
              <div className="flex justify-between items-center py-1 border-b border-amber-900/10 text-sm">
                <span className="flex items-center gap-1.5 font-cinzel font-bold text-slate-700"><Heart size={16} className="text-red-600" /> Zdraví:</span>
                <span className="font-cinzel font-bold text-slate-900 text-base">{hp} / {maxHp} HP</span>
              </div>

              {/* Skill Points Available Banner */}
              {skillPoints > 0 && (
                <div className="bg-amber-100 border border-amber-700/40 p-2.5 rounded-xl flex items-center justify-between shadow-sm">
                  <span className="text-amber-950 text-xs font-cinzel font-bold flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-700" /> Volné body: {skillPoints}
                  </span>
                  <span className="text-[10px] font-lora text-amber-900 italic">Klikni [+] pro vylepšení</span>
                </div>
              )}

              {/* Individual Attributes */}
              <div className="flex flex-col gap-1 text-sm">
                {[
                  { key: 'str', label: 'Síla (STR)', val: stats?.str ?? 10 },
                  { key: 'dex', label: 'Obratnost (DEX)', val: stats?.dex ?? 10 },
                  { key: 'con', label: 'Odolnost (CON)', val: stats?.con ?? 10 },
                  { key: 'intel', label: 'Inteligence (INT)', val: stats?.intel ?? 10 },
                  { key: 'wis', label: 'Moudrost (WIS)', val: stats?.wis ?? 10 },
                  { key: 'cha', label: 'Charisma (CHA)', val: stats?.cha ?? 10 },
                ].map(st => {
                  const mod = Math.floor((st.val - 10) / 2);
                  return (
                    <div key={st.key} className="flex justify-between items-center py-0.5">
                      <span className="font-lora text-slate-700 text-xs sm:text-sm">{st.label}:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-cinzel font-bold text-amber-950 text-sm">{st.val}</span>
                        <span className="text-[10px] font-lora text-slate-500 font-bold">({mod >= 0 ? `+${mod}` : mod})</span>
                        {skillPoints > 0 && (
                          <button
                            onClick={() => spendSkillPoint(st.key)}
                            className="w-5 h-5 bg-amber-800 hover:bg-amber-700 text-white rounded flex items-center justify-center transition shadow font-bold"
                            title={`Přidat 1 bod k ${st.label}`}
                          >
                            <Plus size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Column 2: Selected Item Details */}
          <div className="flex-1 bg-white/70 border border-amber-900/15 p-5 rounded-xl flex flex-col items-center text-center relative min-h-[340px] shadow-sm">
            {selectedItem ? (
              (() => {
                const rConfig = getRarityConfig(selectedItem.rarity);
                const isEquipped = Object.values(equipped).includes(selectedItem.id);
                const isPotion = selectedItem.type === 'lektvar';

                return (
                  <>
                    <div className={`w-32 h-32 mx-auto mb-3 bg-[#fcfbf7] border-2 ${rConfig.border} rounded-2xl flex items-center justify-center shadow-inner relative`}>
                      <ItemIcon iconName={selectedItem.icon || 'Package'} itemId={selectedItem.id} size={90} />
                      <span className={`absolute bottom-1.5 right-2 text-[10px] font-cinzel font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${rConfig.bg} ${rConfig.text}`}>
                        {rConfig.label}
                      </span>
                    </div>
                    
                    <h2 className={`text-xl font-cinzel font-bold mb-0.5 text-amber-950`}>{selectedItem.name}</h2>
                    <p className="text-slate-500 text-xs font-cinzel uppercase tracking-wider mb-3">
                      {selectedItem.type} • {selectedItem.slot || 'bez slotu'}
                    </p>
                    
                    <div className="bg-[#fcfbf7] w-full p-4 rounded-xl text-sm mb-4 text-left border border-amber-900/15">
                      <p className="mb-2 italic text-xs leading-relaxed font-lora text-slate-700">{selectedItem.description || 'Obyčejný předmět nalezený na cestách po Aethelgardu.'}</p>
                      
                      {/* Numerical Modifiers */}
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-amber-900/10 text-xs">
                        {Number(selectedItem.attack_bonus) > 0 && (
                          <span className="font-cinzel font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-700/30">
                            Útok: +{selectedItem.attack_bonus}
                          </span>
                        )}
                        {Number(selectedItem.defense_bonus) > 0 && (
                          <span className="font-cinzel font-bold text-sky-900 bg-sky-100 px-2 py-0.5 rounded border border-sky-700/30">
                            Obrana: +{selectedItem.defense_bonus} AC
                          </span>
                        )}
                        {Number(selectedItem.healing_amount) > 0 && (
                          <span className="font-cinzel font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-700/30">
                            Léčení: +{selectedItem.healing_amount} HP
                          </span>
                        )}
                        {selectedItem.stats && !selectedItem.attack_bonus && !selectedItem.defense_bonus && (
                          <span className="font-cinzel font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{selectedItem.stats}</span>
                        )}
                      </div>
                    </div>

                    <div className="font-cinzel font-bold mb-4 text-sm flex items-center justify-between w-full px-2">
                      <span className="text-slate-500">Cena u kupce:</span>
                      <span className="text-amber-900">{selectedItem.sell_price || 5} Zl.</span>
                    </div>
                    
                    <div className="mt-auto w-full flex flex-col gap-2">
                      {/* Potion Drink Action */}
                      {isPotion && (
                        <button
                          onClick={() => usePotion(selectedItem)}
                          className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-cinzel font-bold uppercase text-xs tracking-wider transition shadow rounded-xl"
                        >
                          Vypít lektvar (+{selectedItem.healing_amount || 25} HP)
                        </button>
                      )}

                      {/* Equip / Unequip Action */}
                      {!isPotion && selectedItem.slot?.toLowerCase().trim() !== "žádný" && (
                        isEquipped ? (
                          <button 
                            onClick={() => {
                              const slotKey = Object.keys(equipped).find(k => equipped[k as keyof typeof equipped] === selectedItem.id);
                              if (slotKey) {
                                setEquipped({ ...equipped, [slotKey]: null });
                              }
                            }}
                            className="w-full py-2.5 bg-white border border-amber-900/20 text-slate-800 hover:bg-amber-100 font-cinzel font-bold uppercase text-xs tracking-wider transition rounded-xl"
                          >
                            Odložit z výstroje
                          </button>
                        ) : (
                          <button 
                            onClick={() => {
                              const normSlot = selectedItem.slot?.toLowerCase().trim();
                              let finalSlot = normSlot;
                              if (normSlot.includes("hlavní") || normSlot.includes("zbraň") || (normSlot.includes("ruka") && !normSlot.includes("druhá"))) finalSlot = "hlavní ruka";
                              if (normSlot.includes("druhá") || normSlot.includes("štít")) finalSlot = "druhá ruka";
                              if (normSlot.includes("hruď") || normSlot.includes("brnění") || normSlot.includes("zbroj") || normSlot.includes("tělo")) finalSlot = "hruď";
                              if (normSlot.includes("hlava") || normSlot.includes("přilba")) finalSlot = "hlava";
                              if (normSlot.includes("prsten")) finalSlot = "prsten";
                              if (normSlot.includes("krk") || normSlot.includes("amulet")) finalSlot = "krk";
                              
                              setEquipped({ ...equipped, [finalSlot]: selectedItem.id });
                            }}
                            className="w-full py-2.5 bg-amber-800 hover:bg-amber-700 text-white font-cinzel font-bold uppercase text-xs tracking-wider transition shadow-lg rounded-xl"
                          >
                            Vybavit do výstroje
                          </button>
                        )
                      )}

                      {/* Drop Item Action */}
                      <button
                        onClick={() => dropItem(selectedItem)}
                        className="w-full py-1.5 text-xs text-red-700 hover:text-red-800 hover:bg-red-50 rounded-lg flex items-center justify-center gap-1.5 transition font-cinzel"
                      >
                        <Trash2 size={13} /> Zahodit předmět
                      </button>
                    </div>
                  </>
                );
              })()
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 font-lora italic text-sm gap-3">
                <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
                  <Package size={28} />
                </div>
                <p className="max-w-xs">Vyberte předmět z batohu nebo výstroje pro zobrazení detailů a akcí.</p>
              </div>
            )}
          </div>

          {/* Column 3: Bag Grid */}
          <div className="flex-1 bg-white/70 border border-amber-900/15 p-4 rounded-xl flex flex-col shadow-sm">
            <div className="flex justify-between items-center border-b border-amber-900/10 pb-2 mb-4">
              <h3 className="text-amber-950 uppercase font-cinzel font-bold text-xs tracking-widest">
                Batoh ({inventory.length} / 20)
              </h3>
              <span className="text-amber-950 font-cinzel font-bold text-xs bg-amber-100 px-2 py-0.5 rounded border border-amber-900/15">
                Kapacita
              </span>
            </div>
            
            <div className="grid grid-cols-4 gap-2.5 flex-1">
              {Array.from({ length: Math.max(20, inventory.length) }).map((_, i) => {
                const item = inventory[i];
                const rConfig = item ? getRarityConfig(item.rarity) : null;
                const isItemEquipped = item && Object.values(equipped).includes(item.id);

                return (
                  <div 
                    key={i} 
                    onClick={() => item && setSelectedItem(item)}
                    className={`aspect-square bg-[#fcfbf7] border-2 rounded-xl flex justify-center items-center transition relative shadow-xs
                      ${item ? `${rConfig?.border} cursor-pointer hover:border-amber-700 hover:scale-105` : 'border-amber-900/10'}
                      ${selectedItem?.id === item?.id ? 'ring-2 ring-amber-800' : ''}
                    `}
                    title={item ? `${item.name} (${rConfig?.label})` : undefined}
                  >
                    {item && (
                      <>
                        <ItemIcon iconName={item.icon || 'Package'} itemId={item.id} />
                        
                        {/* Equipped Indicator Badge */}
                        {isItemEquipped && (
                          <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-800 border border-white rounded-full shadow" title="Vybaveno v boji" />
                        )}

                        {/* Potion Indicator */}
                        {item.type === 'lektvar' && (
                          <div className="absolute bottom-1 right-1 text-[8px] font-cinzel font-bold text-emerald-800 bg-emerald-100 px-1 rounded">
                            +{item.healing_amount || 25}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};


