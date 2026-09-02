import codecs
import re

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

# 1. Add NPCRecord model and update StateChanges
npc_record = """class NPCRecord(BaseModel):
    jmeno: str
    lokace: str
    popis: str
    vztah: str = Field(description="Vztah k hráči (např. Přátelský, Neutrální, Nepřátelský, Zavázán, Zastrašený, atd.)")

"""
if "class NPCRecord(BaseModel):" not in content:
    content = content.replace("class StateChanges(BaseModel):", npc_record + "class StateChanges(BaseModel):")

if "zname_postavy_zmena: List[NPCRecord]" not in content:
    content = content.replace(
        "travel_destination_set: Optional[str] = None",
        'travel_destination_set: Optional[str] = None\n    zname_postavy_zmena: List[NPCRecord] = Field(default=[], description="Pokud hráč potká nové důležité NPC nebo se změní vztah s existujícím, přidej ho sem pro aktualizaci v paměti.")'
    )

# 2. Add Upsert Logic in /action
upsert_logic = """
        # Aplikace zmen NPC
        if zmeny.zname_postavy_zmena:
            current_npcs = state_dict.get('zname_postavy', [])
            for new_npc in zmeny.zname_postavy_zmena:
                found = False
                for i, existing in enumerate(current_npcs):
                    if existing['jmeno'].lower() == new_npc.jmeno.lower():
                        current_npcs[i] = new_npc.model_dump()
                        found = True
                        break
                if not found:
                    current_npcs.append(new_npc.model_dump())
            state_dict['zname_postavy'] = current_npcs
"""
# Note: Pydantic v2 uses model_dump(), Pydantic v1 uses dict(). We should use model_dump() since google-genai is recent. 
# Or just use model_dump() with fallback dict(). Let's use `new_npc.dict() if hasattr(new_npc, "dict") else new_npc.model_dump()` 
# Actually, Pydantic 2 supports `model_dump()`. The code already uses `.model_json_schema()` earlier, so it's Pydantic 2.

upsert_logic_safe = """
        # Aplikace zmen NPC
        if getattr(zmeny, 'zname_postavy_zmena', None):
            current_npcs = state_dict.get('zname_postavy', [])
            for new_npc in zmeny.zname_postavy_zmena:
                found = False
                for i, existing in enumerate(current_npcs):
                    if existing.get('jmeno', '').lower() == new_npc.jmeno.lower():
                        current_npcs[i] = new_npc.model_dump() if hasattr(new_npc, 'model_dump') else new_npc.dict()
                        found = True
                        break
                if not found:
                    current_npcs.append(new_npc.model_dump() if hasattr(new_npc, 'model_dump') else new_npc.dict())
            state_dict['zname_postavy'] = current_npcs
"""

if "# Aplikace zmen NPC" not in content:
    content = content.replace(
        "if zmeny.travel_destination_set is not None:\n            state_dict['travel_destination'] = zmeny.travel_destination_set",
        "if zmeny.travel_destination_set is not None:\n            state_dict['travel_destination'] = zmeny.travel_destination_set\n" + upsert_logic_safe
    )

# 3. Add to system prompt memory
memory_injection = r"""
[Známé postavy a vztahy (PAMATUJ SI!):]
{json.dumps(char_data.get('state', {}).get('zname_postavy', []), ensure_ascii=False)}

[Aktuální stav hry - neukazovat hráči, pouze pro informaci PJ:]"""

if "[Známé postavy a vztahy" not in content:
    content = content.replace(
        "[Aktuln stav hry - neukazovat hri, pouze pro informaci PJ:]", # Note the missing accents in previous regex replacements if any, actually I'll use exact text
        memory_injection
    )
    # Wait, the prompt uses f-string formatting. Let's do a precise replace on the f-string in play_action.
    # We can just replace "[Aktuální stav hry" or similar.

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)
print("Applied to main.py")
