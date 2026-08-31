import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

bad_img = "src={https://image.pollinations.ai/prompt/black%20and%20white%20ink%20drawing%20of%20a%20%20%20RPG%20character%20portrait?width=128&height=128&nologo=true&seed=42}"
good_img = "src={`https://image.pollinations.ai/prompt/black%20and%20white%20ink%20drawing%20of%20a%20${encodeURIComponent(char.race)}%20${encodeURIComponent(char.dnd_class)}%20RPG%20character%20portrait?width=128&height=128&nologo=true&seed=42`}"

content = content.replace(bad_img, good_img)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("Image fixed!")
