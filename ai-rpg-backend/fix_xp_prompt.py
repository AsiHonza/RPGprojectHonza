import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

old_xp_prompt = "ODMĚNY A XP:\n- Uděluj `xp_zmena` za vyhrané souboje, chytré řešení situací nebo postup v úkolu. Zlaté pravidlo: malá překážka 20 XP, těžký souboj 50-100 XP."
new_xp_prompt = "ODMĚNY A XP (EXTRÉMNĚ POMALÝ RŮST - DLOUHÁ KAMPAŇ):\n- Uděluj `xp_zmena` POUZE za velmi významné události. Zlaté pravidlo: běžný pohyb a běžný rozhovor = 0 XP, odhalení důležitého tajemství = 10 XP, zabití monstra = 20-40 XP, splnění celého úkolu = 100-200 XP. Nechceme, aby hráč leveloval rychle."

content = content.replace(old_xp_prompt, new_xp_prompt)

# I should also fix the encoding error if the string is mangled. Let's use regex to find the XP block and replace it.
import re
pattern = r"ODMNY A XP:[\s\S]*?- Ud>luj `xp_zmena` za vyhranc souboje, chytrc teen situac nebo postup v ƭkolu\. Zlatc pravidlo: mal ptekka 20 XP, t>k souboj 50-100 XP\."

content = re.sub(pattern, new_xp_prompt, content)

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)

print("XP prompt updated in backend.")
