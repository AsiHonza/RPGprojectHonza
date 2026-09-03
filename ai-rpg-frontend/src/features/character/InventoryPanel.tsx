import React from 'react';
import { ItemIcon } from '../../components/ui/ItemIcon';
import { X, Package, Shield, Swords, Sparkles, Heart, Plus, Trash2 } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

const RARITY_MAP: Record<string, { label: string; border: string; text: string; bg: string }> = {
  common: { label: 'Běžný', border: 'border-slate-400', text: 'text-slate-300', bg: 'bg-slate-800/60' },
  uncommon: { label: 'Magický', border: 'border-emerald-500', text: 'text-emerald-400', bg: 'bg-emerald-950/60' },
  rare: { label: 'Vzácný', border: 'border-sky-500', text: 'text-sky-400', bg: 'bg-sky-950/60' },
  epic: { label: 'Epický', border: 'border-purple-500', text: 'text-purple-400', bg: 'bg-purple-950/60' },
  legendary: { label: 'Legendární', border: 'border-amber-500', text: 'text-amber-400', bg: 'bg-amber-950/60' },
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
        className={`w-16 h-16 bg-[#1b262c] border-2 rounded flex flex-col justify-center items-center cursor-pointer transition relative
          ${item ? `${rConfig?.border} shadow-sm` : 'border-[#455a64] hover:border-[#90a4ae]'}
          ${selectedItem?.id === itemId ? 'ring-2 ring-[#b74b4b]' : ''}
        `}
        onClick={() => setSelectedItem(item || null)}
        title={item ? `${item.name} (${slotName})` : slotName}
      >
        {item ? (
          <>
            <ItemIcon iconName={item.icon || defaultIcon} itemId={item.id} className="transform scale-75" />
            <span className="text-[9px] text-[#90a4ae] truncate max-w-[56px] text-center px-0.5">{item.name}</span>
          </>
        ) : (
          <span className="text-[#455a64] text-[10px] uppercase font-bold tracking-tighter">{slotName}</span>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-5xl bg-[#2b4c5e] rounded-xl border-4 border-[#90a4ae] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-[#e3dcc8] px-6 py-4 flex justify-between items-center border-b-4 border-[#90a4ae]">
          <div className="flex items-center gap-3 text-[#b74b4b] font-bold text-2xl uppercase tracking-widest">
            <Package size={28} /> Inventář a Vybavení
          </div>
          <button 
            onClick={() => onClose()} 
            className="text-[#2b4c5e] hover:text-[#b74b4b] transition p-1 hover:bg-[#d0c7b0] rounded-full"
          >
            <X size={26} />
          </button>
        </div>

        {/* Modal Body - 3 Columns */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#1e3746] flex flex-col md:flex-row gap-6">
          
          {/* Column 1: Equipment & Stats */}
          <div className="flex-1 flex flex-col gap-5">
            {/* Equipment Grid */}
            <div className="bg-[#2b4c5e] border-2 border-[#455a64] p-4 rounded-lg flex flex-col items-center gap-3">
              <h3 className="text-[#f4f1e1] uppercase font-bold text-sm tracking-widest border-b border-[#455a64] w-full text-center pb-2">
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
                {renderSlot('krk', 'Krk', 'Ring')}
                <div></div>
              </div>
            </div>

            {/* Combat Totals & RPG Stats */}
            <div className="bg-[#2b4c5e] border-2 border-[#455a64] p-4 rounded-lg text-[#90a4ae] flex flex-col gap-3">
              <h3 className="uppercase font-bold text-sm tracking-widest text-[#f4f1e1] border-b border-[#455a64] pb-2">
                Atributy a Boj
              </h3>

              {/* Combat Summary Badges */}
              <div className="grid grid-cols-2 gap-2 bg-[#1b262c] p-2.5 rounded border border-[#455a64]">
                <div className="flex items-center gap-2 text-[#f4f1e1]">
                  <Swords size={18} className="text-amber-400 shrink-0" />
                  <div>
                    <div className="text-[10px] uppercase text-[#90a4ae]">Celkový Útok</div>
                    <div className="font-bold text-base text-amber-400">+{totalAttack}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[#f4f1e1]">
                  <Shield size={18} className="text-sky-400 shrink-0" />
                  <div>
                    <div className="text-[10px] uppercase text-[#90a4ae]">Třída Zbroje (AC)</div>
                    <div className="font-bold text-base text-sky-400">{totalAc}</div>
                  </div>
                </div>
              </div>

              {/* Health */}
              <div className="flex justify-between items-center py-1 border-b border-[#455a64]/50">
                <span className="flex items-center gap-1.5 text-[#e3dcc8]"><Heart size={16} className="text-red-400" /> Zdraví:</span>
                <span className="font-bold text-[#f4f1e1] text-base">{hp} / {maxHp} HP</span>
              </div>

              {/* Skill Points Available Banner */}
              {skillPoints > 0 && (
                <div className="bg-amber-500/20 border border-amber-400/50 p-2 rounded flex items-center justify-between animate-pulse">
                  <span className="text-amber-300 text-xs font-bold flex items-center gap-1">
                    <Sparkles size={14} /> Volné body: {skillPoints}
                  </span>
                  <span className="text-[10px] text-amber-200">Klikni [+] pro vylepšení</span>
                </div>
              )}

              {/* Individual Attributes */}
              {[
                { key: 'str', label: 'Síla (STR)', val: stats?.str ?? 10 },
                { key: 'dex', label: 'Obratnost (DEX)', val: stats?.dex ?? 10 },
                { key: 'con', label: 'Odolnost (CON)', val: stats?.con ?? 10 },
                { key: 'intel', label: 'Inteligence (INT)', val: stats?.intel ?? 10 },
                { key: 'wis', label: 'Moudrost (WIS)', val: stats?.wis ?? 10 },
                { key: 'cha', label: 'Charisma (CHA)', val: stats?.cha ?? 10 },
              ].map(st => (
                <div key={st.key} className="flex justify-between items-center py-0.5">
                  <span className="text-sm">{st.label}:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#f4f1e1] text-sm">{st.val}</span>
                    {skillPoints > 0 && (
                      <button
                        onClick={() => spendSkillPoint(st.key)}
                        className="w-5 h-5 bg-amber-600 hover:bg-amber-500 text-white rounded flex items-center justify-center transition shadow font-bold"
                        title={`Přidat 1 bod k ${st.label}`}
                      >
                        <Plus size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Selected Item Details */}
          <div className="flex-1 bg-[#2b4c5e] border-2 border-[#455a64] p-5 rounded-lg flex flex-col items-center text-center relative min-h-[340px]">
            {selectedItem ? (
              (() => {
                const rConfig = getRarityConfig(selectedItem.rarity);
                const isEquipped = Object.values(equipped).includes(selectedItem.id);
                const isPotion = selectedItem.type === 'lektvar';

                return (
                  <>
                    <div className={`w-36 h-36 mx-auto mb-3 bg-[#1b262c] border-2 ${rConfig.border} rounded-lg flex items-center justify-center shadow-inner relative`}>
                      <ItemIcon iconName={selectedItem.icon || 'Package'} itemId={selectedItem.id} size={110} />
                      <span className={`absolute bottom-1 right-2 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${rConfig.bg} ${rConfig.text}`}>
                        {rConfig.label}
                      </span>
                    </div>
                    
                    <h2 className={`text-xl font-bold mb-0.5 ${rConfig.text}`}>{selectedItem.name}</h2>
                    <p className="text-[#90a4ae] text-xs uppercase tracking-wider mb-3">
                      {selectedItem.type} • {selectedItem.slot || 'bez slotu'}
                    </p>
                    
                    <div className="bg-[#1e3746] w-full p-3.5 rounded-lg text-sm text-[#e3dcc8] mb-4 text-left border border-[#455a64]">
                      <p className="mb-2 italic text-xs leading-relaxed text-[#cfd8dc]">{selectedItem.description || 'Obyčejný předmět nalezený na cestách.'}</p>
                      
                      {/* Numerical Modifiers */}
                      <div className="flex flex-wrap gap-2 pt-1 border-t border-[#455a64]/60 text-xs">
                        {Number(selectedItem.attack_bonus) > 0 && (
                          <span className="font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                            Útok: +{selectedItem.attack_bonus}
                          </span>
                        )}
                        {Number(selectedItem.defense_bonus) > 0 && (
                          <span className="font-bold text-sky-400 bg-sky-950/40 px-2 py-0.5 rounded border border-sky-800/40">
                            Obrana: +{selectedItem.defense_bonus} AC
                          </span>
                        )}
                        {Number(selectedItem.healing_amount) > 0 && (
                          <span className="font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                            Léčení: +{selectedItem.healing_amount} HP
                          </span>
                        )}
                        {selectedItem.stats && !selectedItem.attack_bonus && !selectedItem.defense_bonus && (
                          <span className="font-bold text-[#90a4ae]">{selectedItem.stats}</span>
                        )}
                      </div>
                    </div>

                    <div className="text-[#e3dcc8] font-bold mb-4 text-sm flex items-center justify-between w-full px-2">
                      <span className="text-[#90a4ae]">Cena u kupce:</span>
                      <span className="text-amber-400">{selectedItem.sell_price || 5} Zl.</span>
                    </div>
                    
                    <div className="mt-auto w-full flex flex-col gap-2">
                      {/* Potion Drink Action */}
                      {isPotion && (
                        <button
                          onClick={() => usePotion(selectedItem)}
                          className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-600 border border-emerald-500 text-white font-bold uppercase text-xs tracking-wider transition shadow-lg rounded"
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
                            className="w-full py-2 bg-[#1b262c] border border-[#90a4ae] text-[#90a4ae] hover:bg-[#90a4ae] hover:text-[#1b262c] font-bold uppercase text-xs tracking-wider transition rounded"
                          >
                            Odložit
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
                            className="w-full py-2 bg-[#b74b4b] hover:bg-[#8a3333] border border-[#b74b4b] text-[#f4f1e1] font-bold uppercase text-xs tracking-wider transition shadow-lg rounded"
                          >
                            Vybavit do výstroje
                          </button>
                        )
                      )}

                      {/* Drop Item Action */}
                      <button
                        onClick={() => dropItem(selectedItem)}
                        className="w-full py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-transparent hover:border-red-900/50 rounded flex items-center justify-center gap-1.5 transition"
                      >
                        <Trash2 size={13} /> Zahodit předmět
                      </button>
                    </div>
                  </>
                );
              })()
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-[#455a64] italic text-sm gap-2">
                <Package size={40} className="opacity-40" />
                Vyberte předmět z batohu pro zobrazení detailů a akcí
              </div>
            )}
          </div>

          {/* Column 3: Bag Grid */}
          <div className="flex-1 bg-[#2b4c5e] border-2 border-[#455a64] p-4 rounded-lg flex flex-col">
            <div className="flex justify-between items-center border-b border-[#455a64] pb-2 mb-4">
              <h3 className="text-[#f4f1e1] uppercase font-bold text-sm tracking-widest">
                Batoh ({inventory.length} / 20)
              </h3>
              <span className="text-amber-400 font-bold text-xs bg-[#1b262c] px-2 py-1 rounded border border-amber-500/30">
                {gold} Zl.
              </span>
            </div>
            
            <div className="grid grid-cols-4 gap-2 flex-1">
              {Array.from({ length: Math.max(20, inventory.length) }).map((_, i) => {
                const item = inventory[i];
                const rConfig = item ? getRarityConfig(item.rarity) : null;
                const isItemEquipped = item && Object.values(equipped).includes(item.id);

                return (
                  <div 
                    key={i} 
                    onClick={() => item && setSelectedItem(item)}
                    className={`aspect-square bg-[#1b262c] border-2 rounded-lg flex justify-center items-center transition relative
                      ${item ? `${rConfig?.border} cursor-pointer hover:scale-105 shadow-sm` : 'border-[#1e3746]'}
                      ${selectedItem?.id === item?.id ? 'ring-2 ring-amber-400' : ''}
                    `}
                    title={item ? `${item.name} (${rConfig?.label})` : undefined}
                  >
                    {item && (
                      <>
                        <ItemIcon iconName={item.icon || 'Package'} itemId={item.id} />
                        
                        {/* Equipped Indicator Badge */}
                        {isItemEquipped && (
                          <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#b74b4b] border border-white rounded-full shadow" title="Vybaveno v boji" />
                        )}

                        {/* Potion Indicator */}
                        {item.type === 'lektvar' && (
                          <div className="absolute bottom-1 right-1 text-[8px] font-bold text-emerald-400">
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

