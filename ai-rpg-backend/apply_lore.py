import codecs

lore_text = """
ABSOLUTNÍ PRAVIDLA SVĚTA (AELTHGARD):
1. Tón: Mix Fable a Zaklínače. Vizuálně pohádkové a barevné (obří houby, krásné hrady), ale společensky dospělé, temné a zkorumpované (rasismus, hladomor, morální šeď, neexistuje čisté dobro).
2. Magie: Nedá se naučit, je to vzácné "Probuzení" (Dar i Kletba). Obyčejní lidé se mágů bojí nebo je uctívají jako proroky.
3. Zápletka: Blíží se proroctví "Tříštících se nebes". Bohové se začínají zjevovat náhodným obyčejným lidem (rolníkům i žebrákům).
4. Rozkol: Bohové nejsou sjednocení, naopak - jdou si po krku. Lidé fanaticky následují různá božstva a bratr zabíjí bratra. Hlavní síly: Solarian (Řád, který se mění ve fašistický fanatismus), Vyldia (Příroda a Chaos, svoboda vykoupená krvavými oběťmi), Kull (Bůh stínů našeptávající, ať se lidé stanou bohy).
DŮLEŽITÉ: Neprozrazuj toto lore hráči encyklopedicky. Aplikuj tuto atmosféru do jmen míst, hrozeb a tajemství!
"""

lines = codecs.open("main.py", "r", "utf-8").readlines()

# Najít world_prompt
for i, l in enumerate(lines):
    if "world_prompt = f\"\"\"" in l:
        lines.insert(i+1, lore_text)
        break

# Najít intro_prompt
for i, l in enumerate(lines):
    if "prompt = f\"\"\"" in l and "Jsi Pán jeskyně (Dungeon Master) ve světě Aethelgard" in lines[i+1]:
        lines.insert(i+2, lore_text)
        break

with codecs.open("main.py", "w", "utf-8") as f:
    f.write("".join(lines))
    
print("Lore aplikováno do main.py")
