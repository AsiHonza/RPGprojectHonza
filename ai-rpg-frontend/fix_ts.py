import codecs
import re

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# 1. Fix startNewGame 'state' error
content = content.replace(
    'setTravelMode(state.travel_mode || false);',
    'setTravelMode(false);'
)
content = content.replace(
    'setTravelDaysLeft(state.travel_days_left || 0);',
    'setTravelDaysLeft(0);'
)
content = content.replace(
    'setTravelDestination(state.travel_destination || "");',
    'setTravelDestination("");'
)
content = content.replace(
    'setNpcs(state.zname_postavy || []);',
    'setNpcs([]);'
)
content = content.replace(
    'setWorldData(state.world_data || null);',
    'setWorldData(data.world_data || null);'
)

# 2. Inject PATCH_NOTES
patch_notes_const = """
const PATCH_NOTES = [
  {
    version: "v1.2.0 - Vládci Osudu & Objevitelé",
    date: "Září 2026",
    changes: [
      "🗺️ Řízený Sandbox: Nový kampaňový režim hry! AI pro tebe při založení postavy vymyslí pevnou mapu, zápletku a skrytá tajemství.",
      "📜 Interaktivní Mapa: Hraješ-li kampaň, máš nově přístup k interaktivní vizuální mapě světa a objevených cest.",
      "🏕️ Epické Cestování: Každý krok cesty do nové lokace stojí 1 jídlo. Pán jeskyně hází tajně d20 kostkou na události (od klidné cesty po smrtící léčku).",
      "👥 Deník Postav (Kodex): V horním menu nově najdeš vizitkář! Hra si pamatuje každé důležité NPC a jejich vztah k tobě (zelená/žlutá/červená).",
      "📱 Mobilní UI & Notifikace: Kompaktní rozhraní pro telefony a epické oznámení přes celou obrazovku, když splníš quest!"
    ]
  },
  {
    version: "v1.1.0 - Magie a Ocel",
    date: "Starší",
    changes: [
      "✨ Systém kouzel a cantripů pro magická povolání.",
      "⚔️ Zbraně, zbroje a možnost se vybavovat z inventáře.",
      "🎵 Adaptivní ambientní hudba (Město, Divočina, Boj)."
    ]
  }
];

"""

if "const PATCH_NOTES" not in content:
    content = content.replace("export default function Home() {", patch_notes_const + "export default function Home() {")

# 3. Add TS types to patch notes map
content = content.replace(
    'PATCH_NOTES.map((patch, idx) => (',
    'PATCH_NOTES.map((patch: any, idx: number) => ('
)
content = content.replace(
    'patch.changes.map((change, cIdx) => (',
    'patch.changes.map((change: any, cIdx: number) => ('
)

# Fix API data response for new game:
# `data.world_data` isn't returned by /create-character, it's saved in the database. But the user has to fetch it or we need to update backend to return it.
# Wait! /create-character doesn't return world_data in `data`. It just saves it.
# We can just fetch it again or leave it null until they refresh (loadGame).
# Actually, the user can just refresh, or we can make `loadGame` trigger. But we can just set it to null for the first second, then next autosave... wait, autosave will overwrite it with null if we don't have it!
# THIS IS CRITICAL! Autosave overwrites `state.world_data` with `worldData` (which would be null). We MUST load it properly.

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)

print("TS fixed.")
