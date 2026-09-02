import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

content = content.replace('src="/ambient.m4a"', 'src="/ambient.mp3"')

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)

print("Audio source changed to .mp3!")
