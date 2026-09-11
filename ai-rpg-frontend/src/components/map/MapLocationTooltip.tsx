import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Compass, 
  Scroll, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Target, 
  Utensils, 
  Castle, 
  Trees, 
  Mountain, 
  Skull,
  HelpCircle,
  Footprints
} from 'lucide-react';
import { NodeQuestStatus } from '../../utils/mapQuestUtils';

export interface MapTooltipLocationData {
  id: string;
  name: string;
  type?: string;
  description?: string;
  faction?: string;
  isCurrent?: boolean;
  canTravel?: boolean;
  rations?: number;
  subLocations?: string[];
  questStatus?: NodeQuestStatus;
  isExplored?: boolean;
}

interface MapLocationTooltipProps {
  location: MapTooltipLocationData | null;
  onTravel?: (locationId: string) => void;
  isTraveling?: boolean;
  position?: { x: number; y: number } | null;
  className?: string;
}

export function MapLocationTooltip({
  location,
  onTravel,
  isTraveling = false,
  position,
  className = ""
}: MapLocationTooltipProps) {
  if (!location) return null;

  const {
    id,
    name,
    type = 'divocina',
    description,
    faction,
    isCurrent,
    canTravel,
    rations = 0,
    subLocations = [],
    questStatus,
    isExplored = true
  } = location;

  const hasFood = rations > 0;
  const questList = questStatus?.questList || [];

  // Determine icon based on location type
  const getTypeIcon = () => {
    switch (type.toLowerCase()) {
      case 'mesto':
      case 'capital':
        return <Castle size={16} className="text-amber-400" />;
      case 'dungeon':
        return <Mountain size={16} className="text-stone-400" />;
      case 'vesnice':
      case 'village':
        return <Trees size={16} className="text-emerald-400" />;
      default:
        return <Compass size={16} className="text-amber-300" />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 6, scale: 0.96 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className={`pointer-events-auto bg-[#141a24]/95 dark:bg-[#0c1018]/95 backdrop-blur-xl border border-amber-500/30 rounded-xl shadow-2xl p-3.5 text-amber-50 font-lora max-w-sm w-full z-50 text-left ${className}`}
        style={position ? {
          position: 'absolute',
          left: `${Math.min(Math.max(position.x, 20), 80)}%`,
          top: `${Math.min(Math.max(position.y, 15), 75)}%`,
          transform: 'translate(-50%, -100%)'
        } : {}}
      >
        {/* Header with Title and Badges */}
        <div className="flex items-start justify-between gap-2 border-b border-amber-900/30 pb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-950/60 border border-amber-500/30">
              {getTypeIcon()}
            </div>
            <div>
              <h3 className="font-cinzel font-bold text-sm sm:text-base text-amber-200 tracking-wide flex items-center gap-1.5">
                {name}
                {isCurrent && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-400/40 text-amber-300 font-sans font-normal">
                    Zde se nacházíš
                  </span>
                )}
              </h3>
              {faction && (
                <p className="text-[11px] text-amber-400/70 font-sans">
                  {faction}
                </p>
              )}
            </div>
          </div>

          {/* Quest Badges Top Right */}
          <div className="flex items-center gap-1">
            {questStatus?.turnInCount ? (
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500/20 border border-yellow-400 text-yellow-300 font-black text-xs shadow-[0_0_8px_rgba(250,204,21,0.5)] animate-pulse" title="Úkol připraven k odevzdání!">
                ?
              </span>
            ) : null}

            {questStatus?.availableCount ? (
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 font-black text-xs shadow-[0_0_8px_rgba(245,158,11,0.5)]" title="Nový úkol k dispozici!">
                !
              </span>
            ) : null}

            {questStatus?.objectiveCount ? (
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 text-xs shadow-[0_0_8px_rgba(6,182,212,0.5)]" title="Cíl probíhajícího úkolu">
                ◈
              </span>
            ) : null}

            {questStatus?.primaryBadge === 'cleared' && (
              <CheckCircle2 size={16} className="text-emerald-400" title="Všechny úkoly vyřešeny" />
            )}
          </div>
        </div>

        {/* Location Description */}
        {description && (
          <p className="text-xs text-slate-300 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {/* Quests Section */}
        {questList.length > 0 && (
          <div className="mt-2.5 pt-2 border-t border-amber-900/20">
            <h4 className="text-[11px] font-cinzel font-semibold text-amber-300/80 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Scroll size={12} /> Příležitosti a úkoly:
            </h4>
            <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
              {questList.map((q) => (
                <div 
                  key={q.id}
                  className="flex items-start gap-1.5 text-xs bg-black/40 rounded p-1.5 border border-amber-900/30"
                >
                  <span className={`font-bold shrink-0 mt-0.5 ${
                    q.type === 'turn_in' ? 'text-yellow-400' :
                    q.type === 'available' ? 'text-amber-400' : 'text-cyan-400'
                  }`}>
                    {q.type === 'turn_in' ? '?' : q.type === 'available' ? '!' : '◈'}
                  </span>
                  <div className="overflow-hidden">
                    <div className="font-semibold text-slate-200 truncate">{q.title}</div>
                    {q.objective && (
                      <div className="text-[10px] text-slate-400 truncate">{q.objective}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sub-locations Preview (if any) */}
        {subLocations.length > 0 && (
          <div className="mt-2 text-[11px] text-amber-200/60 flex items-center gap-1 truncate">
            <MapPin size={11} className="shrink-0" />
            <span className="truncate">Zákoutí: {subLocations.join(', ')}</span>
          </div>
        )}

        {/* Footer: Fast Travel & Food Status */}
        <div className="mt-3 pt-2 border-t border-amber-900/30 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[11px]">
            <Utensils size={12} className={hasFood ? "text-amber-400" : "text-rose-400"} />
            <span className={hasFood ? "text-slate-300" : "text-rose-300 font-bold"}>
              {hasFood ? `1 příděl jídla (${rations} k dispozici)` : `Chybí jídlo (hladovění)!`}
            </span>
          </div>

          {canTravel && onTravel && (
            <button
              onClick={() => onTravel(id)}
              disabled={isTraveling}
              className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-cinzel font-bold text-xs tracking-wider border border-amber-400/40 shadow-md hover:shadow-amber-500/20 transition-all flex items-center gap-1 disabled:opacity-50 cursor-pointer"
            >
              <Footprints size={12} />
              {isTraveling ? 'Cestuji...' : 'Cestovat'}
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
