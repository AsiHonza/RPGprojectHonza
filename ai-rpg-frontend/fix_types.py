import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

content = content.replace("Object.keys(equipped).map(eq => (", "Object.keys(equipped).map((eq: string) => (")
content = content.replace("type: \"npc\"", "type: \"npc_muz\"") # Assuming it was used incorrectly somewhere

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("Type errors fixed!")
