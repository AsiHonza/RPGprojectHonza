import codecs
import re

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# 1. Add currentTrack state
if "const [currentTrack, setCurrentTrack]" not in content:
    content = content.replace(
        'const [bgVolume, setBgVolume] = useState(0.2);',
        'const [bgVolume, setBgVolume] = useState(0.2);\n  const [currentTrack, setCurrentTrack] = useState("/ambient.mp3");'
    )

# 2. Add Dynamic Music Crossfade useEffect
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
      const fadeOut = setInterval(() => {
        if (audio.volume > 0.05) {
          audio.volume -= 0.05;
        } else {
          clearInterval(fadeOut);
          audio.pause();
          setCurrentTrack(newTrack);
          
          // Wait for React to render new src, then play and fade IN
          setTimeout(() => {
            audio.volume = 0;
            audio.play().then(() => {
              const fadeIn = setInterval(() => {
                if (audio.volume < bgVolume - 0.05) {
                  audio.volume += 0.05;
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
    content = content.replace(
        '// Audio control effect\n  useEffect(() => {',
        crossfade_effect + '\n  // Audio control effect\n  useEffect(() => {'
    )

# 3. Change audio element src to use currentTrack state
# Also add an onError handler to fallback to /ambient.mp3 if they haven't uploaded the music/ folder yet
audio_replacement = '<audio ref={bgAudioRef} src={currentTrack} loop onError={() => { if (currentTrack !== "/ambient.mp3") setCurrentTrack("/ambient.mp3"); }} />'
content = re.sub(r'<audio ref=\{bgAudioRef\} src=".*?" loop \/>', audio_replacement, content)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)

print("Dynamic music added!")
