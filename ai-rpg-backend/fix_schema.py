import codecs
import re

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

content = re.sub(
    r'    x: int = Field\(description=\"X sou.*?\"\)\n    y: int = Field\(description=\"Y sou.*?\"\)',
    '    q: int = Field(description="Axialni souradnice q (prevezmi z dodaneho zadani)")\n    r: int = Field(description="Axialni souradnice r (prevezmi z dodaneho zadani)")',
    content, flags=re.DOTALL
)

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)

print("Schema fixed")
