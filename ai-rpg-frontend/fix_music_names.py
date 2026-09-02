import codecs
import re

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# Replace the track selection logic
old_logic = """    if (inCombat) {
      newTrack = "/music/combat.mp3";
    } else {
      if (locationType === "mesto") newTrack = "/music/mesto.mp3";
      else if (locationType === "podzemi") newTrack = "/music/podzemi.mp3";
      else if (locationType === "divocina") newTrack = "/music/divocina.mp3";
    }"""

new_logic = """    if (inCombat) {
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

content = content.replace(old_logic, new_logic)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)

print("Music filenames updated!")
