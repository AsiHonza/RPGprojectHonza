import codecs
import re

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

# 1. Update DMResponse
if "novy_zapis_do_deniku" not in content:
    content = content.replace(
        'image_prompt: Optional[str] = Field(default=None, description="Prompt pro vygenerování obrázku k aktuální scéně.")',
        'image_prompt: Optional[str] = Field(default=None, description="Prompt pro vygenerování obrázku k aktuální scéně.")\n    novy_zapis_do_deniku: Optional[str] = Field(default=None, description="Zásadní posun v ději. Napiš max 2 věty, které se zapíšou do hráčova deníku jako shrnutí (např. Zabil jsem vlka a zachránil vesnici). U běžných kroků nech prázdné.")'
    )

# 2. Update create_character to include journal
if '"journal":' not in content:
    content = content.replace(
        '"xp": 0',
        '"xp": 0,\n        "journal": [f"Vytvořil jsi postavu {req.name} (Rasa: {req.race}, Třída: {req.dnd_class}). Tvé dobrodružství začíná."]'
    )

# 3. Update action endpoint to append to journal
if 'novy_zapis_do_deniku' in content and 'state["journal"].append' not in content:
    append_logic = """
        if dm_json.get("novy_zapis_do_deniku"):
            if "journal" not in state:
                state["journal"] = []
            state["journal"].append(dm_json.get("novy_zapis_do_deniku"))
"""
    content = content.replace(
        'fakta = dm_json.get("dulezita_fakta", [])',
        append_logic + '\n        fakta = dm_json.get("dulezita_fakta", [])'
    )

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)

print("Journal added to backend!")
