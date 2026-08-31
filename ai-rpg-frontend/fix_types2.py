import codecs
import re

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

content = re.sub(r'Object\.keys\(equipped\)\.map\(eq =>', r'Object.keys(equipped).map((eq: string) =>', content)
content = re.sub(r'type:\s*["\']npc["\']', 'type: "npc_muz"', content)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("Type errors fixed via regex!")
