import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# 3. Add UI toggle in creation screen
ui_toggle = """            <div className="bg-[#e3dcc8] p-4 rounded border border-[#90a4ae] flex flex-col gap-2 mb-6">
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
"""
if "Režim hry" not in content:
    content = content.replace(
        '            <div className="bg-[#e3dcc8] p-4 rounded border border-[#90a4ae]">',
        ui_toggle + '            <div className="bg-[#e3dcc8] p-4 rounded border border-[#90a4ae]">'
    )


with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)

print("Campaign UI fixed.")
