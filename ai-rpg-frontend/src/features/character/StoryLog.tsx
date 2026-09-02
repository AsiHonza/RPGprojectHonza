import React from 'react';
import { Volume2 } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { TypewriterText } from '../../components/ui/TypewriterText';
import { FormattedSystemLog } from '../../components/ui/FormattedSystemLog';

export const StoryLog = ({ history, playAudio }: { history: any[], playAudio: (text: string, type: string) => void }) => {
  const { name, race, dndClass } = useGameStore();

  return (
    <>
              {history.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.type === "player" ? "items-end" : "items-start"}`}>
            
            {msg.type === "system" && (
              <div className="w-full text-center italic text-[#b74b4b] text-sm my-4 border-b border-[#90a4ae] pb-2">
                — {msg.text} —
              </div>
            )}

            {msg.type === "player" && (
              <div className="flex gap-4 items-end self-end max-w-[90%]">
                <div className="bg-[#2b4c5e] text-[#f4f1e1] px-4 py-2 rounded-lg shadow-md flex-1">
                  <span className="opacity-50 text-xs uppercase block mb-1">Tvá akce</span>
                  {msg.text}
                </div>
                <div className="w-16 h-16 border-2 border-[#b74b4b] rounded overflow-hidden shadow-lg bg-[#e3dcc8] flex-shrink-0">
                  <img src={`https://image.pollinations.ai/prompt/black%20and%20white%20ink%20drawing%20of%20a%20${encodeURIComponent(race)}%20${encodeURIComponent(dndClass)}%20RPG%20character%20portrait?width=256&height=256&nologo=true&seed=42`} alt="Player" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {msg.type === "dm" && (
              <div className="flex flex-col gap-3 w-full max-w-[90%]">
                {/* Obrázek lokace (Zelený rámeček na náčrtu uživatele) */}
                {msg.image_prompt && (
                  <div className="lg:hidden w-full h-56 border-4 border-[#2b4c5e] rounded shadow-lg overflow-hidden mb-2">
                    <img src={`https://image.pollinations.ai/prompt/${encodeURIComponent(msg.image_prompt)}?width=768&height=432&nologo=true&seed=42`} alt="Location" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Popis prostředí (Kurzíva) */}
                {msg.popis_okoli && (
                  <div className="lg:hidden italic text-[#455a64] leading-relaxed text-lg border-l-4 border-[#90a4ae] pl-4">
                    {msg.popis_okoli}
                  </div>
                )}
                
                {/* Přímý výsledek akce */}
                {msg.vypravec && (
                  <div className="text-[#1b262c] font-medium leading-relaxed group relative">
                    <button 
                      onClick={() => playAudio(msg.vypravec, "narrator")} 
                      className="absolute -left-8 top-1 opacity-0 group-hover:opacity-100 transition text-[#b74b4b]"
                      title="Přehrát hlas vypravěče"
                    >
                      <Volume2 size={20} />
                    </button>
                    {msg.vypravec}
                  </div>
                )}

                {/* System Log (Herní mechaniky – hody, XP, poškození) */}
                {msg.system_log && (
                  <div className="mt-2 bg-[#e3dcc8] border-2 border-[#90a4ae] rounded-md px-4 py-3 font-mono text-sm text-[#2b4c5e] leading-relaxed shadow-sm">
                    <div className="text-[#b74b4b] font-bold uppercase tracking-widest text-[11px] mb-2 flex items-center gap-1 border-b border-[#90a4ae] pb-1">
                      <span>⚙</span> Herní mechaniky
                    </div>
                    <FormattedSystemLog text={msg.system_log} />
                  </div>
                )}

                {/* Zpětná kompatibilita pro staré uložení (jedno NPC) */}
                {msg.npc_mluvi?.aktivni && (
                  <div className="bg-[#e3dcc8] p-4 rounded-lg shadow-sm border border-[#90a4ae] mt-2 relative group">
                    <button onClick={() => playAudio(msg.npc_mluvi.text, msg.npc_mluvi.pohlavi === "zena" ? "npc_zena" : "npc_muz")} className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition text-[#b74b4b]"><Volume2 size={20} /></button>
                    <div className="absolute w-3 h-3 bg-[#e3dcc8] border-l border-t border-[#90a4ae] -top-[7px] left-8 transform rotate-45"></div>
                    <span className="font-bold text-[#b74b4b] block mb-1">{msg.npc_mluvi.jmeno || "Neznámý"}:</span>
                    <span className="text-[#2b4c5e]">"<TypewriterText text={msg.npc_mluvi.text} animate={i === history.length - 1} />"</span>
                  </div>
                )}

                {/* Nový seznam NPC dialogů s portréty (Žlutý rámeček na náčrtu uživatele) */}
                {msg.npc_dialogy && msg.npc_dialogy.length > 0 && msg.npc_dialogy.map((npc: any, nIdx: number) => {
                  let seed = 42;
                  if (npc.jmeno) {
                    let h = 0;
                    for(let i=0; i<npc.jmeno.length; i++) h = Math.imul(31, h) + npc.jmeno.charCodeAt(i) | 0;
                    seed = Math.abs(h);
                  }
                  
                  const isPlayer = name && npc.jmeno && npc.jmeno.toLowerCase() === name.toLowerCase();

                  if (isPlayer) {
                    return (
                      <div key={nIdx} className="flex gap-4 items-start self-end w-full mt-2 flex-row-reverse max-w-[90%]">
                        <div className="w-16 h-16 border-2 border-[#b74b4b] rounded overflow-hidden shadow-sm bg-[#e3dcc8] flex-shrink-0 mt-2">
                          <img src={`https://image.pollinations.ai/prompt/black%20and%20white%20ink%20drawing%20of%20a%20${encodeURIComponent(race)}%20${encodeURIComponent(dndClass)}%20RPG%20character%20portrait?width=256&height=256&nologo=true&seed=42`} alt={npc.jmeno} className="w-full h-full object-cover" />
                        </div>
                        <div className="bg-[#2b4c5e] text-[#f4f1e1] p-4 rounded-lg shadow-md relative group flex-1">
                          <button onClick={() => playAudio(npc.text, 'narrator')} className="absolute left-4 top-4 opacity-0 group-hover:opacity-100 transition text-[#e3dcc8] hover:text-white"><Volume2 size={20} /></button>
                          <div className="absolute w-3 h-3 bg-[#2b4c5e] top-6 -right-[6px] transform rotate-45"></div>
                          <span className="font-bold text-[#e3dcc8] block mb-1">{npc.jmeno}:</span>
                          <span className="opacity-90">"<TypewriterText text={npc.text} animate={i === history.length - 1} />"</span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={nIdx} className="flex gap-4 items-start w-full mt-2">
                      <div className="w-16 h-16 border-2 border-[#90a4ae] rounded overflow-hidden shadow-sm bg-[#e3dcc8] flex-shrink-0 mt-2">
                        <img src={`https://image.pollinations.ai/prompt/${encodeURIComponent('black and white ink drawing portrait sketch of ' + (npc.image_prompt || npc.jmeno))}?width=256&height=256&nologo=true&seed=${seed}`} alt={npc.jmeno} className="w-full h-full object-cover" />
                      </div>
                      <div className="bg-[#e3dcc8] p-4 rounded-lg shadow-sm border border-[#90a4ae] relative group flex-1">
                        <button onClick={() => playAudio(npc.text, npc.pohlavi === 'muz' ? 'npc_muz' : 'npc_zena')} className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition text-[#b74b4b]"><Volume2 size={20} /></button>
                        <div className="absolute w-3 h-3 bg-[#e3dcc8] border-b border-l border-[#90a4ae] top-6 -left-[7px] transform rotate-45"></div>
                        <span className="font-bold text-[#b74b4b] block mb-1">{npc.jmeno || "Neznámá"}:</span>
                        <span className="text-[#2b4c5e]">"<TypewriterText text={npc.text} animate={i === history.length - 1} />"</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {msg.type === "error" && (
              <div className="bg-red-100 text-red-800 p-3 rounded text-sm w-full font-sans">
                ⚠️ {msg.text}
              </div>
            )}
            
          </div>
        ))}

    </>
  );
};
