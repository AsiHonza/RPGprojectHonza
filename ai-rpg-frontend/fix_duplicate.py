import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    lines = f.readlines()

out = []
skip = False
for i, line in enumerate(lines):
    if "            {/* AI Backstory Generator */}" in line:
        out.append(line)
        # Skip the next 15 lines if they are the duplicated Režim hry
        if "Režim hry" in "".join(lines[i:i+20]) or "Reim hry" in "".join(lines[i:i+20]):
            skip = True
            skip_count = 15
        continue
    
    if skip:
        skip_count -= 1
        if skip_count <= 0:
            skip = False
        continue
        
    out.append(line)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.writelines(out)

print("Duplicate fixed.")
