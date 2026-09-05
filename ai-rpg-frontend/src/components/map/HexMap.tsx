import React, { useMemo, useState, useRef } from 'react';
import { Grid, defineHex, Orientation } from 'honeycomb-grid';
import { 
  Castle, Skull, 
  Home, Star, Eye, Navigation, Plus, Minus, Crosshair
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { WORLD_LORE } from '../../data/worldLore';
import { useGameStore } from '../../store/gameStore';

const HEX_SIZE = 18;
class CustomHex extends defineHex({ dimensions: HEX_SIZE, orientation: Orientation.POINTY }) {}

export function hexDistance(q1: number, r1: number, q2: number, r2: number): number {
  return (Math.abs(q1 - q2) + Math.abs(q1 + r1 - q2 - r2) + Math.abs(r1 - r2)) / 2;
}

export function hexLerp(q1: number, r1: number, q2: number, r2: number, t: number) {
  const x1 = q1, z1 = r1, y1 = -q1 - r1;
  const x2 = q2, z2 = r2, y2 = -q2 - r2;
  const x = x1 + (x2 - x1) * t + 1e-6;
  const y = y1 + (y2 - y1) * t + 1e-6;
  const z = z1 + (z2 - z1) * t - 2e-6;
  
  let rx = Math.round(x);
  let ry = Math.round(y);
  let rz = Math.round(z);

  const xDiff = Math.abs(rx - x);
  const yDiff = Math.abs(ry - y);
  const zDiff = Math.abs(rz - z);

  if (xDiff > yDiff && xDiff > zDiff) {
    rx = -ry - rz;
  } else if (yDiff > zDiff) {
    ry = -rx - rz;
  } else {
    rz = -rx - ry;
  }

  return { q: rx, r: rz === -0 ? 0 : rz };
}

export function getHexLine(q1: number, r1: number, q2: number, r2: number) {
  const dist = hexDistance(q1, r1, q2, r2);
  const line: { q: number, r: number }[] = [];
  for (let i = 0; i <= dist; i++) {
    const t = dist === 0 ? 0 : i / dist;
    line.push(hexLerp(q1, r1, q2, r2, t));
  }
  return line;
}

export interface HexMapProps {
  playerLocation?: { q: number; r: number } | null;
  worldData: any;
  selectedHex?: any;
  onHexClick?: (hex: any) => void;
  setSelectedItem?: (item: any) => void;
  fogOfWarEnabled?: boolean;
  exploredHexes?: string[];
}

// Cartographic Terrain Palette
const TERRAIN_CONFIG: Record<string, { fill: string; stroke: string; label: string }> = {
  Ocean: { fill: '#1b3446', stroke: '#142836', label: 'Oceán' },
  Plains: { fill: '#d6c49c', stroke: '#bead86', label: 'Pláně' },
  Forest: { fill: '#3d5c34', stroke: '#2e4726', label: 'Les' },
  Mountains: { fill: '#5e656c', stroke: '#495056', label: 'Hory' },
  Swamp: { fill: '#49523e', stroke: '#38402e', label: 'Bažina' },
  Wasteland: { fill: '#84573e', stroke: '#69432d', label: 'Pustina' },
};

// 7 Kingdoms Territorial Watercolor Washes
const KINGDOM_WASHES: Record<number, { tint: string; border: string; name: string }> = {
  1: { tint: 'rgba(185, 45, 45, 0.24)', border: '#8b1e1e', name: 'Valerijské Impérium' },
  2: { tint: 'rgba(215, 145, 25, 0.24)', border: '#c28b18', name: 'Svatá říše Solariova' },
  3: { tint: 'rgba(30, 120, 55, 0.24)', border: '#1e663b', name: 'Kmeny z Hlubokých hvozdů' },
  4: { tint: 'rgba(25, 95, 150, 0.24)', border: '#1e5b85', name: 'Svobodná města' },
  5: { tint: 'rgba(120, 40, 150, 0.24)', border: '#642787', name: 'Karanténní Zóna' },
  6: { tint: 'rgba(65, 80, 95, 0.26)', border: '#3f4b57', name: 'Železný Práh' },
  7: { tint: 'rgba(65, 45, 135, 0.26)', border: '#3d2d7a', name: 'Tajemné Útočiště' },
};

export default function HexMap({ 
  worldData, 
  onHexClick, 
  playerLocation: propPlayerLocation,
  selectedHex: propSelectedHex,
  fogOfWarEnabled: propFogOfWar,
  exploredHexes: propExploredHexes
}: HexMapProps) {
  const [hoveredHex, setHoveredHex] = useState<any>(null);
  const pointerDownPos = useRef<{ x: number; y: number; time: number } | null>(null);

  const storePlayerLoc = useGameStore(s => s.playerLocation);
  const storeFogOfWar = useGameStore(s => s.fogOfWarEnabled);
  const storeExplored = useGameStore(s => s.exploredHexes);

  const playerLoc = propPlayerLocation !== undefined ? propPlayerLocation : storePlayerLoc;
  const fogOfWar = propFogOfWar !== undefined ? propFogOfWar : storeFogOfWar;
  const exploredSet = useMemo(() => {
    const list = propExploredHexes !== undefined ? propExploredHexes : storeExplored;
    return new Set(list || []);
  }, [propExploredHexes, storeExplored]);

  // Enrich Hex Grid with Lore & Coordinates
  const enrichedGrid = useMemo(() => {
    if (!worldData?.hex_grid) return [];
    return worldData.hex_grid.map((hex: any) => {
      const locationLore = worldData.locations?.find((l: any) => l.q === hex.q && l.r === hex.r);
      const kInfo = hex.kingdom_id ? WORLD_LORE.kingdoms.find(k => k.id === hex.kingdom_id) : null;
      
      let defaultName = null;
      if (hex.poi === 'Capital' && kInfo) {
        defaultName = kInfo.name;
      }

      return {
        ...hex,
        nazev: locationLore?.nazev || defaultName,
        popis: locationLore?.popis || null,
        kingdomName: kInfo ? kInfo.name : null,
      };
    });
  }, [worldData]);

  const hexes = useMemo(() => {
    return enrichedGrid.map(h => new CustomHex({ q: h.q, r: h.r }));
  }, [enrichedGrid]);

  const grid = useMemo(() => {
    return new Grid(CustomHex, hexes);
  }, [hexes]);

  // Active player location resolution
  const activeLocation = useMemo(() => {
    if (playerLoc && playerLoc.q !== undefined && playerLoc.r !== undefined) {
      return playerLoc;
    }
    if (worldData?.pois) {
      const cap = worldData.pois.find((p: any) => p.type === 'Capital') || worldData.pois[0];
      if (cap) return { q: cap.q, r: cap.r };
    }
    if (worldData?.hex_grid?.[0]) {
      return { q: worldData.hex_grid[0].q, r: worldData.hex_grid[0].r };
    }
    return null;
  }, [playerLoc, worldData]);

  // Route calculation if selectedHex is active
  const routeLine = useMemo(() => {
    if (!activeLocation || !propSelectedHex) return [];
    if (activeLocation.q === propSelectedHex.q && activeLocation.r === propSelectedHex.r) return [];
    return getHexLine(activeLocation.q, activeLocation.r, propSelectedHex.q, propSelectedHex.r);
  }, [activeLocation, propSelectedHex]);

  // Kingdom watermark centers calculation
  const kingdomCenters = useMemo(() => {
    const centers: Record<number, { x: number; y: number; name: string; count: number }> = {};
    const gridArray = grid.toArray();
    
    enrichedGrid.forEach((h, idx) => {
      if (!h.kingdom_id) return;
      const hex = gridArray[idx];
      if (!hex) return;
      
      if (!centers[h.kingdom_id]) {
        centers[h.kingdom_id] = {
          x: 0,
          y: 0,
          name: KINGDOM_WASHES[h.kingdom_id]?.name || `Království ${h.kingdom_id}`,
          count: 0
        };
      }
      // If capital, weight heavily towards capital
      if (h.poi === 'Capital') {
        centers[h.kingdom_id].x += hex.x * 3;
        centers[h.kingdom_id].y += hex.y * 3;
        centers[h.kingdom_id].count += 3;
      } else {
        centers[h.kingdom_id].x += hex.x;
        centers[h.kingdom_id].y += hex.y;
        centers[h.kingdom_id].count += 1;
      }
    });

    return Object.entries(centers).map(([kId, data]) => ({
      kingdomId: Number(kId),
      x: data.count > 0 ? data.x / data.count : 0,
      y: data.count > 0 ? data.y / data.count : 0,
      name: data.name
    }));
  }, [enrichedGrid, grid]);

  // Calculate SVG bounds with padding
  const { width, height, offsetX, offsetY } = useMemo(() => {
    let allCornersX: number[] = [];
    let allCornersY: number[] = [];
    for (const h of hexes) {
      for (const c of h.corners) {
        allCornersX.push(c.x);
        allCornersY.push(c.y);
      }
    }
    const minX = allCornersX.length ? Math.min(...allCornersX) : -400;
    const maxX = allCornersX.length ? Math.max(...allCornersX) : 400;
    const minY = allCornersY.length ? Math.min(...allCornersY) : -400;
    const maxY = allCornersY.length ? Math.max(...allCornersY) : 400;
    
    const padding = 120;
    return {
      width: (maxX - minX) + padding * 2,
      height: (maxY - minY) + padding * 2,
      offsetX: -minX + padding,
      offsetY: -minY + padding,
    };
  }, [hexes]);

  // Touch vs Drag guard
  const handlePointerDown = (e: React.PointerEvent) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY, time: Date.now() };
  };

  const handleHexClickInternal = (hexData: any, e: React.MouseEvent) => {
    if (pointerDownPos.current) {
      const dx = Math.abs(e.clientX - pointerDownPos.current.x);
      const dy = Math.abs(e.clientY - pointerDownPos.current.y);
      if (Math.hypot(dx, dy) > 7) {
        return; // Drag/pan, ignore click
      }
    }
    if (onHexClick) {
      onHexClick(hexData);
    }
  };

  // Convert route coordinates to SVG points for glowing dashed path
  const routePolylinePoints = useMemo(() => {
    if (!routeLine.length) return '';
    const gridArray = grid.toArray();
    const points: string[] = [];
    for (const rCoord of routeLine) {
      const hex = gridArray.find(h => h.q === rCoord.q && h.r === rCoord.r);
      if (hex) {
        points.push(`${hex.x},${hex.y}`);
      }
    }
    return points.join(' ');
  }, [routeLine, grid]);

  return (
    <div 
      onPointerDown={handlePointerDown}
      className="w-full h-full relative overflow-hidden select-none bg-[#e8dfc8] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#efe7d3] via-[#dfd3b5] to-[#c9bb98] shadow-inner"
    >
      {/* Antique map vignette border overlay */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_90px_rgba(40,25,10,0.45)] z-20" />

      <TransformWrapper 
        initialScale={1.6} 
        minScale={0.4} 
        maxScale={4.5} 
        centerOnInit={false} 
        wheel={{ step: 0.04 }} 
        limitToBounds={false}
        onInit={(ref) => {
          if (activeLocation) {
            const targetHex = grid.toArray().find(h => h.q === activeLocation.q && h.r === activeLocation.r);
            if (targetHex) {
              const px = targetHex.x + offsetX;
              const py = targetHex.y + offsetY;
              const scale = 1.6;
              const wrapper = document.querySelector(".react-transform-wrapper");
              const cx = wrapper ? wrapper.clientWidth / 2 : 400;
              const cy = wrapper ? wrapper.clientHeight / 2 : 400;
              ref.setTransform(-px * scale + cx, -py * scale + cy, scale, 0);
              return;
            }
          }
          ref.centerView(1.6, 0);
        }}
      >
        {({ zoomIn, zoomOut, setTransform }) => (
          <>
            {/* Zoom and Hero Center Controls */}
            <div className="absolute bottom-6 right-4 sm:bottom-8 sm:right-6 flex flex-col gap-2 z-40">
              <button 
                onClick={() => zoomIn(0.3)} 
                className="w-10 h-10 bg-[#faf6ea] border-2 border-amber-900/40 rounded-xl flex items-center justify-center text-amber-950 hover:bg-amber-100 hover:border-amber-800 shadow-xl transition active:scale-95 cursor-pointer"
                title="Přiblížit (+)"
              >
                <Plus size={20} className="stroke-[2.5]" />
              </button>
              <button 
                onClick={() => zoomOut(0.3)} 
                className="w-10 h-10 bg-[#faf6ea] border-2 border-amber-900/40 rounded-xl flex items-center justify-center text-amber-950 hover:bg-amber-100 hover:border-amber-800 shadow-xl transition active:scale-95 cursor-pointer"
                title="Oddálit (-)"
              >
                <Minus size={20} className="stroke-[2.5]" />
              </button>
              <button 
                onClick={() => {
                  if (activeLocation) {
                    const targetHex = grid.toArray().find(h => h.q === activeLocation.q && h.r === activeLocation.r);
                    if (targetHex) {
                      const px = targetHex.x + offsetX;
                      const py = targetHex.y + offsetY;
                      const scale = 2.0;
                      const wrapper = document.querySelector(".react-transform-wrapper");
                      const cx = wrapper ? wrapper.clientWidth / 2 : 400;
                      const cy = wrapper ? wrapper.clientHeight / 2 : 400;
                      setTransform(-px * scale + cx, -py * scale + cy, scale, 400);
                    }
                  }
                }} 
                className="w-10 h-10 bg-amber-900 border-2 border-amber-700 rounded-xl flex items-center justify-center text-amber-100 hover:bg-amber-950 shadow-xl transition active:scale-95 cursor-pointer" 
                title="Centrovat na hrdinu"
              >
                <Crosshair size={19} className="stroke-[2.5]" />
              </button>
            </div>

            <TransformComponent wrapperClass="!w-full !h-full flex items-center justify-center" contentClass="flex items-center justify-center">
              <svg 
                width={width} 
                height={height} 
                viewBox={`0 0 ${width} ${height}`}
                className="cursor-crosshair"
              >
                <defs>
                  {/* Fog of War Antique Diagonal Hatch */}
                  <pattern id="fogPattern" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="8" stroke="#a3967d" strokeWidth="1.2" opacity="0.8" />
                    <rect width="8" height="8" fill="#d3c7ad" opacity="0.85" />
                  </pattern>

                  {/* Radial glow for Hero Beacon */}
                  <radialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
                    <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
                  </radialGradient>

                  {/* Destination Marker Glow */}
                  <radialGradient id="destGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
                    <stop offset="60%" stopColor="#dc2626" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#991b1b" stopOpacity="0" />
                  </radialGradient>
                </defs>

                <g transform={`translate(${offsetX}, ${offsetY})`}>
                  {/* 1. Base Hex Tiles */}
                  {grid.toArray().map((hex, i) => {
                    const { x, y } = hex;
                    const points = hex.corners.map(c => `${c.x},${c.y}`).join(' ');
                    const hexData = enrichedGrid[i];
                    if (!hexData) return null;

                    const hexKey = `${hexData.q}_${hexData.r}`;
                    const distToPlayer = activeLocation ? hexDistance(activeLocation.q, activeLocation.r, hexData.q, hexData.r) : 999;
                    const isVisible = distToPlayer <= 2;
                    const isExplored = !fogOfWar || exploredSet.has(hexKey) || isVisible;

                    const isPlayerHex = activeLocation?.q === hexData.q && activeLocation?.r === hexData.r;
                    const isSelectedHex = propSelectedHex?.q === hexData.q && propSelectedHex?.r === hexData.r;
                    const isOnRoute = routeLine.some(r => r.q === hexData.q && r.r === hexData.r);

                    const terrainStyle = TERRAIN_CONFIG[hexData.terrain] || TERRAIN_CONFIG.Plains;
                    const kingdomWash = hexData.kingdom_id ? KINGDOM_WASHES[hexData.kingdom_id] : null;

                    // Subtle deterministic cartographic accents for plains / mountains / forests / oceans
                    const seed = Math.abs(hexData.q * 37 + hexData.r * 19);
                    const showMountainPeaks = hexData.terrain === 'Mountains' && seed % 3 === 0;
                    const showForestTrees = hexData.terrain === 'Forest' && seed % 3 === 0;
                    const showOceanWaves = hexData.terrain === 'Ocean' && seed % 7 === 0;

                    return (
                      <g 
                        key={`hex-${i}`}
                        className="group cursor-pointer"
                        onMouseEnter={() => setHoveredHex({ ...hexData, isExplored, isVisible })}
                        onMouseLeave={() => setHoveredHex(null)}
                        onClick={(e) => handleHexClickInternal(hexData, e)}
                      >
                        {/* Shrouded Fog of War Hex */}
                        {!isExplored ? (
                          <polygon 
                            points={points}
                            fill="url(#fogPattern)"
                            stroke="#b3a589"
                            strokeWidth="0.8"
                            strokeDasharray="3 2"
                            className="transition-all duration-200 group-hover:stroke-amber-600 group-hover:stroke-[1.5]"
                          />
                        ) : (
                          <>
                            {/* Explored Terrain Base */}
                            <polygon 
                              points={points}
                              fill={terrainStyle.fill}
                              stroke={
                                isSelectedHex 
                                  ? "#ef4444" 
                                  : isPlayerHex 
                                    ? "#f59e0b" 
                                    : isOnRoute 
                                      ? "#f59e0b" 
                                      : terrainStyle.stroke
                              }
                              strokeWidth={isSelectedHex || isPlayerHex ? "2.5" : isOnRoute ? "1.8" : "0.9"}
                              className="transition-all duration-200 group-hover:stroke-amber-300 group-hover:stroke-2"
                            />

                            {/* Kingdom Watercolor Tint */}
                            {kingdomWash && (
                              <polygon 
                                points={points}
                                fill={kingdomWash.tint}
                                className="pointer-events-none"
                              />
                            )}

                            {/* Explored but outside visible radius: soft antique mist veil */}
                            {!isVisible && fogOfWar && (
                              <polygon 
                                points={points}
                                fill="#dfd4ba"
                                opacity="0.35"
                                className="pointer-events-none"
                              />
                            )}

                            {/* Subtle Hand-Drawn Terrain Landscape Accents (No Icon Soup) */}
                            {showMountainPeaks && !hexData.poi && (
                              <g transform={`translate(${x - 8}, ${y - 5})`} className="opacity-40 pointer-events-none stroke-[#2a3036] fill-none stroke-[1.2]">
                                <path d="M 0 10 L 4 2 L 8 10 M 6 10 L 10 4 L 14 10" />
                              </g>
                            )}

                            {showForestTrees && !hexData.poi && (
                              <g transform={`translate(${x - 7}, ${y - 6})`} className="opacity-45 pointer-events-none stroke-[#1e331a] fill-[#253e20] stroke-[1]">
                                <path d="M 4 10 L 4 2 L 7 6 L 1 6 Z M 9 10 L 9 4 L 12 7 L 6 7 Z" />
                              </g>
                            )}

                            {showOceanWaves && !hexData.poi && (
                              <g transform={`translate(${x - 8}, ${y - 2})`} className="opacity-35 pointer-events-none stroke-[#38627e] fill-none stroke-[1.2]">
                                <path d="M 0 2 Q 4 -1 8 2 T 16 2" />
                              </g>
                            )}

                            {/* POI Illustrative Medallion Tokens */}
                            {hexData.poi && (
                              <g transform={`translate(${x}, ${y})`} className="pointer-events-none">
                                {hexData.poi === 'Capital' && (
                                  <g className="filter drop-shadow-[0_0_8px_rgba(234,179,8,0.9)]">
                                    <circle r="12" fill="#78350f" stroke="#fbbf24" strokeWidth="2" />
                                    <g transform="translate(-7, -7)">
                                      <Castle size={14} className="text-amber-300" />
                                    </g>
                                    {/* Capital Banner */}
                                    <g transform="translate(0, 15)">
                                      <rect x="-30" y="-7" width="60" height="13" rx="3" fill="#fef3c7" stroke="#b45309" strokeWidth="1" className="shadow" />
                                      <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" className="text-[7px] font-cinzel font-black fill-[#78350f] uppercase tracking-wider">
                                        {hexData.nazev || 'Hlavní Město'}
                                      </text>
                                    </g>
                                  </g>
                                )}

                                {hexData.poi === 'Village' && (
                                  <g className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                                    <circle r="10" fill="#451a03" stroke="#d97706" strokeWidth="1.5" />
                                    <g transform="translate(-6, -6)">
                                      <Home size={12} className="text-amber-200" />
                                    </g>
                                  </g>
                                )}

                                {hexData.poi === 'Dungeon' && (
                                  <g className="filter drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                                    <circle r="10" fill="#18181b" stroke="#dc2626" strokeWidth="1.5" />
                                    <g transform="translate(-6, -6)">
                                      <Skull size={12} className="text-red-400" />
                                    </g>
                                  </g>
                                )}

                                {hexData.poi === 'Shrine' && (
                                  <g className="filter drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]">
                                    <circle r="10" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" />
                                    <g transform="translate(-6, -6)">
                                      <Star size={12} className="text-indigo-200" />
                                    </g>
                                  </g>
                                )}

                                {hexData.poi === 'Ruin' && (
                                  <g className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                                    <circle r="10" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
                                    <g transform="translate(-6, -6)">
                                      <Eye size={12} className="text-slate-200" />
                                    </g>
                                  </g>
                                )}
                              </g>
                            )}
                          </>
                        )}
                      </g>
                    );
                  })}

                  {/* 2. Kingdom Watermark Names (Antique Cartographic Text) */}
                  {kingdomCenters.map(kc => {
                    return (
                      <g 
                        key={`kingdom-label-${kc.kingdomId}`} 
                        transform={`translate(${kc.x}, ${kc.y - 20})`}
                        className="pointer-events-none select-none opacity-50"
                      >
                        <text 
                          x="0" 
                          y="0" 
                          textAnchor="middle" 
                          className="font-cinzel text-[11px] font-black uppercase fill-[#2d1b0e] tracking-[0.25em] drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]"
                        >
                          {kc.name}
                        </text>
                      </g>
                    );
                  })}

                  {/* 3. Multi-Hex Route Planning Polyline Preview */}
                  {routePolylinePoints && (
                    <g className="pointer-events-none">
                      <polyline 
                        points={routePolylinePoints} 
                        fill="none" 
                        stroke="#f59e0b" 
                        strokeWidth="3" 
                        strokeDasharray="6 4" 
                        strokeLinecap="round" 
                        className="filter drop-shadow-[0_0_6px_rgba(245,158,11,0.9)] animate-pulse"
                      />
                      {routeLine.slice(1, -1).map((rh, idx) => {
                        const h = grid.toArray().find(gh => gh.q === rh.q && gh.r === rh.r);
                        if (!h) return null;
                        return (
                          <circle 
                            key={`route-dot-${idx}`}
                            cx={h.x} 
                            cy={h.y} 
                            r="4" 
                            fill="#f59e0b" 
                            stroke="#78350f" 
                            strokeWidth="1.5" 
                            className="shadow"
                          />
                        );
                      })}
                    </g>
                  )}

                  {/* 4. Target Destination Marker */}
                  {propSelectedHex && activeLocation && (propSelectedHex.q !== activeLocation.q || propSelectedHex.r !== activeLocation.r) && (() => {
                    const targetHex = grid.toArray().find(h => h.q === propSelectedHex.q && h.r === propSelectedHex.r);
                    if (!targetHex) return null;
                    const dist = hexDistance(activeLocation.q, activeLocation.r, propSelectedHex.q, propSelectedHex.r);
                    return (
                      <g transform={`translate(${targetHex.x}, ${targetHex.y})`} className="pointer-events-none z-30">
                        <circle r="18" fill="url(#destGlow)" className="animate-pulse" />
                        <circle r="12" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" />
                        <g transform="translate(0, -18)">
                          <rect x="-24" y="-7" width="48" height="13" rx="3" fill="#991b1b" stroke="#fca5a5" strokeWidth="1" className="shadow-lg" />
                          <text x="0" y="0.5" textAnchor="middle" dominantBaseline="middle" className="text-[7.5px] font-cinzel font-black fill-white uppercase tracking-wider">
                            CÍL (${dist})
                          </text>
                        </g>
                      </g>
                    );
                  })()}

                  {/* 5. Hero Miniature & Pulsing Beacon */}
                  {activeLocation && (() => {
                    const playerHex = grid.toArray().find(h => h.q === activeLocation.q && h.r === activeLocation.r);
                    if (!playerHex) return null;
                    return (
                      <g transform={`translate(${playerHex.x}, ${playerHex.y})`} className="pointer-events-none z-40">
                        {/* Radar Ping */}
                        <circle r="24" fill="none" stroke="#fbbf24" strokeWidth="1.5" className="animate-ping opacity-60" />
                        <circle r="18" fill="url(#heroGlow)" />
                        {/* Golden Hero Medallion */}
                        <circle r="10" fill="#78350f" stroke="#fde047" strokeWidth="2.5" className="filter drop-shadow-[0_0_10px_rgba(250,204,21,1)]" />
                        <g transform="translate(-6, -6)">
                          <Navigation size={12} className="text-yellow-200 fill-yellow-300" />
                        </g>
                        {/* Sleek Hero Banner */}
                        <g transform="translate(0, -19)">
                          <rect x="-24" y="-7" width="48" height="13" rx="3" fill="#451a03" stroke="#fbbf24" strokeWidth="1" className="shadow-md" />
                          <text x="0" y="0.5" textAnchor="middle" dominantBaseline="middle" className="text-[7.5px] font-cinzel font-black fill-amber-100 uppercase tracking-wider">
                            HRDINA
                          </text>
                        </g>
                      </g>
                    );
                  })()}
                </g>
              </svg>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>

      {/* Floating Hover Tooltip (Desktop) */}
      <AnimatePresence>
        {hoveredHex && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#faf6ea]/95 backdrop-blur-md border-2 border-amber-900/40 px-4 py-2.5 rounded-xl shadow-2xl pointer-events-none z-50 text-center max-w-xs sm:max-w-sm"
          >
            {!hoveredHex.isExplored ? (
              <div className="text-amber-950 font-cinzel font-bold text-sm">
                🌫️ Neznámé končiny (Mlha)
              </div>
            ) : hoveredHex.nazev ? (
              <>
                <h3 className="font-cinzel font-bold text-amber-900 text-base">{hoveredHex.nazev}</h3>
                {hoveredHex.popis && <p className="font-lora text-slate-800 text-xs line-clamp-2 mt-0.5">{hoveredHex.popis}</p>}
                <div className="text-[11px] font-semibold text-amber-800 mt-1">
                  {TERRAIN_CONFIG[hoveredHex.terrain]?.label || hoveredHex.terrain} 
                  {hoveredHex.kingdomName && ` • ${hoveredHex.kingdomName}`}
                </div>
              </>
            ) : (
              <div>
                <h3 className="font-cinzel font-bold text-slate-900 text-sm">
                  {TERRAIN_CONFIG[hoveredHex.terrain]?.label || hoveredHex.terrain}
                </h3>
                {hoveredHex.kingdomName && (
                  <p className="font-lora text-amber-800 text-xs mt-0.5">{hoveredHex.kingdomName}</p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
