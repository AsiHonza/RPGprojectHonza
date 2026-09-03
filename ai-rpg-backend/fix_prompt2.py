import re

with open('app/routers/game.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix the json dump to include quests, npcs, journal, but exclude history and world data.
old_dump = '''json.dumps({
    k: v for k, v in char_data.get('state', {}).items() 
    if k not in ['worldData', 'history', 'quests', 'npcs', 'journal']
}, ensure_ascii=False)'''

new_dump = '''json.dumps({
    k: v for k, v in char_data.get('state', {}).items() 
    if k not in ['worldData', 'world_data', 'history']
}, ensure_ascii=False)'''

text = text.replace(old_dump, new_dump)

# Optimize world_prompt_str to not include EVERY location and EVERY NPC in the entire world.
# Find the world_prompt_str block
pattern = r"world_prompt_str = f\"\\n\[TOTO JE.*?\\n\""
replacement = '''
            # Filter locations to only the current region to save massive amounts of tokens
            current_region = state_dict.get('currentRegion') or state_dict.get('aktualni_region')
            local_locations = [loc for loc in world_data.get('locations', []) if loc.get('nazev') == current_region]
            
            world_prompt_str = f"\\n[TOTO JE ØÍZENÝ SANDBOX! Svìt je pevnì dán:]\\nZápletka: {world_data.get('main_plot', '')}\\nAktuální lokace info: {json.dumps(local_locations, ensure_ascii=False)}\\n\\n[KRITICKÉ PRAVIDLO PRO TAJEMSTVÍ]: Všechna 'tajemstvi_nebo_problem' a 'skryty_motiv' jsou pøed hráèem PØÍSNÌ SKRYTÁ. Nesmíš je hráèi vyžvanit v úvodním popisu lokace! Hráè na nì musí pøijít sám pomocí prùzkumu, dedukce nebo dialogù s NPC.\\n"
'''

text = re.sub(pattern, replacement.strip(), text, flags=re.DOTALL)

with open('app/routers/game.py', 'w', encoding='utf-8') as f:
    f.write(text)
