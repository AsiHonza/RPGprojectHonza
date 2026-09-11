import React, { useState } from 'react';
import { Compass, Map as MapIcon } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import worldMapJson from '../data/generated/world_map.json';
import { getLocationQuestStatus, NodeQuestStatus } from '../utils/mapQuestUtils';
import { MapLocationTooltip, MapTooltipLocationData } from './map/MapLocationTooltip';

export const WORLD_NODES = {
  oakhaven: { id: "oakhaven", name: "Oakhaven (Město)", x: 20, y: 50, type: "mesto", connections: ["crossroads", "old_mine"] },
  crossroads: { id: "crossroads", name: "Stará křižovatka", x: 45, y: 35, type: "divocina", connections: ["oakhaven", "dark_forest", "monastery_ruins"] },
  old_mine: { id: "old_mine", name: "Opuštěný důl", x: 10, y: 30, type: "dungeon", connections: ["oakhaven"] },
  dark_forest: { id: "dark_forest", name: "Temný hvozd", x: 70, y: 20, type: "divocina", connections: ["crossroads", "elf_camp"] },
  monastery_ruins: { id: "monastery_ruins", name: "Ruiny kláštera", x: 65, y: 55, type: "dungeon", connections: ["crossroads"] },
  elf_camp: { id: "elf_camp", name: "Skrytý tábor elfů", x: 90, y: 15, type: "vesnice", connections: ["dark_forest"] }
};

interface WorldMapProps {
  currentNodeId: string;
  onTravel: (nodeId: string) => void;
  isTraveling: boolean;
}

