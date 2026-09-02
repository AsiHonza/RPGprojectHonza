import codecs

storylog = """import React from 'react';
import { Volume2 } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { TypewriterText } from '../../components/ui/TypewriterText';
import { FormattedSystemLog } from '../../components/ui/FormattedSystemLog';
import { motion } from 'framer-motion';

export const StoryLog = ({ history, playAudio }: { history: any[], playAudio: (text: string, type: string) => void }) => {
  const { name, race, dndClass } = useGameStore();

  return (
    <>
      {history.map((msg, i) => (
        <motion.div 
          key={i} 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`flex flex-col ${msg.type === "player" ? "items-end" : "items-start"}`}
        >
          
          {msg.type === "system" && (
            <div className="w-full text-center italic text-rpg-magic text-sm my-6 border-b border-rpg-magic/30 pb-2 font-cinzel tracking-wider drop-shadow-md">
              ✧ {msg.text} ✧
            </div>
          )}

          {msg.type === "player" && (
            <div className="flex gap-4 items-end self-end max-w-[90%] my-2">
              <div className="bg-[#1b262c]/80 backdrop-blur-sm text-[#f4ecd8] px-5 py-3 rounded-xl rounded-br-none shadow-[0_4px_15px_rgba(0,0,0,0.3)] border border-[#2b4c5e] flex-1">
                <span className="opacity-60 text-[10px] uppercase block mb-1 font-cinzel font-bold text-rpg-magic tracking-wider">Tvá akce</span>
                <span className="font-lora text-[15px] leading-relaxed drop-shadow-sm">{msg.text}</span>
              </div>
              <div className="w-14 h-14 border border-rpg-magic rounded-full overflow-hidden shadow-lg bg-rpg-obsidian flex-shrink-0 relative">
                <img src={`https://image.pollinations.ai/prompt/black%20and%20white%20ink%20drawing%20of%20a%20${encodeURIComponent(race)}%20${encodeURIComponent(dndClass)}%20RPG%20character%20portrait?width=256&height=256&nologo=true&seed=42`} alt="Player" className="w-full h-full object-cover" />
                <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] rounded-full"></div>
              </div>
            </div>
          )}

          {msg.type === "dm" && (
            <div className="flex gap-4 items-start self-start max-w-[95%] my-4">
              <div className="w-14 h-14 border border-[#455a64] rounded-full overflow-hidden shadow-lg bg-[#2b4c5e] flex-shrink-0 flex items-center justify-center font-bold text-xl text-rpg-paper font-cinzel relative">
                P
                <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] rounded-full"></div>
              </div>
              <div className="flex-1 bg-gradient-to-br from-[#111827] to-rpg-obsidian text-rpg-paper px-6 py-5 rounded-xl rounded-tl-none shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-[#2b4c5e] relative group">
                <span className="opacity-50 text-[10px] uppercase block mb-3 font-cinzel tracking-widest text-[#90a4ae]">Vypravěč</span>
                
                <div className="text-[17px] leading-loose font-lora text-[#e5e7eb] drop-shadow-sm">
                  {i === history.length - 1 ? (
                    <TypewriterText text={msg.text} animate={true} />
                  ) : (
                    msg.text
                  )}
                </div>

                <button 
                  onClick={() => playAudio(msg.text, 'dm')} 
                  className="absolute bottom-2 right-2 text-[#455a64] hover:text-rpg-magic transition-colors opacity-0 group-hover:opacity-100"
                  title="Přečíst nahlas"
                >
                  <Volume2 size={16} />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </>
  );
};
"""

with codecs.open('src/features/character/StoryLog.tsx', 'w', 'utf-8') as f:
    f.write(storylog)

print("StoryLog rewritten with framer-motion and High Fantasy styling")
