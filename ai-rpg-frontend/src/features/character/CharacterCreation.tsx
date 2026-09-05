import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { 
  Settings2, Sparkles, ChevronRight, ChevronLeft, Crown, Shield, 
  Wand2, Axe, Ghost, Skull, Book, Flame, X, Loader2, Globe, Eye, Sun, Compass, ArrowLeft 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SeamlessVideo } from '../../components/ui/SeamlessVideo';
import { calculateBaseStats } from '../../utils/statsCalculator';
import { RACES } from '../../data/races';
import { WORLD_LORE, GodLore, KingdomLore } from '../../data/worldLore';

const STARTING_GEAR: Record<string, { weapon: string; armor: string; offhand?: string; potion: string }> = {
  "Barbar": { weapon: "Obouruční sekera (+2)", armor: "Kožené hadry", potion: "Léčivý lektvar" },
  "Bard": { weapon: "Rapír (+2)", armor: "Kožená zbroj (+1 AC)", potion: "Léčivý lektvar" },
  "Klerik": { weapon: "Kovaný palcát (+1)", armor: "Kroužková košile (+1 AC)", offhand: "Okovaný štít (+1 AC)", potion: "Léčivý lektvar" },
  "Druid": { weapon: "Druidská hůl (+1)", armor: "Zesílená kůže (+1 AC)", potion: "Léčivý lektvar" },
  "Bojovník": { weapon: "Dlouhý meč (+2)", armor: "Kroužková zbroj (+2 AC)", offhand: "Pěchotní štít (+1 AC)", potion: "Léčivý lektvar" },
  "Mnich": { weapon: "Bojová hůl bo (+1)", armor: "Klášterní roucho", potion: "Léčivý lektvar" },
  "Paladin": { weapon: "Válečné kladivo (+2)", armor: "Kroužková zbroj (+2 AC)", offhand: "Posvátný štít (+1 AC)", potion: "Léčivý lektvar" },
  "Hraničář": { weapon: "Lovecký dlouhý luk (+2)", armor: "Zesílená kůže (+1 AC)", offhand: "Lovecký tesák (+1)", potion: "Léčivý lektvar" },
  "Tulák": { weapon: "Dýka (+1)", armor: "Kožená zbroj (+1 AC)", offhand: "Levá dýka (+1)", potion: "Léčivý lektvar" },
  "Čaroděj": { weapon: "Rituální dýka (+1)", armor: "Magické roucho", potion: "Léčivý lektvar" },
  "Černokněžník": { weapon: "Paktová dýka (+1)", armor: "Temné roucho", potion: "Léčivý lektvar" },
  "Kouzelník": { weapon: "Učednická hůlka (+1)", armor: "Mágovo roucho", potion: "Léčivý lektvar" }
};

