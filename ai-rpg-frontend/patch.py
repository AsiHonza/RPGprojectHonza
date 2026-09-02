import codecs

lines = codecs.open('src/data/patchNotes.ts', 'r', 'utf-8').readlines()

new_patch = """  {
    version: "Beta 0.6",
    date: "Září 2026",
    title: "Obří Refaktoring - Zustand a FSD (Část 2)",
    changes: [
      {
        category: "Architektura",
        items: [
          "Herní mapa (MapModal) úspěšně vyčleněna z hlavního monolitického souboru.",
          "Deník úkolů (QuestsModal), Deník postavy (JournalModal) a Seznam NPC (NpcsModal) migrovány do samostatných komponent.",
          "Hlavní herní smyčka nově plně spoléhá na centralizovaný State Management přes Zustand.",
          "Vyřešeny duplicitní stavy, aplikace je nyní o poznání rychlejší a stabilnější."
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
