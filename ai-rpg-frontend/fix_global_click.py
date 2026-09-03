import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

hook = """
  useEffect(() => {
    const playAudio = () => {
      if (musicPlaying && bgAudioRef.current && bgAudioRef.current.paused) {
        bgAudioRef.current.play().catch(() => {});
      }
    };
    document.addEventListener('click', playAudio);
    return () => document.removeEventListener('click', playAudio);
  }, [musicPlaying]);
"""

for i, l in enumerate(lines):
    if 'useEffect(() => {' in l:
        lines.insert(i, hook)
        break

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
