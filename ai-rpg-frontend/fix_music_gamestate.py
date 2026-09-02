import codecs
import re

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

old_logic = """  // Dynamic Music switching
  useEffect(() => {
    if (!musicPlaying || !bgAudioRef.current) return;
    
    let newTrack = "/ambient.mp3";
    if (inCombat) {
      newTrack = "/music/combat1.mp3";
    } else {
      if (locationType === "mesto") {
        const cityTracks = ["/music/city1.mp3", "/music/city2.mp3", "/music/tavern1.mp3", "/music/tavern2.mp3"];
        // Pick one based on some stable value to avoid changing on every re-render, 
        // or just pick city1.mp3 for now if we want to keep it simple. Let's just use city1.mp3
        newTrack = "/music/city1.mp3";
      }
      else if (locationType === "podzemi") newTrack = "/music/theme.mp3";
      else if (locationType === "divocina") newTrack = "/music/wilds1.mp3";
    }"""

new_logic = """  // Dynamic Music switching
  useEffect(() => {
    if (!musicPlaying || !bgAudioRef.current) return;
    
    let newTrack = "/ambient.mp3";
    
    if (gameState === "menu" || gameState === "creation") {
      newTrack = "/music/theme.mp3";
    } else {
      if (inCombat) {
        newTrack = "/music/combat1.mp3";
      } else {
        if (locationType === "mesto") newTrack = "/music/city1.mp3";
        else if (locationType === "podzemi") newTrack = "/ambient.mp3"; // Fallback pro jeskyně, dokud nepřidáš dungeon.mp3
        else if (locationType === "divocina") newTrack = "/music/wilds1.mp3";
      }
    }"""

content = content.replace(old_logic, new_logic)

# We also need to add `gameState` to the dependency array
content = content.replace('}, [locationType, inCombat, musicPlaying]);', '}, [locationType, inCombat, musicPlaying, gameState]);')

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)

print("Game state music logic added!")
