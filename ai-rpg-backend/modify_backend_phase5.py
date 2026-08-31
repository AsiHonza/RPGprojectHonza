import codecs

with codecs.open('main.py', 'r', 'utf-8') as f:
    content = f.read()

# 1. Update StateChanges model
old_state = '''class StateChanges(BaseModel):
    zivoty_zmena: int = 0
    xp_zmena: int = Field(0, description="Počet získaných zkušeností (XP). Uděluj XP za zabití, řešení problémů nebo splnění úkolů.")
    inventar_pridat: List[Item] = []
    inventar_odebrat_id: List[str] = [] # IDs of items to remove
    ukoly: List[Ukol] = Field(default=[], description="Seznam nových nebo aktualizovaných úkolů v tomto tahu.")'''

new_state = '''class StateChanges(BaseModel):
    zivoty_zmena: int = 0
    xp_zmena: int = Field(0, description="Počet získaných zkušeností (XP). Uděluj XP za zabití, řešení problémů nebo splnění úkolů.")
    zlato_zmena: int = Field(0, description="Změna počtu zlaťáků (gp). Např. -5 při nákupu za 5 gp, nebo +10 při nalezení pokladu.")
    spell_slots_zmena: int = Field(0, description="Změna počtu pozic kouzel (Spell Slots). Seslání jakéhokoliv silného kouzla (vše kromě cantripů) stojí vždy -1 slot.")
    inventar_pridat: List[Item] = []
    inventar_odebrat_id: List[str] = [] # IDs of items to remove
    ukoly: List[Ukol] = Field(default=[], description="Seznam nových nebo aktualizovaných úkolů v tomto tahu.")'''

content = content.replace(old_state, new_state)

# 2. Update System Prompt rules
old_rules_end = '''- Vyznamná místa (POI): Pokud je hráč v `mesto` (nebo v rozsáhlé bezpečné základně), vyplň pole `vyznamna_mista` jmény služeb či důležitých budov, které hráč může vidět/navštívit (např. ['Kovárna mistra Broma', 'Hospoda', 'Tržiště']). V lese nebo pustině logicky nesmí být žádné hospodské!'''

new_rules_addition = '''- Vyznamná místa (POI): Pokud je hráč v `mesto` (nebo v rozsáhlé bezpečné základně), vyplň pole `vyznamna_mista` jmény služeb či důležitých budov, které hráč může vidět/navštívit (např. ['Kovárna mistra Broma', 'Hospoda', 'Tržiště']). V lese nebo pustině logicky nesmí být žádné hospodské!

MAGIE A SPELL SLOTY:
- Pokud hraje magické povolání (Mág, Černokněžník, Klerik) a sesílá kouzlo, zkontroluj, zda to není jen drobný trik (Cantrip). Pokud je to skutečné kouzlo (Magic Missile, Fireball, Cure Wounds atd.), MUSÍŠ mu odečíst 1 Spell Slot pomocí `spell_slots_zmena: -1`. Pokud hráč zkouší kouzlit a nemá sloty, kouzlo selže.

EKONOMIKA A OBCHOD:
- Při obchodování musíš poctivě sledovat cenu. Vždy zapiš do `zlato_zmena` odpovídající částku. Pokud hráč kupuje zbraň za 10 gp, `zlato_zmena: -10`.

TÁBOŘENÍ A ODPOČINEK:
- Pokud hráč oznámí, že si chce "Dát Dlouhý odpočinek" (Long Rest), popiš ubíhání noci, vyhodnoť případné noční přepadení a pokud noc přečká, do `zivoty_zmena` mu doplň HP do plných a do `spell_slots_zmena` zapiš kladné číslo, které mu obnoví chybějící sloty.
- Krátký odpočinek (Short Rest) obnoví jen část životů a posune čas o hodinu.'''

content = content.replace(old_rules_end, new_rules_addition)

with codecs.open('main.py', 'w', 'utf-8') as f:
    f.write(content)
print("Backend state and rules updated!")
