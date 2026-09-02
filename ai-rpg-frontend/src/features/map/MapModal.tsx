import React, { useState } from 'react';
import { X, Map as MapIcon, Footprints } from 'lucide-react';
import HexMap from '../../components/map/HexMap';
import { useGameStore } from '../../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';

function hexDistance(q1: number, r1: number, q2: number, r2: number) {
    return (Math.abs(q1 - q2) + Math.abs(q1 + r1 - q2 - r2) + Math.abs(r1 - r2)) / 2;
}

export const MapModal = ({ isOpen, onClose, setSelectedItem, onTravel }: any) => {
  const { worldData, playerLocation, day, rations } = useGameStore();
  const [selectedHex, setSelectedHex] = useState<any>(null);

  if (!isOpen || !worldData) return null;

  const handleHexClick = (hex: any) => {
    setSelectedHex(hex);
    if(hex.nazev) {
      setSelectedItem({
         id: `${hex.q}_${hex.r}`,
         name: hex.nazev,
         desc: hex.popis || (hex.is_poi ? "Zajímavé místo..." : "Divoká příroda"),
         type: hex.poi_type || hex.terrain
      });
    } else {
        setSelectedItem(null);
    }
  };

  const handleTravelClick = () => {
    if (selectedHex && onTravel) {
      onTravel(selectedHex.q, selectedHex.r);
      setSelectedHex(null);
    }
  };

  let dist = 999;
  let canTravel = false;
  let travelError = "";

  if (selectedHex && playerLocation) {
    dist = hexDistance(playerLocation.q, playerLocation.r, selectedHex.q, selectedHex.r);
    if (dist === 0) {
      travelError = "Už jsi tady.";
    } else if (dist > 1) {
      travelError = "Můžeš cestovat jen o 1 hex.";
    } else if (['Ocean'].includes(selectedHex.terrain)) {
      travelError = "Neprostupný oceán.";
    } else if (['Swamp', 'Wasteland', 'Desert', 'Mountains'].includes(selectedHex.terrain) && rations < 2) {
      travelError = "Do nehostinného terénu potřebuješ alespoň 2 zásoby jídla (Zemřel bys hlady).";
    } else {
      canTravel = true;
    }
  }

  return (
    <div className="absolute inset-0 bg-black/80 z-[100] flex items-center justify-center p-2 md:p-8">
      <div className="bg-[#e3dcc8] w-full h-full max-h-screen max-w-6xl rounded shadow-2xl relative overflow-hidden border-4 border-[#1b262c] bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] bg-cover">
        
        {/* Header */}
        <div className="absolute top-4 left-4 z-50 bg-[#f4f1e1]/90 px-4 py-2 rounded border border-[#90a4ae] shadow-lg pointer-events-none flex flex-col gap-1">
          <h2 className="text-[#b74b4b] font-bold text-xl uppercase font-medieval tracking-widest drop-shadow flex items-center gap-2">
            <MapIcon size={20} /> Světová mapa
          </h2>
          <div className="text-sm font-lora font-bold text-[#1b262c]">
            Den: {day} | Zásoby: {rations}
          </div>
        </div>

        <button onClick={() => onClose()} className="absolute top-4 right-4 bg-[#1b262c] text-[#f4f1e1] p-2 rounded hover:bg-[#b74b4b] transition z-50 border border-[#90a4ae]">
          <X size={24} />
        </button>

        <div className="relative w-full h-full min-h-[600px]">
          <HexMap 
            worldData={worldData}
            setSelectedItem={setSelectedItem}
            playerLocation={playerLocation}
            onHexClick={handleHexClick} 
          />
        </div>

        {/* Travel Confirmation Popup */}
        <AnimatePresence>
          {selectedHex && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-4 top-20 w-80 bg-[#111827]/95 backdrop-blur-sm border-2 border-rpg-magic p-4 rounded-xl shadow-2xl z-50"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-cinzel font-bold text-rpg-magic text-xl">
                  {selectedHex.nazev || "Divočina"}
                </h3>
                <button onClick={() => setSelectedHex(null)} className="text-gray-400 hover:text-white">
                  <X size={16} />
                </button>
              </div>
              
              <div className="text-gray-300 font-lora text-sm mb-4">
                <p><strong>Terén:</strong> {selectedHex.terrain}</p>
                <p className="mt-1">{selectedHex.popis || "Pustý kraj bez zajímavostí."}</p>
              </div>

              {dist > 0 && (
                <div className="bg-black/50 p-3 rounded border border-gray-700 mb-4 text-sm font-lora">
                  <p className="text-gray-300 mb-1">Náklady na cestu:</p>
                  <ul className="text-rpg-blood">
                    <li>⏱ 1 Den</li>
                    <li>🍖 1 Zásoba (Jídlo)</li>
                  </ul>
                  {travelError && <p className="text-red-500 mt-2 text-xs font-bold">{travelError}</p>}
                </div>
              )}

              {canTravel && (
                <button
                  onClick={handleTravelClick}
                  className="w-full bg-rpg-blood hover:bg-red-800 text-white font-cinzel font-bold py-2 rounded shadow transition flex items-center justify-center gap-2"
                >
                  <Footprints size={18} />
                  Vydat se na cestu
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
