import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

# Inside create_character:
#             "dnd_class": req.dnd_class.value,
#             "stats": req.stats.model_dump(),
#             "history": [],
#             "state": {
#                 "hp": 100,

find_str = """            "history": [],
            "state": {"""

replace_str = """            "history": [],
            "state": {"""

# Actually I need to insert a function that creates inventory based on req.dnd_class
code_to_insert = """
        # Získání startovního vybavení podle třídy
        start_inventory = []
        start_equipped = {
            "hlava": None, "hruď": None, "hlavní ruka": None, 
            "druhá ruka": None, "prsten": None, "krk": None
        }
        
        c = req.dnd_class.value.lower()
        if "fighter" in c or "paladin" in c or "barbarian" in c:
            start_inventory.append({"id": "zbr_mec", "name": "Dlouhý meč", "type": "zbraň", "slot": "hlavní ruka", "description": "Spolehlivý ostrý meč."})
            start_inventory.append({"id": "zbr_stit", "name": "Dřevěný štít", "type": "zbroj", "slot": "druhá ruka", "description": "Jednoduchý štít na obranu."})
        elif "rogue" in c or "ranger" in c:
            start_inventory.append({"id": "zbr_dyka", "name": "Dýka", "type": "zbraň", "slot": "hlavní ruka", "description": "Rychlá čepel."})
            start_inventory.append({"id": "ost_paklice", "name": "Sada paklíčů", "type": "ostatní", "slot": "žádný", "description": "Pro otevírání zámků."})
        elif "bard" in c:
            start_inventory.append({"id": "zbr_dyka", "name": "Zdobená dýka", "type": "zbraň", "slot": "hlavní ruka", "description": "Vypadá spíš jako rekvizita, ale řeže."})
            start_inventory.append({"id": "ost_loutna", "name": "Loutna", "type": "ostatní", "slot": "žádný", "description": "Hudební nástroj barda."})
        elif "wizard" in c or "sorcerer" in c or "warlock" in c:
            start_inventory.append({"id": "zbr_hul", "name": "Dřevěná hůl", "type": "zbraň", "slot": "hlavní ruka", "description": "Kouzelnická hůl."})
            start_inventory.append({"id": "ost_kniha", "name": "Magický grimoár", "type": "ostatní", "slot": "druhá ruka", "description": "Kniha plná tajemných znaků."})
        elif "cleric" in c or "druid" in c:
            start_inventory.append({"id": "zbr_palcat", "name": "Palcát", "type": "zbraň", "slot": "hlavní ruka", "description": "Těžká zbraň drtící kosti."})
            start_inventory.append({"id": "ost_symbol", "name": "Svatý symbol", "type": "doplněk", "slot": "krk", "description": "Symbol tvé víry."})
        
        # Každý dostane navíc nějaké jídlo
        start_inventory.append({"id": "ost_jidlo", "name": "Cestovní dávka", "type": "ostatní", "slot": "žádný", "description": "Sušené maso a chleba na 1 den."})
"""

# Let's place code_to_insert before character_data = {
import re
content = content.replace('        character_data = {', code_to_insert + '\n        character_data = {')

# Then replace "inventory": [], and "equipped": { ... } inside state dict
old_state = """            "state": {
                "hp": 100,
                "inventory": [],
                "equipped": {
                    "hlava": None,
                    "hruď": None,
                    "hlavní ruka": None,
                    "druhá ruka": None,
                    "prsten": None,
                    "krk": None
                },"""
new_state = """            "state": {
                "hp": 100,
                "inventory": start_inventory,
                "equipped": start_equipped,"""
content = content.replace(old_state, new_state)

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)
print("Inventory added!")
