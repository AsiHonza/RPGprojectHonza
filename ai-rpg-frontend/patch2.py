import codecs

lines = codecs.open('src/data/patchNotes.ts', 'r', 'utf-8').readlines()

new_patch = """  {
    version: "Beta 0.7",
    date: "Září 2026",
    title: "Kompletní přesun UI z page.tsx",
    changes: [
      {
        category: "Architektura",
        items: [
          "Úplně vyčištěný hlavní soubor hry (page.tsx) od balastu uživatelského rozhraní.",
          "Vyčleněny zbylé moduly: Vlastnosti (StatsModal), Dovednosti (SkillsModal), Nastavení (SettingsModal) a Horní Navigační Lišta (PlayerHeader).",
          "Audio přehrávač (hlasitost, hudba, zvuky) a notifikace přesunuty pod hlavičku globálního Zustand Game Store.",
          "Aplikace je nyní 100% Modulární Feature-Sliced Design. Dokončena velká refaktorizace, připraveno na designové animace."
        ]
      }
    ]
  },
"""

for i, l in enumerate(lines):
    if "export const PATCH_NOTES: PatchNote[] = [" in l:
        lines.insert(i+1, new_patch)
        break

with codecs.open('src/data/patchNotes.ts', 'w', 'utf-8') as f:
    f.write("".join(lines))
