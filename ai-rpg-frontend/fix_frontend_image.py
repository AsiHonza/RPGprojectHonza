import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# Add states
target_states = """    const [pointsOfInterest, setPointsOfInterest] = useState<{nazev: string, ikona: string, ma_ukol: boolean}[]>([]);"""
replacement_states = """    const [pointsOfInterest, setPointsOfInterest] = useState<{nazev: string, ikona: string, ma_ukol: boolean}[]>([]);
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const [currentImageError, setCurrentImageError] = useState<string | null>(null);"""
content = content.replace(target_states, replacement_states)

# Update autosave dependencies
content = content.replace(
    ", stats, gold, currentSpellSlots, maxSpellSlots, rations]);",
    ", stats, gold, currentSpellSlots, maxSpellSlots, rations, currentImage, currentImageError]);"
)

# Update state extraction in load-game and action
target_load = """          if (state.currentRegion) setCurrentRegion(state.currentRegion);
          if (state.pointsOfInterest) setPointsOfInterest(state.pointsOfInterest);"""
replacement_load = """          if (state.currentRegion) setCurrentRegion(state.currentRegion);
          if (state.pointsOfInterest) setPointsOfInterest(state.pointsOfInterest);
          if (state.currentImage) setCurrentImage(state.currentImage);
          if (state.currentImageError) setCurrentImageError(state.currentImageError);"""
content = content.replace(target_load, replacement_load)

target_data = """          if (data.aktualni_region) setCurrentRegion(data.aktualni_region);
          if (data.vyznamna_mista) setPointsOfInterest(data.vyznamna_mista);"""
replacement_data = """          if (data.aktualni_region) setCurrentRegion(data.aktualni_region);
          if (data.vyznamna_mista) setPointsOfInterest(data.vyznamna_mista);
          if (data.image_base64) setCurrentImage(data.image_base64);
          if (data.image_error) setCurrentImageError(data.image_error);
          else if (data.image_base64) setCurrentImageError(null);"""
content = content.replace(target_data, replacement_data)

# Update save-state payload
target_save = """            locationType, currentRegion, pointsOfInterest, stats, rations"""
replacement_save = """            locationType, currentRegion, pointsOfInterest, stats, rations, currentImage, currentImageError"""
content = content.replace(target_save, replacement_save)

# Update the UI
target_ui = """            <h2 className="absolute top-4 text-[#d4af37] font-bold text-xl uppercase tracking-widest text-center">{currentRegion}</h2>
            <span className="text-[#455a64] font-serif italic">Neznámé končiny</span>"""
replacement_ui = """            <h2 className="absolute top-4 text-[#d4af37] font-bold text-xl uppercase tracking-widest text-center z-10 drop-shadow-md">{currentRegion}</h2>
            {currentImage ? (
              <img src={`data:image/jpeg;base64,${currentImage}`} className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-luminosity" />
            ) : currentImageError ? (
              <div className="absolute inset-0 bg-black flex items-center justify-center p-4 text-center">
                <span className="text-[#b74b4b] font-serif text-sm">{currentImageError}</span>
              </div>
            ) : (
              <span className="text-[#455a64] font-serif italic">Neznámé končiny</span>
            )}"""
content = content.replace(target_ui, replacement_ui)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("Frontend image logic added!")
