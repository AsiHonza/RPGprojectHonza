import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

# 1. Add game_mode to CharacterCreateRequest
req = """class CharacterCreateRequest(BaseModel):
    name: str
    dnd_class: str
    race: str
    stats: dict
    email: str
    game_mode: str = "sandbox"
"""
content = content.replace(
    'class CharacterCreateRequest(BaseModel):\n    name: str\n    dnd_class: str\n    race: str\n    stats: dict\n    email: str',
    req
)

# 2. Add CampaignWorld models
models = """class WorldLocation(BaseModel):
    id: str = Field(description="Unikátní ID bez diakritiky, např. 'mesto_vranov'")
    typ: str = Field(description="'hlavni_mesto', 'mesto', 'vesnice', 'zajimavost'")
    nazev: str
    popis: str
    x: int = Field(description="X souřadnice na mapě (0-100)")
    y: int = Field(description="Y souřadnice na mapě (0-100)")

class CampaignWorld(BaseModel):
    main_plot: str = Field(description="Hlavní epická zápletka kampaně.")
    locations: List[WorldLocation] = Field(description="1-2 hlavni_mesto, 3-4 mesto, 4-8 vesnice, 3-5 zajimavost (rozmístěné po celé mapě 0-100).")
    key_npcs: List[NPCRecord] = Field(description="3-5 důležitých klíčových postav pro zápletku kampaně.")

"""
content = content.replace("class CharacterCreateRequest(BaseModel):", models + "class CharacterCreateRequest(BaseModel):")

# 3. Update create_character logic
create_logic = """
    # Pokud hrac zvolil kampan, vygenerujeme svet
    world_data = None
    if req.game_mode == "campaign":
        try:
            import json
            client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
            world_prompt = f"Vytvoř temný a epický fantasy svět pro kampaň. Postava se jmenuje {req.name}, je to {req.race} {req.dnd_class}. Vymysli originální hlavní zápletku, unikátní mapu (seznam lokací s X a Y souřadnicemi 0-100) a klíčová NPC."
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=world_prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=CampaignWorld,
                    temperature=0.9
                )
            )
            world_data = json.loads(response.text)
        except Exception as e:
            print("World gen error:", e)
            world_data = None
            
    # Doplnění world_data do state
"""

# Let's find where state is initialized
original_state = """    state = {
        "hp": 100,
        "xp": 0,
        "level": 1,
        "inventory": gear,
        "equipped": {"hlavn ruka": zbran, "druh ruka": None, "hru": None},
        "stats": req.stats,
        "skills": profs,
        "skillPoints": 0,
        "inCombat": False,
        "enemies": [],
        "quests": [],
        "locationType": "mesto",
        "currentRegion": "Potezen msto",
        "pointsOfInterest": [],
        "currentSpellSlots": 0,
        "maxSpellSlots": 0,
        "rations": 10,
        "travel_mode": False,
        "travel_days_left": 0,
        "travel_destination": "",
        "zname_postavy": []
    }"""
# Note: missing chars due to unicode stripping in my previous shell regex replacements, I'll use regex to inject.

import re
content = re.sub(
    r'(    state = \{.*?"zname_postavy": \[\]\n    \})',
    create_logic + r'\1',
    content,
    flags=re.DOTALL
)

# Insert world_data into state dict
content = re.sub(
    r'("zname_postavy": \[\]\n    \})',
    r'"zname_postavy": [],\n        "world_data": world_data\n    }',
    content
)

# 4. Inject world_data into the system prompt in /action
world_injection = """
          world_data = state_dict.get('world_data')
          world_prompt_str = ""
          if world_data:
              world_prompt_str = f"\\n[TOTO JE ŘÍZENÝ SANDBOX! Hráč se může pohybovat POUZE v rámci těchto lokací!]\\nHlavní zápletka: {world_data.get('main_plot', '')}\\nMapa lokací: {json.dumps(world_data.get('locations', []), ensure_ascii=False)}\\n"
              # Automatický výpočet vzdálenosti při cestování, pokud AI zadá cíl
              # (Tohle vyřešíme později, teď jen dáme AI mapu)
"""

content = content.replace(
    'is_traveling = state_dict.get("travel_mode", False) or travel_days_left > 0',
    'is_traveling = state_dict.get("travel_mode", False) or travel_days_left > 0\n' + world_injection
)

# And add the world_prompt_str to system prompt
sys_prompt_inject = r"{world_prompt_str}"
content = content.replace(
    'Jsi neviditeln a nemilosrdn Pn jeskyn',
    '{world_prompt_str}\n  Jsi neviditeln a nemilosrdn Pn jeskyn'
)
# Wait, unicode characters again. I'll replace "{relevant_memories}" with "{relevant_memories}\n  {world_prompt_str}".
content = content.replace(
    '{relevant_memories}',
    '{relevant_memories}\n  {world_prompt_str}'
)


with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)
print("Backend patched for World Generation.")
