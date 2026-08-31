import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if "popis_okoli" in line and "image_prompt" in line:
        new_lines.append('- Do \'image_prompt\' detailně popište aktuální scénu (bez textu). VŽDY NA KONEC PŘIDEJTE TENTO STYL: "style of detailed 2D painterly fantasy concept art, bright vibrant colors, majestic epic scale, cozy atmosphere, studio ghibli meets classic D&D illustrations". Do \'popis_okoli\' stručně popište situaci.\n')
    elif "black and white ink drawing portrait" in line:
        line = line.replace("black and white ink drawing portrait", "detailed 2D painterly fantasy portrait, vibrant colors")
        new_lines.append(line)
    else:
        new_lines.append(line)

with codecs.open("main.py", "w", "utf-8") as f:
    f.writelines(new_lines)
print("Prompt completely fixed!")
