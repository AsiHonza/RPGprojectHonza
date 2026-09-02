import codecs

with codecs.open('src/features/character/StatsModal.tsx', 'r', 'utf-8') as f:
    content = f.read()
    
# Change closing divs
# Since we know the last two </div> are the ones that close the wrappers:
lines = content.split('\n')
divs_replaced = 0
for i in range(len(lines)-1, -1, -1):
    if "</div>" in lines[i]:
        lines[i] = lines[i].replace("</div>", "</motion.div>")
        divs_replaced += 1
        if divs_replaced == 2:
            break
            
with codecs.open('src/features/character/StatsModal.tsx', 'w', 'utf-8') as f:
    f.write('\n'.join(lines))
