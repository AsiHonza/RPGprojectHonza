import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { 
  Settings2, Sparkles, ChevronRight, ChevronLeft, Crown, Shield, 
  Wand2, Axe, Ghost, Skull, Book, Flame, X, Loader2, Globe, Eye, Sun, Compass, ArrowLeft,
  Swords, Zap, Check, CheckCircle2, Star, Award, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SeamlessVideo } from '../../components/ui/SeamlessVideo';
import { calculateBaseStats } from '../../utils/statsCalculator';
import { RACES } from '../../data/races';
import { CLASS_SKILL_TREES } from '../../data/classSkillTrees';
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
    if (dndClass && race) {
      setStats(calculateBaseStats(dndClass, race));
    }
  }, [dndClass, race, setStats]);

  const handleNext = () => setStep(prev => Math.min(prev + 1, 4));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
  };

  const getRaceIcon = (r: string) => {
    switch(r) {
      case "Člověk": return <Crown size={20} />;
      case "Elf": return <Sparkles size={20} />;
      case "Trpaslík": return <Axe size={20} />;
      case "Půlčík": return <Star size={20} />;
      case "Drakorozený": return <Flame size={20} />;
      case "Tiefling": return <Ghost size={20} />;
      case "Půlork": return <Skull size={20} />;
      case "Gnóm": return <Settings2 size={20} />;
      default: return <Ghost size={20} />;
    }
  };

  const getClassIcon = (c: string) => {
    switch(c) {
      case "Bojovník": case "Barbar": return <Shield size={19} />;
      case "Paladin": return <Crown size={19} />;
      case "Kouzelník": case "Čaroděj": case "Černokněžník": return <Wand2 size={19} />;
      case "Klerik": return <Book size={19} />;
      case "Druid": return <Flame size={19} />;
      case "Bard": return <Sparkles size={19} />;
      case "Tulák": return <Ghost size={19} />;
      case "Hraničář": return <Axe size={19} />;
      case "Mnich": return <Shield size={19} />;
      default: return <Swords size={19} />;
    }
  };

  const currentKingdomData = WORLD_LORE.kingdoms.find(k => k.id === selectedKingdom) || WORLD_LORE.kingdoms[0];
  const currentGodData = WORLD_LORE.gods.find(g => g.id === selectedGod) || WORLD_LORE.gods[0];
  const currentRaceData = race ? (RACES[race] || RACES["Člověk"]) : null;
  const currentClassTree = dndClass ? CLASS_SKILL_TREES[dndClass] : null;

  return (
    <div className="min-h-screen w-full bg-[#12181f] text-slate-900 flex flex-col items-center justify-center p-2 sm:p-4 lg:p-6 overflow-y-auto overflow-x-hidden relative select-none">
      
      {/* Background Ambience */}
      <video src="/video/bg1.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-45" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#e5dfc5]/25 via-[#f9f6e6]/60 to-transparent z-0 pointer-events-none" />

      {loading && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center cursor-not-allowed p-4">
          <div className="flex flex-col items-center gap-4 p-6 sm:p-8 bg-[#f9f6e6] rounded-3xl shadow-2xl border-2 border-amber-600/50 max-w-sm text-center">
            <Loader2 className="w-12 h-12 text-amber-700 animate-spin" />
            <p className="text-lg sm:text-xl font-cinzel font-bold text-slate-800">
              Probouzím bohy a tvořím svět...<br/>
              <span className="text-xs sm:text-sm font-lora font-normal text-slate-600 mt-1 block">Prosím strpení, nenech se vyrušit.</span>
            </p>
          </div>
        </div>
      )}

      {/* Glow Center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] lg:w-[1000px] h-[700px] lg:h-[1000px] bg-amber-600/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Main Widescreen Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-6xl xl:max-w-7xl max-h-[94dvh] h-[860px] bg-[#f9f6e6]/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-amber-900/20 p-4 sm:p-6 md:p-7 relative z-10 flex flex-col justify-between overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-3 sm:mb-4 border-b border-amber-900/15 pb-3 shrink-0">
          <div>
            <h2 className="text-xl sm:text-3xl font-cinzel font-bold text-amber-950 flex items-center gap-2.5">
              {step === 1 && "Svět Aelthgardu"}
              {step === 2 && "Zrození Hrdiny"}
              {step === 3 && "Cesta Meče a Magie"}
              {step === 4 && "Kniha Osudu"}
            </h2>
            <p className="text-[11px] sm:text-xs font-lora text-slate-600 mt-0.5">
              Krok {step} ze 4 • {step === 1 ? "Panteon a říše" : step === 2 ? "Volba rasy a jména" : step === 3 ? "Povolání, vlastnosti a schopnosti" : "Prolog a herní režim"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5 sm:gap-2">
              {[1, 2, 3, 4].map(i => (
                <div 
                  key={i} 
                  className={`h-1.5 sm:h-2 w-6 sm:w-10 rounded-full transition-all duration-500 ${step >= i ? 'bg-amber-700 shadow-[0_0_8px_rgba(180,83,9,0.5)]' : 'bg-amber-900/15'}`} 
                />
              ))}
            </div>
            {onClose && (
              <button 
                onClick={onClose} 
                className="px-3 py-1.5 rounded-xl border border-amber-900/20 text-slate-700 hover:text-amber-950 hover:bg-amber-100/70 font-cinzel font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Zpět k výběru postav"
              >
                <ArrowLeft size={14} />
                <span className="hidden sm:inline">Zpět k postavám</span>
              </button>
            )}
          </div>
        </div>

        {/* Dual-column body on desktop (lg+), single column on mobile */}
        <div className="flex-1 min-h-0 flex flex-col lg:grid lg:grid-cols-12 lg:gap-7 overflow-hidden py-1">
          
          {/* Left Hero Companion Column (Visible on lg+) */}
          <aside className="hidden lg:flex lg:col-span-4 xl:col-span-4 flex-col gap-3 h-full bg-amber-950/5 p-4 rounded-2xl border border-amber-900/15 overflow-y-auto custom-scrollbar shrink-0 select-none">
            {/* Ornate Video Frame */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-amber-600/60 shadow-md bg-[#12181f] shrink-0 flex items-center justify-center">
              {race && getAvatarVideo && getAvatarVideo(race) ? (
                <SeamlessVideo src={getAvatarVideo(race)!} className="w-full h-full object-cover" />
              ) : race ? (
                <img 
                  src={`https://image.pollinations.ai/prompt/vibrant%20fable%20style%20magical%20fantasy%20portrait%20of%20a%20${encodeURIComponent(race)}%20${encodeURIComponent(dndClass || 'adventurer')}%20RPG%20character?width=360&height=270&nologo=true&seed=42`} 
                  alt={race} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-b from-[#1a232f] via-[#12181f] to-[#080b0f] flex flex-col items-center justify-center p-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,119,6,0.18)_0,transparent_70%)] pointer-events-none" />
                  <div className="w-16 h-16 rounded-full bg-amber-950/60 border border-amber-500/30 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(217,119,6,0.25)]">
                    <Ghost size={32} className="text-amber-300/80 animate-pulse" />
                  </div>
                  <span className="font-cinzel text-amber-200 font-bold text-xs tracking-wider z-10">Čistý list osudu</span>
                  <span className="font-lora text-[10px] text-slate-400 text-center mt-0.5 z-10">Podoba se zjeví po volbě rasy</span>
                </div>
              )}
              <div className="absolute top-2.5 left-2.5 bg-black/65 backdrop-blur-xs text-amber-300 px-2.5 py-0.5 rounded-full font-cinzel font-bold text-[10px] border border-amber-500/30 flex items-center gap-1">
                {race ? <><Sparkles size={11} /> Živá legenda</> : <><Crown size={11} /> Čistý štít</>}
              </div>
              <div className="absolute bottom-2.5 inset-x-2.5 bg-black/75 backdrop-blur-xs px-3 py-1 rounded-xl text-center text-amber-100 font-cinzel font-bold text-sm border border-amber-500/25 truncate">
                {name.trim() || "Nepojmenovaný Hrdina"}
              </div>
            </div>

            {/* Race & Class Badge */}
            <div className="flex items-center justify-between gap-2 bg-white/75 p-2.5 rounded-xl border border-amber-900/15 shadow-2xs shrink-0">
              <div className="flex items-center gap-2">
                <span className={`p-1.5 rounded-lg border ${race ? 'bg-amber-100 text-amber-900 border-amber-900/20' : 'bg-slate-100 text-slate-400 border-slate-300'}`}>
                  {race ? getRaceIcon(race) : <Crown size={18} className="opacity-50" />}
                </span>
                <div>
                  <div className={`font-cinzel font-bold text-xs ${race ? 'text-amber-950' : 'text-slate-400 italic'}`}>
                    {race || "Zatím nezvolena"}
                  </div>
                  <div className="font-lora text-[10px] text-slate-500">Rasa (Krok 2)</div>
                </div>
              </div>
              <div className="h-6 w-px bg-amber-900/15" />
              <div className="flex items-center gap-2 text-right">
                <div>
                  <div className={`font-cinzel font-bold text-xs ${dndClass ? 'text-amber-950' : 'text-slate-400 italic'}`}>
                    {dndClass || "Zatím nezvoleno"}
                  </div>
                  <div className="font-lora text-[10px] text-slate-500">Povolání (Krok 3)</div>
                </div>
                <span className={`p-1.5 rounded-lg border ${dndClass ? 'bg-amber-100 text-amber-900 border-amber-900/20' : 'bg-slate-100 text-slate-400 border-slate-300'}`}>
                  {dndClass ? getClassIcon(dndClass) : <Shield size={18} className="opacity-50" />}
                </span>
              </div>
            </div>

            {/* Active Race Bonuses Card */}
            {race && currentRaceData ? (
              <div className="bg-white/75 p-3 rounded-xl border border-amber-900/15 shadow-2xs flex flex-col gap-1.5 text-xs font-lora shrink-0">
                <div className="flex items-center justify-between font-cinzel font-bold text-amber-950 text-xs border-b border-amber-900/10 pb-1">
                  <span className="flex items-center gap-1"><Sparkles size={13} className="text-amber-700" /> Rasové přednosti</span>
                  <span className="text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-600/30 text-[10px]">
                    {currentRaceData.displayBonuses}
                  </span>
                </div>
                <div className="text-slate-900 font-bold font-cinzel text-xs flex items-center gap-1 mt-0.5">
                  <span>⚔️</span> {currentRaceData.trait.name}
                </div>
                <p className="text-slate-600 text-[11px] leading-tight">
                  {currentRaceData.trait.description}
                </p>
              </div>
            ) : (
              <div className="bg-white/60 p-3 rounded-xl border border-dashed border-amber-900/25 shadow-2xs flex flex-col gap-1 text-xs font-lora shrink-0 text-slate-500">
                <div className="flex items-center justify-between font-cinzel font-bold text-slate-600 text-xs border-b border-amber-900/10 pb-1">
                  <span className="flex items-center gap-1"><Sparkles size={13} className="text-amber-600/60" /> Rasové dědictví</span>
                  <span className="text-[10px] text-slate-400 italic">Čistý štít</span>
                </div>
                <p className="text-[11px] italic leading-tight text-slate-500 pt-0.5">
                  Krev tvého rodu se probudí v Kroku 2 – získáš unikátní rasový rys a bonusy k atributům.
                </p>
              </div>
            )}

            {/* Core Stats Overview */}
            <div className="bg-white/75 p-3 rounded-xl border border-amber-900/15 shadow-2xs shrink-0">
              <div className="text-[10px] font-cinzel uppercase font-bold text-amber-900 tracking-wider mb-2 flex items-center justify-between">
                <span>Atributy postavy</span>
                <span className="text-[10px] font-lora text-slate-500 italic">
                  {dndClass ? (race ? "Včetně rasových bonusů" : "Podle povolání") : "Základní hodnoty"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-center">
                {Object.entries(stats).map(([stat, val]) => {
                  const bonus = currentRaceData?.bonuses?.[stat as keyof typeof currentRaceData.bonuses];
                  return (
                    <div key={stat} className="bg-[#f9f6e6] p-1.5 rounded-lg border border-amber-900/10 text-center">
                      <div className="text-[9px] uppercase font-bold text-amber-900">{stat}</div>
                      <div className="text-sm font-cinzel font-bold text-slate-900">
                        {val as number}
                        {bonus ? <span className="text-emerald-700 text-[10px] ml-0.5 font-bold">(+{bonus})</span> : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mode badge */}
            <div className="bg-amber-100/70 p-2 rounded-xl border border-amber-900/15 text-[11px] font-cinzel font-bold text-amber-950 flex items-center justify-between mt-auto shrink-0">
              <span>Režim:</span>
              <span className="bg-amber-200/80 px-2 py-0.5 rounded-lg border border-amber-900/20 text-amber-900">
                {gameMode === 'campaign' ? '⭐ Kampaň Aelthgard' : 'Pustina (Sandbox)'}
              </span>
            </div>
          </aside>

          {/* Right Main Steps Column */}
          <main className="flex-1 lg:col-span-8 xl:col-span-8 flex flex-col justify-between h-full min-h-0 overflow-y-auto custom-scrollbar pr-1">
            <div className="flex-1 py-1">
              <AnimatePresence mode="wait">
                
                {/* STEP 1: WORLD LORE & PROLOGUE */}
                {step === 1 && (
                  <motion.div key="step1" variants={pageVariants} initial="initial" animate="in" exit="out" className="space-y-4">
                    {/* Lore Tabs Header */}
                    <div className="flex border-b border-amber-900/20 pb-2 gap-2">
                      <button
                        onClick={() => setLoreTab('overview')}
                        className={`px-3.5 py-1.5 rounded-xl font-cinzel text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          loreTab === 'overview' 
                            ? 'bg-amber-700 text-white shadow-xs' 
                            : 'bg-white/40 text-slate-700 hover:bg-white/80'
                        }`}
                      >
                        <Globe size={14} /> Přehled světa
                      </button>
                      <button
                        onClick={() => setLoreTab('gods')}
                        className={`px-3.5 py-1.5 rounded-xl font-cinzel text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          loreTab === 'gods' 
                            ? 'bg-amber-700 text-white shadow-xs' 
                            : 'bg-white/40 text-slate-700 hover:bg-white/80'
                        }`}
                      >
                        <Sun size={14} /> Panteon bohů
                      </button>
                      <button
                        onClick={() => setLoreTab('kingdoms')}
                        className={`px-3.5 py-1.5 rounded-xl font-cinzel text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          loreTab === 'kingdoms' 
                            ? 'bg-amber-700 text-white shadow-xs' 
                            : 'bg-white/40 text-slate-700 hover:bg-white/80'
                        }`}
                      >
                        <Compass size={14} /> 7 Království
                      </button>
                    </div>

                    {/* Tab 1: Overview */}
                    {loreTab === 'overview' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                        <div className="bg-white/80 border border-amber-900/15 p-4 rounded-2xl shadow-xs">
                          <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                            <h3 className="font-cinzel font-bold text-base text-amber-950 flex items-center gap-2">
                              <span>📜</span> {WORLD_LORE.name} – {WORLD_LORE.subtitle}
                            </h3>
                            <span className="text-[10px] font-cinzel font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-900/20">
                              {WORLD_LORE.tone}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm font-lora text-slate-800 leading-relaxed mb-3">
                            {WORLD_LORE.overview}
                          </p>
                          <div className="p-3 bg-amber-50/90 rounded-xl border border-amber-900/10 text-xs font-lora italic text-amber-950">
                            „{WORLD_LORE.magicConcept}“
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div className="bg-white/60 border border-amber-900/15 p-3 rounded-xl shadow-2xs flex flex-col gap-1">
                            <span className="text-lg">👑</span>
                            <span className="font-cinzel font-bold text-xs text-amber-950">7 Království</span>
                            <p className="font-lora text-[11px] text-slate-600 leading-tight">Kontinent rozdělený na impéria, teokracie, gildy a nebezpečné divočiny.</p>
                          </div>
                          <div className="bg-white/60 border border-amber-900/15 p-3 rounded-xl shadow-2xs flex flex-col gap-1">
                            <span className="text-lg">⚡</span>
                            <span className="font-cinzel font-bold text-xs text-amber-950">Procitnutí Magie</span>
                            <p className="font-lora text-[11px] text-slate-600 leading-tight">Magie se nedá naučit ze svitků. Je to vzácný dar bohů zvaný Procitnutí.</p>
                          </div>
                          <div className="bg-white/60 border border-amber-900/15 p-3 rounded-xl shadow-2xs flex flex-col gap-1">
                            <span className="text-lg">⚔️</span>
                            <span className="font-cinzel font-bold text-xs text-amber-950">Válka Bohů</span>
                            <p className="font-lora text-[11px] text-slate-600 leading-tight">Solarian, Vyldia a Kull přímo ovlivňují osudy smrtelníků na zemi.</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Tab 2: The Gods */}
                    {loreTab === 'gods' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                        <div className="grid grid-cols-3 gap-2">
                          {WORLD_LORE.gods.map(god => (
                            <button
                              key={god.id}
                              onClick={() => setSelectedGod(god.id)}
                              className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                                selectedGod === god.id
                                  ? 'bg-amber-100/95 border-amber-700 shadow-sm font-bold scale-[1.02]'
                                  : 'bg-white/50 border-amber-900/15 text-slate-700 hover:bg-white/80'
                              }`}
                            >
                              <span className="text-xl">{god.icon}</span>
                              <span className="font-cinzel text-xs font-bold text-amber-950">{god.name}</span>
                            </button>
                          ))}
                        </div>

                        <div className="bg-white/80 border border-amber-900/20 p-4 rounded-2xl shadow-xs">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-cinzel font-bold text-base text-amber-950 flex items-center gap-2">
                              <span className="text-lg">{currentGodData.icon}</span>
                              <span>{currentGodData.name}</span>
                              <span className="text-xs font-normal text-slate-500 italic">({currentGodData.title})</span>
                            </span>
                            <span className="text-[10px] font-cinzel font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-900/20">
                              {currentGodData.domain}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm font-lora text-slate-800 leading-relaxed mb-3">
                            {currentGodData.description}
                          </p>
                          <div className="p-3 bg-amber-50/90 rounded-xl border border-amber-900/10 text-xs font-lora italic text-amber-950">
                            „{currentGodData.philosophy}“
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Tab 3: The 7 Kingdoms */}
                    {loreTab === 'kingdoms' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 max-h-36 overflow-y-auto p-1 custom-scrollbar">
                          {WORLD_LORE.kingdoms.map(k => (
                            <button
                              key={k.id}
                              onClick={() => setSelectedKingdom(k.id)}
                              className={`p-2 rounded-xl border text-left transition flex items-center gap-1.5 cursor-pointer ${
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

                        <div className="bg-white/80 border border-amber-900/20 p-4 rounded-2xl shadow-xs">
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
                            <span className="text-[10px] font-cinzel font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-900/15">
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

                {/* STEP 2: CHARACTER NAME, RACE & RACE BONUSES */}
                {step === 2 && (
                  <motion.div key="step2" variants={pageVariants} initial="initial" animate="in" exit="out" className="space-y-4">
                    {/* Name Input */}
                    <div>
                      <label className="block font-lora font-semibold text-sm sm:text-base mb-1.5 text-slate-800">
                        Jaké jméno ponese tvá legenda?
                      </label>
                      <input 
                        type="text" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        className="w-full bg-white/70 border-2 border-amber-900/20 focus:border-amber-700 outline-none px-4 py-2.5 text-lg sm:text-xl font-cinzel text-slate-900 transition placeholder-slate-400 rounded-2xl shadow-inner" 
                        placeholder="Např. Artes, Kaelen ze Severu, Lyra Stínová" 
                      />
                    </div>

                    {/* Race Selector */}
                    <div>
                      <label className="block font-lora font-semibold text-sm sm:text-base mb-1.5 text-slate-800">
                        Krev jakého rodu ti koluje v žilách?
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {races.map(r => (
                          <button 
                            key={r}
                            onClick={() => setRace(r)}
                            className={`p-2.5 sm:p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                              race === r 
                                ? 'bg-amber-100/95 border-amber-600 shadow-[0_0_12px_rgba(180,83,9,0.3)] text-amber-950 font-bold scale-[1.02]' 
                                : 'bg-white/50 border-amber-900/15 text-slate-700 hover:bg-white/80 hover:border-amber-900/30'
                            }`}
                          >
                            <div className={race === r ? "text-amber-800" : "text-slate-600"}>
                              {getRaceIcon(r)}
                            </div>
                            <span className="font-cinzel text-xs tracking-wider">{r}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* NEW: Comprehensive Race Bonuses & Traits Showcase */}
                    {race && currentRaceData ? (
                      <div className="bg-white/80 border-2 border-amber-900/20 p-4 rounded-2xl shadow-sm space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-900/15 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-900/20">
                              {getRaceIcon(race)}
                            </span>
                            <div>
                              <h3 className="font-cinzel font-bold text-base text-amber-950 flex items-center gap-2">
                                <span>Rasové bonusy: {race}</span>
                              </h3>
                              <span className="text-[11px] font-lora text-slate-500 italic">D&D 5e rasová pravidla</span>
                            </div>
                          </div>

                          {/* Display Stat Bonuses Pill */}
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100/90 border border-emerald-600/30 rounded-full text-emerald-950 font-cinzel font-bold text-xs shadow-2xs self-start sm:self-auto">
                            <span>✨</span>
                            <span>{currentRaceData.displayBonuses}</span>
                          </div>
                        </div>

                        {/* Unique Trait & Lore */}
                        <div className="space-y-2 text-xs font-lora text-slate-800">
                          <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-900/10">
                            <div className="font-cinzel font-bold text-xs text-amber-950 flex items-center gap-1.5 mb-1">
                              <Zap size={14} className="text-amber-700" />
                              <span>Unikátní rasový rys: {currentRaceData.trait.name}</span>
                            </div>
                            <p className="text-slate-700 leading-relaxed text-[11px] sm:text-xs">
                              {currentRaceData.trait.description}
                            </p>
                          </div>

                          {/* Passive perks checklist */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                            {currentRaceData.passivesList.map((traitItem, i) => (
                              <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-700 bg-white/60 px-2.5 py-1.5 rounded-lg border border-amber-900/10">
                                <CheckCircle2 size={13} className="text-emerald-700 shrink-0" />
                                <span>{traitItem}</span>
                              </div>
                            ))}
                          </div>

                          <p className="text-[11px] text-slate-600 italic pt-1 border-t border-amber-900/10">
                            {currentRaceData.lore}
                          </p>
                        </div>

                        {/* Compact mobile avatar preview (lg shows in left column) */}
                        {getAvatarVideo && getAvatarVideo(race) && (
                          <div className="lg:hidden flex items-center gap-3 bg-amber-100/60 p-2.5 rounded-xl border border-amber-900/15">
                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-amber-600/50 shadow-xs shrink-0">
                              <SeamlessVideo src={getAvatarVideo(race)!} className="w-full h-full object-cover" />
                            </div>
                            <div className="text-left">
                              <span className="font-cinzel font-bold text-xs text-amber-950 block">Živý portrét: {race}</span>
                              <span className="font-lora text-[11px] text-slate-600">Animovaný vzhled v legendách</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-white/60 border-2 border-dashed border-amber-900/25 p-5 rounded-2xl shadow-sm text-center flex flex-col items-center justify-center gap-2 text-slate-600">
                        <span className="text-2xl opacity-60">🛡️</span>
                        <h3 className="font-cinzel font-bold text-xs sm:text-sm text-amber-950">Zvol rasu svého hrdiny</h3>
                        <p className="font-lora text-[11px] sm:text-xs text-slate-500 max-w-md">
                          Výběrem rasy probudíš pradávné dědictví svého rodu, získáš unikátní rasové přednosti a bonusy k atributům.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* STEP 3: CLASS, ATTRIBUTES, GEAR & SKILLS PREVIEW */}
                {step === 3 && (
                  <motion.div key="step3" variants={pageVariants} initial="initial" animate="in" exit="out" className="space-y-4">
                    {/* Class Selector Grid */}
                    <div>
                      <label className="block font-lora font-semibold text-sm sm:text-base mb-1.5 text-slate-800">
                        Jakému řemeslu ses upsal?
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-1.5">
                        {classes.map(c => (
                          <button 
                            key={c}
                            onClick={() => setDndClass(c)}
                            className={`p-2 sm:p-2.5 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer text-center ${
                              dndClass === c 
                                ? 'bg-amber-100/95 border-amber-600 shadow-[0_0_10px_rgba(180,83,9,0.3)] text-amber-950 font-bold scale-[1.02]' 
                                : 'bg-white/50 border-amber-900/15 text-slate-700 hover:bg-white/80 hover:border-amber-900/30'
                            }`}
                          >
                            <div className={dndClass === c ? "text-amber-800" : "text-slate-600"}>
                              {getClassIcon(c)}
                            </div>
                            <span className="font-cinzel text-[11px] tracking-wide">{c}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Attributes & Gear Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Attributes */}
                      <div className="bg-white/70 p-3 rounded-2xl border border-amber-900/15 shadow-2xs">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-cinzel text-amber-950 font-bold text-xs flex items-center gap-1.5">
                            <Settings2 size={14} className="text-amber-700" /> Atributy (Standard Array)
                          </h3>
                          <span className="text-[10px] text-slate-600 font-lora italic">
                            {dndClass ? `Optimalizováno pro ${dndClass}` : "Základní rozdělení"}
                          </span>
                        </div>
                        <div className="grid grid-cols-6 gap-1.5 text-center">
                          {Object.entries(stats).map(([stat, val]) => {
                            const bonus = currentRaceData?.bonuses?.[stat as keyof typeof currentRaceData.bonuses];
                            return (
                              <div key={stat} className="bg-[#f9f6e6] p-1.5 rounded-lg border border-amber-900/10">
                                <div className="text-[9px] uppercase text-amber-900 font-bold tracking-wider">{stat}</div>
                                <div className="text-sm font-cinzel font-bold text-slate-900">
                                  {val as number}
                                  {bonus ? <span className="text-emerald-700 text-[10px] ml-0.5 font-bold">(+{bonus})</span> : null}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Starting Gear */}
                      <div className="bg-amber-100/60 p-3 rounded-2xl border border-amber-900/15 shadow-2xs text-left">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-cinzel text-amber-950 font-bold text-xs flex items-center gap-1.5">
                            <Shield size={14} className="text-amber-700" /> Počáteční výstroj
                          </span>
                          <span className="text-[9px] uppercase font-cinzel font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-600/30">
                            {dndClass ? "Připraveno k boji" : "Zatím nezvoleno"}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 text-[11px] font-lora text-slate-800">
                          {dndClass && STARTING_GEAR[dndClass] ? (
                            <>
                              <span className="bg-white/85 border border-amber-900/10 px-2 py-0.5 rounded-lg flex items-center gap-1">
                                ⚔️ {STARTING_GEAR[dndClass].weapon}
                              </span>
                              <span className="bg-white/85 border border-amber-900/10 px-2 py-0.5 rounded-lg flex items-center gap-1">
                                🛡️ {STARTING_GEAR[dndClass].armor}
                              </span>
                              {STARTING_GEAR[dndClass].offhand && (
                                <span className="bg-white/85 border border-amber-900/10 px-2 py-0.5 rounded-lg flex items-center gap-1">
                                  🔰 {STARTING_GEAR[dndClass].offhand}
                                </span>
                              )}
                              <span className="bg-white/85 border border-amber-900/10 px-2 py-0.5 rounded-lg flex items-center gap-1">
                                🧪 {STARTING_GEAR[dndClass].potion}
                              </span>
                            </>
                          ) : (
                            <span className="text-slate-500 italic text-[11px]">
                              Výstroj se zobrazí po výběru povolání.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* NEW: Class Abilities & Spells Preview Showcase */}
                    {dndClass && currentClassTree ? (
                      <div className="bg-white/85 border-2 border-amber-900/20 p-4 rounded-2xl shadow-sm space-y-2.5">
                        <div className="flex items-center justify-between border-b border-amber-900/15 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-900/20">
                              {getClassIcon(dndClass)}
                            </span>
                            <div>
                              <h3 className="font-cinzel font-bold text-sm sm:text-base text-amber-950 flex items-center gap-2">
                                Bojové schopnosti a kouzla: {dndClass}
                              </h3>
                              <span className="text-[11px] font-lora text-slate-500">
                                {currentClassTree?.description || 'Přehled dovedností a talentového stromu.'}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] font-cinzel font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-900/20 hidden sm:inline">
                            Primární: {currentClassTree?.primaryStat?.toUpperCase()}
                          </span>
                        </div>

                        {/* Display Top Class Skills Preview Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                          {currentClassTree?.skills.slice(0, 3).map((skill) => {
                            const firstRank = skill.ranks[0];
                            return (
                              <div key={skill.id} className="bg-[#fdfbf7] p-2.5 rounded-xl border border-amber-900/15 flex flex-col justify-between shadow-2xs">
                                <div>
                                  <div className="flex items-start justify-between gap-1 mb-1">
                                    <span className="font-cinzel font-bold text-xs text-amber-950 leading-tight">
                                      {skill.name}
                                    </span>
                                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-900/15 shrink-0">
                                      {skill.apCost || 1} AP
                                    </span>
                                  </div>
                                  <p className="text-[11px] font-lora text-slate-700 leading-snug">
                                    {firstRank.desc}
                                  </p>
                                </div>
                                <div className="flex items-center justify-between text-[10px] text-slate-500 font-cinzel mt-2 pt-1 border-t border-amber-900/10">
                                  <span>{skill.type === 'active' ? '⚔️ Aktivní' : '✨ Pasivní'}</span>
                                  {skill.cooldown ? <span>⏳ CD: {skill.cooldown} kola</span> : <span>Připraveno</span>}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="text-[11px] font-lora text-slate-600 italic text-center pt-1">
                          V průběhu hry získáš v talentovém stromu celkem 10 unikátních schopností (5 aktivních a 5 pasivních).
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white/60 border-2 border-dashed border-amber-900/25 p-5 rounded-2xl shadow-sm text-center flex flex-col items-center justify-center gap-2 text-slate-600">
                        <span className="text-2xl opacity-60">⚔️</span>
                        <h3 className="font-cinzel font-bold text-xs sm:text-sm text-amber-950">Zvol své povolání</h3>
                        <p className="font-lora text-[11px] sm:text-xs text-slate-500 max-w-md">
                          Vyber si výše jedno z povolání, abys odemkl talentový strom, dovednosti a kouzla pro své dobrodružství.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* STEP 4: BACKSTORY & MODE SELECTION */}
                {step === 4 && (
                  <motion.div key="step4" variants={pageVariants} initial="initial" animate="in" exit="out" className="space-y-4">
                    {/* Game Mode Selector - Campaign FIRST & Recommended */}
                    <div>
                      <label className="block font-lora font-semibold text-sm sm:text-base mb-1.5 text-slate-800">
                        Zvol herní režim pro svou legendu:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col relative ${gameMode === 'campaign' ? 'border-amber-700 bg-amber-100/75 shadow-md scale-[1.01]' : 'border-amber-900/15 bg-white/50 hover:border-amber-900/30'}`}>
                          <input type="radio" value="campaign" checked={gameMode === 'campaign'} onChange={() => setGameMode('campaign')} className="hidden" />
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-cinzel font-bold text-base text-slate-900">Aelthgard (Kampaň)</span>
                            <span className="bg-amber-700 text-white font-cinzel font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-xs">
                              ⭐ Doporučeno
                            </span>
                          </div>
                          <span className="font-lora text-xs text-slate-600 leading-relaxed">
                            Plná mapa světa, 7 království, intriky bohů, zjevení a bohatá hlavní dějová zápletka s unikátními NPC.
                          </span>
                        </label>

                        <label className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col ${gameMode === 'sandbox' ? 'border-amber-700 bg-amber-100/75 shadow-md scale-[1.01]' : 'border-amber-900/15 bg-white/50 hover:border-amber-900/30'}`}>
                          <input type="radio" value="sandbox" checked={gameMode === 'sandbox'} onChange={() => setGameMode('sandbox')} className="hidden" />
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-cinzel font-bold text-base text-slate-900">Pustina (Sandbox)</span>
                            <span className="bg-slate-200 text-slate-700 font-cinzel font-bold text-[10px] px-2 py-0.5 rounded-full">
                              Volná hra
                            </span>
                          </div>
                          <span className="font-lora text-xs text-slate-600 leading-relaxed">
                            Nekonečná volnost bez pevného kontinentu. Vypravěč generuje svět dynamicky podle tvých kroků.
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Backstory & Prologue */}
                    <div className="bg-white/70 p-4 rounded-2xl border border-amber-900/15 shadow-2xs space-y-3">
                      <div>
                        <label className="block font-lora font-semibold text-sm sm:text-base mb-1 text-slate-800">
                          Prolog a původ hrdiny (Volitelný)
                        </label>
                        <p className="text-xs text-slate-600 mb-2 font-lora">
                          Napiš pár klíčových slov o minulosti postavy a nech AI Vypravěče sepsat tvůj osud.
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2.5">
                        <textarea 
                          value={keywords} 
                          onChange={e => setKeywords(e.target.value)}
                          className="flex-1 p-3 bg-white/80 border-2 border-amber-900/20 rounded-xl outline-none focus:border-amber-700 transition text-slate-900 font-lora resize-none h-20 text-sm shadow-inner"
                          placeholder="Např. zahořklý bývalý inkvizitor, který odmítl upálit nevinného elfa a nyní hledá vykoupení..."
                        />
                        <button 
                          onClick={generateBackstory} 
                          disabled={loading || !keywords} 
                          className="px-5 py-3 sm:py-0 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl shadow-md cursor-pointer transition disabled:opacity-40 flex items-center justify-center gap-2 shrink-0 font-cinzel text-xs sm:text-sm"
                        >
                          <Sparkles size={16} />
                          <span>Napsat Osud</span>
                        </button>
                      </div>

                      {backstory && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3.5 bg-amber-50/90 border border-amber-700/30 rounded-xl space-y-1.5 font-lora text-slate-800 text-xs sm:text-sm leading-relaxed max-h-36 overflow-y-auto custom-scrollbar">
                          <p><strong className="text-amber-900 font-cinzel">Vzhled:</strong> {backstory.appearance}</p>
                          <p><strong className="text-amber-900 font-cinzel">Chování:</strong> {backstory.personality}</p>
                          <p><strong className="text-amber-900 font-cinzel">Příběh:</strong> {backstory.backstory}</p>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-4 flex justify-between items-center border-t border-amber-900/15 pt-3 shrink-0">
              <button 
                onClick={step === 1 ? onClose : handlePrev} 
                className="px-4 sm:px-6 py-2.5 font-cinzel font-bold tracking-wider text-xs sm:text-sm text-slate-700 hover:text-slate-950 transition flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft size={18} /> {step === 1 ? "Zpět do menu" : "Zpět"}
              </button>
              
              {step < 4 ? (
                <button 
                  onClick={handleNext} 
                  disabled={(step === 2 && (!name.trim() || !race)) || (step === 3 && !dndClass)}
                  className="px-6 sm:px-8 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-cinzel font-bold tracking-wider text-xs sm:text-sm rounded-xl transition disabled:opacity-40 flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <span>{step === 1 ? "Vstoupit do tvorby" : "Dále"}</span>
                  <ChevronRight size={18} />
                </button>
              ) : (
                <button 
                  onClick={startNewGame} 
                  disabled={loading || !name.trim() || !race || !dndClass} 
                  className="px-6 sm:px-8 py-3 bg-red-800 hover:bg-red-700 text-white font-cinzel font-bold text-sm sm:text-base tracking-widest rounded-xl transition disabled:opacity-40 shadow-[0_0_20px_rgba(183,75,75,0.5)] flex items-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin text-white" />
                      <span>Vytvářím svět...</span>
                    </>
                  ) : (
                    "Zrození Hrdiny"
                  )}
                </button>
              )}
            </div>
          </main>

        </div>
      </motion.div>
    </div>
  );
};
