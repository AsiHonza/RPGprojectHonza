import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

# 1. Modify the System Prompt for play_action to emphasize Class/Race
old_system_prompt = """6. Během průzkumu neznámých končin občas nabídni nějaký zajímavý bod zájmu (jeskyně, zřícenina)."""
new_system_prompt = """6. Během průzkumu neznámých končin občas nabídni nějaký zajímavý bod zájmu (jeskyně, zřícenina).
7. TŘÍDA A RASA: Hráčova třída (DndClass) a rasa hrají OBROVSKOU roli. 
   - Vždy generuj alespoň jednu ze 3 "nabízených akcí" tak, aby byla unikátní pro hráčovu třídu (např. Bard může někoho okouzlit písní, Zloděj se pokusí ukrást klíče, Barbar zkusí hrubou sílu).
   - Nech NPC postavy občas reagovat na hráčovu rasu a třídu (např. strach z černokněžníků, respekt k paladinům, rasové narážky).
   - Obchodníci by měli nabízet předměty a kouzla, které se hodí k hráčově třídě."""

content = content.replace(old_system_prompt, new_system_prompt)

# 2. Modify create_character to give starting inventory based on Class
old_inventory = '"inventory": [],'
new_inventory = '''"inventory": [
                {"id": "ration_1", "name": "Cestovní dávka jídla", "type": "ostatní", "slot": "žádný", "description": "Základní jídlo na cesty."},
                {"id": "gold_pouch", "name": "Měšec s 15 zlaťáky", "type": "ostatní", "slot": "žádný", "description": "Počáteční kapitál."}
            ],'''
# Wait, I should do this programmatically in python!

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)
print("System prompt updated!")
