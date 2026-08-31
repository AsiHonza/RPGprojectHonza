import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

content = content.replace(
    'const classes = ["Barbarian", "Bard", "Cleric", "Druid", "Fighter", "Monk", "Paladin", "Ranger", "Rogue", "Sorcerer", "Warlock", "Wizard"];',
    'const classes = ["Barbar", "Bard", "Klerik", "Druid", "Bojovník", "Mnich", "Paladin", "Hraničář", "Tulák", "Čaroděj", "Černokněžník", "Kouzelník"];'
)

content = content.replace(
    'const races = ["Human", "Elf", "Dwarf", "Halfling", "Dragonborn", "Tiefling", "Half-Orc", "Gnome"];',
    'const races = ["Člověk", "Elf", "Trpaslík", "Půlčík", "Drakorozený", "Tiefling", "Půlork", "Gnóm"];'
)

content = content.replace('useState("Fighter")', 'useState("Bojovník")')
content = content.replace('useState("Human")', 'useState("Člověk")')

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("Translated!")
