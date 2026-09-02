import codecs
import re

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

world_gen_block = re.search(r'(    # Pokud hrac zvolil kampan.*?world_data = None\n\n)', content, re.DOTALL)
if world_gen_block:
    content = content.replace(world_gen_block.group(1), '')
    content = content.replace(
        '    try:\n        client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))',
        '    try:\n        client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))\n\n' + world_gen_block.group(1).replace('            client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))\n', '')
    )

prompt_match = re.search(r'(        prompt = f\'\'\'\n.*?\'\'\'\n)', content, re.DOTALL)
if prompt_match:
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
        '''
"""
    content = content.replace(prompt_match.group(1), new_prompt)

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)

print("Done")
