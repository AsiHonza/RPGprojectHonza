"use client";

import React, { useMemo } from 'react';
import { defineHex, Grid, Hex } from 'honeycomb-grid';
import { motion } from 'framer-motion';
import { Mountain, Trees, Skull, Castle, Compass, MapPin } from 'lucide-react';

interface POI {
  q: number;
  r: number;
  type: string;
  terrain: string;
}

interface HexData {
  q: number;
  r: number;
  terrain: string;
  has_road: boolean;
  is_poi: boolean;
  poi_type?: string;
  nazev?: string;
  popis?: string;
}

interface HexMapProps {
  worldData: {
    hex_grid: HexData[];
    hex_radius: number;
    locations: any[];
  };
  onHexClick?: (hex: HexData) => void;
}

const HEX_SIZE = 30;
class CustomHex extends defineHex({ dimensions: HEX_SIZE, origin: 'topLeft' }) {}

export default function HexMap({ worldData, onHexClick }: HexMapProps) {
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

  // Use the list of hex coordinates to construct the grid
  const hexes = enrichedGrid.map(h => new CustomHex({ q: h.q, r: h.r }));
  const grid = new Grid(CustomHex, hexes);

  const getTerrainColor = (terrain: string) => {
    switch (terrain) {
      case 'Forest': return 'fill-[#2d4c1e]';
      case 'Mountains': return 'fill-[#4a4a4a]';
      case 'Plains': return 'fill-[#8b9c60]';
      case 'Swamp': return 'fill-[#3d4536]';
      case 'Desert': return 'fill-[#c2b280]';
      case 'Hills': return 'fill-[#687352]';
      default: return 'fill-[#90a4ae]';
    }
  };

  const getIcon = (hex: any) => {
    if (hex.is_poi) {
      if (hex.poi_type === 'City' || hex.poi_type === 'hlavni_mesto' || hex.poi_type === 'mesto') return <Castle size={20} className="text-rpg-paper" />;
      if (hex.poi_type === 'Ruins' || hex.poi_type === 'vesnice' || hex.poi_type === 'zajimavost') return <Skull size={20} className="text-rpg-blood" />;
      return <MapPin size={20} className="text-rpg-magic" />;
    }
    if (hex.terrain === 'Mountains') return <Mountain size={16} className="text-white/20" />;
    if (hex.terrain === 'Forest') return <Trees size={16} className="text-white/20" />;
    return null;
  };

  let minX = 0, minY = 0, maxX = 0, maxY = 0;
  if (grid.size > 0) {
    const coords = Array.from(grid).map(h => ({ x: h.x, y: h.y }));
    minX = Math.min(...coords.map(c => c.x));
    minY = Math.min(...coords.map(c => c.y));
    maxX = Math.max(...coords.map(c => c.x)) + HEX_SIZE * 2;
    maxY = Math.max(...coords.map(c => c.y)) + HEX_SIZE * 2;
  }
  
  const width = maxX - minX;
  const height = maxY - minY;

  return (
    <div className="w-full h-full overflow-hidden bg-rpg-obsidian rounded-lg relative cursor-grab active:cursor-grabbing border-2 border-rpg-blood">
      <div className="absolute top-2 left-2 bg-black/50 text-rpg-paper p-2 rounded text-xs z-10 flex items-center gap-2">
        <Compass size={16} /> Mapa světa
      </div>
      
      <div className="w-full h-full overflow-auto p-4 flex items-center justify-center">
        {grid.size > 0 && (
          <motion.svg 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            viewBox={`${minX - HEX_SIZE} ${minY - HEX_SIZE} ${width + HEX_SIZE*2} ${height + HEX_SIZE*2}`} 
            style={{ minWidth: width, minHeight: height }}
            className="w-full max-w-[800px] h-auto drop-shadow-2xl"
          >
            {enrichedGrid.map((hexData: any, i) => {
              const hex = new CustomHex({ q: hexData.q, r: hexData.r });
              const { x, y } = hex;
              const points = hex.corners.map((corner: any) => `${corner.x},${corner.y}`).join(' ');

              return (
                <motion.g 
                  key={`${hex.q}-${hex.r}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.005 }}
                  onClick={() => onHexClick && onHexClick(hexData)}
                  className="cursor-pointer group"
                >
                  <polygon 
                    points={points} 
                    className={`${getTerrainColor(hexData.terrain)} stroke-[#1b262c] stroke-1 transition-all duration-300 group-hover:stroke-rpg-magic group-hover:stroke-2`}
                  />
                  
                  {hexData.has_road && (
                    <circle cx={x + HEX_SIZE} cy={y + HEX_SIZE * 0.866} r={4} className="fill-[#8b7355] opacity-50" />
                  )}

                  <foreignObject 
                    x={x + HEX_SIZE - 12} 
                    y={y + HEX_SIZE * 0.866 - 12} 
                    width={24} 
                    height={24}
                    className="pointer-events-none overflow-visible"
                  >
                    <div className="flex items-center justify-center w-full h-full drop-shadow-md">
                      {getIcon(hexData)}
                    </div>
                  </foreignObject>
                  
                  {hexData.nazev && (
                    <text 
                      x={x + HEX_SIZE} 
                      y={y + HEX_SIZE * 1.5} 
                      textAnchor="middle" 
                      className="text-[8px] fill-rpg-paper font-bold pointer-events-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {hexData.nazev}
                    </text>
                  )}
                </motion.g>
              );
            })}
          </motion.svg>
        )}
      </div>
    </div>
  );
}
