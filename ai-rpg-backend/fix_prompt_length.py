import codecs

lines = codecs.open('main.py', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if '"locations": [' in l:
        lines[i] = '  "locations": [\n    // VYGENERUJ POUZE 5 NEJDULEZITEJSICH LOKACI Z POI LISTU!\n'
    elif '"key_npcs": [' in l:
        lines[i] = '  "key_npcs": [\n    // VYGENERUJ POUZE 5 KLICOVYCH NPC!\n'

with codecs.open('main.py', 'w', 'utf-8') as f:
    f.write("".join(lines))
