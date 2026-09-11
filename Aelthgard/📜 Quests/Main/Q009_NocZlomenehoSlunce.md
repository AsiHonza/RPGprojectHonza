---
title: "Q009 - Noc zlomeného slunce"
tags: [quest, main, act1, finale, climax, oakhaven]
quest_id: "Q009"
type: main_finale
giver_id: "strazmistr_aldric"
giver: "[[Strážmistr Aldric]]"
start_location_id: "oakhaven"
target_location_ids:
  - "oakhaven"
  - "abandoned_mine"
  - "crossroads"
location: "[[Oakhaven]] ➔ [[Opuštěný důl]] ➔ Útěk do [[Temný hvozd]]"
prerequisite_quests:
  - "Q008"
prerequisite_flags:
  - "mine_sabotage_triggered"
kingdom_id: 1
level_range: "4-5"
reward:
  gold: 100
  xp: 500
  items:
    - "Aetheritové jádro (Legendární klíčový artefakt uzavřený v těžké olověné schráně Železného Prahu)"
    - "Mapa tajných stezek pohraničního hvozdu"
    - "Zlomený pečetní prsten velitele gardy"
  reputation:
    valerijske_imperium: -10
    teokracie_solariova: -20
    kmeny_z_hvozdu: 10
---

# Q009 – Noc zlomeného slunce (Finále Aktu 1)

> *"Slyšíš to dunění pod nohama? To není bouřka, chlapče. To se láme samotná kostra země. Běž k bráně... a cokoliv z toho kouře vyleze, střílej!"*  
> — [[Strážmistr Aldric]], na hořící palisádě Oakhaven

---

## Přehled úkolu
Důsledky sabotáže a narušení tří prastarých pečetí v předchozích úkolech vyvrcholily v neodvratnou katastrofu. V hlubinách [[Opuštěný důl]] explodovala aetheritová žíla. Masivní zemětřesení protrhlo hráz u [[Starý mlýn]], zaplavilo spodní čtvrť a probudilo spící těžařský kolos – gigantickou mechanicko-krystalickou konstrukci Impéria a [[Železný Práh|Železného Prahu]], známou jako **Aetheritový kolos**.

Monstrum, poháněné nestabilním modrým jádrem, se prokopalo na povrch a kráčí přímo na [[Oakhaven]]. Z lesů v panice prchá zmutovaná zvěř a vniká do hořících ulic. Městská posádka je decimována, obyvatelé v panice prchají po cestě k [[Stará křižovatka]], kde však čekají zmatené a nepřátelské předsunuté hlídky z [[Teokracie Solariova]] a [[Valerijské Impérium]].

Hráč musí v zoufalém boji na život a na smrt využít všechny nashromážděné klíčové předměty z celého Aktu 1, zastavit kolosa dřív, než vyhladí přeživší, a rozhodnout o konečném osudu Oakhaven.

---

## Zúčastněné postavy & role
- **Zoufale velící autorita:** [[Strážmistr Aldric]] (krvácející, brání bránu do posledního dechu).
- **Civilní oběť:** [[Boris Mlynář]] (uvězněný na střeše polorozpadlého mlýna obklopeného vodou a plameny).
- **Inkviziční hrozba:** [[Inkvizitor Kaelen]] (pokud přežil Q002, pokouší se zabavit jádro ve jménu Solariana i za cenu smrti všech měšťanů).
- **Finální Boss Aktu 1:** **Aetheritový kolos** (masivní konstrukce z oceli a pulzujícího aetheritu).

---

## Fáze úkolu (Quest Steps)