export function WorldMap({ currentNodeId, onTravel, isTraveling }: WorldMapProps) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  const quests = useGameStore(s => s.quests);
  const rations = useGameStore(s => s.rations);

  const nodes = Object.values(WORLD_NODES);
  
  // Calculate lines between connected nodes to avoid drawing double lines
  const lines: {id: string, x1: number, y1: number, x2: number, y2: number}[] = [];
  const processed = new Set<string>();
  
  nodes.forEach(node => {
    node.connections.forEach(targetId => {
      const target = WORLD_NODES[targetId as keyof typeof WORLD_NODES];
      const lineId = [node.id, target?.id].sort().join('-');
      if (!processed.has(lineId) && target) {
        processed.add(lineId);
        lines.push({
          id: lineId,
          x1: node.x, y1: node.y,
          x2: target.x, y2: target.y
        });
      }
    });
  });

  const currentNode = WORLD_NODES[currentNodeId as keyof typeof WORLD_NODES] || WORLD_NODES.oakhaven;

  // Resolved active node for tooltip (hover takes precedence on desktop, selection for mobile touch)
  const activeTooltipNodeId = hoveredNodeId || selectedNodeId;
  const activeTooltipNode = activeTooltipNodeId ? WORLD_NODES[activeTooltipNodeId as keyof typeof WORLD_NODES] : null;

  let activeTooltipData: MapTooltipLocationData | null = null;
  if (activeTooltipNode) {
    const rawData = (worldMapJson as Record<string, any>)[activeTooltipNode.id] || {};
    const questStatus: NodeQuestStatus = getLocationQuestStatus(activeTooltipNode.id, quests);
    const isCurrent = activeTooltipNode.id === currentNodeId;
    const isConnected = currentNode.connections.includes(activeTooltipNode.id);
    const canTravel = isConnected && !isTraveling && !isCurrent;

    // Sub-locations for Oakhaven
    const subLocations = activeTooltipNode.id === 'oakhaven' 
      ? ["Hostinec U Zlomeného štítu", "Starý mlýn", "Kovárna u Hučícího měchu", "Radnice", "Bylinkářka"]
      : [];

    activeTooltipData = {
      id: activeTooltipNode.id,
      name: rawData.name || activeTooltipNode.name,
      type: rawData.type || activeTooltipNode.type,
      description: rawData.description || activeTooltipNode.name,
      faction: rawData.faction_id ? "Valerijské Impérium" : undefined,
      isCurrent,
      canTravel,
      rations,
      subLocations,
      questStatus,
      isExplored: true
    };
  }

  return (
    <div 
      className="relative w-full aspect-video bg-[#1a202c] dark:bg-[#0f141e] rounded-xl overflow-hidden border-2 border-amber-900/40 shadow-inner"
      onClick={() => setSelectedNodeId(null)}
    >
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23d97706\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")'
      }}></div>
      
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        {/* Draw connections */}
        {lines.map(line => (
          <line key={line.id} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="#78350f" strokeWidth="0.8" strokeDasharray="2,1" className="opacity-60" />
        ))}
        
        {/* Draw Nodes */}
        {nodes.map(node => {
          const isCurrent = node.id === currentNodeId;
          const isConnected = currentNode.connections.includes(node.id);
          const canTravel = isConnected && !isTraveling;
          const questStatus = getLocationQuestStatus(node.id, quests);
          const hasBadge = questStatus.primaryBadge !== 'none';
          
          return (
            <g key={node.id} 
               className={`transition-all duration-300 ${canTravel ? 'cursor-pointer hover:opacity-100' : 'opacity-85'}`}
               onMouseEnter={() => setHoveredNodeId(node.id)}
               onMouseLeave={() => setHoveredNodeId(null)}
               onClick={(e) => {
                 e.stopPropagation();
                 setSelectedNodeId(node.id);
                 if (canTravel && !hoveredNodeId) {
                   // Single click on desktop with hover can travel, or two-tap on mobile
                   onTravel(node.id);
                 }
               }}
            >
              {/* Node Circle */}
              <circle 
                cx={node.x} cy={node.y} 
                r={isCurrent ? 3.5 : 2.5} 
                fill={isCurrent ? "#fbbf24" : (canTravel ? "#fcd34d" : "#92400e")}
                className={`${isCurrent ? 'animate-pulse' : ''} transition-colors duration-500`}
                stroke="#451a03" strokeWidth="0.6"
              />

              {/* Quest Badge on Map Node */}
              {hasBadge && (
                <g transform={`translate(${node.x + 2.5}, ${node.y - 2.5})`}>
                  <circle 
                    r="1.8" 
                    fill={
                      questStatus.primaryBadge === 'turn_in' ? '#eab308' :
                      questStatus.primaryBadge === 'available' ? '#f59e0b' :
                      questStatus.primaryBadge === 'objective' ? '#06b6d4' : '#10b981'
                    }
                    stroke="#451a03"
                    strokeWidth="0.4"
                    className={questStatus.primaryBadge === 'turn_in' ? 'animate-bounce' : ''}
                  />
                  <text 
                    x="0" y="0.6" 
                    fontSize="2" 
                    fontWeight="bold" 
                    fill="#451a03" 
                    textAnchor="middle" 
                    className="select-none font-sans"
                  >
                    {questStatus.primaryBadge === 'turn_in' ? '?' : 
                     questStatus.primaryBadge === 'available' ? '!' : 
                     questStatus.primaryBadge === 'objective' ? '◈' : '✓'}
                  </text>
                </g>
              )}

              {/* Node Label */}
              <text 
                x={node.x} y={node.y + (node.y > 80 ? -4 : 6)} 
                fontSize="3" 
                fill={isCurrent ? "#fef3c7" : (canTravel ? "#fde68a" : "#d4d4d8")} 
                textAnchor="middle"
                className="font-cinzel drop-shadow-md select-none font-semibold"
              >
                {node.name}
              </text>
            </g>
          );
        })}
        
        {/* Draw Player Figure (Animated) */}
        <g 
           className="transition-all duration-1000 ease-in-out pointer-events-none"
           style={{ transform: `translate(${currentNode.x}px, ${currentNode.y}px)` }}
        >
          <circle r="3" fill="none" stroke="#fbbf24" strokeWidth="0.6" className="animate-ping opacity-60" />
          <path d="M-1.2,-2.2 L1.2,-2.2 L1.8,1.2 L-1.8,1.2 Z" fill="#b91c1c" />
          <circle cx="0" cy="-3.4" r="1.4" fill="#fca5a5" />
        </g>
      </svg>
      
      {/* Map Legend */}
      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm p-2 rounded-lg border border-amber-900/50 flex flex-col gap-1 z-10 pointer-events-none">
        <div className="flex items-center gap-2 text-xs text-amber-200">
           <MapIcon size={12} /> <span className="font-cinzel font-bold">Aelthgard • 1. Akt</span>
        </div>
        <div className="text-[10px] text-slate-300 flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#fbbf24]"></div> Současná pozice
        </div>
        <div className="text-[10px] text-slate-300 flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#fcd34d]"></div> Dostupná cesta
        </div>
        <div className="text-[10px] text-amber-300 flex items-center gap-1.5">
          <span className="font-bold text-yellow-400">?</span> Odevzdání úkolu
        </div>
        <div className="text-[10px] text-amber-300 flex items-center gap-1.5">
          <span className="font-bold text-amber-400">!</span> Nový úkol
        </div>
      </div>

      {/* Interactive Tooltip Card */}
      {activeTooltipData && (
        <div className="absolute bottom-3 right-3 z-30 max-w-xs sm:max-w-sm">
          <MapLocationTooltip 
            location={activeTooltipData} 
            onTravel={onTravel}
            isTraveling={isTraveling}
          />
        </div>
      )}
    </div>
  );
}
