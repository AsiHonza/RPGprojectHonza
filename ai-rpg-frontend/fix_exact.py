import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

content = content.replace("setEquipped(eq => {", "setEquipped((eq: any) => {")
content = content.replace('playAudio(msg.npc_mluvi.text, "npc")', 'playAudio(msg.npc_mluvi.text, msg.npc_mluvi.pohlavi === "zena" ? "npc_zena" : "npc_muz")')

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("Fixed finally.")
