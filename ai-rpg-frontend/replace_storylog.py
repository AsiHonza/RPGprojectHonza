import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

# find bounds of helpers
typewriter_start = -1
syslog_end = -1
for i, l in enumerate(lines):
    if "const TypewriterText =" in l:
        typewriter_start = i
    if "export default function Home()" in l:
        syslog_end = i - 1
        break

# find bounds of history.map
hist_start = -1
hist_end = -1
for i, l in enumerate(lines):
    if "{history.map((msg, i) => (" in l:
        hist_start = i
    if hist_start != -1 and i > hist_start + 100 and "))}" in l and "          </div>" in lines[i+1]:
        hist_end = i
        break

new_lines = []

for i, l in enumerate(lines):
    if typewriter_start <= i <= syslog_end:
        continue
    
    if hist_start <= i <= hist_end:
        if i == hist_start:
            new_lines.append("            <StoryLog history={history} playAudio={playAudio} />\n")
        continue

    new_lines.append(l)

# Add imports
for i, l in enumerate(new_lines):
    if "import { CharacterStatsPanel }" in l:
        new_lines.insert(i+1, "import { StoryLog } from '../features/character/StoryLog';\n")
        break

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(new_lines))
    
print("StoryLog and helpers replaced")
