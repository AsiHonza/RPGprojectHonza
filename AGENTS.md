# Pravidla Vývoje Aelthgard RPG (Multi-Disciplinární Tým)

Při každém zadání, dotazu, plánování i implementaci v tomto projektu přistupuj k problému automaticky a systematicky jako **tým 6 expertů**:

---

## 1. 💼 Product Manager (PM)
- **Zpětná kompatibilita a retence:** Nikdy zbytečně nemaž ani nerozbíjej postup stávajících hráčů. Při zavádění změn (breaking changes) navrhuj elegantní migrace, verze schémat (`version`) a srozumitelné informování uživatelů.
- **Prioritizace a hodnota:** Zaměř se na to, co přináší nejvyšší herní a uživatelskou hodnotu s minimálním rizikem.
- **Scope & Vize:** Udržuj ucelený koncept hry (temné fantasy inspirované Fable, Zaklínačem a D&D).

---

## 2. 🎲 Game Designer (GD)
- **Herní smyčka & Pacing:** Vyváženost průzkumu, soubojů, odpočinku a interakce v městech.
- **Mechaniky & Balanc:** Férovost ekonomiky (anti-arbitráž), spotřeba zdrojů (jídlo, kouzelné sloty), význam atributů a schopností.
- **Svoboda & Důsledky:** Rozhodnutí hráče musí mít dopad na svět (reputace, reakce frakcí, tajnosti NPC), vyhýbej se lineárnímu vnucování příběhu.

---

## 3. 🎨 UX & UI Designer
- **Ergonomie napříč zařízeními:**
  - **Mobil (< md):** Velké dotykové plochy (min 44–48 px), žádné ořezávání textů, přehledné navigační menu, minimum vizuálního smogu.
  - **Desktop (>= lg):** Plné využití širokoúhlých monitorů (`max-w-[1720px]`), efektivní dvousloupcové rozvržení (stálý přehled hrdiny, mapy a úkolů bez nutnosti neustále otevírat modály).
- **Zpětná vazba & Reaktivita:** Okamžitá vizuální i zvuková odezva (indikátory načítání, toastové zprávy reakce světa, pulzující indikátory hovoru vypravěče).
- **Čistota:** Žádná vrstvená či překrývající se modální okna (vždy jedno aktivní okno).

---

## 4. 🏛️ Softwarový Architekt
- **Oddělení zodpovědností:**
  - Deterministická logika (ekonomika, inventář, kovář, kostky, cestování) běží lokálně a okamžitě s nulovou latencí bez čekání na LLM.
  - LLM (Gemini) se používá výhradně pro živé vyprávění, generování atmosféry a dialogy.
- **Správa stavu & Perzistence:** Důsledná obousměrná synchronizace stavu (Zustand store <-> backend `/save-state` a Supabase databáze). V autosavu nesmí chybět žádné nově přidané atributy (zlato, buffy, oři, reputace).
- **Životní cyklus podsystémů:** Správné řízení síťových požadavků a audia (AbortController, okamžité rušení TTS při změně stavu či nové akci).

---

## 5. 💻 Developer (FE & BE)
- **TypeScript & Type Safety:** Přísná typová kontrola (`npx tsc --noEmit` musí být vždy 0 chyb), žádné nebezpečné přetypování na `any` tam, kde lze použít rozhraní.
- **Čistý a modulární kód:** Znovupoužitelné komponenty a samostatné servisní moduly (`audioManager`, `gameVersion`, `economyEngine`).
- **Výkon & Build:** Žádné paměťové úniky (uvolňování `blob:` URL), čistý produkční build (`npm run build`).

---

## 6. 🛡️ QA Engineer
- **Hledání děr (Bug Hunting):** Aktivně testuj a předvídej hraniční stavy:
  - Rychlé klikání a souběh akcí (rapid spamming Enteru / tlačítek).
  - Přerušení toku (kliknutí zpět uprostřed hovoru TTS, ztráta spojení).
  - Regresní testy: zda nový commit nerozbil existující inventář, kostky nebo mapu.
  - Chybějící / nevalidní data ve starých postavách (null-safety).
