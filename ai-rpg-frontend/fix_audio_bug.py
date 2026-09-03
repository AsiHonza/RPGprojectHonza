import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if 'bgAudioRef.current.play().catch(e => console.log("Autoplay still blocked:", e));' in l:
        lines[i] = '          bgAudioRef.current.volume = bgVolume;\n          bgAudioRef.current.play().catch(e => console.log("Autoplay still blocked:", e));\n'
    if '.catch(e => console.error("Audio crossfade blocked", e));' in l:
        lines[i] = l.replace('.catch(e => console.error("Audio crossfade blocked", e));', '.catch(e => { console.error("Audio crossfade blocked", e); audio.volume = bgVolume; });')

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
