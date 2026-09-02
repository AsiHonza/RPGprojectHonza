import codecs

readme = """# AI RPG Project Honza

Tento projekt kombinuje AI Game Mastera (Python/FastAPI) s Reactovým frontendem (Next.js/Tailwind). 
Cílem je vytvořit dynamické, procedurálně generované RPG ve fantasy světě Aelthgard, kde každé vaše rozhodnutí formuje příběh.

## Architektura (Feature-Sliced Design - Probíhající refaktoring)

Frontend momentálně prochází velkým refaktoringem. Opuštíme monolitický `page.tsx` a přecházíme na modulární strukturu pomocí **Zustand** pro State Management.

### Aktuální stav refaktoringu (Září 2026):
* **Stav:** ~50% Hotovo
* **State Management:** `gameStore.ts` plně nasazen.
* **Vyčleněné komponenty:**
  * `CharacterCreation.tsx` (Tvorba postavy)
  * `InventoryPanel.tsx` (Inventář)
  * `StoryLog.tsx` (Vykreslování příběhu a NPC zpráv)
  * `CharacterStatsPanel.tsx` (Statistiky hrdiny)
  * `patchNotes.ts` (Dynamický systém pro in-game Patch Notes)

### Backend:
* Voronoi diagram pro rozdělení světa do 7 Království.
* Hexagonální mapa (30x30 = ~900 hexů) s Lazy Loadingem POI (Points of Interest).

## Jak hrát
- Backend: `uv run uvicorn main:app --reload`
- Frontend: `npm run dev`
"""

with codecs.open('../../README.md', 'w', 'utf-8') as f:
    f.write(readme)
    
print("README updated")
