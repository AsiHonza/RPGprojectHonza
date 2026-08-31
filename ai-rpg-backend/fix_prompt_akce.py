import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

# I will replace "ze 3 \"nabízených akcí\"" with "z \"nabízených akcí\" (vygeneruj jich 3 až 5 podle situace)"
import re
content = re.sub(r'ze 3 "nab.zen.ch akc."', 'z "nabízených akcí" (vygeneruj jich 3 až 5 podle situace)', content)

# I should also make sure it generates 3-5 in general. Let's add a bullet point.
old_bullet = """- Vždy generuj alespoň jednu z "nabízených akcí" (vygeneruj jich 3 až 5 podle situace) tak, aby byla unikátní pro hráčovu třídu"""
new_bullet = """- VŽDY vygeneruj 3 až 5 "nabízených akcí", které dávají v dané situaci smysl (neomezuj se jen na 3, pokud se nabízí více možností úniku/řešení).
   - Z těchto akcí generuj alespoň jednu tak, aby byla unikátní pro hráčovu třídu"""

content = content.replace(old_bullet, new_bullet)

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)
print("Action count prompt updated!")
