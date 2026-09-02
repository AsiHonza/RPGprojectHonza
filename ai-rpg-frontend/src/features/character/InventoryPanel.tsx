import React from 'react';
import { ItemIcon } from '../../components/ui/ItemIcon';
import { X, Package } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export const InventoryPanel = ({ isOpen, onClose, selectedItem, setSelectedItem }: any) => {
  const { inventory, equipped, setEquipped, gold, hp, stats } = useGameStore();

  if (!isOpen) return null;

  return (
<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-5xl bg-[#2b4c5e] rounded-lg border-4 border-[#90a4ae] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-[#e3dcc8] p-4 flex justify-between items-center border-b-4 border-[#90a4ae]">
              <div className="flex items-center gap-2 text-[#b74b4b] font-bold text-2xl uppercase tracking-widest">
                <Package size={28} /> Inventář
              </div>
              <button onClick={() => onClose()} className="text-[#2b4c5e] hover:text-[#b74b4b] transition">
                <X size={28} />
              </button>
            </div>

            {/* Modal Body - 3 Columns */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#1e3746] flex flex-col md:flex-row gap-6">
              
              {/* Column 1: Equipment & Stats */}
              <div className="flex-1 flex flex-col gap-6">
                <div className="bg-[#2b4c5e] border-2 border-[#455a64] p-4 rounded flex flex-col items-center gap-4">
                  <h3 className="text-[#90a4ae] uppercase font-bold text-sm tracking-widest border-b border-[#455a64] w-full text-center pb-2">Vybavení</h3>
                  
                  {/* Slots Grid */}
                  <div className="grid grid-cols-3 gap-2">
                    {/* Top Row: Empty, Head, Empty */}
                    <div></div>
                    <div className="w-16 h-16 bg-[#1b262c] border-2 border-[#90a4ae] rounded flex justify-center items-center cursor-pointer hover:border-[#f4f1e1] transition relative"
                         onClick={() => setSelectedItem(inventory.find(i => i.id === equipped['hlava']) || null)}>
                      {equipped['hlava'] ? <ItemIcon iconName={inventory.find(i => i.id === equipped['hlava'])?.icon || 'Shirt'} itemId={equipped['hlava']} className="transform scale-75" /> : <span className="text-[#455a64] text-xs">Hlava</span>}
                    </div>
                    <div></div>

                    {/* Middle Row: Main Hand, Chest, Off Hand */}
                    <div className="w-16 h-16 bg-[#1b262c] border-2 border-[#90a4ae] rounded flex justify-center items-center cursor-pointer hover:border-[#f4f1e1] transition relative"
                         onClick={() => setSelectedItem(inventory.find(i => i.id === equipped['hlavní ruka']) || null)}>
                      {equipped['hlavní ruka'] ? <ItemIcon iconName={inventory.find(i => i.id === equipped['hlavní ruka'])?.icon || 'Sword'} itemId={equipped['hlavní ruka']} className="transform scale-75" /> : <span className="text-[#455a64] text-xs">Zbraň</span>}
                    </div>
                    <div className="w-16 h-16 bg-[#1b262c] border-2 border-[#90a4ae] rounded flex justify-center items-center cursor-pointer hover:border-[#f4f1e1] transition relative"
                         onClick={() => setSelectedItem(inventory.find(i => i.id === equipped['hruď']) || null)}>
                      {equipped['hruď'] ? <ItemIcon iconName={inventory.find(i => i.id === equipped['hruď'])?.icon || 'Shirt'} itemId={equipped['hruď']} className="transform scale-75" /> : <span className="text-[#455a64] text-xs">Hruď</span>}
                    </div>
                    <div className="w-16 h-16 bg-[#1b262c] border-2 border-[#90a4ae] rounded flex justify-center items-center cursor-pointer hover:border-[#f4f1e1] transition relative"
                         onClick={() => setSelectedItem(inventory.find(i => i.id === equipped['druhá ruka']) || null)}>
                      {equipped['druhá ruka'] ? <ItemIcon iconName={inventory.find(i => i.id === equipped['druhá ruka'])?.icon || 'Shield'} itemId={equipped['druhá ruka']} className="transform scale-75" /> : <span className="text-[#455a64] text-xs">Štít</span>}
                    </div>

                    {/* Bottom Row: Ring, Neck, Empty */}
                    <div className="w-16 h-16 bg-[#1b262c] border-2 border-[#90a4ae] rounded flex justify-center items-center cursor-pointer hover:border-[#f4f1e1] transition relative"
                         onClick={() => setSelectedItem(inventory.find(i => i.id === equipped['prsten']) || null)}>
                      {equipped['prsten'] ? <ItemIcon iconName={inventory.find(i => i.id === equipped['prsten'])?.icon || 'Ring'} itemId={equipped['prsten']} className="transform scale-75" /> : <span className="text-[#455a64] text-xs">Prsten</span>}
                    </div>
                    <div className="w-16 h-16 bg-[#1b262c] border-2 border-[#90a4ae] rounded flex justify-center items-center cursor-pointer hover:border-[#f4f1e1] transition relative"
                         onClick={() => setSelectedItem(inventory.find(i => i.id === equipped['krk']) || null)}>
                      {equipped['krk'] ? <ItemIcon iconName={inventory.find(i => i.id === equipped['krk'])?.icon || 'Ring'} itemId={equipped['krk']} className="transform scale-75" /> : <span className="text-[#455a64] text-xs">Krk</span>}
                    </div>
                    <div></div>
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-[#2b4c5e] border-2 border-[#455a64] p-4 rounded text-[#90a4ae]">
                  <h3 className="uppercase font-bold text-sm tracking-widest border-b border-[#455a64] pb-2 mb-2">Statistiky</h3>
                  <div className="flex justify-between py-1"><span>Zdraví:</span> <span className="font-bold text-[#f4f1e1]">{hp}</span></div>
                  <div className="flex justify-between py-1"><span>Síla (STR):</span> <span className="font-bold text-[#f4f1e1]">{stats.str}</span></div>
                  <div className="flex justify-between py-1"><span>Obratnost (DEX):</span> <span className="font-bold text-[#f4f1e1]">{stats.dex}</span></div>
                  <div className="flex justify-between py-1"><span>Odolnost (CON):</span> <span className="font-bold text-[#f4f1e1]">{stats.con}</span></div>
                  <div className="flex justify-between py-1"><span>Inteligence (INT):</span> <span className="font-bold text-[#f4f1e1]">{stats.intel}</span></div>
                  <div className="flex justify-between py-1"><span>Moudrost (WIS):</span> <span className="font-bold text-[#f4f1e1]">{stats.wis}</span></div>
                  <div className="flex justify-between py-1"><span>Charisma (CHA):</span> <span className="font-bold text-[#f4f1e1]">{stats.cha}</span></div>
                </div>
              </div>

              {/* Column 2: Selected Item Details */}
              <div className="flex-1 bg-[#2b4c5e] border-2 border-[#455a64] p-6 rounded flex flex-col items-center text-center relative min-h-[300px]">
                {selectedItem ? (
                  <>
                    <div className="w-48 h-48 mx-auto mb-4 bg-[#1b262c] border-2 border-[#b74b4b] rounded flex items-center justify-center">
                      {selectedItem && (
                        <ItemIcon iconName={selectedItem.icon} itemId={selectedItem.id} size={192} />
                      )}
                    </div>
                    
                    <h2 className="text-2xl text-[#f4f1e1] font-bold mb-1">{selectedItem.name}</h2>
                    <p className="text-[#90a4ae] text-sm uppercase mb-4">{selectedItem.type} • {selectedItem.slot}</p>
                    
                    <div className="bg-[#1e3746] w-full p-4 rounded text-sm text-[#e3dcc8] mb-4 text-left">
                      <p className="mb-2 italic">{selectedItem.description}</p>
                      <p className="font-bold text-[#90a4ae]">{selectedItem.stats}</p>
                    </div>

                    <p className="text-[#90a4ae] font-bold mb-6 text-lg">Hodnota: {selectedItem.sell_price} Zl.</p>
                    
                    <div className="mt-auto w-full flex flex-col gap-2">
                      {Object.values(equipped).includes(selectedItem.id) ? (
                        <button 
                          onClick={() => {
                            // Find which slot holds this item
                            const slotKey = Object.keys(equipped).find(k => equipped[k as keyof typeof equipped] === selectedItem.id);
                            if (slotKey) {
                              setEquipped({ ...equipped, [slotKey]: null });
                            }
                          }}
                          className="w-full py-2 bg-[#1b262c] border border-[#90a4ae] text-[#90a4ae] hover:bg-[#90a4ae] hover:text-[#1b262c] font-bold uppercase transition"
                        >
                          Odložit
                        </button>
                      ) : (
                        selectedItem.slot?.toLowerCase().trim() !== "žádný" && (
                          <button 
                            onClick={() => {
                              const normSlot = selectedItem.slot?.toLowerCase().trim();
                              // map slightly wrong slots
                              let finalSlot = normSlot;
                              if (normSlot.includes("hlavní") || normSlot.includes("zbraň") || normSlot.includes("ruka") && !normSlot.includes("druhá")) finalSlot = "hlavní ruka";
                              if (normSlot.includes("druhá") || normSlot.includes("štít")) finalSlot = "druhá ruka";
                              if (normSlot.includes("hruď") || normSlot.includes("brnění") || normSlot.includes("zbroj") || normSlot.includes("tělo")) finalSlot = "hruď";
                              
                              setEquipped({ ...equipped, [finalSlot]: selectedItem.id });
                            }}
                            className="w-full py-2 bg-[#b74b4b] border border-[#b74b4b] text-[#f4f1e1] hover:bg-[#8a3333] font-bold uppercase transition shadow-lg"
                          >
                            Vybavit
                          </button>
                        )
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-[#455a64] italic">
                    Vyberte předmět z batohu
                  </div>
                )}
              </div>

              {/* Column 3: Bag Grid */}
              <div className="flex-1 bg-[#2b4c5e] border-2 border-[#455a64] p-4 rounded">
                <h3 className="text-[#90a4ae] uppercase font-bold text-sm tracking-widest border-b border-[#455a64] pb-2 mb-4">Batoh</h3>
                
                <div className="grid grid-cols-4 gap-2">
                  {/* Render 20 slots minimum, fill with items first */}
                  {Array.from({ length: Math.max(20, inventory.length) }).map((_, i) => {
                    const item = inventory[i];
                    return (
                      <div 
                        key={i} 
                        onClick={() => item && setSelectedItem(item)}
                        className={`aspect-square bg-[#1b262c] border-2 rounded flex justify-center items-center transition relative
                          ${item ? 'border-[#90a4ae] cursor-pointer hover:border-[#f4f1e1]' : 'border-[#1e3746]'}
                          ${selectedItem?.id === item?.id ? 'ring-2 ring-[#b74b4b]' : ''}
                        `}
                      >
                        {item && (
                          <>
                            <ItemIcon iconName={item.icon || 'Package'} itemId={item.id} />
                            
                            {/* Equipped indicator */}
                            {Object.values(equipped).includes(item.id) && (
                              <div className="absolute top-1 right-1 w-2 h-2 bg-[#b74b4b] rounded-full"></div>
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
