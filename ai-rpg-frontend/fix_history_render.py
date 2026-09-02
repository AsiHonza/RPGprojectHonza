import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

start_idx = -1
end_idx = -1

for i, l in enumerate(lines):
    if '{history.map((msg, i) => (' in l:
        start_idx = i
        break

if start_idx != -1:
    # Find the closing tag for the map
    count = 0
    for i in range(start_idx, len(lines)):
        count += lines[i].count('(')
        count -= lines[i].count(')')
        if count == 0 and '{loading && (' in "".join(lines[i:i+5]):
            end_idx = i
            break

new_history_map = """            {history.map((msg, i) => (
              <div key={i} className={`flex ${msg.type === "player" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] md:max-w-[75%] p-5 rounded-2xl ${
                  msg.type === "player" 
                    ? "bg-white/5 border border-white/10 text-gray-300 font-lora" 
                    : msg.type === "system" || msg.type === "error"
                      ? "bg-slate-900 border border-white/5 text-gray-400 font-cinzel text-sm italic"
                      : "bg-black/60 border border-rpg-magic/30 text-white font-lora shadow-[0_0_15px_rgba(197,160,89,0.1)]"
                }`}>
                  {msg.type === "player" && (
                    <div className="leading-relaxed text-lg">{msg.text}</div>
                  )}
                  {msg.type === "system" && <FormattedSystemLog text={msg.text} />}
                  {msg.type === "error" && <div className="text-red-500 font-bold">Chyba: {msg.text}</div>}
                  {msg.type === "dm" && (
                    <div className="flex flex-col gap-4">
                      {msg.vypravec && (
                        <div className="leading-relaxed text-lg">
                          <button onClick={() => playAudio(msg.vypravec, 'narrator')} className="float-right ml-4 text-gray-500 hover:text-rpg-magic transition">
                            <Volume2 size={18} />
                          </button>
                          <TypewriterText text={msg.vypravec} animate={i === history.length - 1} />
                        </div>
                      )}
                      {msg.popis_okoli && (
                        <div className="text-gray-400 italic font-lora text-sm border-l-2 border-rpg-magic/50 pl-3">
                          {msg.popis_okoli}
                        </div>
                      )}
                      {msg.npc_dialogy && msg.npc_dialogy.length > 0 && (
                        <div className="flex flex-col gap-2 mt-2">
                          {msg.npc_dialogy.map((npc: any, nIdx: number) => (
                            <div key={nIdx} className="bg-slate-900/80 p-3 rounded-lg border border-white/10">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-rpg-magic font-cinzel">{npc.jmeno}</span>
                                <button onClick={() => playAudio(npc.replika, npc.jmeno.toLowerCase().includes('žen') ? 'npc_zena' : 'npc_muz')} className="text-gray-500 hover:text-white"><Volume2 size={16} /></button>
                              </div>
                              <div className="text-gray-200">"{npc.replika}"</div>
                            </div>
                          ))}
                        </div>
                      )}
                      {msg.system_log && (
                        <div className="text-xs text-gray-500 font-mono mt-2 opacity-70">
                          {msg.system_log}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
"""

lines = lines[:start_idx] + [new_history_map] + lines[end_idx+1:]

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
