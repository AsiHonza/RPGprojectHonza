import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    lines = f.readlines()

new_lines = []
in_initial_history = False
for line in lines:
    if "initial_history = [" in line:
        in_initial_history = True
    if "]" in line and in_initial_history:
        in_initial_history = False
        
    if "- Do 'image_prompt' detail" in line and in_initial_history:
        new_lines.append('        {"role": "model", "text": """{"aktualni_region": "Pocatecni vesnice", "popis_okoli": "Stojíš na začátku své cesty.", "vypravec": "Vítej ve světě dobrodružství!", "nabizene_akce": ["Rozhlédnout se", "Jít do hospody", "Odejít z vesnice"]}"""}\n')
    else:
        new_lines.append(line)

with codecs.open("main.py", "w", "utf-8") as f:
    f.writelines(new_lines)