export const CharacterCreation = ({ startNewGame, loading, backstory, generateBackstory, onClose, getAvatarVideo }: any) => {
  const [step, setStep] = useState(1);
  const [selectedGod, setSelectedGod] = useState<string>('solarian');
  const [selectedKingdom, setSelectedKingdom] = useState<number>(1);
  const [loreTab, setLoreTab] = useState<'overview' | 'gods' | 'kingdoms'>('overview');

  const classes = ["Barbar", "Bard", "Klerik", "Druid", "Bojovník", "Mnich", "Paladin", "Hraničář", "Tulák", "Čaroděj", "Černokněžník", "Kouzelník"];
  const races = ["Člověk", "Elf", "Trpaslík", "Půlčík", "Drakorozený", "Tiefling", "Půlork", "Gnóm"];
  
  const { 
    name, setName, 
    race, setRace, 
    dndClass, setDndClass, 
    stats, setStats, 
    keywords, setKeywords, 
    gameMode, setGameMode 
  } = useGameStore();

  React.useEffect(() => {
    setStats(calculateBaseStats(dndClass, race));
  }, [dndClass, race, setStats]);

  const handleNext = () => setStep(prev => Math.min(prev + 1, 4));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  const pageVariants = {
    initial: { opacity: 0, x: 25 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -25 }
  };

  const getRaceIcon = (r: string) => {
    switch(r) {
      case "Člověk": return <Crown size={22} />;
      case "Elf": return <Sparkles size={22} />;
      case "Trpaslík": return <Axe size={22} />;
      case "Tiefling": return <Flame size={22} />;
      case "Půlork": return <Skull size={22} />;
      default: return <Ghost size={22} />;
    }
  };

  const getClassIcon = (c: string) => {
    switch(c) {
      case "Bojovník": case "Barbar": return <Shield size={22} />;
      case "Paladin": return <Crown size={22} />;
      case "Kouzelník": case "Čaroděj": case "Černokněžník": return <Wand2 size={22} />;
      case "Klerik": return <Book size={22} />;
      case "Druid": return <Flame size={22} />;
      case "Bard": return <Sparkles size={22} />;
      case "Tulák": return <Ghost size={22} />;
      case "Hraničář": return <Axe size={22} />;
      case "Mnich": return <Shield size={22} />;
      default: return <Axe size={22} />;
    }
  };

  const currentKingdomData = WORLD_LORE.kingdoms.find(k => k.id === selectedKingdom) || WORLD_LORE.kingdoms[0];
  const currentGodData = WORLD_LORE.gods.find(g => g.id === selectedGod) || WORLD_LORE.gods[0];

  return (
    <div className="min-h-screen w-full bg-[#12181f] text-slate-900 flex flex-col items-center justify-center p-2 sm:p-4 overflow-y-auto overflow-x-hidden relative">
      
      <video src="/video/bg1.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#e5dfc5]/20 via-[#f9f6e6]/50 to-transparent z-0 pointer-events-none" />

      {loading && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center cursor-not-allowed p-4">
          <div className="flex flex-col items-center gap-4 p-6 sm:p-8 bg-[#f9f6e6] rounded-2xl shadow-2xl border border-amber-600/40 max-w-sm text-center">
            <Loader2 className="w-10 h-10 text-amber-700 animate-spin" />
            <p className="text-lg sm:text-xl font-cinzel font-bold text-slate-800">
              Probouzím bohy a tvořím svět...<br/>
              <span className="text-xs sm:text-sm font-lora font-normal text-slate-600 mt-1 block">Prosím strpení, nenech se vyrušit.</span>
            </p>
          </div>
        </div>
      )}

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-amber-600/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl max-h-[94dvh] overflow-y-auto bg-[#f9f6e6]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-amber-900/20 p-4 sm:p-6 md:p-8 relative z-10 flex flex-col justify-between custom-scrollbar"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 sm:mb-5 border-b border-amber-900/15 pb-3 shrink-0">
          <div>
            <h2 className="text-xl sm:text-3xl font-cinzel font-bold text-amber-950">
              {step === 1 && "Svět Aelthgardu"}
              {step === 2 && "Zrození Hrdiny"}
              {step === 3 && "Cesta Meče a Magie"}
              {step === 4 && "Kniha Osudu"}
            </h2>
            <p className="text-[11px] sm:text-xs font-lora text-slate-600 mt-0.5">Krok {step} ze 4</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5 sm:gap-2">
              {[1, 2, 3, 4].map(i => (
                <div 
                  key={i} 
                  className={`h-1.5 sm:h-2 w-5 sm:w-8 rounded-full transition-all duration-500 ${step >= i ? 'bg-amber-700 shadow-[0_0_8px_rgba(180,83,9,0.5)]' : 'bg-amber-900/15'}`} 
                />
              ))}
            </div>
            {onClose && (
              <button 
                onClick={onClose} 
                className="px-2.5 py-1.5 rounded-xl border border-amber-900/20 text-slate-700 hover:text-amber-950 hover:bg-amber-100/60 font-cinzel font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Zpět k výběru postav"
              >
                <ArrowLeft size={14} />
                <span className="hidden sm:inline">Zpět k postavám</span>
              </button>
            )}
          </div>
        </div>

        {/* Form Body */}
        <div className="flex-1 py-1">
          <AnimatePresence mode="wait">
            {/* STEP 1: WORLD LORE & PROLOGUE */}
            {step === 1 && (
              <motion.div key="step1" variants={pageVariants} initial="initial" animate="in" exit="out" className="space-y-4">
                
                {/* World Introduction Banner */}
                <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 p-4 rounded-xl text-white shadow-md border border-amber-500/30">
                  <div className="flex items-center gap-2 mb-1 text-amber-400 font-cinzel font-bold text-xs uppercase tracking-widest">
                    <Globe size={14} />
                    <span>Kronika Světa • {WORLD_LORE.subtitle}</span>
                  </div>
                  <h3 className="font-cinzel text-lg sm:text-xl font-bold text-amber-200 mb-1">
                    Vítej v zemi, kde pohádka končí krví
                  </h3>
                  <p className="text-xs sm:text-sm font-lora text-slate-300 leading-relaxed italic">
                    „{WORLD_LORE.overview}“
                  </p>
                </div>

                {/* Lore Navigation Tabs */}
                <div className="flex gap-1.5 border-b border-amber-900/15 pb-2">
                  <button
                    onClick={() => setLoreTab('overview')}
                    className={`px-3 py-1.5 rounded-lg font-cinzel text-xs font-bold transition flex items-center gap-1.5 ${
                      loreTab === 'overview'
                        ? 'bg-amber-800 text-white shadow-xs'
                        : 'bg-white/60 text-slate-700 hover:bg-white'
                    }`}
                  >
                    <Compass size={13} /> Přehled & Procitnutí
                  </button>
                  <button
                    onClick={() => setLoreTab('gods')}
                    className={`px-3 py-1.5 rounded-lg font-cinzel text-xs font-bold transition flex items-center gap-1.5 ${
                      loreTab === 'gods'
                        ? 'bg-amber-800 text-white shadow-xs'
                        : 'bg-white/60 text-slate-700 hover:bg-white'
                    }`}
                  >
                    <Sun size={13} /> 3 Válčící Bohové
                  </button>
                  <button
                    onClick={() => setLoreTab('kingdoms')}
                    className={`px-3 py-1.5 rounded-lg font-cinzel text-xs font-bold transition flex items-center gap-1.5 ${
                      loreTab === 'kingdoms'
                        ? 'bg-amber-800 text-white shadow-xs'
                        : 'bg-white/60 text-slate-700 hover:bg-white'
                    }`}
                  >
                    <Crown size={13} /> 7 Království
                  </button>
                </div>

                {/* Tab 1: Overview & Magic */}
                {loreTab === 'overview' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                    <div className="bg-white/70 border border-amber-900/15 p-4 rounded-xl shadow-xs">
                      <h4 className="font-cinzel font-bold text-sm text-amber-950 mb-1 flex items-center gap-1.5">
                        <Sparkles size={16} className="text-amber-700" />
                        Tajemství Magie: „Procitnutí“
                      </h4>
                      <p className="text-xs sm:text-sm font-lora text-slate-800 leading-relaxed">
                        {WORLD_LORE.magicConcept}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-[#fcfbf7] border border-amber-900/15 p-3 rounded-xl">
                        <div className="font-cinzel font-bold text-xs text-amber-900 mb-1 uppercase tracking-wider">
                          ⚔️ Tón Světa
                        </div>
                        <p className="text-xs font-lora text-slate-700 leading-relaxed">
                          Pohádkově malebný vizuál skrývá drsnou realitu: morální volby bez jednoznačného dobra a zla, intriky šlechty a nebezpečné nestvůry.
                        </p>
                      </div>
                      <div className="bg-[#fcfbf7] border border-amber-900/15 p-3 rounded-xl">
                        <div className="font-cinzel font-bold text-xs text-amber-900 mb-1 uppercase tracking-wider">
                          📜 Tvá Role
                        </div>
                        <p className="text-xs font-lora text-slate-700 leading-relaxed">
                          Ať už jsi válečník hledající vykoupení, tulák bažící po bohatství nebo procitnutý mág, tvé volby ovlivní osudy celého kontinentu.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Tab 2: The 3 Gods */}
                {loreTab === 'gods' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      {WORLD_LORE.gods.map(god => (
                        <button
                          key={god.id}
                          onClick={() => setSelectedGod(god.id)}
                          className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                            selectedGod === god.id
                              ? 'bg-amber-100/90 border-amber-700 shadow-sm font-bold scale-[1.02]'
                              : 'bg-white/50 border-amber-900/15 text-slate-700 hover:bg-white/80'
                          }`}
                        >
                          <span className="text-xl">{god.icon}</span>
                          <span className="font-cinzel text-xs font-bold text-amber-950">{god.name}</span>
                        </button>
                      ))}
                    </div>

                    <div className="bg-white/80 border border-amber-900/20 p-4 rounded-xl shadow-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-cinzel font-bold text-base text-amber-950 flex items-center gap-2">
                          <span className="text-lg">{currentGodData.icon}</span>
                          <span>{currentGodData.name}</span>
                          <span className="text-xs font-normal text-slate-500 italic">({currentGodData.title})</span>
                        </span>
                        <span className="text-[10px] font-cinzel font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-900/20">
                          {currentGodData.domain}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-lora text-slate-800 leading-relaxed mb-3">
                        {currentGodData.description}
                      </p>
                      <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-900/10 text-xs font-lora italic text-amber-950">
                        „{currentGodData.philosophy}“
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Tab 3: The 7 Kingdoms */}
                {loreTab === 'kingdoms' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                    {/* Horizontal kingdom selector buttons */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 max-h-36 overflow-y-auto p-1 custom-scrollbar">
                      {WORLD_LORE.kingdoms.map(k => (
                        <button
                          key={k.id}
                          onClick={() => setSelectedKingdom(k.id)}
                          className={`p-2 rounded-lg border text-left transition flex items-center gap-1.5 ${
                            selectedKingdom === k.id
                              ? 'bg-amber-200/90 border-amber-700 shadow-xs font-bold'
                              : 'bg-white/50 border-amber-900/15 text-slate-700 hover:bg-white/80'
                          }`}
                        >
                          <span className="text-sm shrink-0">{k.badge}</span>
                          <span className="font-cinzel text-[11px] truncate">{k.name}</span>
                        </button>
                      ))}
                    </div>

                    {/* Selected Kingdom Inspection Card */}
                    <div className="bg-white/80 border border-amber-900/20 p-4 rounded-xl shadow-xs">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{currentKingdomData.badge}</span>
                          <div>
                            <h4 className="font-cinzel font-bold text-sm sm:text-base text-amber-950">
                              {currentKingdomData.name}
                            </h4>
                            <span className="text-[10px] font-lora italic text-slate-500">
                              {currentKingdomData.archetype}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-cinzel font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-900/15">
                          Království #{currentKingdomData.id}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm font-lora text-slate-800 leading-relaxed my-2">
                        {currentKingdomData.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-amber-900/10">
                        <div>
                          <strong className="font-cinzel text-amber-900">Vládci: </strong>
                          <span className="text-slate-700 font-lora">{currentKingdomData.rulerArchetype}</span>
                        </div>
                        <div>
                          <strong className="font-cinzel text-red-800">Hrozba: </strong>
                          <span className="text-slate-700 font-lora">{currentKingdomData.threat}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* STEP 2: CHARACTER NAME & RACE */}
            {step === 2 && (
              <motion.div key="step2" variants={pageVariants} initial="initial" animate="in" exit="out" className="space-y-6">
                <div>
                  <label className="block font-lora font-semibold text-base sm:text-lg mb-2 text-slate-800">
                    Jaké jméno ponese tvá legenda?
                  </label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    className="w-full bg-white/50 border-b-2 border-amber-900/30 focus:border-amber-700 outline-none px-3 py-2.5 sm:py-3 text-xl sm:text-2xl font-cinzel text-slate-900 transition placeholder-slate-400 rounded-t-lg" 
                    placeholder="Např. Artes, Kaelen ze Severu" 
                  />
                </div>

                <div>
                  <label className="block font-lora font-semibold text-base sm:text-lg mb-2 text-slate-800">
                    Krev jakého rodu ti koluje v žilách?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                    {races.map(r => (
                      <button 
                        key={r}
                        onClick={() => setRace(r)}
                        className={`p-3 sm:p-4 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          race === r 
                            ? 'bg-amber-100/90 border-amber-600 shadow-[0_0_12px_rgba(180,83,9,0.3)] text-amber-950 font-bold scale-[1.02]' 
                            : 'bg-white/40 border-amber-900/15 text-slate-700 hover:bg-white/70 hover:border-amber-900/30'
                        }`}
                      >
                        <div className={race === r ? "text-amber-800" : "text-slate-600"}>
                          {getRaceIcon(r)}
                        </div>
                        <span className="font-cinzel text-xs sm:text-sm tracking-wider">{r}</span>
                      </button>
                    ))}
                  </div>

                  {getAvatarVideo && getAvatarVideo(race) && (
                    <motion.div 
                      key={race}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-3.5 flex items-center gap-3 bg-amber-100/70 p-2.5 rounded-xl border border-amber-900/20 shadow-xs"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-amber-600/50 shadow-sm shrink-0">
                        <SeamlessVideo src={getAvatarVideo(race)!} className="w-full h-full" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-cinzel font-bold text-xs text-amber-950">Živý portrét: {race}</span>
                        <span className="font-lora text-[11px] text-slate-600">Animovaný vzhled tvého hrdiny v legendách</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* STEP 3: CLASS & STATS */}
            {step === 3 && (
              <motion.div key="step3" variants={pageVariants} initial="initial" animate="in" exit="out" className="space-y-5">
                <div>
                  <label className="block font-lora font-semibold text-base sm:text-lg mb-2 text-slate-800">
                    Jakému řemeslu ses upsal?
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 sm:max-h-56 overflow-y-auto p-1 custom-scrollbar">
                    {classes.map(c => (
                      <button 
                        key={c}
                        onClick={() => setDndClass(c)}
                        className={`p-2.5 sm:p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center ${
                          dndClass === c 
                            ? 'bg-amber-100/90 border-amber-600 shadow-[0_0_10px_rgba(180,83,9,0.3)] text-amber-950 font-bold scale-[1.02]' 
                            : 'bg-white/40 border-amber-900/15 text-slate-700 hover:bg-white/70 hover:border-amber-900/30'
                        }`}
                      >
                        <div className={dndClass === c ? "text-amber-800" : "text-slate-600"}>
                          {getClassIcon(c)}
                        </div>
                        <span className="font-cinzel text-xs tracking-wide">{c}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Attributes */}
                <div className="bg-white/60 p-3 sm:p-5 rounded-xl border border-amber-900/15 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-2.5">
                    <h3 className="font-cinzel text-amber-950 font-bold text-sm sm:text-base flex items-center gap-1.5">
                      <Settings2 size={16} className="text-amber-700" /> Atributy (Standard Array)
                    </h3>
                    <span className="text-[11px] text-slate-600 font-lora italic">
                      Optimalizováno pro {dndClass}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                    {Object.entries(stats).map(([stat, val]) => {
                      const bonus = RACES[race]?.bonuses?.[stat as keyof typeof RACES[string]['bonuses']];
                      return (
                      <div key={stat} className="bg-[#f9f6e6] p-2 rounded-lg border border-amber-900/15 shadow-sm relative">
                        <div className="text-[10px] uppercase text-amber-900 font-bold tracking-wider mb-0.5">{stat}</div>
                        <div className="text-lg sm:text-xl font-cinzel font-bold text-slate-900">
                          {val as number}
                          {bonus ? <span className="text-green-600 text-sm ml-1">(+{bonus})</span> : null}
                        </div>
                      </div>
                      )
                    })}
                  </div>
                </div>

                {/* Starting Gear Preview */}
                <div className="bg-amber-100/60 p-3 sm:p-4 rounded-xl border border-amber-900/15 shadow-sm text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-cinzel text-amber-950 font-bold text-xs sm:text-sm flex items-center gap-1.5">
                      <Shield size={15} className="text-amber-700" /> Počáteční výstroj (rovnou nasazeno)
                    </span>
                    <span className="text-[10px] uppercase font-cinzel font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-600/30">
                      Připraveno k boji
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-lora text-slate-800">
                    {STARTING_GEAR[dndClass] && (
                      <>
                        <span className="bg-white/80 border border-amber-900/10 px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-xs">
                          ⚔️ <strong>Zbraň:</strong> {STARTING_GEAR[dndClass].weapon}
                        </span>
                        <span className="bg-white/80 border border-amber-900/10 px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-xs">
                          🛡️ <strong>Zbroj:</strong> {STARTING_GEAR[dndClass].armor}
                        </span>
                        {STARTING_GEAR[dndClass].offhand && (
                          <span className="bg-white/80 border border-amber-900/10 px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-xs">
                            🔰 <strong>Druhá ruka:</strong> {STARTING_GEAR[dndClass].offhand}
                          </span>
                        )}
                        <span className="bg-white/80 border border-amber-900/10 px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-xs">
                          🧪 <strong>V batohu:</strong> {STARTING_GEAR[dndClass].potion}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: BACKSTORY & MODE */}
            {step === 4 && (
              <motion.div key="step4" variants={pageVariants} initial="initial" animate="in" exit="out" className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block font-lora font-semibold text-base sm:text-lg mb-1 text-slate-800">
                    Prolog (Volitelný)
                  </label>
                  <p className="text-xs text-slate-600 mb-3 font-lora">
                    Napiš pár slov o postavě a nech Vypravěče (AI) dopsat zbytek.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4">
                    <textarea 
                      value={keywords} 
                      onChange={e => setKeywords(e.target.value)}
                      className="flex-1 p-3 bg-white/60 border border-amber-900/20 rounded-xl outline-none focus:border-amber-700 transition text-slate-900 font-lora resize-none h-20 text-sm"
                      placeholder="Např. zahořklý klerik hledající odpuštění..."
                    />
                    <button 
                      onClick={generateBackstory} 
                      disabled={loading || !keywords} 
                      className="px-4 py-2.5 sm:py-0 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold border border-amber-800/30 rounded-xl shadow-sm cursor-pointer transition disabled:opacity-40 flex items-center justify-center gap-2 shrink-0 font-cinzel text-xs sm:text-sm"
                    >
                      <Sparkles size={16} />
                      <span>Napsat Osud</span>
                    </button>
                  </div>

                  {backstory && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-white/70 border border-amber-700/30 rounded-xl space-y-2 font-lora text-slate-800 text-xs sm:text-sm leading-relaxed mb-4 max-h-36 overflow-y-auto">
                      <p><strong className="text-amber-900 font-cinzel">Vzhled:</strong> {backstory.appearance}</p>
                      <p><strong className="text-amber-900 font-cinzel">Chování:</strong> {backstory.personality}</p>
                      <p><strong className="text-amber-900 font-cinzel">Příběh:</strong> {backstory.backstory}</p>
                    </motion.div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`p-3.5 sm:p-4 rounded-xl border-2 cursor-pointer transition flex flex-col ${gameMode === 'sandbox' ? 'border-amber-700 bg-amber-100/60 shadow-sm' : 'border-amber-900/15 bg-white/40 hover:border-amber-900/30'}`}>
                    <input type="radio" value="sandbox" checked={gameMode === 'sandbox'} onChange={() => setGameMode('sandbox')} className="hidden" />
                    <span className="font-cinzel font-bold text-sm sm:text-base text-slate-900 mb-1">Pustina (Sandbox)</span>
                    <span className="font-lora text-xs text-slate-600">Nekonečný náhodně generovaný svět. AI tvoří dobrodružství za pochodu.</span>
                  </label>
                  <label className={`p-3.5 sm:p-4 rounded-xl border-2 cursor-pointer transition flex flex-col ${gameMode === 'campaign' ? 'border-amber-700 bg-amber-100/60 shadow-sm' : 'border-amber-900/15 bg-white/40 hover:border-amber-900/30'}`}>
                    <input type="radio" value="campaign" checked={gameMode === 'campaign'} onChange={() => setGameMode('campaign')} className="hidden" />
                    <span className="font-cinzel font-bold text-sm sm:text-base text-slate-900 mb-1">Aelthgard (Kampaň)</span>
                    <span className="font-lora text-xs text-slate-600">Pevně daná mapa světa, 7 království a epická zápletka. Doporučený režim.</span>
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-5 sm:mt-6 flex justify-between items-center border-t border-amber-900/15 pt-4 shrink-0">
          <button 
            onClick={step === 1 ? onClose : handlePrev} 
            className="px-4 sm:px-6 py-2.5 font-cinzel font-bold tracking-wider text-xs sm:text-sm text-slate-700 hover:text-slate-900 transition flex items-center gap-1.5 cursor-pointer"
          >
            <ChevronLeft size={18} /> {step === 1 ? "Zpět do menu" : "Zpět"}
          </button>
          
          {step < 4 ? (
            <button 
              onClick={handleNext} 
              disabled={step === 2 && !name.trim()}
              className="px-6 sm:px-8 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-cinzel font-bold tracking-wider text-xs sm:text-sm rounded-xl transition disabled:opacity-40 flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <span>{step === 1 ? "Vstoupit do tvorby" : "Dále"}</span>
              <ChevronRight size={18} />
            </button>
          ) : (
            <button 
              onClick={startNewGame} 
              disabled={loading || !name.trim()} 
              className="px-6 sm:px-8 py-3 bg-red-700 hover:bg-red-800 text-white font-cinzel font-bold text-sm sm:text-base tracking-widest rounded-xl transition disabled:opacity-40 shadow-[0_0_15px_rgba(183,75,75,0.4)] flex items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin text-white" />
                  <span>Vytvářím...</span>
                </>
              ) : (
                "Zrození Hrdiny"
              )}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
