import codecs
import re

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# 1. Change default state to true
content = content.replace(
    'const [musicPlaying, setMusicPlaying] = useState(false);',
    'const [musicPlaying, setMusicPlaying] = useState(true);'
)

# 2. Add global interaction listener to bypass Autoplay Policy
interaction_effect = """
  // Global interaction listener for Autoplay Policy
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (musicPlaying && bgAudioRef.current && bgAudioRef.current.paused) {
        bgAudioRef.current.play().catch(e => console.log("Autoplay still blocked:", e));
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [musicPlaying]);
"""

if "Global interaction listener" not in content:
    content = content.replace(
        '// Dynamic Music switching',
        interaction_effect + '\n  // Dynamic Music switching'
    )

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)

print("Autoplay bypass added!")
