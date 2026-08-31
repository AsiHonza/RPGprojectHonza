import codecs
import re

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

# Update the narrative tone instructions
target_vypravec = "Do 'vypravec' pište POUZE beletristické vyprávění světa - jak se situace odvíjí, jak reagují NPC, atmosféru. NIKDY sem nepsat technické detaily"
replacement_vypravec = "Do 'vypravec' pište POUZE beletristické vyprávění světa. **ZAMĚŘTE SE NA EPIKU A ATMOSFÉRU:** Popisujte majestátní hory, hluboké živé lesy, monumentální architekturu s červenými střechami a kouzelná zátiší. Přeneste hráče do světa plného barev, vůně jehličí nebo dýmkového koření, tepla slunce a majestátní přírody. NIKDY sem nepsat technické detaily"

content = content.replace(target_vypravec, replacement_vypravec)
if target_vypravec not in content and replacement_vypravec not in content:
    # try another substring
    target_vypravec2 = "Do 'vypravec' pi"
    replacement_vypravec2 = "Do 'vypravec' pište (s velkým důrazem na epické, barevné, malířské fantasy popisy majestátních scenérií, detailů architektury a útulné atmosféry) "
    content = content.replace(target_vypravec2, replacement_vypravec2)

# Update the image prompt instructions
target_image = "Do 'image_prompt' popište situaci. Můžete přidat 'image_prompt' (přidej \"black and white ink drawing, simple line art\")."
replacement_image = "Do 'image_prompt' detailně popište aktuální scénu (bez textu). **VŽDY NA KONEC PŘIDEJTE TENTO STYL:** \"style of detailed 2D painterly fantasy concept art, bright vibrant colors, majestic epic scale, cozy atmosphere, studio ghibli meets classic D&D illustrations\"."

if "black and white ink drawing" in content:
    content = re.sub(r"Do 'image_prompt'.*?line art.?\)\.", replacement_image, content, flags=re.DOTALL)
else:
    # fallback replace
    content = content.replace("image_prompt' (p\u0159idej \"black and white ink drawing, simple line art\").", "image_prompt' (V\u017dDY P\u0158IDEJ: \"style of detailed 2D painterly fantasy concept art, bright vibrant colors, majestic epic scale, cozy atmosphere, studio ghibli meets classic D&D illustrations\").")

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)
print("Prompt updated!")
