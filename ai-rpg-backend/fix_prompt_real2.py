import codecs
import re

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

new_rules = """
SPECIFIKA POSTAVY A NABIZENE AKCE:
- TRIDA A RASA: Hracova trida a rasa hraji OBROVSKOU roli. Obchodnici by meli nabizet predmety/kouzla pro hracovu tridu, a NPC by na ni meli reagovat.
- VZDY vygeneruj 3 az 5 "nabizenych akci" (v listu `nabizene_akce`), ktere davaji v dane situaci smysl (neomezuj se jen na 3, muze jich byt az 5).
- Z techto nabizenych akci generuj alespon jednu tak, aby byla unikatni pro hracovu tridu (napr. Bard muze nekoho okouzlit pisni, Zlodej pacit, Barbar pouzit silu).
"""

# Let's find the assignment of system_prompt inside play_action
# It ends with:
# Pokud mluvi vice postav, vloz do 'npc_dialogy' vice objektu.
# """
content = re.sub(r'(npc_dialogy.*?)\"\"\"', r'\1' + new_rules + '"""', content, flags=re.DOTALL)

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)
print("Prompt injected!")
