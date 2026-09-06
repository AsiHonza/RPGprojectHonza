import React from 'react';
import { Compass, Map as MapIcon } from 'lucide-react';

export const WORLD_NODES = {
  oakhaven: { id: "oakhaven", name: "Oakhaven (Město)", x: 20, y: 50, type: "mesto", connections: ["crossroads", "old_mine"] },
  crossroads: { id: "crossroads", name: "Stará křižovatka", x: 40, y: 50, type: "divocina", connections: ["oakhaven", "dark_forest", "ruins"] },
  old_mine: { id: "old_mine", name: "Opuštěný důl", x: 20, y: 20, type: "dungeon", connections: ["oakhaven"] },
  dark_forest: { id: "dark_forest", name: "Temný hvozd", x: 60, y: 30, type: "divocina", connections: ["crossroads", "elven_camp"] },
  ruins: { id: "ruins", name: "Ruiny kláštera", x: 45, y: 80, type: "dungeon", connections: ["crossroads"] },
  elven_camp: { id: "elven_camp", name: "Skrytý tábor elfů", x: 80, y: 25, type: "vesnice", connections: ["dark_forest"] }
};

interface WorldMapProps {
  currentNodeId: string;
  onTravel: (nodeId: string) => void;
  isTraveling: boolean;
}

export function WorldMap({ currentNodeId, onTravel, isTraveling }: WorldMapProps) {
  const nodes = Object.values(WORLD_NODES);
  
  // Calculate lines between connected nodes to avoid drawing double lines
  const lines: {id: string, x1: number, y1: number, x2: number, y2: number}[] = [];
  const processed = new Set<string>();
  
  nodes.forEach(node => {
    node.connections.forEach(targetId => {
      const target = WORLD_NODES[targetId as keyof typeof WORLD_NODES];
      const lineId = [node.id, target.id].sort().join('-');
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

  return (
    <div className="relative w-full aspect-video bg-[#1a202c] dark:bg-[#0f141e] rounded-xl overflow-hidden border-2 border-amber-900/40 shadow-inner">
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
          
          return (
            <g key={node.id} 
               className={`transition-all duration-300 ${canTravel ? 'cursor-pointer hover:opacity-100' : 'opacity-80'}`}
               onClick={() => canTravel && onTravel(node.id)}>
              <circle 
                cx={node.x} cy={node.y} 
                r={isCurrent ? 3 : 2} 
                fill={isCurrent ? "#fbbf24" : (canTravel ? "#fcd34d" : "#92400e")}
                className={`${isCurrent ? 'animate-pulse' : ''} transition-colors duration-500`}
                stroke="#451a03" strokeWidth="0.5"
              />
              <text 
                x={node.x} y={node.y + (node.y > 80 ? -4 : 6)} 
                fontSize="3" 
                fill={isCurrent ? "#fef3c7" : (canTravel ? "#fde68a" : "#d4d4d8")} 
                textAnchor="middle"
                className="font-cinzel drop-shadow-md select-none"
              >
                {node.name}
              </text>
            </g>
          );
        })}
        
        {/* Draw Player Figure (Animated) */}
        <g 
           className="transition-all duration-1000 ease-in-out"
           style={{ transform: `translate(${currentNode.x}px, ${currentNode.y}px)` }}
        >
          <circle r="2.5" fill="none" stroke="#fbbf24" strokeWidth="0.5" className="animate-ping opacity-50" />
          <path d="M-1,-2 L1,-2 L1.5,1 L-1.5,1 Z" fill="#b91c1c" />
          <circle cx="0" cy="-3" r="1.2" fill="#fca5a5" />
        </g>
      </svg>
      
      {/* Map Legend */}
      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm p-2 rounded border border-amber-900/50 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs text-amber-200">
           <MapIcon size={12} /> <span className="font-cinzel font-bold">Aelthgard</span>
        </div>
        <div className="text-[10px] text-slate-300 flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#fbbf24]"></div> Současná pozice
        </div>
        <div className="text-[10px] text-slate-300 flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#fcd34d]"></div> Dostupná cesta
        </div>
      </div>
    </div>
  );
}
