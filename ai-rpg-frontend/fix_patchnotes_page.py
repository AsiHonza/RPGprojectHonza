import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

start = -1
end = -1
for i, l in enumerate(lines):
    if '{patchNotesOpen && (' in l:
        start = i
        break
        
for i in range(start, len(lines)):
    if 'Kronika Zm' in lines[i]: # find the block
        pass
    if ')}' in lines[i] and '</div>' in lines[i-1] and '</div>' in lines[i-2]:
        end = i
        break

new_lines = lines[:start] + ["      <PatchNotesModal isOpen={patchNotesOpen} onClose={() => setPatchNotesOpen(false)} />\n"] + lines[end+1:]

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(new_lines))

