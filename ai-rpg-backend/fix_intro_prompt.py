import codecs

lines = codecs.open('main.py', 'r', 'utf-8').readlines()
start = -1
for i, l in enumerate(lines):
    if 'world_context = f"\\n\\n[HRAJE SE P' in l:
        lines[i] = '''
            kingdom_names = {
                1: "Valerijské Impérium", 2: "Svatá Říše Solariova", 3: "Kmeny z Hlubokých hvozdů",
                4: "Svobodná města", 5: "Karanténní Zóna", 6: "Železný Práh", 7: "Tajemné Útočiště"
            }
            start_kingdom_id = initial_location.get("kingdom_id") if initial_location else 1
            start_kingdom_name = kingdom_names.get(start_kingdom_id, "Neznámé království")
            
            world_context = f"\\n\\n[HRAJE SE PŘÍBĚHOVÁ KAMPAŇ]: Zamotej postavu rovnou do vygenerované zápletky tohoto světa!\\nZápletka: {world_data.get('main_plot')}\\nMísto startu: Hráč právě začíná ve frakci/království {start_kingdom_name} (Souřadnice: {initial_location['q']}, {initial_location['r']}). Vypravěč by měl na začátku tuto lokaci představit a uvést, proč tam postava je.\\nZmiň v intru letmo některé z klíčových NPC: {json.dumps(world_data.get('key_npcs'), ensure_ascii=False)}"
'''
        break

with codecs.open('main.py', 'w', 'utf-8') as f:
    f.write("".join(lines))
