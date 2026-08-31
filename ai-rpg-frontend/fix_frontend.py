import codecs
import re

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# 1. Imports: import Drumstick
content = content.replace("Heart, Coins, Shield,", "Heart, Coins, Shield, Drumstick,")

# 2. Add rations state
old_gold_state = "const [gold, setGold] = useState(15);"
new_gold_state = "const [gold, setGold] = useState(15);\n  const [rations, setRations] = useState(3);"
content = content.replace(old_gold_state, new_gold_state)

# 3. Update pointsOfInterest type
old_poi_state = "const [pointsOfInterest, setPointsOfInterest] = useState<string[]>([]);"
new_poi_state = "const [pointsOfInterest, setPointsOfInterest] = useState<{nazev: string, ikona: string, ma_ukol: boolean}[]>([]);"
content = content.replace(old_poi_state, new_poi_state)

# 4. loadGame: state.rations
# We must find the block where state variables are set in loadGame.
# It starts around: setSkills(state.skills || []);
loadgame_add = "        setRations(state.rations ?? 3);"
content = content.replace("setSkills(state.skills || []);", "setSkills(state.skills || []);\n" + loadgame_add)

# 5. save_state payload
old_save_payload = "locationType, currentRegion, pointsOfInterest, stats"
new_save_payload = "locationType, currentRegion, pointsOfInterest, stats, rations"
content = content.replace(old_save_payload, new_save_payload)

# 6. dependency array
old_dep = "currentRegion, pointsOfInterest, gameState, apiKey, stats, gold, currentSpellSlots, maxSpellSlots]);"
new_dep = "currentRegion, pointsOfInterest, gameState, apiKey, stats, gold, currentSpellSlots, maxSpellSlots, rations]);"
content = content.replace(old_dep, new_dep)

# 7. Action response: data.zmeny_stavu.davky_jidla_zmena
action_update = """
          if (data.zmeny_stavu.davky_jidla_zmena) {
             setRations(r => Math.max(0, r + data.zmeny_stavu.davky_jidla_zmena));
          }
"""
content = content.replace("setInventory(inv => {", action_update + "          setInventory(inv => {")

# 8. Top bar UI: rations indicator
# It's next to HP: <div className="flex items-center gap-1 font-bold mr-2"><Heart size={18} className="text-[#8b1e1e]" /> <span key={`hp-${hp}`} className="animate-flash text-[#8b1e1e] font-bold">{hp}</span> / {stats.con * 10} HP</div>
old_hp_ui = '<div className="flex items-center gap-1 font-bold mr-2"><Heart size={18} className="text-[#8b1e1e]" />'
new_hp_ui = '<div className="flex items-center gap-1 font-bold mr-4 text-[#8b1e1e]"><Drumstick size={18} /> <span key={`food-${rations}`} className="animate-flash">{rations}</span></div>\n              ' + old_hp_ui
content = content.replace(old_hp_ui, new_hp_ui)

# 9. Left Panel UI overlay for Town
old_region_header = '             {/* Region Header */}'
town_overlay = """
             {/* Town Overlay UI */}
             {locationType === 'mesto' && pointsOfInterest && pointsOfInterest.length > 0 && (
               <div className="absolute inset-0 bg-black/65 flex flex-col items-center justify-center p-6 z-20 overflow-y-auto">
                 <h3 className="text-[#d4af37] font-medieval text-3xl mb-8 font-bold drop-shadow-md border-b-2 border-[#d4af37] pb-2">Ve Městě</h3>
                 <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                   {pointsOfInterest.map((poi, idx) => (
                     <button
                       key={idx}
                       onClick={() => sendAction(`Jdu do lokace: ${poi.nazev}`)}
                       className="relative bg-[#3d2b1f] border-2 border-[#c4a47c] rounded-lg p-4 flex flex-col items-center hover:bg-[#5c4a3d] transition-all shadow-lg group hover:scale-105"
                     >
                       {poi.ma_ukol && (
                         <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#8b1e1e] border-2 border-[#d4af37] text-[#d4af37] rounded-full flex items-center justify-center font-bold text-xl animate-bounce shadow-xl z-30">
                           !
                         </div>
                       )}
                       <span className="text-[#f4ecd8] font-bold text-sm text-center">{poi.nazev}</span>
                     </button>
                   ))}
                 </div>
                 <button
                   onClick={() => sendAction("Odejít z města a cestovat do neznáma.")}
                   className="mt-8 bg-[#8b1e1e] border-2 border-[#c4a47c] text-[#f4ecd8] font-bold py-3 px-8 rounded hover:bg-red-900 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(139,30,30,0.5)] hover:shadow-[0_0_25px_rgba(139,30,30,0.8)] hover:scale-105"
                 >
                   <MapPin size={20} /> Vyrazit na cestu (1 🍗)
                 </button>
               </div>
             )}
"""
content = content.replace(old_region_header, town_overlay + "\n" + old_region_header)

# 10. Remove the old text buttons for POI in the main action bar
# We will just leave it if it's there but maybe it breaks because poi is now an object, not a string!
# We MUST fix it!
old_poi_buttons = """                {pointsOfInterest.map((poi, i) => (
                  <button 
                    key={`poi-${i}`} 
                    onClick={() => sendAction(`Jdu prozkoumat: ${poi}`)}
                    className="bg-[#d4af37] text-[#1a120b] font-bold px-4 py-2 rounded-sm text-sm hover:bg-[#f4ecd8] transition-all shadow-md border border-[#d4af37] font-serif flex items-center gap-1"
                  >
                    <MapPin size={16} className="opacity-70" /> {poi}
                  </button>
                ))}"""

# If poi is an object, poi.nazev
new_poi_buttons = """                {locationType !== 'mesto' && pointsOfInterest.map((poi, i) => (
                  <button 
                    key={`poi-${i}`} 
                    onClick={() => sendAction(`Jdu prozkoumat: ${poi.nazev}`)}
                    className="bg-[#d4af37] text-[#1a120b] font-bold px-4 py-2 rounded-sm text-sm hover:bg-[#f4ecd8] transition-all shadow-md border border-[#d4af37] font-serif flex items-center gap-1"
                  >
                    <MapPin size={16} className="opacity-70" /> {poi.nazev}
                  </button>
                ))}"""
content = content.replace(old_poi_buttons, new_poi_buttons)


with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("Frontend updated!")
