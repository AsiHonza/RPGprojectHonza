import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

# 1. We need to extract the world gen block and put it at the very top of create_character
import re

world_gen_block = re.search(r'(    # Pokud hrac zvolil kampan, vygenerujeme svet\n    world_data = None\n    if req\.game_mode == "campaign":\n        try:.*?world_data = None\n\n)', content, re.DOTALL)

if world_gen_block:
    block_text = world_gen_block.group(1)
    # Remove from old position
    content = content.replace(block_text, '')
    
    # Insert right at the beginning of the try block
    target = '    try:\n        client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))'
    new_target = '    try:\n        client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))\n\n' + block_text.replace('            client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))\n', '')
    
    content = content.replace(target, new_target)
    
    # 2. Modify intro prompt to use world_data
    old_prompt = """        prompt = f'''
Jsi Pán jeskyně v textové RPG hře D&D. Hráč právě vytvořil novou postavu:
Jméno: {req.name}
Rasa: {req.race}
Třída: {req.dnd_class}
Staty: {req.stats}

Napiš poutavý první odstavec (intro), který postavu rovnou vrhne do děje. Zohledni její rasu a třídu. Nezačínej v obyčejné hospodě, začni např. na deštivé cestě, uprostřed lesa, u brány města nebo v nebezpečí.
Vrať POUZE json ve formátu:
{{
  "intro_text": "Text vypravěče (min 3 věty)...",
  "popis_okoli": "Stručný popis lokace (např. Temný les plný stínů a vlhka)"
}}
        '''"""
        
    new_prompt = """        world_context = ""
        if world_data:
            import json
            world_context = f"\\n\\n[HRAJE SE PŘÍBĚHOVÁ KAMPAŇ]: Zamotej postavu rovnou do vygenerované zápletky tohoto světa!\\nZápletka: {world_data.get('main_plot')}\\nMísto startu: Napiš intro odehrávající se v jedné z těchto lokací: {json.dumps(world_data.get('locations'))}\\nZmíň v intru letmo klíčové NPC: {json.dumps(world_data.get('key_npcs'))}"
        
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
        '''"""
        
    content = content.replace(old_prompt, new_prompt)

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)

print("Intro gen fixed.")
