import codecs
import json
from datetime import datetime

lines = codecs.open('src/data/patchNotes.ts', 'r', 'utf-8').readlines()

new_patch = f"""
  {{
    "version": "Beta 0.5 - Architektura & Království",
    "date": "{datetime.now().strftime('%d. %m. %Y')}",
    "changes": [
      "🗺️ Mapa 30x30 s inteligentním Lazy Loadingem bodů zájmu.",
      "👑 7 Království - Svět Aelthgardu je nyní rozdělen do 7 politických a přírodních regionů pomocí Voronoi diagramu.",
      "⚙️ Zásadní refaktoring - Přechod na profi Zustand State Management.",
      "🎨 Vizuální úpravy mapy - Přidána speciální barva pro Mrtvou zónu uprostřed."
    ]
  }},
"""

for i, l in enumerate(lines):
    if "export const PATCH_NOTES = [" in l:
        lines.insert(i+1, new_patch)
        break

with codecs.open('src/data/patchNotes.ts', 'w', 'utf-8') as f:
    f.write("".join(lines))
    
print("Patch notes updated")
