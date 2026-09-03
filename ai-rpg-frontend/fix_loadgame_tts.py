import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if 'let lastDesc = "";' in l:
        lines[i] = '          let lastAudioQueue: {text: string, type: "narrator"|"npc_muz"|"npc_zena"}[] = [];\n'
    if 'if (dm_data.popis_okoli) lastDesc = dm_data.popis_okoli;' in l:
        lines.insert(i+1, '                lastAudioQueue = [];\n                if (dm_data.vypravec) lastAudioQueue.push({text: dm_data.vypravec, type: "narrator"});\n                if (dm_data.npc_dialogy) dm_data.npc_dialogy.forEach((n: any) => { if (n.text) lastAudioQueue.push({text: n.text, type: n.pohlavi === "muz" ? "npc_muz" : "npc_zena"}) });\n')
    if 'if (lastDesc) {' in l and 'playAudioSequentially([{text: lastDesc, type: "narrator"}]);' in lines[i+1]:
        lines[i] = '          if (lastAudioQueue.length > 0) {\n'
        lines[i+1] = '            playAudioSequentially(lastAudioQueue);\n'

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
