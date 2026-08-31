import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if '{"role": "model", "text": """{"aktualni_region"' in line:
        # Check surrounding lines to see if it's in the system prompt
        if "ZÁZNAMY PRO FRONTEND:" in "".join(lines):
            pass # We'll just replace it differently based on line index, but this is simpler:
        new_lines.append("- Do 'image_prompt' detailně popište aktuální scénu (bez textu). VŽDY NA KONEC PŘIDEJTE TENTO STYL: \"style of detailed 2D painterly fantasy concept art, bright vibrant colors, majestic epic scale, cozy atmosphere, studio ghibli meets classic D&D illustrations\". Do 'popis_okoli' stručně popište situaci.\n")
    else:
        new_lines.append(line)

with codecs.open("main.py", "w", "utf-8") as f:
    f.writelines(new_lines)
