import codecs
import re

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

# 1. Add PointOfInterest class
poi_class = """class PointOfInterest(BaseModel):
    nazev: str = Field(description="Název místa (např. 'U Zlomeného štítu', 'Kovářství')")
    ikona: str = Field(description="Typ ikony: 'hospoda', 'kovarna', 'chram', 'obchod', 'radnice', 'ostatni'")
    ma_ukol: bool = Field(description="True, pokud zde pro hráče existuje potenciální úkol nebo zajímavá událost.")

"""
# insert before class DMResponse
content = content.replace("class DMResponse(BaseModel):", poi_class + "class DMResponse(BaseModel):")

# 2. Update vyznamna_mista in DMResponse
old_vyznamna_mista = 'vyznamna_mista: List[str] = Field(default=[], description="Seznam zajímavých míst/služeb dostupných v této lokaci (např. [\'Kovárna\', \'Hospoda\']). V divočině většinou prázdné.")'
new_vyznamna_mista = 'vyznamna_mista: List[PointOfInterest] = Field(default=[], description="Seznam zajímavých míst ve městě. V divočině nech prázdné.")'

# Since diacritics might cause regex issues, let's just find the line starting with "    vyznamna_mista: List"
content = re.sub(r'    vyznamna_mista: List\[str\].*?\n', '    ' + new_vyznamna_mista + '\n', content)

# 3. Update StateChanges
old_zmeny_stavu_xp = 'xp_zmena: int = Field(0, description="Počet získaných zkušeností (XP). Uděluj XP za zabití, řešení problémů nebo splnění úkolů.")'
new_zmeny_stavu_xp = old_zmeny_stavu_xp + '\n    davky_jidla_zmena: int = Field(0, description="Odečti -1 za každý den/tah cestování. Může být kladné při nákupu jídla.")'
content = content.replace(old_zmeny_stavu_xp, new_zmeny_stavu_xp)

# 4. Update initial character state with rations: 3
old_state_init = '"hp": 100,'
new_state_init = '"hp": 100,\n                "rations": 3,'
content = content.replace(old_state_init, new_state_init)

# 5. Update System Prompt rules
old_vymamna_mista_rule = '- **Významná místa (POI):** Pokud je hráč v `mesto` (nebo v rozsáhlé bezpečné základně), vyplň pole `vyznamna_mista` jmény služeb či důležitých budov, které hráč může vidět/navštívit (např. [\'Kovárna mistra Broma\', \'Hospoda\', \'Tržiště\']). V lese nebo pustině logicky nesmí být žádné hospodské!'
new_vyznamna_mista_rule = """- **Významná místa (Město a UI):** Pokud je hráč v `mesto`, MUSÍŠ vyplnit pole `vyznamna_mista` objekty (název, ikona, ma_ukol). Nastav `ma_ukol=True`, pokud se tam dá vzít quest (v UI se objeví vykřičník). V lese/pustině pole nech prázdné!
- **CESTOVÁNÍ A JÍDLO (Survival):** Když se hráč rozhodne cestovat (opustit město a jít jinam), PŘEPNI `typ_lokace` na 'divocina'. Změň `davky_jidla_zmena` na -1 (cesta stojí jídlo). Pokud hráč jídlo nemá, dej mu penalizaci (-10 HP, napiš to do system_log). Cestou VŽDY vygeneruj náhodné setkání (bandité, bouře, obchodník) a nenech ho dorazit hned do cíle!"""
# Regex replace
content = re.sub(r'- \*\*V.znamn. m.sta \(POI\):\*\*.*?\!', new_vyznamna_mista_rule, content, flags=re.DOTALL)

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)
print("Backend updated!")
