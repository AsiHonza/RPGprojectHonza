import React from 'react';
import { X, Settings2, Mail } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export const SettingsModal = ({ isOpen, onClose }: any) => {
  const { bgVolume, setBgVolume, ttsVolume, setTtsVolume } = useGameStore();

  if (!isOpen) return null;

  return (
        <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#f4f1e1] border-2 border-[#b74b4b] rounded p-6 max-w-sm w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b border-[#90a4ae] pb-2">
              <h2 className="text-2xl font-bold text-[#2b4c5e] flex items-center gap-2"><Settings2 size={24} /> Nastavení</h2>
              <button onClick={() => onClose()} className="text-[#b74b4b] hover:text-[#8a3333]"><X size={24} /></button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="flex justify-between text-[#2b4c5e] font-bold mb-2">
                  <span>Hudba pozadí</span>
                  <span>{Math.round(bgVolume * 100)}%</span>
                </label>
                <input 
                  type="range" min="0" max="1" step="0.05" 
                  value={bgVolume} 
                  onChange={(e) => setBgVolume(parseFloat(e.target.value))}
                  className="w-full accent-[#b74b4b]"
                />
              </div>
              <div>
                <label className="flex justify-between text-[#2b4c5e] font-bold mb-2">
                  <span>Hlas vypravěče</span>
                  <span>{Math.round(ttsVolume * 100)}%</span>
                </label>
                <input 
                  type="range" min="0" max="1" step="0.05" 
                  value={ttsVolume} 
                  onChange={(e) => setTtsVolume(parseFloat(e.target.value))}
                  className="w-full accent-[#b74b4b]"
                />
              
              <div className="pt-4 mt-6 border-t border-[#90a4ae]">
                <a href="mailto:janmlcak6@gmail.com?subject=Zpětná vazba - Aethelgard" className="w-full py-2 bg-[#2b4c5e] text-[#f4f1e1] rounded font-bold hover:bg-[#1e3746] transition flex justify-center items-center gap-2">
                  <Mail size={18} /> Odeslat zpětnou vazbu
                </a>
              </div>
</div>
            </div>
          </div>
        </div>

  );
};
