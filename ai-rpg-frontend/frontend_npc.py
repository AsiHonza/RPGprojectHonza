import codecs
import re

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# 1. Imports
if "Users" not in content:
    content = content.replace("User, Settings2", "User, Users, Settings2")

# 2. State hooks
hooks = """  const [npcs, setNpcs] = useState<any[]>([]);
  const [npcsOpen, setNpcsOpen] = useState(false);
"""
if "const [npcs," not in content:
    content = content.replace(
        'const [travelDestination, setTravelDestination] = useState("");',
        'const [travelDestination, setTravelDestination] = useState("");\n' + hooks
    )

# 3. Autosave payload
content = content.replace(
    'travel_destination: travelDestination',
    'travel_destination: travelDestination, zname_postavy: npcs'
)
content = content.replace(
    'travelDestination]',
    'travelDestination, npcs]'
)

# 4. loadGame and startNewGame
state_logic = """        if (state.zname_postavy) setNpcs(state.zname_postavy);
"""
content = content.replace(
    'if (state.travel_destination !== undefined) setTravelDestination(state.travel_destination);',
    'if (state.travel_destination !== undefined) setTravelDestination(state.travel_destination);\n' + state_logic
)
content = content.replace(
    'setTravelDestination(state.travel_destination || "");',
    'setTravelDestination(state.travel_destination || "");\n        setNpcs(state.zname_postavy || []);'
)

# 5. sendAction update
send_action = """
          if (data.zmeny_stavu.zname_postavy_zmena && data.zmeny_stavu.zname_postavy_zmena.length > 0) {
            setNpcs(prev => {
              const updated = [...prev];
              data.zmeny_stavu.zname_postavy_zmena.forEach((newNpc: any) => {
                const idx = updated.findIndex(n => n.jmeno.toLowerCase() === newNpc.jmeno.toLowerCase());
                if (idx !== -1) updated[idx] = newNpc;
                else updated.push(newNpc);
              });
              return updated;
            });
          }
"""
content = content.replace(
    'if (data.zmeny_stavu.travel_destination_set !== undefined && data.zmeny_stavu.travel_destination_set !== null) setTravelDestination(data.zmeny_stavu.travel_destination_set);',
    'if (data.zmeny_stavu.travel_destination_set !== undefined && data.zmeny_stavu.travel_destination_set !== null) setTravelDestination(data.zmeny_stavu.travel_destination_set);\n' + send_action
)

# 6. UI Button
# We will place the Users button next to the Quests button
btn_ui = """              <button onClick={() => setNpcsOpen(true)} className="flex items-center gap-1 font-bold text-[#2b4c5e] hover:text-[#b74b4b] transition cursor-pointer bg-[#e3dcc8] px-2 py-1 rounded border border-[#90a4ae]" title="Známé postavy">
                <Users size={18} />
              </button>
              <button onClick={() => setInventoryOpen(true)"""
content = content.replace('<button onClick={() => setInventoryOpen(true)', btn_ui)

# 7. UI Modal
modal_ui = """
        {/* NPCs Modal */}
        {npcsOpen && (
          <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-[#f4f1e1] border-2 border-[#b74b4b] rounded max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-[#90a4ae] bg-[#e3dcc8]">
                <div className="flex items-center gap-2 text-[#b74b4b] font-bold text-2xl uppercase tracking-widest font-medieval">
                  <Users size={28} /> Deník postav
                </div>
                <button onClick={() => setNpcsOpen(false)} className="text-[#2b4c5e] hover:text-[#b74b4b] transition">
                  <X size={28} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-[url('/assets/parchment.jpg')] bg-cover bg-center">
                {npcs.length === 0 ? (
                  <div className="text-center text-[#455a64] py-8 italic font-serif">Zatím jsi nepotkal nikoho důležitého...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {npcs.map((npc, idx) => (
                      <div key={idx} className="bg-[#1b262c]/80 border border-[#90a4ae] rounded p-4 flex flex-col gap-2 relative">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-[#d4af37] font-bold font-medieval text-lg uppercase">{npc.jmeno}</h3>
                          <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded border font-bold ${npc.vztah.toLowerCase().includes('přát') ? 'bg-green-900/50 text-green-400 border-green-500' : npc.vztah.toLowerCase().includes('nepř') ? 'bg-red-900/50 text-red-400 border-red-500' : 'bg-yellow-900/50 text-yellow-400 border-yellow-500'}`}>
                            {npc.vztah}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[#90a4ae] text-xs">
                          <MapPin size={12} /> {npc.lokace}
                        </div>
                        <p className="text-[#f4f1e1] text-sm font-serif italic mt-2">{npc.popis}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
"""
content = content.replace('{/* Inventory Modal */}', modal_ui + '\n        {/* Inventory Modal */}')

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)

print("Frontend updated for NPCs.")
