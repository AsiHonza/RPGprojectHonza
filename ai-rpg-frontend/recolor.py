import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

replacements = {
    "#1a120b": "#1b262c",  # Deep slate/blue background
    "#0a0705": "#0f1619",  # Darker slate
    "#f4ecd8": "#f4f1e1",  # Brighter, warmer cream
    "#e8dcc4": "#e3dcc8",  # Slightly darker cream
    "#c4a47c": "#90a4ae",  # Blueish-grey border instead of brown
    "#8b1e1e": "#b74b4b",  # Softer painterly terracotta red
    "#b22222": "#d46a6a",  # Hover terracotta
    "#6b1515": "#8a3333",  # Darker terracotta border
    "#3d2b1f": "#2b4c5e",  # Slate-blue (dwarf tunic color) for panels/main text
    "#2a1d15": "#1e3746",  # Darker slate-blue
    "#5c4a3d": "#455a64",  # Muted slate border/text
    "#a0907d": "#78909c",  # Muted slate
    "#d4af37": "#d4af37",  # Keep gold
}

for old_c, new_c in replacements.items():
    content = content.replace(old_c, new_c)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)

print("Colors updated!")
