import React, { useState, useMemo } from 'react';
import { 
  X, Map as MapIcon, Footprints, Eye, EyeOff, 
  Compass, Castle, Home, Skull, Star, Info, Shield, 
  ChevronRight, AlertTriangle
} from 'lucide-react';
import HexMap, { hexDistance, getHexLine } from '../../components/map/HexMap';
import { useGameStore } from '../../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { WORLD_LORE } from '../../data/worldLore';

export const MapModal = ({ isOpen, onClose, setSelectedItem, onTravel }: any) => {
  const { 
    worldData, 
    playerLocation, 
    day, 
    rations, 
    currentRegion,
    fogOfWarEnabled, 
    setFogOfWarEnabled,
    exploredHexes 
  } = useGameStore();

  const [selectedHex, setSelectedHex] = useState<any>(null);
  const [showLegend, setShowLegend] = useState(false);

  const translateTerrain = (t: string) => {
    switch(t) {
      case 'Ocean': return 'Oceán';
      case 'Mountains': return 'Hory';
      case 'Forest': return 'Les';
      case 'Swamp': return 'Bažina';
      case 'Wasteland': return 'Pustina';
      case 'Plains': return 'Pláně';
      default: return t || 'Neznámý terén';
    }
  };

  const translatePoi = (p: string) => {
    switch(p) {
      case 'Capital': return 'Hlavní Město';
      case 'Village': return 'Vesnice';
      case 'Dungeon': return 'Temnice (Dungeon)';
      case 'Shrine': return 'Posvátná Svatyně';
      case 'Ruin': return 'Prastará Ruina';
      default: return p;
    }
  };

  const getPoiBadge = (poi: string) => {
    switch(poi) {
      case 'Capital':
        return { icon: <Castle size={16} className="text-amber-300" />, label: 'Hlavní Město', bg: 'bg-amber-950 text-amber-200 border-amber-600' };
      case 'Village':
        return { icon: <Home size={16} className="text-amber-200" />, label: 'Vesnice', bg: 'bg-[#451a03] text-amber-100 border-amber-700' };
      case 'Dungeon':
        return { icon: <Skull size={16} className="text-red-300" />, label: 'Temnice', bg: 'bg-zinc-900 text-red-300 border-red-800' };
      case 'Shrine':
        return { icon: <Star size={16} className="text-indigo-200" />, label: 'Svatyně', bg: 'bg-indigo-950 text-indigo-200 border-indigo-700' };
      case 'Ruin':
        return { icon: <Eye size={16} className="text-teal-200" />, label: 'Ruina', bg: 'bg-slate-900 text-teal-200 border-teal-700' };
      default:
        return null;
    }
  };

  const handleHexClick = (hex: any) => {
    setShowLegend(false);
    setSelectedHex(hex);
    if (hex.nazev && setSelectedItem) {
      setSelectedItem({
        id: `${hex.q}_${hex.r}`,
        name: hex.nazev,
        desc: hex.popis || (hex.poi ? `Významné místo: ${translatePoi(hex.poi)}` : `Krajina: ${translateTerrain(hex.terrain)}`),
        type: hex.poi || hex.terrain
      });
    }
  };

  const toggleLegend = () => {
    setShowLegend(prev => {
      if (!prev) setSelectedHex(null);
      return !prev;
    });
  };

  // Travel calculation
  const travelStats = useMemo(() => {
    if (!selectedHex || !playerLocation) {
      return { dist: 999, route: [], canTravelDirect: false, canTravelStep: false, nextStep: null, error: '', foodCost: 1 };
    }

    const dist = hexDistance(playerLocation.q, playerLocation.r, selectedHex.q, selectedHex.r);
    const route = getHexLine(playerLocation.q, playerLocation.r, selectedHex.q, selectedHex.r);
    const nextStep = route.length > 1 ? route[1] : null;

    let error = '';
    const isOcean = selectedHex.terrain === 'Ocean';
    const isHarsh = ['Swamp', 'Wasteland', 'Mountains'].includes(selectedHex.terrain);
    const foodCost = isHarsh ? 2 : 1;

    if (dist === 0) {
      error = 'Zde se právě nacházíš.';
    } else if (isOcean) {
      error = 'Neprostupný oceán. Bez lodi nelze překročit mořské hlubiny.';
    } else if (rations < foodCost) {
      error = `Nedostatek zásob jídla! Pro cestu do tohoto terénu potřebuješ alespoň ${foodCost} zásoby.`;
    }

    // Step calculation: if route exists, check if nextStep is ocean
    let canTravelStep = false;
    if (dist > 1 && !isOcean && nextStep) {
      const nextHexData = worldData?.hex_grid?.find((h: any) => h.q === nextStep.q && h.r === nextStep.r);
      if (nextHexData && nextHexData.terrain !== 'Ocean') {
        const nextCost = ['Swamp', 'Wasteland', 'Mountains'].includes(nextHexData.terrain) ? 2 : 1;
        if (rations >= nextCost) {
          canTravelStep = true;
        }
      }
    }

    return {
      dist,
      route,
      nextStep,
      foodCost,
      canTravelDirect: dist === 1 && !error,
      canTravelStep,
      error
    };
  }, [selectedHex, playerLocation, rations, worldData]);

  const handleDirectTravel = () => {
    if (selectedHex && onTravel && travelStats.canTravelDirect) {
      const hex = selectedHex;
      setSelectedHex(null);
      onClose();
      onTravel(hex.q, hex.r, hex);
    }
  };

  const handleStepTravel = () => {
    const step = travelStats.nextStep;
    if (step && onTravel) {
      const nextHexData = worldData?.hex_grid?.find(
        (h: any) => h.q === step.q && h.r === step.r
      ) || step;
      setSelectedHex(null);
      onClose();
      onTravel(step.q, step.r, nextHexData);
    }
  };

  if (!isOpen) return null;

  if (!worldData) {
    return (
      <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
        <div className="bg-[#faf6ea] border-4 border-amber-950/80 p-6 sm:p-8 rounded-2xl max-w-md text-center shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-amber-900 mb-3">Mapa nenalezena</h2>
          <p className="text-slate-800 font-lora text-sm mb-6 leading-relaxed">
            Data pro mapu světa zatím nejsou k dispozici nebo došlo k chybě při inicializaci. Zkus obnovit hru nebo vytvořit novou postavu.
          </p>
          <button 
            onClick={onClose} 
            className="bg-amber-900 hover:bg-amber-950 text-amber-100 px-6 py-2.5 rounded-xl font-cinzel font-bold transition shadow-md cursor-pointer"
          >
            Zavřít
          </button>
        </div>
      </div>
    );
  }

  const selectedKingdom = selectedHex?.kingdom_id 
    ? WORLD_LORE.kingdoms.find(k => k.id === selectedHex.kingdom_id)
    : null;

  const poiBadge = selectedHex?.poi ? getPoiBadge(selectedHex.poi) : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm select-none">
      <div className="w-full h-full max-h-screen relative overflow-hidden bg-[#e8dfc8]">
        
        {/* Top Header HUD */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-50 flex items-center gap-2 flex-wrap max-w-[calc(100vw-70px)] pointer-events-auto">
          {/* World Badge */}
          <div className="bg-[#faf6ea]/95 backdrop-blur-md px-3 sm:px-4 py-2 rounded-xl border-2 border-amber-900/40 shadow-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-900/15 flex items-center justify-center text-amber-900 shrink-0">
              <MapIcon size={18} />
            </div>
            <div>
              <h2 className="text-[#8b1e1e] font-bold text-xs sm:text-sm font-medieval tracking-widest uppercase flex items-center gap-1.5 leading-tight">
                Aelthgard
              </h2>
              <div className="text-[10px] sm:text-xs font-lora font-semibold text-slate-800 flex items-center gap-2">
                <span>⏱ Den <strong>{day}</strong></span>
                <span>•</span>
                <span>🍖 Zásoby: <strong>{rations}</strong></span>
                {currentRegion && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline text-amber-900 font-bold truncate max-w-[140px]">{currentRegion}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Fog of War Toggle */}
          <button
            onClick={() => setFogOfWarEnabled(prev => !prev)}
            className={`px-2.5 sm:px-3 py-2 rounded-xl border-2 font-cinzel text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer ${
              fogOfWarEnabled 
                ? 'bg-[#faf6ea] border-amber-900/40 text-amber-950 hover:bg-amber-100' 
                : 'bg-amber-900 text-amber-100 border-amber-700 hover:bg-amber-950'
            }`}
            title="Přepnout mlhu neznáma (Fog of War)"
          >
            {fogOfWarEnabled ? <Eye size={15} /> : <EyeOff size={15} />}
            <span className="hidden sm:inline">Mlha:</span>
            <span>{fogOfWarEnabled ? 'Zap' : 'Vyp'}</span>
          </button>

          {/* Map Legend Button */}
          <button
            onClick={toggleLegend}
            className={`px-2.5 sm:px-3 py-2 rounded-xl border-2 font-cinzel text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer ${
              showLegend
                ? 'bg-amber-900 text-amber-100 border-amber-700'
                : 'bg-[#faf6ea] border-amber-900/40 text-amber-950 hover:bg-amber-100'
            }`}
            title="Otevřít legendu mapy"
          >
            <Compass size={15} />
            <span>Legenda</span>
          </button>
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-amber-950 text-amber-100 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[#8b1e1e] transition z-50 border-2 border-amber-900/50 shadow-xl cursor-pointer active:scale-95"
          title="Zavřít mapu"
        >
          <X size={20} />
        </button>

        {/* Full-bleed HexMap Canvas */}
        <div className="w-full h-full">
          <HexMap 
            worldData={worldData}
            setSelectedItem={setSelectedItem}
            playerLocation={playerLocation}
            selectedHex={selectedHex}
            onHexClick={handleHexClick}
            fogOfWarEnabled={fogOfWarEnabled}
            exploredHexes={exploredHexes}
          />
        </div>

        {/* Responsive Tactile Bottom Sheet / Travel Confirmation */}
        <AnimatePresence>
          {selectedHex && !showLegend && (
            <motion.div
              initial={{ y: 150, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 150, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="fixed sm:absolute bottom-0 inset-x-0 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[430px] max-h-[85vh] sm:max-h-[82vh] bg-[#faf6ea] bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] border-t-4 sm:border-4 border-amber-950/80 rounded-t-3xl sm:rounded-2xl shadow-[0_-15px_40px_rgba(0,0,0,0.5)] z-[85] flex flex-col overflow-hidden"
            >
              {/* Mobile Drag Indicator */}
              <div className="w-12 h-1.5 bg-amber-900/25 rounded-full mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

              <div className="p-4 sm:p-5 overflow-y-auto flex-1 flex flex-col gap-3">
                {/* Header & Badges */}
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {poiBadge && (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-cinzel font-bold shadow-sm ${poiBadge.bg}`}>
                          {poiBadge.icon}
                          {poiBadge.label}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-900/10 border border-amber-900/20 text-amber-950 text-[11px] font-lora font-semibold">
                        Terén: {translateTerrain(selectedHex.terrain)}
                      </span>
                      {selectedKingdom && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-900/10 border border-amber-900/20 text-amber-900 text-[11px] font-cinzel font-bold">
                          {selectedKingdom.badge} {selectedKingdom.name}
                        </span>
                      )}
                    </div>
                    <h3 className="font-cinzel font-bold text-amber-950 text-lg sm:text-xl leading-tight">
                      {selectedHex.nazev || translateTerrain(selectedHex.terrain)}
                    </h3>
                  </div>

                  <button 
                    onClick={() => setSelectedHex(null)} 
                    className="text-amber-900/70 hover:text-amber-950 p-1.5 rounded-lg hover:bg-amber-900/10 transition cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Lore / Atmosphere */}
                <div className="bg-[#f2ecda] p-3 rounded-xl border border-amber-900/20 text-slate-800 font-lora text-xs sm:text-sm leading-relaxed">
                  {selectedHex.popis ? (
                    <p>{selectedHex.popis}</p>
                  ) : (
                    <p className="italic text-slate-700">
                      {selectedHex.terrain === 'Ocean' 
                        ? 'Nekonečné mořské dálavy a hlubiny, které brázdí pouze rybářské bárky a legendární mořské bestie.'
                        : selectedHex.terrain === 'Forest'
                        ? 'Hluboký prastarý les se šumícími korunami stromů. V mechu se ukrývají stopy zvěře i divokých kmenů.'
                        : selectedHex.terrain === 'Mountains'
                        ? 'Strmé žulové štíty stoupající k mrakům. Cesty jsou úzké, mrazivé a vyžadují opatrnost i zásoby.'
                        : selectedHex.terrain === 'Swamp'
                        ? 'Mlžný močál plný zrádných rašelinišť a nezdravých výparů. Poutníci zde snadno zabloudí.'
                        : selectedHex.terrain === 'Wasteland'
                        ? 'Vyprahlá spálená země nasáklá pradávnou magickou katastrofou. Jen málokdo se zde odváží tábořit.'
                        : 'Úrodné travnaté pláně lemované kamenitými cestami a malebnými remízky.'}
                    </p>
                  )}
                </div>

                {/* Travel & Cost Section */}
                <div className="bg-[#f6f0dd] p-3 rounded-xl border border-amber-900/25 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-lora">
                    <span className="font-bold text-amber-950 flex items-center gap-1.5">
                      <Compass size={16} className="text-amber-800" />
                      Vzdálenost:
                    </span>
                    <span className="font-bold text-amber-900">
                      {travelStats.dist === 0 
                        ? 'Zde se nacházíš' 
                        : `${travelStats.dist} ${travelStats.dist === 1 ? 'hex' : travelStats.dist < 5 ? 'hexy' : 'hexů'}`}
                    </span>
                  </div>

                  {travelStats.dist > 0 && (
                    <div className="border-t border-amber-900/15 pt-2 flex items-center justify-between text-xs sm:text-sm font-lora">
                      <span className="text-slate-700">Náklady na 1 krok:</span>
                      <div className="flex items-center gap-2 font-bold text-amber-900">
                        <span>⏱ 1 Den</span>
                        <span>•</span>
                        <span>🍖 {travelStats.foodCost} {travelStats.foodCost === 1 ? 'Zásoba' : 'Zásoby'}</span>
                      </div>
                    </div>
                  )}

                  {travelStats.dist > 1 && (
                    <div className="text-[11px] text-slate-600 font-lora italic">
                      Celá expedice by zabrala přibližně {travelStats.dist} dní a {travelStats.dist * travelStats.foodCost} zásob jídla. Putování probíhá krok po kroku.
                    </div>
                  )}

                  {travelStats.error && travelStats.dist > 0 && (
                    <div className="bg-red-50 border border-red-300 p-2 rounded-lg flex items-center gap-2 text-red-700 text-xs font-lora font-bold">
                      <AlertTriangle size={15} className="shrink-0 text-red-600" />
                      <span>{travelStats.error}</span>
                    </div>
                  )}
                </div>

                {/* Travel Action Buttons */}
                <div className="pt-1">
                  {travelStats.dist === 0 ? (
                    <div className="w-full py-2.5 px-4 bg-amber-900/15 border border-amber-900/30 rounded-xl text-center text-amber-950 font-cinzel font-bold text-xs sm:text-sm">
                      📍 Zde právě táboříš
                    </div>
                  ) : travelStats.canTravelDirect ? (
                    <button
                      onClick={handleDirectTravel}
                      className="w-full bg-[#8b1e1e] hover:bg-red-800 text-amber-100 font-cinzel font-bold py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer active:scale-98"
                    >
                      <Footprints size={18} />
                      Vydat se do této lokace (1 den)
                    </button>
                  ) : travelStats.canTravelStep ? (
                    <button
                      onClick={handleStepTravel}
                      className="w-full bg-amber-900 hover:bg-amber-950 text-amber-100 font-cinzel font-bold py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer active:scale-98"
                    >
                      <Compass size={18} />
                      Vydat se směrem k cíli (Krok 1/{travelStats.dist})
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-slate-300 text-slate-600 font-cinzel font-bold py-3 rounded-xl transition cursor-not-allowed text-xs sm:text-sm flex items-center justify-center gap-2 opacity-80"
                    >
                      ⛔ Nelze cestovat ({travelStats.error || 'Nedostupné'})
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsible Illustrated Map Legend */}
        <AnimatePresence>
          {showLegend && (
            <>
              {/* Dark backdrop scrim to isolate legend and prevent bleed-through */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowLegend(false)}
                className="fixed inset-0 bg-black/65 backdrop-blur-xs z-[90] cursor-pointer"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-4 sm:inset-auto sm:top-16 sm:left-4 sm:w-[460px] sm:max-h-[82vh] z-[95] bg-[#faf6ea] bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] border-4 border-amber-950/80 rounded-2xl shadow-2xl p-4 sm:p-5 flex flex-col overflow-hidden text-slate-900"
              >
                {/* Legend Header */}
                <div className="flex justify-between items-center pb-3 border-b-2 border-amber-900/25 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-900/15 flex items-center justify-center text-amber-900">
                      <Compass size={18} />
                    </div>
                    <h3 className="font-cinzel font-bold text-amber-950 text-lg sm:text-xl">
                      Legenda Mapy
                    </h3>
                  </div>
                  <button 
                    onClick={() => setShowLegend(false)}
                    className="text-amber-900/70 hover:text-amber-950 p-1.5 rounded-lg hover:bg-amber-900/10 transition cursor-pointer"
                    title="Zavřít legendu"
                  >
                    <X size={22} />
                  </button>
                </div>

                {/* Legend Content Scrollable */}
                <div className="overflow-y-auto flex-1 py-3 flex flex-col gap-4 text-xs font-lora">
                  {/* 1. Kingdoms */}
                  <div>
                    <h4 className="font-cinzel font-bold text-amber-900 text-sm mb-2 uppercase tracking-wider flex items-center gap-1.5">
                      <Shield size={15} /> 7 Království Aelthgardu
                    </h4>
                    <div className="grid grid-cols-1 gap-1.5">
                      {WORLD_LORE.kingdoms.map(k => (
                        <div key={k.id} className="p-2 rounded-lg bg-amber-900/5 border border-amber-900/15 flex items-start gap-2">
                          <span className="text-base">{k.badge}</span>
                          <div>
                            <strong className="font-cinzel text-amber-950 block">{k.name}</strong>
                            <span className="text-[11px] text-slate-700">{k.archetype}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. POIs */}
                  <div>
                    <h4 className="font-cinzel font-bold text-amber-900 text-sm mb-2 uppercase tracking-wider flex items-center gap-1.5">
                      <Star size={15} /> Významná Místa (POIs)
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center gap-2.5 p-1.5 rounded-lg bg-amber-950 text-amber-100 border border-amber-600">
                        <Castle size={16} className="text-amber-300 shrink-0" />
                        <div>
                          <strong className="font-cinzel block text-[11px]">Hlavní Město</strong>
                          <span className="text-[10px] text-amber-200">Sídlo panovníka, obchody a gildy</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 p-1.5 rounded-lg bg-[#451a03] text-amber-100 border border-amber-700">
                        <Home size={16} className="text-amber-200 shrink-0" />
                        <div>
                          <strong className="font-cinzel block text-[11px]">Vesnice</strong>
                          <span className="text-[10px] text-amber-200">Hostinec, odpočinek a doplňování zásob</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 p-1.5 rounded-lg bg-zinc-900 text-red-200 border border-red-800">
                        <Skull size={16} className="text-red-400 shrink-0" />
                        <div>
                          <strong className="font-cinzel block text-[11px]">Temnice (Dungeon)</strong>
                          <span className="text-[10px] text-red-300">Nebezpečná monstra, starobylá kořist</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 p-1.5 rounded-lg bg-indigo-950 text-indigo-100 border border-indigo-700">
                        <Star size={16} className="text-indigo-300 shrink-0" />
                        <div>
                          <strong className="font-cinzel block text-[11px]">Posvátná Svatyně</strong>
                          <span className="text-[10px] text-indigo-200">Božská požehnání a léčení</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 p-1.5 rounded-lg bg-slate-900 text-teal-100 border border-teal-700">
                        <Eye size={16} className="text-teal-300 shrink-0" />
                        <div>
                          <strong className="font-cinzel block text-[11px]">Prastará Ruina</strong>
                          <span className="text-[10px] text-teal-200">Tajemná magie a zapomenutá historie</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Terrains */}
                  <div>
                    <h4 className="font-cinzel font-bold text-amber-900 text-sm mb-2 uppercase tracking-wider flex items-center gap-1.5">
                      <Info size={15} /> Terény & Zásoby
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 rounded bg-amber-900/5 border border-amber-900/10">
                        <strong className="block text-amber-950">🌾 Pláně</strong>
                        <span className="text-slate-700">Náklad: 1 den, 1 jídlo</span>
                      </div>
                      <div className="p-2 rounded bg-amber-900/5 border border-amber-900/10">
                        <strong className="block text-amber-950">🌲 Lesy</strong>
                        <span className="text-slate-700">Náklad: 1 den, 1 jídlo</span>
                      </div>
                      <div className="p-2 rounded bg-amber-900/5 border border-amber-900/10">
                        <strong className="block text-amber-950">⛰️ Hory</strong>
                        <span className="text-slate-700">Náklad: 1 den, 2 jídla</span>
                      </div>
                      <div className="p-2 rounded bg-amber-900/5 border border-amber-900/10">
                        <strong className="block text-amber-950">🌫️ Bažiny</strong>
                        <span className="text-slate-700">Náklad: 1 den, 2 jídla</span>
                      </div>
                      <div className="p-2 rounded bg-amber-900/5 border border-amber-900/10">
                        <strong className="block text-amber-950">🔥 Pustina</strong>
                        <span className="text-slate-700">Náklad: 1 den, 2 jídla</span>
                      </div>
                      <div className="p-2 rounded bg-amber-900/5 border border-amber-900/10">
                        <strong className="block text-amber-950">🌊 Oceán</strong>
                        <span className="text-slate-700">Neprostupný bez lodi</span>
                      </div>
                    </div>
                  </div>

                  {/* 4. Fog of War */}
                  <div className="p-3 rounded-xl bg-amber-900/10 border border-amber-900/25 text-[11px] leading-relaxed">
                    <strong className="font-cinzel text-amber-950 font-bold block mb-1 text-xs flex items-center gap-1.5">
                      <span>🌫️</span> Mlha Neznáma (Fog of War)
                    </strong>
                    <p className="text-amber-950 font-medium font-lora">
                      Šrafované oblasti představují neprozkoumané země. Jakmile vstoupíš do sousedství nebo navštívíš daný hex, mlha se rozplyne a odhalí skrytá města, dungeony i krajinu. Mlhu lze kdykoli přepnout tlačítkem v záhlaví.
                    </p>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
