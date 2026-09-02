import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()
lines_orig = codecs.open('src/features/ui/PlayerHeader.tsx', 'r', 'utf-8').readlines()

# wait, I don't have the original lines anymore easily. 
# let me just add </div> at the end of the return statement in PlayerHeader.tsx!

for i, l in enumerate(lines_orig):
    if l.strip() == ");":
        lines_orig.insert(i, "      </div>\n")
        break

with codecs.open('src/features/ui/PlayerHeader.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines_orig))
