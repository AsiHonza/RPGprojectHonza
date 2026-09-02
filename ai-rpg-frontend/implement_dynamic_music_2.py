import codecs
import re

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

crossfade_effect = """
  // Dynamic Music switching
  useEffect(() => {
    if (!musicPlaying || !bgAudioRef.current) return;
    
    let newTrack = "/ambient.mp3";
    if (inCombat) {
      newTrack = "/music/combat.mp3";
    } else {
      if (locationType === "mesto") newTrack = "/music/mesto.mp3";
      else if (locationType === "podzemi") newTrack = "/music/podzemi.mp3";
      else if (locationType === "divocina") newTrack = "/music/divocina.mp3";
    }

    if (newTrack !== currentTrack) {
      const audio = bgAudioRef.current;
      
      // Crossfade OUT
      let outVol = audio.volume;
      const fadeOut = setInterval(() => {
        if (outVol > 0.05) {
          outVol -= 0.05;
          audio.volume = Math.max(0, outVol);
        } else {
          clearInterval(fadeOut);
          audio.pause();
          setCurrentTrack(newTrack);
          
          // Wait for React to render new src, then play and fade IN
          setTimeout(() => {
            audio.volume = 0;
            audio.play().then(() => {
              let inVol = 0;
              const fadeIn = setInterval(() => {
                if (inVol < bgVolume - 0.05) {
                  inVol += 0.05;
                  audio.volume = Math.min(bgVolume, inVol);
                } else {
                  audio.volume = bgVolume;
                  clearInterval(fadeIn);
                }
              }, 150);
            }).catch(e => console.error("Audio crossfade blocked", e));
          }, 100);
        }
      }, 150);
    }
  }, [locationType, inCombat, musicPlaying]);
"""

if "// Dynamic Music switching" not in content:
    content = re.sub(r'(\s*\/\/\s*Audio control effect\s*useEffect\(\(\) => \{)', crossfade_effect + r'\1', content)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)

print("Dynamic music useEffect added!")
