import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()
out_lines = []
skip = False

for l in lines:
    if "hlava\": null" in l or "hruď\": null" in l or "hlavní ruka\": null" in l or "druhá ruka\": null" in l or "prsten\": null" in l or "krk\": null" in l or l.strip() == "});" and skip:
        skip = True
        continue
    out_lines.append(l)

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(out_lines))
    
print("Syntax fixed")
