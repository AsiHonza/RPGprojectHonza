import codecs
import json

lines = codecs.open('src/data/patchNotes.ts', 'r', 'utf-8').readlines()

new_patch = """  {
    version: "Beta 0.9 (World 2.0)",
    date: "Září 2026",
    title: "Honeycomb Map & Hardcore Travel",
    changes: [
      {
        category: "Generování Světa & Mapa",
        items: [
          "Matematický generátor hexů - Aelthgard má nyní pevnou mřížku o poloměru 15 hexů (cca 720 polí).",
          "7 Království a Biomy generované přes Voronoi diagramy a Perlin noise (Lesy, Pláně, Hory, Pustiny, Oceány, Bažiny).",
          "React Honeycomb pergamenová mapa: Už žádné barevné čtverce, svět vypadá jako reálná ztmavená středověká mapa.",
          "Generování 'Bible Světa' při založení hry. Umělá inteligence dostane archetypy a vyrobí hluboký Lore."
        ]
      },
      {
        category: "Cestování a Přežití",
        items: [
          "Fyzický model cestování - hráč se musí fyzicky (přes UI mapy) posunovat z hexu na hex. Náklady jsou 1 den a 1 jídlo.",
          "Starvation Hard-Lock: Hra ti nyní nedovolí vstoupit do Pustiny nebo Hvozdů s méně než 2 dny zásob. Záchranná brzda proti smrti hladem.",
          "Automatické Eventy: Kliknutím na cestování kód automaticky spočítá terén a při 25% šanci vyvolá Vypravěče k náhodnému setkání."
        ]
      },
      {
        category: "Dark Fantasy UX/UI Overhaul",
        items: [
          "Kompletní redesign do imerzivního Glassmorphismu a zrušení bílých bloků.",
          "Framer Motion animace: Rozmazaná pozadí, levitující ukazatele a plně průhledný Story Log pro vtáhnutí do děje.",
          "Zcela nový Login a Průvodce vytvořením postavy (Karty a Stepper namísto gigantického formuláře)."
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
