import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()
for i, l in enumerate(lines):
    if "<HexMap" in l:
        # Find where HexMap ends
        for j in range(i, i+20):
            if "/>" in lines[j]:
                # Insert </div> right after this
                lines.insert(j+1, "                </div>\n")
                with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
                    f.write("".join(lines))
                print("Div inserted")
                exit(0)
