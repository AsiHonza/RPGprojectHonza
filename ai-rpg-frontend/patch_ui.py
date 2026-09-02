import codecs

lines = codecs.open('src/data/patchNotes.ts', 'r', 'utf-8').readlines()

new_patch = """  {
    version: "Beta 0.8",
    date: "Září 2026",
    title: "AAA High Fantasy UI Upgrade",
    changes: [
      {
        category: "Grafika a Animace",
        items: [
          "Přechod na AAA minimalismus - obrazovka je nyní čistá a zaměřená na příběh a ilustrace.",
          "Zavedena podpora filmových animací přes Framer Motion (plynulé fade-in efekty, rozmazání pozadí).",
          "Změna typografie na Google Fonts 'Cinzel' (velkolepé nadpisy) a 'Lora' (skvěle čitelný knižní příběh).",
          "Tlačítka z hlavní obrazovky přesunuta do nového elegantního vysouvacího 'Master Menu'.",
          "HP a XP se nyní zobrazují formou elegantních plnících se gradientních linek vedle avataru.",
          "Předělán herní deník (StoryLog) do podoby nádherných průsvitných karet se silným fantasy nádechem a inkoustovými akcenty.",
          "Magické pole pro psaní příkazů - plovoucí, stínované okraje s levitujícími detaily."
        ]
      }
    ]
  },
"""

for i, l in enumerate(lines):
    if "export const PATCH_NOTES = [" in l:
        lines.insert(i+1, new_patch)
        break

with codecs.open('src/data/patchNotes.ts', 'w', 'utf-8') as f:
    f.write("".join(lines))