```yaml
steps:
  - id: 1
    objective: "Ubraň hořící barikádu u západní brány Oakhaven"
    location_id: "oakhaven"
    trigger: "combat_wave"
    narrative: |
      Oakhaven se topí v kouři a plamenech. Obloha má nepřirozeně fialový nádech a vzduch páchne spáleným kamenem a ozónem. Aldric ti vráží do ruky poslední zásobu zápalných šípů.
      Z lesa a úpatí dolu se valí první vlna: krystaly zmutovaní rypáci a zdivočelí troglodyti. Společně s přežívajícími gardisty odrážíte útok na dřevěnou palisádu.
    on_complete_flag: "Q009_wave1_cleared"

  - id: 2
    objective: "Zachraň přeživší v zaplavené čtvrti u Starého mlýna"
    location_id: "oakhaven_mill"
    trigger: "interactive_hazard"
    narrative: |
      Zemětřesení prorazilo hráz a říčka Oak se vylila z břehů. Voda syčí při kontaktu s hořícími trámy. Na střeše Starého mlýna vidíš Borise Mlynáře, který v náručí tiskne rodinnou truhličku.
      Musíš přeskočit po plovoucích kládách, spustit stavidlo nouzovým kolem a vyvést Borise a hrstku dětí ven na suchou cestu dřív, než se konstrukce mlýna zřítí.
    on_complete_flag: "Q009_civilians_saved"

  - id: 3
    objective: "Konfrontuj Aetheritového kolosa na hlavním náměstí"
    location_id: "oakhaven_square"
    trigger: "boss_encounter"
    narrative: |
      Hradby s ohlušujícím rachotem povolí. Z prachu vystoupí dvanáctimetrový kolos ze zčernalé oceli, jehož hrudní plát pulzuje oslepujícím azurovým světlem Aetheritového jádra. Každý jeho krok zanechává v dlažbě roztavené stopy.
      Přímý útok zbraněmi selhává – jeho ocelový krunýř je nezranitelný. Musíš využít nashromážděné předměty z předchozích questů k oslabení hydraulických hadic a chladicích ventilů kolosa.
    on_complete_flag: "Q009_boss_weakened"

  - id: 4
    objective: "Učiň monumentální rozhodnutí o osudu kolosa a celého údolí"
    location_id: "oakhaven_square"
    trigger: "branch_choice"
    narrative: |
      Kolos klesá na jedno koleno, z jeho trupových spár uniká vařící pára a v obnažené hrudi tepe obnažené Aetheritové jádro. Teplota stoupá – za minutu hrozí totální termální exploze, která smaže z mapy celé údolí.
      V rukou máš nástroje, olověnou schránu a osud všech přeživších.
```

---

## Monumentální Větvení Finále (Epic Act Finale Branches)

