import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

new_lines = []
for l in lines:
    if "const [bgVolume, setBgVolume] = useState" in l: continue
    if "const [currentTrack, setCurrentTrack] = useState" in l: continue
    if "const [ttsVolume, setTtsVolume] = useState" in l: continue
    if "const [musicPlaying, setMusicPlaying] = useState" in l: continue
    if "const [unreadQuests, setUnreadQuests] = useState" in l: continue
    
    if "const { name, level" in l:
        l = l.replace("const { name", "const { bgVolume, setBgVolume, currentTrack, setCurrentTrack, ttsVolume, setTtsVolume, musicPlaying, setMusicPlaying, unreadQuests, setUnreadQuests, name")
        
    new_lines.append(l)

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(new_lines))
