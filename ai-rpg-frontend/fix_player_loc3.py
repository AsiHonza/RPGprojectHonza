import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()
for i, l in enumerate(lines):
    if 'setPlayerLocation(data.state.playerLocation);' in l:
        lines[i] = '        setPlayerLocation(data.state.playerLocation || data.state.player_location);\n'
        break

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
