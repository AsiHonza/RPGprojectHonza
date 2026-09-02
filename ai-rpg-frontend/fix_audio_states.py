import codecs
import re

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

new_lines = []
for l in lines:
    if "const [bgVolume, setBgVolume] = useState" in l:
        continue
    if "const [currentTrack, setCurrentTrack] = useState" in l:
        continue
    if "const [ttsVolume, setTtsVolume] = useState" in l:
        continue
    if "const [musicPlaying, setMusicPlaying] = useState" in l:
        continue
        
    if "const { gameState, setGameState" in l:
        l = l.replace("const { gameState", "const { bgVolume, setBgVolume, currentTrack, setCurrentTrack, ttsVolume, setTtsVolume, musicPlaying, setMusicPlaying, gameState")
        
    new_lines.append(l)

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(new_lines))
