# Aelthgard: AI Dungeons & Dragons RPG (v2.1)

Aelthgard je next-gen textové RPG pohánìné umìlou inteligencí, které pøináší dynamickı a nekoneènı záitek inspirovanı stolními hrami na hrdiny (D&D). Pánem jeskynì (Dungeon Masterem) je zde Gemini AI, které reaguje na jakoukoliv tvoji akci, posouvá pøíbìh a øídí herní svìt.

## ?? Novinky ve verzi 2.1 (Modularizace & Stabilita)
- **Kompletní Backend Refaktoring:** Monolitickı systém byl rozdìlen do moderní FastAPI modulární architektury (outers, services, models).
- **Pydantic Strict Schemas:** Umìlá inteligence je nyní vázána pøísnımi Pydantic schématy pomocí nejnovìjšího Google GenAI SDK. To absolutnì eliminuje chyby spojené se špatnım parsováním JSONu z modelu.
- **Zustand State Management:** UI frontend se doèkal obrovského odlehèení pøesunem masivních stavù (historie, akce, mapa) z lokálních komponent do centrálního gameStore.ts.
- **Prostorová konzistence (Spatial Realism):** Byla implementována striktní pravidla zamezující NPC halucinacím. Postavy jsou pevnì vázány na své lokace a nemohou "teleportovat" pøes mapu.

## ??? Pøedchozí novinky (v2.0 World-Gen Overhaul)
- **Kompletní UI/UX Overhaul:** Pøestavìno do Dark Fantasy Glassmorphism stylu. Vizuál plnı tmavé mlhy, zlaté magie a elegantních karet postav.
- **Fyzická Honeycomb Mapa:** Svìt u není jen imaginární text. Je generován matematicky (šestiúhelníková møíka, polomìr 15), obsahuje 7 Království, stovky procedurálnì generovanıch Point of Interests a specifické biomy.
- **Lore Bible:** Pøi startu hry Vypravìè vymyslí 20stránkovı dokument historie a atmosféry konkrétnì pro tvou mapu.
- **Hardcore Cestování:** Cestování mezi hexy spotøebovává jídlo a dny. Hra obsahuje systém proti vyhladovìní a náhodná setkání øízená matematikou, na která AI plynule navazuje.

## ?? Vlastnosti hry

- **Volnost v rozhodování:** Nejsi omezen jen na pøedem pøipravené odpovìdi. Mùeš do textového pole napsat cokoliv a Pán jeskynì na to zareaguje. OOC (Out of character) mód pro plánování s DM.
- **Hlasovı Vypravìè (TTS):** Herní události, promluvy NPC i popisy prostøedí jsou plnì namluvené pomocí realistickıch èeskıch hlasù.
- **Vizuální dokreslení:** Hra generuje portréty tvé postavy a lokací na míru pomocí sluby Pollinations.ai.
- **Herní mechaniky:** Za hrou bìí odlehèená verze pravidel - tvá postava má statistiky (Síla, Obratnost...), zdraví, zkušenosti, inventáø a zlato. Umìlá inteligence tyto mechaniky respektuje.
- **Tvorba Hrdiny:** Plynulı magickı 3-krokovı prùvodce (Framer Motion). Vyber si rasu a povolání. AI ti vygeneruje kompletní pøíbìhové pozadí.
- **Poutavı svìt Aelthgard:** Prozkoumávej temné lesy, rušná mìsta, zatuchlé kobky a plò úkoly, které ti zadávají ivé postavy v reálném èase.

## ?? Jak hrát

1. **Registrace:** Zadej svùj e-mail a heslo.
2. **Tvorba postavy:** Magickım prùvodcem si vytvoø Legendu. Tvé statistiky se automaticky optimalizují.
3. **Pøíbìh a Mapa:** Hra se vdy ukládá automaticky. Posouvej svou peèe po pergaménové mapì svìta a prozkoumávej hex za hexem.
4. **Akce:** Mùeš vyuít rychlá tlaèítka pro prùzkum, nebo napsat svou vlastní kreativní akci.
5. **Pøeití:** Nakupuj zásoby u obchodníkù a lov v lesích. Cestování nehostinnou krajinou stojí peníze i dny!

Vítej v Aelthgardu. Tvé legendární dobrodruství právì zaèíná.
