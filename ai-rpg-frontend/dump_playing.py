import codecs
with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    lines = f.readlines()

in_playing = False
for i, line in enumerate(lines):
    if 'gameState === "playing"' in line:
        in_playing = True
        print("START PLAYING BLOCK", i)
    if in_playing:
        print(line, end="")
    if in_playing and i > 400: # limit to avoid dumping too much
        break
