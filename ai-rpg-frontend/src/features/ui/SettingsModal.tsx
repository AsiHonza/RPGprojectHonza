import React from 'react';
import { X, Settings2, Mail, Volume2, Mic, LogOut } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export const SettingsModal = ({ isOpen, onClose }: any) => {
  const { bgVolume, setBgVolume, ttsVolume, setTtsVolume, ttsProvider, setTtsProvider } = useGameStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md bg-[#f9f6e6]/95 backdrop-blur-xl rounded-2xl border border-amber-900/20 shadow-2xl overflow-hidden flex flex-col text-slate-900">
        
        {/* Header */}
        <div className="px-5 py-4 flex justify-between items-center border-b border-amber-900/15 bg-gradient-to-r from-amber-900/5 via-transparent to-amber-900/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-xl border border-amber-900/15 text-amber-900">
              <Settings2 size={24} />
            </div>
            <div>
              <h2 className="font-cinzel font-bold text-xl text-amber-950 tracking-wide">
                Nastavení Hry
              </h2>
              <p className="text-xs font-lora text-slate-600">
                Zvuk, hlas vypravěče a volby sezení
              </p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="text-amber-900/60 hover:text-amber-950 p-1.5 rounded-xl hover:bg-amber-900/10 transition"
            title="Zavřít"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[75vh] custom-scrollbar">
          
          {/* Background music volume */}
          <div className="bg-white/70 border border-amber-900/15 p-3.5 rounded-xl shadow-xs">
            <div className="flex justify-between items-center text-sm font-cinzel font-bold text-amber-950 mb-2">
              <span className="flex items-center gap-1.5">
                <Volume2 size={16} className="text-amber-800" /> Hudba na pozadí
              </span>
              <span className="text-amber-900 font-cinzel">{Math.round(bgVolume * 100)}%</span>
            </div>
            <input 
              type="range" min="0" max="1" step="0.05" 
              value={bgVolume} 
              onChange={(e) => setBgVolume(parseFloat(e.target.value))}
              className="w-full accent-amber-800 cursor-pointer"
            />
          </div>

          {/* TTS voice volume */}
          <div className="bg-white/70 border border-amber-900/15 p-3.5 rounded-xl shadow-xs">
            <div className="flex justify-between items-center text-sm font-cinzel font-bold text-amber-950 mb-2">
              <span className="flex items-center gap-1.5">
                <Mic size={16} className="text-amber-800" /> Hlas vypravěče
              </span>
              <span className="text-amber-900 font-cinzel">{Math.round(ttsVolume * 100)}%</span>
            </div>
            <input 
              type="range" min="0" max="1" step="0.05" 
              value={ttsVolume} 
              onChange={(e) => setTtsVolume(parseFloat(e.target.value))}
              className="w-full accent-amber-800 cursor-pointer"
            />
          </div>

          {/* TTS provider choice */}
          <div className="bg-white/70 border border-amber-900/15 p-3.5 rounded-xl shadow-xs">
            <label className="text-amber-950 font-cinzel font-bold mb-2.5 block text-xs tracking-wider uppercase">
              Model a kvalita hlasu
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setTtsProvider("elevenlabs")}
                className={`py-2.5 px-2 rounded-xl text-xs font-cinzel font-bold border transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  ttsProvider === "elevenlabs"
                    ? "bg-amber-200/90 border-amber-700 text-amber-950 shadow-sm"
                    : "bg-white/80 border-amber-900/15 text-slate-600 hover:bg-white"
                }`}
              >
                <span className="text-sm">🎙️ ElevenLabs</span>
                <span className="text-[10px] font-lora font-normal text-amber-900">Filmový & Emoce</span>
              </button>
              <button
                type="button"
                onClick={() => setTtsProvider("edge")}
                className={`py-2.5 px-2 rounded-xl text-xs font-cinzel font-bold border transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  ttsProvider === "edge"
                    ? "bg-amber-200/90 border-amber-700 text-amber-950 shadow-sm"
                    : "bg-white/80 border-amber-900/15 text-slate-600 hover:bg-white"
                }`}
              >
                <span className="text-sm">🔊 Edge-TTS</span>
                <span className="text-[10px] font-lora font-normal text-slate-600">Příjemný (Bez limitu)</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 space-y-2.5 border-t border-amber-900/10">
            <button 
              onClick={() => {
                localStorage.removeItem("aethelgard_active_char");
                window.location.reload();
              }} 
              className="w-full py-2.5 bg-white hover:bg-amber-50 border border-amber-900/20 text-amber-950 rounded-xl font-cinzel font-bold text-xs tracking-wider transition shadow-xs flex justify-center items-center gap-2"
            >
              <LogOut size={14} /> Zpět do výběru hrdinů
            </button>

            <a 
              href="mailto:janmlcak6@gmail.com?subject=Zpětná vazba - Aethelgard" 
              className="w-full py-2 bg-amber-900/5 hover:bg-amber-900/10 text-slate-700 rounded-xl font-lora text-xs transition flex justify-center items-center gap-1.5 text-center"
            >
              <Mail size={14} /> Napsat tvůrcům zpětnou vazbu
            </a>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-amber-900/10 bg-amber-900/5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-800 hover:bg-amber-700 text-white rounded-xl font-cinzel font-bold text-xs tracking-wider transition shadow-sm"
          >
            Hotovo
          </button>
        </div>

      </div>
    </div>
  );
};
