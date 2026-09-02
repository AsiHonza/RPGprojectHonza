import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

# 1. Update WorldLocation model
new_world_location = """class WorldLocation(BaseModel):
    id: str = Field(description="Unikátní ID bez diakritiky, např. 'mesto_vranov'")
    typ: str = Field(description="'hlavni_mesto', 'mesto', 'vesnice', 'zajimavost'")
    nazev: str
    popis: str = Field(description="Veřejně známý popis místa.")
    tajemstvi_nebo_problem: str = Field(description="Skrytý problém, konflikt nebo tajemství lokace. (Hráč ho nezná!)")
    x: int = Field(description="X souřadnice na mapě (0-100)")
    y: int = Field(description="Y souřadnice na mapě (0-100)")

class CampaignNPC(BaseModel):
    jmeno: str
    lokace_id: str = Field(description="ID lokace, kde se nachází.")
    popis: str
    skryty_motiv: str = Field(description="Skutečná motivace nebo tajemství postavy. (Hráč ho nezná!)")
"""

content = content.replace(
    'class WorldLocation(BaseModel):\n    id: str = Field(description="Unikátní ID bez diakritiky, např. \'mesto_vranov\'")\n    typ: str = Field(description="\'hlavni_mesto\', \'mesto\', \'vesnice\', \'zajimavost\'")\n    nazev: str\n    popis: str\n    x: int = Field(description="X souřadnice na mapě (0-100)")\n    y: int = Field(description="Y souřadnice na mapě (0-100)")',
    new_world_location
)

# 2. Update CampaignWorld to use CampaignNPC instead of NPCRecord (because NPCRecord is for the frontend log and requires 'vztah')
content = content.replace(
    'key_npcs: List[NPCRecord] = Field(description="3-5 důležitých klíčových postav pro zápletku kampaně.")',
    'key_npcs: List[CampaignNPC] = Field(description="3-5 klíčových NPC (vůdci, padouši, zadavatelé úkolů) spjatých s kampaní.")'
)

# 3. Update the DM prompt injection to enforce secrecy
old_injection = r"""world_prompt_str = f"\n[TOTO JE ŘÍZENÝ SANDBOX! Hráč se může pohybovat POUZE v rámci těchto lokací!]\nHlavní zápletka: {world_data.get('main_plot', '')}\nMapa lokací: {json.dumps(world_data.get('locations', []), ensure_ascii=False)}\n" """

new_injection = r"""world_prompt_str = f"\n[TOTO JE ŘÍZENÝ SANDBOX! Svět je pevně dán:]\nZápletka: {world_data.get('main_plot', '')}\nLokace: {json.dumps(world_data.get('locations', []), ensure_ascii=False)}\nKlíčová NPC: {json.dumps(world_data.get('key_npcs', []), ensure_ascii=False)}\n\n[KRITICKÉ PRAVIDLO PRO TAJEMSTVÍ]: Všechna 'tajemstvi_nebo_problem' a 'skryty_motiv' jsou před hráčem PŘÍSNĚ SKRYTÁ. Nesmíš je hráči vyžvanit v úvodním popisu lokace! Hráč na ně musí přijít sám pomocí průzkumu, dedukce nebo dialogů s NPC.\n" """

content = content.replace(
    old_injection.strip(),
    new_injection.strip()
)

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)

print("World gen enhanced with secrets.")
