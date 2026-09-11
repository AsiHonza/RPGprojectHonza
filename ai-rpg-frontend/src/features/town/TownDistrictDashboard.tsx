import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Castle, 
  Beer, 
  Hammer, 
  Scroll, 
  Sparkles, 
  Compass, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  HelpCircle, 
  ChevronRight, 
  User, 
  Flame, 
  Footprints,
  Eye,
  Shield
} from 'lucide-react';
import worldMapJson from '../../data/generated/world_map.json';
import npcsJson from '../../data/generated/npcs.json';
import { useGameStore } from '../../store/gameStore';
import { getLocationQuestStatus } from '../../utils/mapQuestUtils';

interface TownDistrictDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWorldMap?: () => void;
  onOpenTownServices?: (tab: 'market' | 'blacksmith' | 'tavern' | 'stables' | 'temple') => void;
  onSendAction?: (action: string) => void;
}

export const TownDistrictDashboard: React.FC<TownDistrictDashboardProps> = ({
  isOpen,
  onClose,
  onOpenWorldMap,
  onOpenTownServices,
  onSendAction
}) => {
  const { 
    currentNodeId = 'oakhaven', 
    quests, 
    day, 
    worldFlags = [], 
    reputation 
  } = useGameStore();

  const [selectedSubLocId, setSelectedSubLocId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Retrieve current macro location from generated data
  const currentTown = (worldMapJson as Record<string, any>)[currentNodeId] || (worldMapJson as Record<string, any>)['oakhaven'];
  const subLocations: any[] = currentTown?.sub_locations || [];
  const npcsDict = npcsJson as Record<string, any>;

  // Icon selector per sub-location type/id
  const getSubLocationIcon = (id: string, type: string) => {
    if (id.includes('tavern')) return <Beer size={20} className="text-amber-400" />;
    if (id.includes('forge')) return <Hammer size={20} className="text-orange-400" />;
    if (id.includes('mill')) return <Building2 size={20} className="text-yellow-400" />;
    if (id.includes('townhall')) return <Shield size={20} className="text-indigo-400" />;
    if (id.includes('herbalist')) return <Sparkles size={20} className="text-emerald-400" />;
    return <Compass size={20} className="text-amber-300" />;
  };

  const handleEnterSubLocation = (subLoc: any) => {
    // Check if sublocation maps to a TownServices tab
    if (subLoc.id.includes('tavern') && onOpenTownServices) {
      onOpenTownServices('tavern');
      onClose();
      return;
    }
    if (subLoc.id.includes('forge') && onOpenTownServices) {
      onOpenTownServices('blacksmith');
      onClose();
      return;
    }
    if (subLoc.id.includes('herbalist') && onOpenTownServices) {
      onOpenTownServices('market');
      onClose();
      return;
    }

    // Default action trigger into story action
    if (onSendAction) {
      onSendAction(`Vstupuji a prozkoumávám: ${subLoc.name}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-5">
      <div className="w-full max-w-5xl bg-[#121824]/95 dark:bg-[#0c1017]/95 border-2 border-amber-900/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-amber-50 font-lora">
        
        {/* Top Town Banner */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-950/60 via-amber-900/30 to-amber-950/60 border-b border-amber-900/40 flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-900/40 border border-amber-500/30 text-amber-300">
              <Castle size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-cinzel font-bold text-xl sm:text-2xl text-amber-200 tracking-wide">
                  {currentTown.name}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30 font-sans">
                  Pohraniční centrum • Den {day}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-lora mt-0.5">
                Karetní přehled městských čtvrtí, dílen a důležitých míst
              </p>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-2">
            {onOpenWorldMap && (
              <button
                onClick={() => {
                  onClose();
                  onOpenWorldMap();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-950/40 hover:bg-amber-900/50 text-xs font-cinzel font-bold text-amber-300 transition shadow-sm cursor-pointer"
                title="Otevřít mapu celého kraje"
              >
                <Compass size={14} /> Mapa kraje
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-amber-200 hover:bg-white/5 transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Town Flavor Overview Bar */}
        <div className="px-6 py-2.5 bg-black/40 border-b border-amber-900/20 text-xs text-slate-300 flex items-center justify-between gap-4">
          <p className="italic line-clamp-1">
            "Vzduch v uličkách voní kouřem z dřevěného uhlí, čerstvým chlebem a potem tažných koní. Místní stráže bedlivě sledují každého příchozího."
          </p>
          <div className="shrink-0 text-amber-400/80 font-sans font-semibold">
            {subLocations.length} významných zákoutí
          </div>
        </div>

        {/* District Cards Grid */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subLocations.map((subLoc: any) => {
              const questStatus = getLocationQuestStatus(subLoc.id, quests);
              const hasBadge = questStatus.primaryBadge !== 'none';
              
              // Resolve present NPCs
              const presentNpcNames = (subLoc.npcs || []).map((npcId: string) => {
                const npc = npcsDict[npcId];
                return npc?.name || npcId;
              });

              return (
                <div 
                  key={subLoc.id}
                  className="group relative bg-[#18202d]/90 hover:bg-[#1f2a3a] border border-amber-900/30 hover:border-amber-500/50 rounded-xl p-4 transition-all duration-200 flex flex-col justify-between shadow-lg hover:shadow-amber-950/40"
                >
                  {/* Card Top: Icon, Title & Badges */}
                  <div>
                    <div className="flex items-start justify-between gap-2 pb-2 border-b border-amber-900/20">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-black/40 border border-amber-900/30 group-hover:border-amber-500/40 transition">
                          {getSubLocationIcon(subLoc.id, subLoc.type)}
                        </div>
                        <div>
                          <h4 className="font-cinzel font-bold text-sm text-amber-100 group-hover:text-amber-300 transition line-clamp-1">
                            {subLoc.name}
                          </h4>
                          <span className="text-[10px] text-amber-400/60 uppercase font-sans tracking-wider">
                            {subLoc.type || 'Městská budova'}
                          </span>
                        </div>
                      </div>

                      {/* Quest Badges */}
                      {hasBadge && (
                        <div className="flex items-center gap-1">
                          {questStatus.turnInCount > 0 && (
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-yellow-500/20 border border-yellow-400 text-yellow-300 font-bold text-xs animate-bounce" title="Úkol k odevzdání!">
                              ?
                            </span>
                          )}
                          {questStatus.availableCount > 0 && (
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 font-bold text-xs" title="Nový úkol!">
                              !
                            </span>
                          )}
                          {questStatus.objectiveCount > 0 && (
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 text-xs" title="Cíl úkolu">
                              ◈
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-300 mt-2.5 line-clamp-3 leading-relaxed font-lora">
                      {subLoc.description || 'Významná budova v Oakhaven.'}
                    </p>

                    {/* Present NPCs */}
                    {presentNpcNames.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-amber-900/20 flex items-center gap-1.5 text-[11px] text-amber-200/80 truncate">
                        <User size={12} className="shrink-0 text-amber-400" />
                        <span className="truncate">
                          {presentNpcNames.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom: Enter / Action Button */}
                  <div className="mt-4 pt-2.5 border-t border-amber-900/20 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Footprints size={11} /> Vstup zdarma
                    </span>

                    <button
                      onClick={() => handleEnterSubLocation(subLoc)}
                      className="px-3 py-1.5 rounded-lg bg-amber-900/30 hover:bg-amber-800/60 border border-amber-500/30 hover:border-amber-400/60 text-amber-200 font-cinzel font-bold text-xs tracking-wide transition flex items-center gap-1 cursor-pointer group-hover:text-amber-100"
                    >
                      Vstoupit <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Secret / Unexplored Corner Card */}
            <div className="border border-dashed border-amber-900/40 rounded-xl p-4 flex flex-col justify-between items-center text-center bg-black/20 text-slate-400">
              <div className="my-auto py-4">
                <div className="w-10 h-10 mx-auto rounded-full bg-amber-950/40 border border-amber-900/40 flex items-center justify-center text-amber-500/70 mb-2">
                  <HelpCircle size={20} />
                </div>
                <h4 className="font-cinzel font-bold text-sm text-slate-300">
                  Neznámé zákoutí (?)
                </h4>
                <p className="text-[11px] text-slate-400 max-w-xs mt-1">
                  Skryté uličky, starý hřbitov a podzemní stoky za palisádou zatím čekají na odhalení.
                </p>
              </div>

              <button
                onClick={() => onSendAction?.("Pečlivě prozkoumávám skrytá zákoutí města Oakhaven")}
                className="w-full py-1.5 rounded-lg bg-black/40 hover:bg-amber-950/50 border border-amber-900/30 text-amber-300/80 hover:text-amber-200 font-cinzel text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Eye size={12} /> Prozkoumat okolí
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Status / Footer */}
        <div className="px-6 py-3 bg-black/50 border-t border-amber-900/30 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Bezpečná městská zóna (Valerijské Impérium)</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-amber-900/40 hover:border-amber-500/40 bg-white/5 hover:bg-white/10 text-xs font-cinzel text-amber-200 transition cursor-pointer"
          >
            Zavřít
          </button>
        </div>

      </div>
    </div>
  );
};
