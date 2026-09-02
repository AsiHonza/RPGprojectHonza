import React from 'react';
import { X, Users, Map, MapPin } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export const NpcsModal = ({ isOpen, onClose, setMapOpen }: any) => {
  const { npcs, worldData } = useGameStore();

  if (!isOpen) return null;

  return (
          <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-[#f4f1e1] border-2 border-[#b74b4b] rounded max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-[#90a4ae] bg-[#e3dcc8]">
                <div className="flex items-center gap-2 text-[#b74b4b] font-bold text-2xl uppercase tracking-widest font-medieval">
                  <Users size={28} /> Deník postav
                </div>
                              {worldData && (
                <button onClick={() => setMapOpen(true)} className="flex items-center gap-1 font-bold text-[#2b4c5e] hover:text-[#b74b4b] transition cursor-pointer bg-[#e3dcc8] px-2 py-1 rounded border border-[#90a4ae]" title="Mapa světa">
                  <Map size={18} />
                </button>
              )}
              <button onClick={() => onClose()} className="text-[#2b4c5e] hover:text-[#b74b4b] transition">
                  <X size={28} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-[url('/assets/parchment.jpg')] bg-cover bg-center">
                {npcs.length === 0 ? (
                  <div className="text-center text-[#455a64] py-8 italic font-serif">Zatím jsi nepotkal nikoho důležitého...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {npcs.map((npc, idx) => (
                      <div key={idx} className="bg-[#1b262c]/80 border border-[#90a4ae] rounded p-4 flex flex-col gap-2 relative">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-[#d4af37] font-bold font-medieval text-lg uppercase">{npc.jmeno}</h3>
                          <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded border font-bold ${npc.vztah.toLowerCase().includes('přát') ? 'bg-green-900/50 text-green-400 border-green-500' : npc.vztah.toLowerCase().includes('nepř') ? 'bg-red-900/50 text-red-400 border-red-500' : 'bg-yellow-900/50 text-yellow-400 border-yellow-500'}`}>
                            {npc.vztah}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[#90a4ae] text-xs">
                          <MapPin size={12} /> {npc.lokace}
                        </div>
                        <p className="text-[#f4f1e1] text-sm font-serif italic mt-2">{npc.popis}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

  );
};
