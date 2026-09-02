import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

new_lines = []
for l in lines:
    if "const { gameState, setGameState" in l:
        l = l.replace("const { gameState, setGameState", "const { bgVolume, setBgVolume, currentTrack, setCurrentTrack, ttsVolume, setTtsVolume, musicPlaying, setMusicPlaying, unreadQuests, setUnreadQuests, gameState, setGameState")
        
    new_lines.append(l)

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(new_lines))
