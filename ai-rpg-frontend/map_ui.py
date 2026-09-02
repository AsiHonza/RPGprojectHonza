import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# 1. Imports
if "Map," not in content and "Map " not in content:
    content = content.replace("Users, Settings2", "Users, Settings2, Map")

# 2. State hooks
if "const [worldData" not in content:
    content = content.replace(
        'const [npcsOpen, setNpcsOpen] = useState(false);',
        'const [npcsOpen, setNpcsOpen] = useState(false);\n  const [worldData, setWorldData] = useState<any>(null);\n  const [mapOpen, setMapOpen] = useState(false);'
    )

# 3. Autosave payload
content = content.replace(
    'zname_postavy: npcs',
    'zname_postavy: npcs, world_data: worldData'
)
content = content.replace(
    'npcs]',
    'npcs, worldData]'
)

# 4. loadGame and startNewGame
content = content.replace(
    'setNpcs(state.zname_postavy || []);',
    'setNpcs(state.zname_postavy || []);\n        setWorldData(state.world_data || null);'
)
# loadGame happens via state assignment
content = content.replace(
    'if (state.zname_postavy) setNpcs(state.zname_postavy);',
    'if (state.zname_postavy) setNpcs(state.zname_postavy);\n        if (state.world_data) setWorldData(state.world_data);\n        else setWorldData(null);'
)

# 5. UI Button (next to NPCs)
btn_ui = """              {worldData && (
                <button onClick={() => setMapOpen(true)} className="flex items-center gap-1 font-bold text-[#2b4c5e] hover:text-[#b74b4b] transition cursor-pointer bg-[#e3dcc8] px-2 py-1 rounded border border-[#90a4ae]" title="Mapa světa">
                  <Map size={18} />
                </button>
              )}
              <button onClick={() => setNpcsOpen"""
content = content.replace('<button onClick={() => setNpcsOpen', btn_ui)

# 6. Map Modal UI
map_modal = """
        {/* Map Modal */}
        {mapOpen && worldData && (
          <div className="absolute inset-0 bg-black/80 z-[100] flex items-center justify-center p-2 md:p-8">
            <div className="bg-[#e3dcc8] w-full h-full max-h-screen max-w-6xl rounded shadow-2xl relative overflow-hidden border-4 border-[#1b262c] bg-[url('/assets/parchment.jpg')] bg-cover">
              
              <div className="absolute top-4 left-4 z-50 bg-[#f4f1e1]/90 px-4 py-2 rounded border border-[#90a4ae] shadow-lg pointer-events-none">
                <h2 className="text-[#b74b4b] font-bold text-xl uppercase font-medieval tracking-widest drop-shadow">Světová mapa</h2>
              </div>

              <button onClick={() => setMapOpen(false)} className="absolute top-4 right-4 bg-[#1b262c] text-[#f4f1e1] p-2 rounded hover:bg-[#b74b4b] transition z-50 border border-[#90a4ae]">
                <X size={24} />
              </button>

              <div className="relative w-full h-full min-h-[600px] p-10">
                {/* Roads/Routes (SVG) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {worldData.locations?.map((loc: any, i: number) => {
                    return worldData.locations?.map((loc2: any, j: number) => {
                      if (i < j) {
                        const dx = loc.x - loc2.x;
                        const dy = loc.y - loc2.y;
                        const dist = Math.sqrt(dx*dx + dy*dy);
                        if (dist < 40) { // Connect nodes closer than 40 units
                          return <line key={`${i}-${j}`} x1={`${loc.x}%`} y1={`${loc.y}%`} x2={`${loc2.x}%`} y2={`${loc2.y}%`} stroke="#455a64" strokeWidth="2" strokeDasharray="4,6" opacity={0.6} />
                        }
                      }
                      return null;
                    });
                  })}
                </svg>

                {/* Location Nodes */}
                {worldData.locations?.map((loc: any, idx: number) => {
                  const isCurrent = currentRegion?.toLowerCase().includes(loc.nazev?.toLowerCase()) || false;
                  return (
                    <div key={idx} className="absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20" style={{left: `${loc.x}%`, top: `${loc.y}%`}}>
                      <div className={`w-4 h-4 md:w-6 md:h-6 rounded-full border-2 ${isCurrent ? 'bg-[#b74b4b] border-[#d4af37] shadow-[0_0_15px_#b74b4b] animate-pulse' : 'bg-[#1b262c] border-[#90a4ae]'} transition-transform duration-300 group-hover:scale-150 z-10`} />
                      <span className="mt-1 text-xs md:text-sm font-bold text-[#1b262c] drop-shadow-[0_1px_1px_rgba(255,255,255,1)] font-medieval whitespace-nowrap bg-[#f4f1e1]/70 px-1 rounded transition-opacity">
                        {loc.nazev}
                      </span>
                      <div className="hidden group-hover:block absolute top-full mt-2 w-48 md:w-64 bg-[#1b262c] text-[#f4f1e1] text-xs p-3 rounded z-30 shadow-xl border-2 border-[#b74b4b] text-left">
                        <span className="font-bold text-[#d4af37] block mb-2 uppercase border-b border-[#455a64] pb-1">{String(loc.typ).replace('_', ' ')}</span>
                        <p className="italic font-serif">{loc.popis}</p>
                        {isCurrent && <p className="mt-2 text-green-400 font-bold uppercase text-[10px]">📍 Tvá současná poloha</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
"""
content = content.replace('{/* NPCs Modal */}', map_modal + '\n        {/* NPCs Modal */}')

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)

print("Map implemented.")
