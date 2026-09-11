---
title: "Q002 - Šepot krypty"
tags: [quest, main, act1, oakhaven, ruins]
quest_id: "Q002"
type: main
giver_id: "inkvizitor_kaelen"
giver: "[[Inkvizitor Kaelen]]"
start_location_id: "oakhaven"
target_location_ids:
  - "crossroads"
  - "monastery_ruins"
location: "[[Oakhaven]] ➔ [[Stará křižovatka]] ➔ [[Ruiny kláštera]]"
prerequisite_quests:
  - "Q001"
prerequisite_flags: []
kingdom_id: 1
level_range: "2-4"
reward:
  gold: 40
  xp: 120
  items: ["Zapečetěný svitek inkvizice"]
  reputation:
    valerijske_imperium: 3
---

# Q002 – Šepot krypty

> *"Kde se sejde hřích se slabostí, tam začíná doutnat kacířství. A kde doutná kacířství, tam my přinášíme posvátný oheň. Vyber si, cizinče: buď mi pomůžeš vymést tu špínu z krypty svaté Judity, nebo tě spálím spolu s ní."*  
> — [[Inkvizitor Kaelen]], Řád Plamenného meče

---

## Přehled úkolu
Události kolem krádeže prstenu zesnulé Anny v úkolu [[Q001_ZtrazenýPrsten]] nezůstaly bez odezvy. Přemístění šperku s ochrannou runou boha [[Religion#Kull|Kulla]] narušilo křehkou bariéru, kterou Anna za svého života udržovala nad okolím městečka. Do [[Oakhaven]] nečekaně dorazil **[[Inkvizitor Kaelen]]** z fanatické [[Teokracie Solariova]], jehož magická kadidelnice zachytila záchvěv kacířské magie.

Kaelen ovládl kout v [[Hostinec U Zlomeného štítu]], terorizuje nervózního [[Strážmistr Aldric|strážmistra Aldrica]] a větří stopu po Probuzené z [[Tajemné Útočiště]]. Ví, že stopy loupeže a temného šepotu se sbíhají v prastarých [[Ruiny kláštera|Ruinách kláštera sv. Judity]]. Protože však v kryptách působí stará kletba, která pálí každého nositele čisté sluneční víry, potřebuje Kaelen bezskrupulózního průzkumníka – hráče.

**Dějový zvrat (Fable / Zaklínač styl):**
V hlubinách krypty hráč neodhalí pouhé doupě fanatiků, nýbrž tragickou oběť. Anna nebyla chamtivou kacířkou; byla strážkyní, která v podzemí uvěznila prastarou stínovou entitu – *Stínový pečetní kámen*. Bez její ochrany se kult Kulla a oživlí mniši pokoušejí relikvii vyrvat. Hráč se ocitá mezi fanatismem slunečního inkvizitora, který zničí město i nebohého [[Boris Mlynář|Borise]], a lákavým, leč zhoubným šepotem boha Kulla.

---

## Zúčastněné postavy & vazby
- **Zadavatel:** [[Inkvizitor Kaelen]] (vynucená nabídka pod hrozbou inkvizičního vyšetřování)
- **Svědek & Oběť:** [[Boris Mlynář]] (jeho osud visí na vlásku podle hráčovy volby)
- **Zastrašená autorita:** [[Strážmistr Aldric]] (prosí hráče, aby Kaelena nějak uspokojil a odvrátil zkázu města)
- **Oponent v kryptě:** Kultista Malakar a oživlí kostlivci mnichů
- **Dotčené lokace:** [[Oakhaven]], [[Stará křižovatka]], [[Ruiny kláštera]]

---

## Fáze úkolu (Steps)

```yaml
steps:
  - id: 1
    objective: "Konfrontuj Inkvizitora Kaelena v Hostinci U Zlomeného štítu"
    location_id: "oakhaven"
    trigger: "interact_npc:inkvizitor_kaelen"
    narrative: |
      Hostinec U Zlomeného štítu ztichl. Štamgasti sedí u piva s očima sklopenýma k podlaze a strážmistr Aldric postává u dveří s nervózní rukou na jílci meče. U krbu sedí Inkvizitor Kaelen v popelavém plášti s planoucím mečem Solariana na hrudi.
      Kaelen tě probodne chladným pohledem. Ví o tělech banditů na křižovatce i o runovém prstenu. Bez okolků ti předkládá volbu: půjdeš jako předvoj do Ruin kláštera a přineseš mu z krypty kacířské relikvie a Anniny zápisky, nebo nechá Oakhaven prohlásit za hnízdo kacířů a předvolá pluk Plamenného meče.
    on_complete_flag: "Q002_step1_done"

  - id: 2
    objective: "Projdi Starou křižovatkou a následuj stopy stínů k Ruinám kláštera"
    location_id: "crossroads"
    trigger: "combat"
    narrative: |
      Na Staré křižovatce visí těžká mlha páchnoucí ozónem a spáleným voskem. Zvětralý Solarianův obelisk je zbrocen čerstvou černou krví. Z křovin se na tebe vrhnou stínoví vlci s planoucíma fialovýma očima, vedení zvědem kultu Kulla.
      Po krátkém a krvavém střetu nacházíš u padlého kultisty pergamen s pokyny: 'Pečeť Probuzené slábne. Oltář v kryptě svaté Judity volá své pány. Přineste lidskou krev k probuzení Kámenu Šepotu.'
    on_complete_flag: "Q002_step2_done"

  - id: 3
    objective: "Pronikni do vyhořelého opatství a najdi vchod do podzemních krypt"
    location_id: "monastery_ruins"
    trigger: "explore"
    narrative: |
      Černé ohořelé zdi opatství svaté Judity se tyčí proti zatažené obloze. V rozpadlé chrámové lodi se mezi vyvrácenými lavicemi plouží nemrtví mniši – kostlivci v cárech posvátných rouch, jejichž kosti drží pohromadě pulzující stínová vlákna.
      Prosekáš se znesvěceným chrámem až k oltáři, kde leží rozbitá kamenná deska s reliéfem plačící ženy. Pod deskou zívá vlhký, po schodech klesající jícen podzemní krypty, odkud vane mrazivý průvan a tichý, mámivý šepot.
    on_complete_flag: "Q002_step3_done"

  - id: 4
    objective: "Prozkoumej Kryptu svaté Judity a zneškodni Kultistu Malakara"
    location_id: "monastery_ruins"
    trigger: "combat"
    narrative: |
      V hlubinách krypty panuje hrobové ticho přerušované jen kapáním vody. Uprostřed síně stojí znesvěcený oltář obklopený stříbrnými maskami boha Kulla. Nad oltářem se vznáší Stínový pečetní kámen, z něhož prýští chladná temnota.
      U oltáře dokončuje rituál Kultista Malakar obklopený stínovými zjeveními. Vypukne nelítostný boj, v němž Malakar vrhá kletby z temnoty a stíny se natahují po tvém hrdle. Když Malakar padá s proklátou hrudí, na oltáři po něm zůstává kožené pouzdro s Anniným zapečetěným deníkem.
    on_complete_flag: "Q002_step4_done"

  - id: 5
    objective: "Rozhodni o osudu Stínového pečetního kamene a Annina odkazu"
    location_id: "monastery_ruins"
    trigger: "branch_choice"
    narrative: |
      Otevřeš Annin deník. Písmo je roztřesené, ale jasné: Anna sem přišla z Tajemného Útočiště, aby kámen zapečetila a zabránila vypuknutí stínového moru. Boris o ničem nevěděl – vzala si ho z lásky i proto, aby splynula s davem.
      Kámen na oltáři tiše pulzuje. Slyšíš v hlavě hlas boha Kulla, slibující skrytou moc a odhalení tvého vlastního dřímajícího Probuzení. Ze schodů krypty se však již ozývají těžké kroky okovaných bot – Inkvizitor Kaelen s pochodní a taseným mečem sestupuje dolů. Teď se rozhodne o všem.
```

---

## Větvení a Morální Volby (Branches)

```yaml
branches:
  A:
    label: "Sluneční ortel – Odevzdat relikvii i deník Kaelenovi k očistnému plameni"
    narrative: |
      Potlačíš vábení stínů a ustoupíš. Podáváš Kaelenovi Annin deník i chladný pečetní kámen. Inkvizitorovy oči zahoří fanatickým uspokojením. Kaelen polije oltář posvátným solariánským olejem a zapálí jej bílým plamenem.
      Kámen s ohlušujícím kvílením puká v gejzíru černého dýmu a strop krypty se začíná hroutit. Sotva vyváznete ven. Kaelen však v deníku nachází Annino jméno i zmínku o mlýnu v Oakhaven.
      'Spravedlnost nezná slitování,' prohlásí Kaelen chladně. V Oakhaven nechá okamžitě zatknout Borise Mlynáře za ukrývání kacířky. Starý mlynář končí v řetězech na pranýři a město je sevřeno strachem pod stanným právem inkvizice.
    set_flags:
      - "Q002_completed_A"
      - "kaelen_purged_ruins"
      - "boris_imprisoned"
      - "oakhaven_inquisition_lockdown"
    clear_flags: []
    reward:
      gold: 50
      xp: 120
      items: ["Solarianův posvěcený amulet (+10% odolnost proti ohni)", "Kaelenova propustka"]
    reputation_change:
      teokracie_solariova: 10
      oakhaven: -10
      tajemne_utociste: -15
    unlock_quests: ["Q003_KladivoInkvizice"]
    lock_quests: ["Q003_HlasyZeStinu", "Q003_KrvaveProcitnuti"]
    npc_disposition_change:
      inkvizitor_kaelen: "friendly"
      strazmistr_aldric: "hostile"
      boris_mlynar: "fearful"
    world_event: "Ruiny kláštera byly rituálně vypáleny. V Oakhaven vyrostl inkviziční pranýř a Boris Mlynář čeká v řetězech na odvoz do Sol-Sancta. Městem hlídkují ozbrojenci v bílých pláštích."

  B:
    label: "Zmlklé svědectví – Zapečetit kámen Anniným rituálem a obelstít inkvizici"
    narrative: |
      Rychle nalistuješ v Annině deníku ochrannou formuli. Použiješ svou vlastní krev a zopakuješ runová slova Kulla, jimiž Anna kámen poutala. Temný šepot utichne a chladný kámen se zbarví do matně šedé barvy mrtvého křemene. Schováš deník i zapečetěný kámen do tlumoku a na oltář pohodíš ohořelé cetky banditů a prázdnou lebku.
      Když Kaelen dorazí k oltáři, lžeš mu s kamennou tváří: 'Kultisté byli jen pobláznění zloději. Rituál selhal dřív, než jsem dorazil, a jejich těla pohltil oheň. Není tu nic než prach.'
      Kaelen podezřívavě zkoumá oltář. Vzduch je čistý, magické záření vyprchalo. Inkvizitor s nevolí procedí mezi zuby kletbu. Nemá důkaz, aby město spálil, ani aby obvinil mlynáře. Znechuceně ti hodí měšec se stříbrem a opouští Oakhaven.
      Večer za tebou do hostince přistoupí zahalená postava a do dlaně ti vtiskne pečetní vosk se znakem Útočiště: 'Anna by byla hrdá. Útočiště nezapomíná na ty, kdo chrání tajemství.'
    set_flags:
      - "Q002_completed_B"
      - "anna_secrets_kept"
      - "sealed_shadow_stone"
      - "contact_tajemne_utociste"
    clear_flags: []
    reward:
      gold: 35
      xp: 150
      items: ["Annin stříbrný medailon (+10% odolnost vůči kletbám)", "Zapečetěná schrána Útočiště"]
    reputation_change:
      tajemne_utociste: 15
      oakhaven: 5
      teokracie_solariova: -2
    unlock_quests: ["Q003_HlasyZeStinu"]
    lock_quests: ["Q003_KladivoInkvizice", "Q003_KrvaveProcitnuti"]
    npc_disposition_change:
      inkvizitor_kaelen: "hostile"
      strazmistr_aldric: "friendly"
      boris_mlynar: "friendly"
    world_event: "Inkvizitor Kaelen opustil Oakhaven bez důkazů, ačkoliv přísahal, že se vrátí. Boris Mlynář je v bezpečí a tajná síť Tajemného Útočiště navázala s hráčem první kontakt."

  C:
    label: "Pakt se Stíny – Vyrvat Stínový kámen z oltáře a zahnat inkvizitora do pasti"
    narrative: |
      Zavrhneš Anninu opatrnost i Kaelenovy dogmatické výzvy. Dýkou vypáčíš pulzující Stínový pečetní kámen přímo ze středu znesvěceného oltáře a uzavřeš jej do těžkého olověného pouzdra z Anniny truhly. Oltář bez své kotvy začne divoce praskat a celá krypta se otřásá.
      Když Kaelen vtrhne do krypty, spatří relikvii v tvých rukou: 'Okamžitě ten klenot polož, kacíři!'
      Místo boje však přesekneš podpěrné lano starého kamenného lustru. Těžký kamenný kruh se zřítí přímo mezi vás a zatarasí přístupové schodiště lavinou kamení. Těžce potlučený Kaelen zůstává uvězněn na druhé straně závalu a ty unikáš starou pašeráckou šachtou do bezpečí.
      V batohu ti chladně tepe mocná, neprobádaná relikvie, která bude v budoucnu klíčem k prastarým podzemním branám.
    set_flags:
      - "Q002_completed_C"
      - "player_has_kull_relic"
      - "kaelen_trapped_in_ruins"
    clear_flags: []
    reward:
      gold: 0
      xp: 220
      items: ["Střípek Srdce Kulla (Unikátní klíčový předmět: starobylá relikvie vyzařující chlad, reagující na stínové zámky a oltáře)"]
    reputation_change:
      teokracie_solariova: -25
      oakhaven: -5
      tajemne_utociste: 5
    unlock_quests: ["Q003_KrvaveProcitnuti"]
    lock_quests: ["Q003_KladivoInkvizice", "Q003_HlasyZeStinu"]
    npc_disposition_change:
      inkvizitor_kaelen: "hostile"
      strazmistr_aldric: "fearful"
      boris_mlynar: "fearful"
    world_event: "Hráč ukořistil Stínový kámen jako mocnou relikvii. Inkvizitor Kaelen byl uvězněn za závalem v kryptě a jeho hněv bude neúprosný. Ruiny kláštera se staly nebezpečnou zónou a v údolí houstne napětí."
```

---

## Decision Flags Reference

### NASTAVUJE:
- `Q002_step1_done`, `Q002_step2_done`, `Q002_step3_done`, `Q002_step4_done` (průběh questu)
- `Q002_completed_A` – relikvie předána Kaelenovi, Boris uvězněn, Oakhaven pod stanným právem
- `Q002_completed_B` – relikvie zapečetěna, Kaelen obelstěn, spojenectví s Útočištěm
- `Q002_completed_C` – moc kamene vstřebána hráčem, Kaelen zahnán na útěk, stínové Probuzení
- `kaelen_purged_ruins` / `boris_imprisoned` / `oakhaven_inquisition_lockdown` (varianta A)
- `anna_secrets_kept` / `sealed_shadow_stone` / `contact_tajemne_utociste` (varianta B)
- `player_absorbed_kull_stone` / `player_awakened_shadow` / `kaelen_routed_and_wounded` (varianta C)

### ČTOU (prerequisite_flags):
- Plynule navazuje na splnění [[Q001_ZtrazenýPrsten]]:
  - `Q001_completed_A` (Kaelen pátrá po podezřele vděčném Borisovi)
  - `Q001_completed_B` (Kaelen zachytil zvěsti o Annině tajné truhle)
  - `Q001_completed_C` (Kaelen cítí z hráče auru ukradeného prstenu Kulla)

---

## Následky volby v herním světě

### Varianta A (Sluneční ortel):
- **Oakhaven:** Město se mění v policejní stát. Na náměstí stojí pranýř, v němž je uvězněn [[Boris Mlynář]]. Stráže Teokracie provádějí noční prohlídky domů. Ceny zboží rostou (+20%), atmosféra je plná paranoie.
- **Ruiny kláštera:** Podzemní krypta je zavalena a ohořelá. Nemrtví byli zničeni bílým plamenem. Místo je bezpečné, ale pusté.
- **NPC Reakce:** [[Strážmistr Aldric]] opovrhuje hráčem za to, že přivedl inkvizici do města. [[Inkvizitor Kaelen]] nabízí hráči další církevní zakázky.

### Varianta B (Zmlklé svědectví):
- **Oakhaven:** Město si vydechne. Život se vrací do normálu. Boris Mlynář dál mele mouku a vděčně zásobuje hráče jídlem zdarma.
- **Tajemné Útočiště:** Hráč se dostává do povědomí Kruhu probuzených. V hospodě se začnou objevovat tajní kurýři nabízející zakázky a magické zboží.
- **Ruiny kláštera:** Krypta je vyčištěna od kultistů, ale pečeť je křehká. V budoucnu může vyžadovat další rituální údržbu.

### Varianta C (Pakt se Stíny):
- **Hráč:** Postava získává trvalé vizuální změny (zčernalé žíly, stříbřité odlesky očí). Odemčena pasivní schopnost *Kullův šepot* umožňující odhalovat skryté lži v dialozích a stínové skrýše ve světě.
- **Oakhaven:** Místní lidé se hráče bojí a vyhýbají se mu. V noci se z lesů stahují stíny a Aldric musí zdvojnásobit noční hlídky.
- **Svět:** Teokracie Solariova vyhlašuje na hráče lov. V pozdějších aktech se na cestách budou objevovat lovci kacířů a paladini Plamenného meče.
