import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

safe_zones_rule = """BEZPEČNÁ MÍSTA A ODPOČINEK (Safe Zones):
- Pokud hráč tráví čas v hostinci, spí ve městě, nebo provádí rutinní činnosti v bezpečném prostředí (nákupy, odpočinek), NEGENERUJ náhodné útoky ani pasti. Nech ho v klidu zotavit, prozkoumat město nebo si popovídat s NPC. Pasti a přepadení patří do divočiny a dungeonů!

VNITŘNÍ MYŠLENKY A KONTROLY (OOC):
- Pokud text akce hráče začíná na [OOC/MYŠLENKA], znamená to, že si hráč pouze interně rekapituluje stav nebo o něčem přemýšlí. V takovém případě ZASTAV ČAS. Neposouvej děj, nevyvolávej žádné události ani reakce okolí. Zůstaň ve stávající scéně a pouze stručně popiš výsledek jeho úvahy či kontroly."""

if "BEZPEČNÁ MÍSTA A ODPOČINEK" not in content:
    content = content.replace(
        "VYPRÁVĚNÍ, MÍSTA A PUTOVÁNÍ (LOKACE):",
        safe_zones_rule + "\n\nVYPRÁVĚNÍ, MÍSTA A PUTOVÁNÍ (LOKACE):"
    )

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)

print("Prompt updated with safe zones and OOC.")
