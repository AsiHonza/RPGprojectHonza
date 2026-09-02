import React, { useMemo, useState } from 'react';
import { Grid, defineHex, rectangle, Orientation } from 'honeycomb-grid';
import { User, Castle, Skull, MapPin, Mountain, Trees, Waves, Wind, Droplets, Flame, Home, Star, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HEX_SIZE = 16;
class CustomHex extends defineHex({ dimensions: HEX_SIZE, orientation: Orientation.POINTY }) {}

interface HexMapProps {
  playerLocation?: {q: number, r: number} | null;
  worldData: any;
  onHexClick?: (hex: any) => void;
  setSelectedItem: (item: any) => void;
}

export const MapModal = ({ isOpen, onClose, setSelectedItem }: any) => {
    // Moved to separate file to just rewrite HexMap.tsx safely
}

export default function HexMap({ worldData, onHexClick, setSelectedItem, playerLocation }: HexMapProps) {
  const [hoveredHex, setHoveredHex] = useState<any>(null);

  const enrichedGrid = useMemo(() => {
    if (!worldData?.hex_grid) return [];
    return worldData.hex_grid.map((hex: any) => {
      const locationLore = worldData.locations?.find((l: any) => l.q === hex.q && l.r === hex.r);
      return {
        ...hex,
        nazev: locationLore?.nazev || null,
        popis: locationLore?.popis || null,
      };
    });
  }, [worldData]);

  const hexes = enrichedGrid.map(h => new CustomHex({ q: h.q, r: h.r }));
  const grid = new Grid(CustomHex, hexes);

  // Pastel watercolor tints for 7 kingdoms
  const getKingdomColor = (k_id: number | null) => {
    switch (k_id) {
      case 1: return 'fill-red-900/20'; // Aurelie
      case 2: return 'fill-blue-900/20';
      case 3: return 'fill-green-900/20';
      case 4: return 'fill-yellow-600/20';
      case 5: return 'fill-purple-900/20';
      case 6: return 'fill-cyan-900/20';
      case 7: return 'fill-indigo-900/20';
      default: return 'fill-transparent'; // Ocean or unexplored
    }
  };

  const getTerrainIcon = (terrain: string) => {
    switch (terrain) {
      case 'Ocean': return <Waves size={14} className="text-[#2b4c5e]/40" />;
      case 'Mountains': return <Mountain size={16} className="text-[#455a64]/60" />;
      case 'Forest': return <Trees size={16} className="text-[#2d4c1e]/60" />;
      case 'Swamp': return <Droplets size={14} className="text-[#3d4536]/60" />;
      case 'Wasteland': return <Flame size={14} className="text-[#b74b4b]/40" />;
      case 'Plains': return null; // Clean parchment
      default: return null;
    }
  };

  const getPoiIcon = (poi: string) => {
    if (!poi) return null;
    switch (poi) {
      case 'Capital': return <Castle size={20} className="text-rpg-magic drop-shadow-[0_0_5px_rgba(197,160,89,0.8)]" />;
      case 'Village': return <Home size={16} className="text-rpg-paper drop-shadow-md" />;
      case 'Dungeon': return <Skull size={18} className="text-rpg-blood drop-shadow-[0_0_5px_rgba(183,75,75,0.8)]" />;
      case 'Shrine': return <Star size={16} className="text-indigo-300 drop-shadow-[0_0_5px_rgba(165,180,252,0.8)]" />;
      case 'Ruin': return <Eye size={16} className="text-[#90a4ae] drop-shadow-md" />;
      default: return <MapPin size={16} className="text-rpg-paper" />;
    }
  };

  const minX = Math.min(...hexes.map(h => h.corners[3].x));
  const maxX = Math.max(...hexes.map(h => h.corners[0].x));
  const minY = Math.min(...hexes.map(h => h.corners[4].y));
  const maxY = Math.max(...hexes.map(h => h.corners[1].y));
  
  const width = (maxX - minX) + 100;
  const height = (maxY - minY) + 100;
  const offsetX = -minX + 50;
  const offsetY = -minY + 50;

  return (
    <div className="w-full h-full relative bg-[#e3dcc8] bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] overflow-auto custom-scrollbar border-4 border-rpg-obsidian rounded shadow-inner">
      <svg 
        width={width} 
        height={height} 
        className="cursor-crosshair"
      >
        <g transform={`translate(${offsetX}, ${offsetY})`}>
          {grid.toArray().map((hex, i) => {
            const { x, y } = hex;
            const points = hex.corners.map(c => `${c.x},${c.y}`).join(' ');
            const hexData = enrichedGrid[i];
            if (!hexData) return null;

            return (
              <g 
                key={i} 
                className="group"
                onMouseEnter={() => setHoveredHex(hexData)}
                onMouseLeave={() => setHoveredHex(null)}
                onClick={() => onHexClick && onHexClick(hexData)}
              >
                {/* Kingdom Watercolor Tint */}
                <polygon 
                  points={points}
                  className={`${getKingdomColor(hexData.kingdom_id)} stroke-[#455a64]/20 stroke-[0.5] transition-all duration-300 group-hover:stroke-rpg-magic group-hover:stroke-2 group-hover:fill-rpg-magic/10 cursor-pointer`}
                />
                
                {/* Terrain Ink Icon */}
                {!hexData.poi && (
                    <foreignObject 
                    x={x + HEX_SIZE - 8} 
                    y={y + HEX_SIZE * 0.866 - 8} 
                    width={16} 
                    height={16}
                    className="pointer-events-none overflow-visible opacity-70"
                    >
                    <div className="flex items-center justify-center w-full h-full">
                        {getTerrainIcon(hexData.terrain)}
                    </div>
                    </foreignObject>
                )}


                {/* Player Pawn */}
                {playerLocation?.q === hexData.q && playerLocation?.r === hexData.r && (
                  <foreignObject 
                    x={x + HEX_SIZE - 12} 
                    y={y + HEX_SIZE * 0.866 - 20} 
                    width={24} 
                    height={24}
                    className="pointer-events-none overflow-visible z-50 animate-bounce"
                  >
                    <div className="flex items-center justify-center w-full h-full text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.9)]">
                      <User size={24} strokeWidth={3} />
                    </div>
                  </foreignObject>
                )}
                {/* POI Icon */}
                {hexData.poi && (
                  <foreignObject 
                    x={x + HEX_SIZE - 12} 
                    y={y + HEX_SIZE * 0.866 - 12} 
                    width={24} 
                    height={24}
                    className="pointer-events-none overflow-visible"
                  >
                    <div className="flex items-center justify-center w-full h-full">
                      {getPoiIcon(hexData.poi)}
                    </div>
                  </foreignObject>
                )}
                
                {/* Map Name Overlay (Only for Kingdoms or Capitals to avoid clutter) */}
                {hexData.nazev && hexData.poi === 'Capital' && (
                  <text 
                    x={x + HEX_SIZE} 
                    y={y + HEX_SIZE * 0.866 + 18} 
                    textAnchor="middle" 
                    className="text-[7px] font-cinzel font-bold fill-[#111827] drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] pointer-events-none uppercase tracking-widest"
                  >
                    {hexData.nazev}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
      
      {/* Tooltip */}
      <AnimatePresence>
        {hoveredHex && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#111827]/90 backdrop-blur-sm border border-rpg-magic p-4 rounded-xl shadow-2xl pointer-events-none max-w-sm w-full z-50 text-center"
          >
            {hoveredHex.nazev ? (
                <>
                    <h3 className="font-cinzel font-bold text-rpg-magic text-lg mb-1">{hoveredHex.nazev}</h3>
                    <p className="font-lora text-rpg-paper text-sm line-clamp-3 leading-relaxed">{hoveredHex.popis}</p>
                </>
            ) : (
                <>
                    <h3 className="font-cinzel font-bold text-[#e5e7eb] text-md capitalize">
                        {hoveredHex.terrain}
                    </h3>
                    {hoveredHex.kingdom_id && <p className="font-lora text-rpg-muted text-xs mt-1">Království {hoveredHex.kingdom_id}</p>}
                </>
            )}
            
            {hoveredHex.poi && (
              <div className="mt-2 text-xs font-bold uppercase tracking-widest text-[#90a4ae] border-t border-[#2b4c5e] pt-2">
                {hoveredHex.poi}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