```yaml
branches:
  A:
    label: "Odpálení tunelů – Záchrana zbylých budov za cenu totálního pohřbení dolu"
    narrative: |
      Použiješ zbylé odpalovací šňůry a trhaviny Železného Prahu z Q007. Vrazíš nálož do nohy kolosa a odpálíš přístupový svah. Lavina kamení, suti a zeminy strhne kolosa zpět do propasti a navždy pohřbí vstup do dolu.
      Výbuch je ohlušující. Náměstí v Oakhaven je uchráněno před plameny, ale horníci a průzkumníci uvěznění v hlubinách dolu nemají šanci na záchranu. Torbenův zoufalý řev se ztrácí v hřmotu padající suti.
      Z rozpadlého hrudníku kolosa vylovíš polorozpadlý fragment jádra. Městečko přežilo, ale je z něj izolovaná, vyhladovělá pevnost odříznutá od těžby. Zlomený Kovář Torben na tebe plivne: "Zabil jsi mé bratry. Už do mé kovárny nikdy nevkroč."
    set_flags:
      - "act1_finished"
      - "finale_choice_A_mines_collapsed"
      - "oakhaven_partially_survived"
      - "miners_sacrificed"
    reward:
      gold: 150
      xp: 500
      items: ["Aetheritové jádro (Zapečetěné v olověné schráně Železného Prahu)", "Čestný meč strážmistra Aldrica"]
    reputation_change:
      valerijske_imperium: 5
      zelezny_prah: -15
      oakhaven: 20
    world_event: "Důl byl navždy zavalen obrovským závalem. Oakhaven uhájilo holé přežití, ale hospodářsky zkrachovalo. Přeživší oslavují hráče jako zachránce městečka, i když cech kovářů truchlí nad ztrátami."

  B:
    label: "Vyrvání Jádra – Získání neporušeného artefaktu za cenu zničení městských hradeb"
    narrative: |
      Nasadíš si měděný respirátor, ignoruješ popáleniny třetího stupně a vrazíš páčidlo ze Železného Prahu přímo do pulzujícího jádra kolosa.
      S nelidským úsilím vytrhneš neporušené, zářící Aetheritové jádro a bleskově jej zaklapneš do těžké olověné schrány!
      Přerušený energetický obvod však vyvolá masivní rázovou vlnu. Tlakový vzduch rozmetá zbývající hradby Oakhaven, strhne střechy domů a srovná se zemí strážnici. Kolos se bez energie hroutí na hromadu mrtvého šrotu, ale tvá schrána v rukou nyní hrozivě pálí.
      Město je v ruinách a neobyvatelné. Zakrvácený Aldric se vyhrabe z trosek a chroptí: "Takže pro tebe byl ten modrý šutr cennější než životy dětí u mlýna... Táhni z mého města, než ti do zad vpálím šíp sám."
    set_flags:
      - "act1_finished"
      - "finale_choice_B_core_extracted"
      - "oakhaven_destroyed_evacuated"
      - "player_has_pristine_core"
    reward:
      gold: 80
      xp: 600
      items: ["Dokonalé Aetheritové jádro (Prvotřídní relikvie v těžké schráně, klíč k technologiím Sedmi království)", "Annin zachráněný cestovní plášť"]
    reputation_change:
      teokracie_solariova: -25
      valerijske_imperium: -10
      tajemne_utociste: 20
      svobodna_mesta: 15
    world_event: "Oakhaven lehlo popelem a obyvatelé se jako uprchlíci vydávají na cesty. Hráč ukořistil nedotčené Aetheritové jádro – prokletý artefakt, který chtějí získat všichni králové kontinentu."

  C:
    label: "Pakt s Hvozdem – Povolání divokého hvozdu a očištění údolí"
    narrative: |
      Přiložíš k ústům vyřezávaný tiskový roh z Q005 a zatroubíš starobylou píseň bohyně Vyldie.
      Z hlubin Temného hvozdu odpoví mohutný řev. Kořeny staletých dubů vyrazí z dlažby náměstí jako obří chapadla, obtočí končetiny kolosa a rozdrtí jeho ocelový trup na prach. Spolu s kořeny se však do města valí nezkrotný les – zdivočelá zeleň a mech během několika minut pohlcují domy, kovárnu i mlýn.
      Lidé prchají do polí, Aldric proklíná tvé jméno. Civilizace v údolí skončila, země se vrátila do rukou lesních kmenů. Šamanka z elfího tábora ti předává jádro, které kořeny očistily od zkaženosti: "Vezmi ho pryč, cizinče. Lidská chamtivost sem už nesmí vstoupit."
    set_flags:
      - "act1_finished"
      - "finale_choice_C_nature_reclaimed"
      - "oakhaven_overgrown_by_forest"
      - "allied_with_forest_clans"
    reward:
      gold: 30
      xp: 550
      items: ["Aetheritové jádro ovinuté posvátnou liánou Vyldie (Tlumí nepřirozené anomálie)", "Luk z posvátného tisu"]
    reputation_change:
      kmeny_z_hvozdu: 35
      teokracie_solariova: -40
      valerijske_imperium: -30
    world_event: "Oakhaven bylo pohlceno lesem. Na místě náměstí roste posvátný háj bohyně Vyldie. Císařské a solariánské armády narážejí na neprostupnou hradbu pralesa."
```

---

## 🪝 Epický Závěr & Můstek (Hook) do Aktu 2

Ať už hráč zvolil kteroukoliv z variant, výsledek je nezvratný:
1. **Status quo je zničen:** Oakhaven jako bezpečný výchozí bod přestalo existovat (je buď v ruinách, pohlceno lesem, nebo odříznuto za závalem).
2. **Hráč má v rukou Artefakt:** V těžké olověné schráně nese **Aetheritové jádro**. Hráč **nemá žádná nová kouzla**, ale nese předmět, který:
   - Dokáže napájet a odemykat prastaré konstrukce ze starých ér.
   - Vydává měřitelnou frekvenci, kterou dokáží stopovat magické kadidelnice inkvizice i krystaly mágů.
3. **Začíná Štvanice Sedmi království (Akt 2):**
   - Na [[Stará křižovatka]] dorazily přední hlídky tří armád: křížová výprava [[Teokracie Solariova]], těžkooděnci [[Valerijské Impérium]] a žoldnéři najatí syndikátem z [[Svobodná města]].
   - Jediná úniková cesta vede přes hluboké, neprobádané průsmyky [[Temný hvozd]] na širý kontinent.
   - **Titulní karta: AKT 2 – CESTA SEDMI KRÁLOVSTVÍ.**
