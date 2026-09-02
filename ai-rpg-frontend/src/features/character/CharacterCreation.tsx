import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Settings2, Sparkles } from 'lucide-react';

export const CharacterCreation = ({ startNewGame, loading, backstory, generateBackstory }: any) => {
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

  const handleStatChange = (stat: string, value: number) => {
    setStats({ ...stats, [stat]: value });
  };

  return (
<div className="min-h-screen bg-[#1b262c] p-4 font-serif text-[#2b4c5e] overflow-y-auto">
        <div className="max-w-3xl mx-auto bg-[#f4f1e1] rounded p-6 sm:p-10 shadow-2xl border border-[#90a4ae] my-8">
          <h2 className="text-3xl font-bold border-b-2 border-[#b74b4b] pb-4 mb-6 font-medieval">Tvorba Hrdiny</h2>
          
          <div className="space-y-6">
            

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block font-bold mb-2">Jméno hrdiny</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 bg-[#e3dcc8] border border-[#90a4ae] rounded outline-none" placeholder="Tvé jméno..." />
              </div>
              
              <div>
                <label className="block font-bold mb-2">Rasa</label>
                <select value={race} onChange={e => setRace(e.target.value)} className="w-full p-2 bg-[#e3dcc8] border border-[#90a4ae] rounded outline-none">
                  {races.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-bold mb-2">Povolání</label>
                <select value={dndClass} onChange={e => setDndClass(e.target.value)} className="w-full p-2 bg-[#e3dcc8] border border-[#90a4ae] rounded outline-none">
                  {classes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="bg-[#e3dcc8] p-4 rounded border border-[#90a4ae] flex flex-col gap-2 mb-6">
              <h3 className="font-bold border-b border-[#90a4ae] pb-2 mb-2">Režim hry</h3>
              <div className="flex gap-4 flex-col sm:flex-row">
                <label className={`flex-1 p-4 rounded border-2 cursor-pointer transition ${gameMode === 'sandbox' ? 'border-[#b74b4b] bg-[#f4f1e1]' : 'border-transparent hover:bg-[#d8d1bc]'}`}>
                  <input type="radio" name="gamemode" value="sandbox" checked={gameMode === 'sandbox'} onChange={() => setGameMode('sandbox')} className="hidden" />
                  <div className="font-bold text-[#b74b4b] mb-1">Volný Sandbox</div>
                  <div className="text-xs text-[#455a64]">Tradiční AI zážitek. AI si nekonečně vymýšlí svět, nová města a úkoly za pochodu. Nemá pevné hranice.</div>
                </label>
                <label className={`flex-1 p-4 rounded border-2 cursor-pointer transition ${gameMode === 'campaign' ? 'border-[#b74b4b] bg-[#f4f1e1]' : 'border-transparent hover:bg-[#d8d1bc]'}`}>
                  <input type="radio" name="gamemode" value="campaign" checked={gameMode === 'campaign'} onChange={() => setGameMode('campaign')} className="hidden" />
                  <div className="font-bold text-[#b74b4b] mb-1">Příběhová Kampaň</div>
                  <div className="text-xs text-[#455a64]">Vygeneruje se pevný kampaňový svět (Omezená mapa, města, epická zápletka). AI drží příběh a neodbíhá. Doba tvorby trvá trochu déle.</div>
                </label>
              </div>
            </div>
            <div className="bg-[#e3dcc8] p-4 rounded border border-[#90a4ae]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold flex items-center gap-2"><Settings2 size={18} /> Statistiky (Standard Array)</h3>
                <span className="text-xs text-[#455a64] italic">Automaticky optimalizováno pro {dndClass}</span>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
                {Object.entries(stats).map(([stat, val]) => (
                  <div key={stat} className="bg-[#f4f1e1] p-2 rounded border border-[#90a4ae]">
                    <div className="text-xs uppercase text-[#455a64] font-bold">{stat}</div>
                    <div className="text-xl font-bold text-[#b74b4b]">{val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Backstory Generator */}
            <div className="bg-[#e3dcc8] p-4 rounded border border-[#90a4ae]">
               <h3 className="font-bold flex items-center gap-2 mb-2"><Sparkles size={18} className="text-[#b74b4b]" /> Příběh a charakter</h3>
               <p className="text-sm text-[#455a64] mb-3">Napiš pár slov o tom, jaký tvůj hrdina je (např. "zjizvený, hrubý, hledá pomstu za smrt bratra") a nech AI dopsat zbytek.</p>
               <textarea 
                  value={keywords} 
                  onChange={e => setKeywords(e.target.value)}
                  className="w-full p-2 bg-[#f4f1e1] border border-[#90a4ae] rounded outline-none h-20 mb-3"
                  placeholder="Klíčová slova..."
               />
               <button onClick={generateBackstory} disabled={loading} className="w-full py-2 bg-[#2b4c5e] text-[#f4f1e1] font-bold rounded hover:bg-[#b74b4b] transition shadow disabled:opacity-50">
                 {loading ? "Přemýšlím..." : "Vygenerovat kompletní profil"}
               </button>

               {backstory && (
                 <div className="mt-4 p-4 bg-[#f4f1e1] border-l-4 border-[#b74b4b] space-y-3 text-sm">
                   <p><strong>Vzhled:</strong> {backstory.appearance}</p>
                   <p><strong>Chování:</strong> {backstory.personality}</p>
                   <p><strong>Historie:</strong> {backstory.backstory}</p>
                 </div>
               )}
            </div>

            <button onClick={startNewGame} disabled={loading} className="w-full py-4 bg-[#b74b4b] text-[#f4f1e1] font-bold text-xl rounded hover:bg-[#8a3333] transition shadow-lg disabled:opacity-50">
              {loading ? "Vstupuji do portálu..." : "Začít dobrodružství"}
            </button>
          </div>
        </div>
      </div>
  );
};
