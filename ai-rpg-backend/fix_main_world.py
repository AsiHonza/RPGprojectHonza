import codecs

lines = codecs.open('main.py', 'r', 'utf-8').readlines()

start = -1
for i, l in enumerate(lines):
    if 'world_prompt = f"""' in l:
        start = i
        break

end = -1
for i in range(start, len(lines)):
    if 'model=\'gemini-3.5-flash\',' in lines[i]:
        end = i - 2
        break

new_prompt = '''            world_prompt = f"""
NAVRHUJÍŠ WORLD BIBLE PRO HIGH FANTASY KÁMPAŇ (AELTHGARD).

ABSOLUTNÍ PRAVIDLA SVĚTA:
1. Tón: Mix Fable a Zaklínače (Pohádkový vizuál, ale dospělé, krvavé a zkorumpované problémy).
2. Magie: Nedá se učit. Je to "Probuzení", vzácný dar nebo kletba od bohů. Jsou to "Vyvolení".
3. Zjevení: Bohové (Solarian - Řád a Krev, Vyldia - Příroda a Chaos, Kull - Stíny a Lži) se začínají zjevovat lidem.
4. Království: Kontinent je rozdělen na 7 království. 

Zde jsou základní archetypy 7 království (kingdom_id 1 až 7):
1K: Upadající Impérium (Zkorumpovaná šlechta)
2K: Teokracie (Náboženští fanatici Řádu)
3K: Divoké Kmeny (Přeživší v bažinách/lesích, krevní rituály)
4K: Obchodní Gildy (Žoldáci a peníze, žádný král)
5K: Karanténní Zóna (Magická pustina, monstra)
6K: Severní Hradba (Militarizovaná stráž před zlem)
7K: Útočiště Vyvolených (Tajemní mágové a izolace)

Tady je JSON se všemi body zájmu (POI) na vygenerované mapě:
{json.dumps(math_world['pois'], ensure_ascii=False)}

Tvým úkolem je vrátit POUZE validní JSON s následující strukturou:
{{
  "main_plot": "Krátký popis epické zápletky (proroctví).",
  "kingdoms": [
    {{
      "kingdom_id": 1,
      "name": "Epické Jméno Království 1",
      "ruler": "Kdo tam vládne",
      "current_problem": "Stručný problém (např. mor, fanatismus)"
    }},
    ... pro všech 7 království
  ],
  "locations": [
    {{
      "q": (musí sedět z dodaného JSONu),
      "r": (musí sedět z dodaného JSONu),
      "type": "Capital/Village/Dungeon/Shrine/Ruin",
      "kingdom_id": (přepsat ze zadání),
      "nazev": "Jméno lokace",
      "popis": "Krátký atmosférický popis (zapoj i bohy nebo archetyp království)"
    }},
    ... doplň VŠECHNY dodané POI
  ]
}}
"""
'''

new_lines = lines[:start] + [new_prompt] + lines[end+1:]

with codecs.open('main.py', 'w', 'utf-8') as f:
    f.write("".join(new_lines))

print("World prompt updated in main.py")
