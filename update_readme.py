import codecs

new_readme = """# Aelthgard: AI Dungeons & Dragons RPG (v2.0)

Aelthgard je next-gen textové RPG poháněné umělou inteligencí, které přináší dynamický a nekonečný zážitek inspirovaný stolními hrami na hrdiny (D&D). Pánem jeskyně (Dungeon Masterem) je zde Gemini AI, která reaguje na jakoukoliv tvoji akci, posouvá příběh a řídí herní svět.

## 🚀 Novinky ve verzi 2.0 (World-Gen Overhaul)
- **Kompletní UI/UX Overhaul:** Přebudováno do Dark Fantasy Glassmorphism stylu. Vizuál plný tmavé mlhy, zlaté magie a elegantních karet postav.
- **Fyzická Honeycomb Mapa:** Svět už není jen imaginární text. Je generován matematicky (šestiúhelníková mřížka, poloměr 15), obsahuje 7 Království, stovky procedurálně generovaných Point of Interests a specifické biomy.
- **Lore Bible:** Při startu hry Vypravěč vymyslí 20stránkový dokument historie a atmosféry konkrétně pro tvou mapu.
- **Hardcore Cestování:** Cestování mezi hexy spotřebovává jídlo a dny. Hra obsahuje systém proti vyhladovění a náhodná setkání řízená matematikou, na která AI plynule navazuje.

## 🎲 Vlastnosti hry

- **Volnost v rozhodování:** Nejsi omezen jen na předem připravené odpovědi. Můžeš do textového pole napsat cokoliv a Pán jeskyně na to zareaguje. OOC (Out of character) mod pro plánování s DM.
- **Hlasový Vypravěč (TTS):** Herní události, promluvy NPC i popisy prostředí jsou plně namluvené pomocí realistických českých hlasů.
- **Vizuální dokreslení:** Hra generuje portréty tvé postavy a lokací na míru pomocí služby Pollinations.ai.
- **Herní mechaniky:** Za hrou běží odlehčená verze pravidel - tvá postava má statistiky (Síla, Obratnost...), zdraví, zkušenosti, inventář a zlato. Umělá inteligence tyto mechaniky respektuje.
- **Tvorba Hrdiny:** Plynulý magický 3-krokový průvodce (Framer Motion). Vyber si rasu a povolání. AI ti vygeneruje kompletní příběhové pozadí.
- **Poutavý svět Aelthgard:** Prozkoumávej temné lesy, rušná města, zatuchlé kobky a plň úkoly, které ti zadávají živé postavy v reálném čase.

## 🗺️ Jak hrát

1. **Registrace:** Zadej svůj e-mail a heslo.
2. **Tvorba postavy:** Magickým průvodcem si vytvoř Legendu. Tvé statistiky se automaticky optimalizují.
3. **Příběh a Mapa:** Hra se vždy ukládá automaticky. Posouvej svou pečetí po pergaménové mapě světa a prozkoumávej hex za hexem.
4. **Akce:** Můžeš využít rychlá tlačítka pro průzkum, nebo napsat svou vlastní kreativní akci.
5. **Přežití:** Nakupuj zásoby u obchodníků a lov v lesích. Cestování nehostinnou krajinou stojí peníze i dny!

Vítej v Aelthgardu. Tvé legendární dobrodružství právě začíná.
"""

with codecs.open('README.md', 'w', 'utf-8') as f:
    f.write(new_readme)
