import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

# We will append the new rules to the end of ZÁZNAMY PRO FRONTEND: section, right before the """ closing quotes.
import re

new_rules = """
SPECIFIKA POSTAVY A NABÍZENÉ AKCE:
- TŘÍDA A RASA: Hráčova třída a rasa hrají OBROVSKOU roli. Obchodníci by měli nabízet předměty/kouzla pro hráčovu třídu, a NPC by na ni měli reagovat.
- VŽDY vygeneruj 3 až 5 "nabízených akcí" (v listu `nabizene_akce`), které dávají v dané situaci smysl (neomezuj se jen na 3, může jich být až 5).
- Z těchto nabízených akcí generuj alespoň jednu tak, aby byla unikátní pro hráčovu třídu (např. Bard může někoho okouzlit písní, Zloděj páčit, Barbar použít sílu).
"""

content = content.replace(
    "vlo do 'npc_dialogy' vce objekt.\n\"\"\"",
    "vlož do 'npc_dialogy' více objektů.\n" + new_rules + "\n\"\"\""
)
# Since powershell mangles the encoding of the search string in my script, I will just use a generic regex to insert before the closing quotes of system_prompt!
