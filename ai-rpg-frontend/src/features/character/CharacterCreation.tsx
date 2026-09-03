import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Settings2, Sparkles, ChevronRight, ChevronLeft, Crown, Shield, Wand2, Axe, Ghost, Skull, Book, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CharacterCreation = ({ startNewGame, loading, backstory, generateBackstory, onClose }: any) => {
  const [step, setStep] = useState(1);
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

  const handleNext = () => setStep(prev => Math.min(prev + 1, 3));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  const pageVariants = {
    initial: { opacity: 0, x: 50 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -50 }
  };

  const getRaceIcon = (r: string) => {
    switch(r) {
      case "Člověk": return <Crown size={24} />;
      case "Elf": return <Sparkles size={24} />;
      case "Trpaslík": return <Axe size={24} />;
      case "Tiefling": return <Flame size={24} />;
      case "Půlork": return <Skull size={24} />;
      default: return <Ghost size={24} />;
    }
  };

  const getClassIcon = (c: string) => {
    switch(c) {
      case "Bojovník": case "Barbar": case "Paladin": return <Shield size={24} />;
      case "Kouzelník": case "Čaroděj": return <Wand2 size={24} />;
      case "Klerik": return <Book size={24} />;
      default: return <Axe size={24} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-slate-900 flex flex-col items-center justify-center p-4 overflow-y-auto overflow-x-hidden relative">
      
        <video src="/video/bg1.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-60" />
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rpg-magic/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-[#f9f6e6]/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-amber-900/10 p-4 sm:p-8 md:p-12 relative z-10"
      >
        <div className="flex justify-between items-center mb-8 border-b border-amber-900/10 pb-6">
          <h2 className="text-2xl sm:text-4xl text-center md:text-left font-cinzel text-rpg-magic drop-shadow-[0_0_10px_rgba(197,160,89,0.3)]">
            {step === 1 && "Zrození Hrdiny"}
            {step === 2 && "Cesta Meče a Magie"}
            {step === 3 && "Kniha Osudu"}
          </h2>
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-2 w-12 rounded-full transition-all duration-500 ${step >= i ? 'bg-rpg-magic shadow-[0_0_8px_rgba(197,160,89,0.8)]' : 'bg-white/70'}`} />
            ))}
          </div>
        </div>

        <div className="min-h-[400px] relative">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" variants={pageVariants} initial="initial" animate="in" exit="out" className="space-y-8">
                <div>
                  <label className="block font-lora text-xl mb-4 text-slate-800">Jaké jméno ponese tvá legenda?</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    className="w-full bg-transparent border-b-2 border-amber-900/20 focus:border-rpg-magic outline-none px-4 py-3 text-3xl font-cinzel text-slate-900 transition placeholder-slate-400" 
                    placeholder="Např. Kaelen ze Severu" 
                  />
                </div>

                <div>
                  <label className="block font-lora text-xl mb-4 text-slate-800">Krev jakého rodu ti koluje v žilách?</label>
                  <div className="flex overflow-x-auto snap-x md:grid md:grid-cols-4 gap-2 sm:gap-4 pb-2 custom-scrollbar">
                    {races.map(r => (
                      <button 
                        key={r}
                        onClick={() => setRace(r)}
                        className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${race === r ? 'bg-rpg-magic/20 border-rpg-magic shadow-[0_0_15px_rgba(197,160,89,0.4)] text-amber-800 font-bold bg-amber-100' : 'border-amber-900/10 text-slate-700 hover:bg-white/50 hover:border-amber-900/30'}`}
                      >
                        {getRaceIcon(r)}
                        <span className="font-cinzel tracking-widest">{r}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" variants={pageVariants} initial="initial" animate="in" exit="out" className="space-y-8">
                <div>
                  <label className="block font-lora text-xl mb-4 text-slate-800">Jakému řemeslu ses upsal?</label>
                  <div className="flex overflow-x-auto snap-x md:grid md:grid-cols-4 gap-2 sm:gap-3 md:max-h-48 md:overflow-y-auto custom-scrollbar p-1 pb-4">
                    {classes.map(c => (
                      <button 
                        key={c}
                        onClick={() => setDndClass(c)}
                        className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${dndClass === c ? 'bg-rpg-magic/20 border-rpg-magic shadow-[0_0_10px_rgba(197,160,89,0.4)] text-amber-800 font-bold bg-amber-100' : 'border-amber-900/10 text-slate-700 hover:bg-white/50 hover:border-amber-900/30'}`}
                      >
                        {getClassIcon(c)}
                        <span className="font-cinzel text-sm tracking-wide">{c}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white/50 p-6 rounded-xl border border-amber-900/10">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-cinzel text-rpg-magic text-lg flex items-center gap-2"><Settings2 size={18} /> Atributy (Standard Array)</h3>
                    <span className="text-xs text-slate-600 font-lora italic">Automaticky optimalizováno pro {dndClass}</span>
                  </div>
                  <div className="flex overflow-x-auto snap-x md:grid md:grid-cols-6 gap-2 sm:gap-4 text-center pb-2 custom-scrollbar">
                    {Object.entries(stats).map(([stat, val]) => (
                      <div key={stat} className="shrink-0 snap-center min-w-[80px] md:min-w-0 bg-[#f9f6e6]/70 p-3 rounded-lg border border-amber-900/10">
                        <div className="text-xs uppercase text-slate-600 font-bold tracking-widest mb-1">{stat}</div>
                        <div className="text-2xl font-cinzel text-slate-900">{val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" variants={pageVariants} initial="initial" animate="in" exit="out" className="space-y-6">
                <div>
                  <label className="block font-lora text-xl mb-4 text-slate-800">Prolog (Volitelný)</label>
                  <p className="text-sm text-slate-600 mb-4 font-lora">Napiš pár slov o tom, jaký tvůj hrdina je (např. "zjizvený, hrubý, hledá pomstu za smrt bratra") a nech Vypravěče (AI) dopsat zbytek.</p>
                  
                  <div className="flex gap-4 mb-6">
                    <textarea 
                        value={keywords} 
                        onChange={e => setKeywords(e.target.value)}
                        className="flex-1 p-4 bg-[#f9f6e6]/70 border border-amber-900/20 rounded-xl outline-none focus:border-rpg-magic transition text-slate-900 font-lora resize-none h-24"
                        placeholder="Zadej klíčová slova k historii..."
                    />
                    <button 
                      onClick={generateBackstory} 
                      disabled={loading || !keywords} 
                      className="px-6 bg-transparent text-amber-800 font-bold border border-amber-900/30 rounded-xl hover:bg-amber-900/10 hover:border-amber-900/50 hover:shadow-md cursor-pointer transition disabled:opacity-50 flex flex-col items-center justify-center gap-2"
                    >
                      <Sparkles size={20} />
                      <span className="font-cinzel text-sm">Napsat<br/>Osud</span>
                    </button>
                  </div>

                  {backstory && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 bg-white/50 border border-rpg-magic/30 rounded-xl space-y-3 font-lora text-slate-800 text-sm leading-relaxed mb-6">
                      <p><strong className="text-rpg-magic font-cinzel">Vzhled:</strong> {backstory.appearance}</p>
                      <p><strong className="text-rpg-magic font-cinzel">Chování:</strong> {backstory.personality}</p>
                      <p><strong className="text-rpg-magic font-cinzel">Příběh:</strong> {backstory.backstory}</p>
                    </motion.div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className={`p-6 rounded-xl border-2 cursor-pointer transition flex flex-col ${gameMode === 'sandbox' ? 'border-rpg-magic bg-rpg-magic/10' : 'border-amber-900/10 hover:border-amber-900/30'}`}>
                    <input type="radio" value="sandbox" checked={gameMode === 'sandbox'} onChange={() => setGameMode('sandbox')} className="hidden" />
                    <span className="font-cinzel text-xl text-slate-900 mb-2">Pustina (Sandbox)</span>
                    <span className="font-lora text-sm text-slate-600">Nekonečný, náhodně generovaný svět bez pevné zápletky. AI si vymýšlí vše za pochodu.</span>
                  </label>
                  <label className={`p-6 rounded-xl border-2 cursor-pointer transition flex flex-col ${gameMode === 'campaign' ? 'border-rpg-magic bg-rpg-magic/10' : 'border-amber-900/10 hover:border-amber-900/30'}`}>
                    <input type="radio" value="campaign" checked={gameMode === 'campaign'} onChange={() => setGameMode('campaign')} className="hidden" />
                    <span className="font-cinzel text-xl text-slate-900 mb-2">Aelthgard (Kampaň)</span>
                    <span className="font-lora text-sm text-slate-600">Pevně vygenerovaná mapa, 7 království, epická zápletka a politika. Náš doporučený režim.</span>
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between items-center border-t border-amber-900/10 pt-6">
          <button 
            onClick={handlePrev} 
            disabled={step === 1}
            className="px-6 py-3 font-cinzel tracking-widest text-slate-700 hover:text-slate-900 transition disabled:opacity-0 flex items-center gap-2"
          >
            <ChevronLeft size={20} /> Zpět
          </button>
          
          {step < 3 ? (
            <button 
              onClick={handleNext} 
              disabled={step === 1 && !name}
              className="px-8 py-3 bg-white/70 text-slate-900 font-cinzel tracking-widest rounded-lg hover:bg-white/80 transition disabled:opacity-50 flex items-center gap-2 border border-amber-900/20"
            >
              Dále <ChevronRight size={20} />
            </button>
          ) : (
            <button 
              onClick={startNewGame} 
              disabled={loading || !name} 
              className="px-10 py-4 bg-rpg-blood text-slate-900 font-cinzel font-bold text-lg tracking-widest rounded-lg hover:bg-red-800 transition disabled:opacity-50 shadow-[0_0_20px_rgba(183,75,75,0.4)] flex items-center gap-2"
            >
              {loading ? <Sparkles className="animate-spin" /> : "Vstoupit do Světa"}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
