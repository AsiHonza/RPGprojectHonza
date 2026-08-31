import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if line.startswith("- Do 'image_prompt'"):
        new_lines.append('        {"role": "model", "text": """{"aktualni_region": "Pocatecni vesnice", "popis_okoli": "Stojíš na začátku své cesty.", "vypravec": "Vítej ve světě dobrodružství!", "nabizene_akce": ["Rozhlédnout se", "Jít do hospody", "Odejít z vesnice"]}"""}\n')
    else:
        new_lines.append(line)

with codecs.open("main.py", "w", "utf-8") as f:
    f.writelines(new_lines)
print("Syntax fixed!")
