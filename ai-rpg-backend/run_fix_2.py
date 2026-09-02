import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

start = content.find("prompt = f'''\nJsi")
end = content.find("'''\n        response = client.models.generate_content(", start)

if start != -1 and end != -1:
    new_prompt = """        world_context = ""
        if world_data:
            import json
            world_context = f"\\n\\n[HRAJE SE PŘÍBĚHOVÁ KAMPAŇ]: Zamotej postavu rovnou do vygenerované zápletky tohoto světa!\\nZápletka: {world_data.get('main_plot')}\\nMísto startu: Napiš intro odehrávající se v jedné z těchto lokací: {json.dumps(world_data.get('locations'), ensure_ascii=False)}\\nZmíň v intru letmo klíčové NPC: {json.dumps(world_data.get('key_npcs'), ensure_ascii=False)}"
        
        prompt = f'''
Jsi Pán jeskyně v textové RPG hře D&D. Hráč právě vytvořil novou postavu:
Jméno: {req.name}
Rasa: {req.race}
Třída: {req.dnd_class}
Staty: {req.stats}
{world_context}

Napiš poutavý první odstavec (intro), který postavu rovnou vrhne do děje (a do kampaně, pokud je zadaná). Zohledni její rasu a třídu. Nezačínej v obyčejné hospodě, začni na zajímavém místě.
Vrať POUZE json ve formátu:
{{
  "intro_text": "Text vypravěče (min 3 věty)...",
  "popis_okoli": "Stručný popis lokace"
}}
"""
    content = content[:start] + new_prompt + content[end:]
    
    with codecs.open("main.py", "w", "utf-8") as f:
        f.write(content)
    print("Replaced")
else:
    print("Not found")

