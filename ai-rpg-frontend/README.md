# AI RPG Frontend (Next.js)

Tento repozitáø obsahuje uivatelské rozhraní pro hru Aelthgard (AI Dungeons & Dragons RPG). Zajišuje vizualizaci temného fantasy svìta, renderování mapy, interakce hráèe a komunikaci s herním backendem.

## Architektura (Verze 2.1)

Frontend je postaven na moderním **Reactu** a frameworku **Next.js**. Design staví na "Glassmorphism" vizuálním stylu, vyuívá animace z **Framer Motion** a rozsáhlou sadu ikon **Lucide React**.

### State Management (Zustand)
Od verze 2.1 byl masivní React \useState\ stav extrahován z koøenovıch komponent do globálního storu pomocí knihovny **Zustand**. 

- **\src/store/gameStore.ts\**: Hlavní nervové centrum aplikace. Obsahuje veškerı herní stav vèetnì:
  - Stav hráèe (HP, zlato, statistiky, inventáø, vybavené zbranì).
  - Svìtovı stav (historie odehraného pøíbìhu, aktuální Point of Interests, navrhované akce od umìlé inteligence).
  - Globální UI stavy (otevøené modály, pøepínání herního módu).

Díky Zustandu se extrémnì sníilo mnoství zbyteènıch pøekreslování (re-renderù) aplikace a logika je ostøe oddìlena od JSX kódu. To navíc pøipravuje cestu pro budoucí WebSockets/SSE real-time streamování pøíbìhu, kde lze globální stav aktualizovat plynule, ani by trpìl uivatelskı záitek.

### Struktura sloek:
- \src/app/page.tsx\: Hlavní stránka (øídí pøechody mezi Hlavním menu, Tvorbou postavy a Samotnou hrou).
- \src/components/\: Znovupouitelné UI komponenty (Tlaèítka, Videa, Kolotoè postav, Zobrazování pøedmìtù).
- \src/features/\: Funkèní moduly (Inventáø, Mapa, Úkoly, Zápisník, Tvorba postavy). Logika a UI pro jednotlivé obrazovky.
- \src/store/\: Globální state management (Zustand).

## Technologie
- **Next.js 16+** (App Router)
- **React 18** (Plné nasazení hookù)
- **Tailwind CSS** (Styling a responsivita, podpora pro absolutní layout a scroll-management)
- **Zustand** (Global state management)
- **Framer Motion** (Plynulé pøechody a animace elementù)
- **React Player** (Pøehrávání loopovanıch videí Vypravìèe a atmosfér)

## Spuštìní vıvoje

Nainstalujte balíèky a spuste vıvojovı server:

\\\ash
npm install
npm run dev
\\\

Pro build do produkce (Statické / Serverové renderování):
\\\ash
npm run build
npm run start
\\\

## Napojení na Backend
Frontend vyaduje pro plnou funkcionalitu bìící instanci \i-rpg-backend\. Veškerá komunikace s FastAPI probíhá na adrese \http://127.0.0.1:8000\ (nebo dle promìnné prostøedí \NEXT_PUBLIC_API_URL\).
