import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()
for i, l in enumerate(lines):
    if 'if (dm_data.npc_dialogy) {' in l:
        lines[i] = '                if (dm_data.npc_dialogy && Array.isArray(dm_data.npc_dialogy)) {\n'

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
