import codecs
import re

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# 1. State hooks
state_hooks = """  const [travelMode, setTravelMode] = useState(false);
  const [travelDaysLeft, setTravelDaysLeft] = useState(0);
  const [travelDestination, setTravelDestination] = useState("");
"""
content = content.replace(
    'const [currentRegion, setCurrentRegion] = useState<string>("Neznámé končiny");',
    'const [currentRegion, setCurrentRegion] = useState<string>("Neznámé končiny");\n' + state_hooks
)

# 2. Add to autosave payload (first one)
content = content.replace(
    'locationType, currentRegion, pointsOfInterest, stats, rations, currentImage, currentImageError, currentLocationDesc',
    'locationType, currentRegion, pointsOfInterest, stats, rations, currentImage, currentImageError, currentLocationDesc, travel_mode: travelMode, travel_days_left: travelDaysLeft, travel_destination: travelDestination'
)

# 3. Add to autosave dependencies
content = content.replace(
    'currentImageError]',
    'currentImageError, travelMode, travelDaysLeft, travelDestination]'
)

# 4. loadGame
load_game_logic = """
        if (state.travel_mode !== undefined) setTravelMode(state.travel_mode);
        if (state.travel_days_left !== undefined) setTravelDaysLeft(state.travel_days_left);
        if (state.travel_destination !== undefined) setTravelDestination(state.travel_destination);
"""
content = content.replace(
    'if (state.currentRegion) setCurrentRegion(state.currentRegion);',
    'if (state.currentRegion) setCurrentRegion(state.currentRegion);\n' + load_game_logic
)

# 5. startNewGame
start_game_logic = """
        setTravelMode(state.travel_mode || false);
        setTravelDaysLeft(state.travel_days_left || 0);
        setTravelDestination(state.travel_destination || "");
"""
content = content.replace(
    'setCurrentRegion("Začátek cesty");',
    'setCurrentRegion("Začátek cesty");\n' + start_game_logic
)

# 6. sendAction (from zmeny_stavu or the returned new state)
# But wait, in sendAction, does it read state changes for travel?
# Yes, if we update the backend to return them, or if we just rely on autosave?
# Wait! In sendAction we don't get the FULL state back. We get `data.zmeny_stavu`.
# Let's check `sendAction`. If the backend returns `zmeny_stavu.travel_mode_set`...
send_action_logic = """
        if (data.zmeny_stavu) {
          if (data.zmeny_stavu.travel_mode_set !== undefined && data.zmeny_stavu.travel_mode_set !== null) setTravelMode(data.zmeny_stavu.travel_mode_set);
          if (data.zmeny_stavu.travel_days_left_set !== undefined && data.zmeny_stavu.travel_days_left_set !== null) setTravelDaysLeft(data.zmeny_stavu.travel_days_left_set);
          if (data.zmeny_stavu.travel_destination_set !== undefined && data.zmeny_stavu.travel_destination_set !== null) setTravelDestination(data.zmeny_stavu.travel_destination_set);
        }
"""
content = content.replace(
    'if (data.v_boji !== undefined) setInCombat(data.v_boji);',
    'if (data.v_boji !== undefined) setInCombat(data.v_boji);\n' + send_action_logic
)

# 7. UI Update - Map / Region Header
# Find: <span className="text-[#d4af37] font-bold text-2xl uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,1)] font-medieval">{currentRegion}</span>
ui_replacement = """              {travelMode || travelDaysLeft > 0 ? (
                <div className="flex flex-col items-center">
                   <span className="text-white font-bold text-sm tracking-widest uppercase drop-shadow-md">Putování do:</span>
                   <span className="text-[#d4af37] font-bold text-2xl uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,1)] font-medieval">{travelDestination}</span>
                   <div className="mt-2 bg-[#1b262c] border border-[#d4af37] px-3 py-1 rounded-full flex gap-2 items-center shadow-lg">
                      <span className="text-white font-bold text-xs uppercase tracking-wider">Cesta:</span>
                      <span className="text-red-400 font-bold animate-pulse">{travelDaysLeft} dní</span>
                   </div>
                </div>
              ) : (
                <span className="text-[#d4af37] font-bold text-2xl uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,1)] font-medieval">{currentRegion}</span>
              )}"""
content = content.replace(
    '<span className="text-[#d4af37] font-bold text-2xl uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,1)] font-medieval">{currentRegion}</span>',
    ui_replacement
)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("Frontend updated for travel system.")
