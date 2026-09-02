import React from 'react';
import { X } from 'lucide-react';
import HexMap from '../../components/map/HexMap';
import { useGameStore } from '../../store/gameStore';

export const MapModal = ({ isOpen, onClose, setSelectedItem }: any) => {
  const { worldData } = useGameStore();

  if (!isOpen || !worldData) return null;

  return (
          <div className="absolute inset-0 bg-black/80 z-[100] flex items-center justify-center p-2 md:p-8">
            <div className="bg-[#e3dcc8] w-full h-full max-h-screen max-w-6xl rounded shadow-2xl relative overflow-hidden border-4 border-[#1b262c] bg-[url('/assets/parchment.jpg')] bg-cover">
              
              <div className="absolute top-4 left-4 z-50 bg-[#f4f1e1]/90 px-4 py-2 rounded border border-[#90a4ae] shadow-lg pointer-events-none">
                <h2 className="text-[#b74b4b] font-bold text-xl uppercase font-medieval tracking-widest drop-shadow">Světová mapa</h2>
              </div>

              <button onClick={() => onClose()} className="absolute top-4 right-4 bg-[#1b262c] text-[#f4f1e1] p-2 rounded hover:bg-[#b74b4b] transition z-50 border border-[#90a4ae]">
                <X size={24} />
              </button>

                <div className="relative w-full h-full min-h-[600px]">
                  <HexMap 
                    worldData={worldData}
                    setSelectedItem={setSelectedItem}
                    onHexClick={(hex: any) => {
                      if(hex.nazev) {
                        setSelectedItem({
                           id: `${hex.q}_${hex.r}`,
                           name: hex.nazev,
                           desc: hex.popis || (hex.is_poi ? "Zajímavé místo..." : "Divoká příroda"),
                           type: hex.poi_type || hex.terrain
                        });
                      }
                    }} 
                  />
                </div>
            </div>
          </div>

  );
};
