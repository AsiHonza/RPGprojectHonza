import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

content = content.replace("React.useState", "useState")
content = content.replace("React.useEffect", "useEffect")
content = content.replace("idx === history.length - 1", "i === history.length - 1")

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("Fixed!")
