import codecs
import json

lines = codecs.open('ai-rpg-backend/main.py', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if 'initial_history = [' in l and '{"role": "model"' in lines[i+1]:
        lines[i+1] = '        {"role": "model", "text": json.dumps({"aktualni_region": "Začátek cesty", "popis_okoli": popis_okoli, "vypravec": intro_text, "nabizene_akce": ["Rozhlédnout se", "Zkontrolovat vybavení", "Vydat se vpřed"]}, ensure_ascii=False)}\n'

with codecs.open('ai-rpg-backend/main.py', 'w', 'utf-8') as f:
    f.write("".join(lines))
