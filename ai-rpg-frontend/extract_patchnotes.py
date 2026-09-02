import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()
start = -1
end = -1

for i, l in enumerate(lines):
    if "const PATCH_NOTES =" in l:
        start = i
    if start != -1 and "];" in l and i > start:
        end = i + 1
        break

if start != -1 and end != -1:
    patchnotes_comp = "export " + "".join(lines[start:end])
    with codecs.open('src/data/patchNotes.ts', 'w', 'utf-8') as f:
        f.write(patchnotes_comp)
    
    new_lines = lines[:start] + lines[end:]
    for i, l in enumerate(new_lines):
        if "import { StoryLog }" in l:
            new_lines.insert(i+1, "import { PATCH_NOTES } from '../data/patchNotes';\n")
            break
            
    with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
        f.write("".join(new_lines))
    print("Patch notes extracted to src/data/patchNotes.ts")
