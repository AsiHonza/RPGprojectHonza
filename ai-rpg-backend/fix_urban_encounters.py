import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

old_rule = """BEZPEČNÁ MÍSTA A ODPOČINEK (Safe Zones):
- Pokud hráč tráví čas v hostinci, spí ve městě, nebo provádí rutinní činnosti v bezpečném prostředí (nákupy, odpočinek), NEGENERUJ náhodné útoky ani pasti. Nech ho v klidu zotavit, prozkoumat město nebo si popovídat s NPC. Pasti a přepadení patří do divočiny a dungeonů!"""

new_rule = """MĚSTA A BEZPEČNÁ MÍSTA (Urban Encounters & Safe Zones):
- Při spánku v hostinci nebo odpočinku NEGNERUJ pasti ani bojová přepadení (žádné nečekané pavučiny při spánku!). Nech hráče v klidu zotavit.
- Náhodná setkání VE MĚSTĚ by měla být zajímavá, ale NEBOJOVÁ: např. žebrák s tajnou mapou, kapsář (test obratnosti), hádka dvou kupců, nebo NPC, které nabídne vedlejší quest.
- Smrtící pasti, monstra a bojová přepadení patří VÝHRADNĚ do divočiny a dungeonů!"""

if old_rule in content:
    content = content.replace(old_rule, new_rule)

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)

print("Updated rule for urban encounters.")
