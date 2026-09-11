---
title: "Q003 - Zlomená přísaha na křižovatce"
tags: [quest, main, act1, crossroads, investigation, wolves]
quest_id: "Q003"
type: main
giver_id: "strazmistr_aldric"
giver: "[[Strážmistr Aldric]]"
start_location_id: "oakhaven"
target_location_ids:
  - "crossroads"
location: "[[Oakhaven]] ➔ [[Stará křižovatka]]"
prerequisite_quests:
  - "Q002"
prerequisite_flags: []
kingdom_id: 1
level_range: "2-3"
reward:
  gold: 45
  xp: 160
  items:
    - "Kódovaný deník důlního dozorce (šifrované záznamy o tajných dodávkách trhavin)"
    - "Mosazný klíč k prachárně Železného Prahu"
    - "Císařská jezdecká dýka (kvalitní valerijská ocel)"
  reputation:
    valerijske_imperium: 5
    oakhaven: 10
---

# Q003 – Zlomená přísaha na křižovatce

> *"Císařská zásobovací kolona nedorazila. Zůstaly po ní jen doutnající vozy a těla rozervaná spáry, jaké žádný obyčejný vlk v životě neměl. Kaelen tvrdí, že je to hněv boží, ale já cítím pach síry a zrady. Jdi na křižovatku, najdi kurýrní brašnu a zjisti, co nám říše doopravdy vezla."*  
> — [[Strážmistr Aldric]], ve strážnici Oakhaven

---

## Přehled úkolu
Dozvuky událostí v kryptě sv. Judity ([[Q002_SepotKrypty]]) otřásly celým údolím. Narušení prastaré stínové pečeti vyslalo rázovou vlnu do okolní divočiny a na strategickém tranzitním uzlu [[Stará křižovatka]] došlo k masakru. Pravidelná zásobovací kolona z [[Valerijské Impérium]], která vezla ocel, mzdy a citlivé technické vybavení pro důlní cech z [[Železný Práh]], byla přepadena a do jednoho vybita.

Útok však nespáchali obyčejní lapkové:
- Na převrácených vozech leží krusty nepřirozeného modrého ledu a krystalického prachu.
- Těla koní i vojáků nesou stopy po tesácích zmutovaných vlků s azurově zářícíma očima.
- Chybí transportní truhla důlního dozorce s technickými mapami podzemí.

[[Strážmistr Aldric]] posílá hráče na křižovatku, aby zajistil místo činu dřív, než k němu dorazí inkviziční garda [[Inkvizitor Kaelen|Inkvizitora Kaelena]] nebo mrchožrouti.

---

## Zúčastněné postavy & vazby
- **Zadavatel:** [[Strážmistr Aldric]] (potřebuje důkazy pro udržení pořádku a ochranu města).
- **Inkviziční stín:** [[Inkvizitor Kaelen]] (sleduje hráče a pokouší se zabavit dokumenty pro církevní archiv).
- **Umírající svědek:** Desátník Beric (poslední přeživší z kolony, choulí se v křoví u obelisku).
- **Zainteresovaný překupník:** [[Hostinský Odo]] (v hostinci se vyptává na ztracený náklad zbraní).
- **Dotčené lokace:** [[Oakhaven]], [[Stará křižovatka]].

---

## Fáze úkolu (Quest Steps)

```yaml
steps:
  - id: 1
    objective: "Přijmi rozkazy od Strážmistra Aldrica ve strážnici Oakhaven"
    location_id: "oakhaven"
    trigger: "interact_npc:strazmistr_aldric"
    narrative: |
      Aldric je nevyspalý, na stole má rozloženou mapu pohraničí a neustále pokukuje po okně, odkud je vidět Kaelenova hlídka u hostince.
      'Kolona měla přivézt náhradní těsnění pro důlní čerpadla a dopis od vrchního hejtmana. Pokud se ty papíry dostanou do rukou banditům nebo Kaelenovi, máme na krku buď hlad, nebo hranici. Najdi kurýra a přines mi jeho pečetní brašnu.'
    on_complete_flag: "Q003_step1_briefed"

  - id: 2
    objective: "Doraz na Starou křižovatku a prozkoumej zničenou karavanu"
    location_id: "crossroads"
    trigger: "location_arrival"
    narrative: |
      Na křižovatce visí těžký zápach spáleniny a zkaženého masa. Uprostřed silnice doutnají dva převrácené kryté vozy. Omšelý kamenný obelisk Solariana je osekán sekerami a na větvích starého jilmu sedí hejno černých krkavců.
      Všude kolem jsou stopy těžkých tlap s hlubokými zářezy drápů do kamenné dlažby.
    on_complete_flag: "Q003_step2_arrived"

  - id: 3
    objective: "Odraz útok smečky krystalických vlků a jejich alfa samce"
    location_id: "crossroads"
    trigger: "combat_encounter"
    narrative: |
      Z houštin u cesty k Temnému hvozdu se neslyšně vynoří trojice vlků. Jejich srst je slepená černým dehtem a z páteře jim vyrůstají ostré modré krystaly Aetheritu.
      V čele smečky stojí obrovský krystalický alfa vlk. Boj je rychlý a divoký – zvířata jsou nepřirozeně rychlá a po zásahu jejich rány nekrvácejí, ale prskají chladnými jiskrami.
    on_complete_flag: "Q003_step3_combat_won"

  - id: 4
    objective: "Vyslechni umírajícího desátníka Berica ukrytého v roští"
    location_id: "crossroads"
    trigger: "dialogue_investigation"
    narrative: |
      Za kamenným obeliskem nacházíš v kaluži krve ležícího císařského desátníka. Sípe a v křeči svírá zlomené kopí:
      'To nebyli... vlci... Někdo je vedl píšťalou z lesa... Chtěli jen schránu dozorce... Vzali těžební vrtáky a rozbušky... Deník jsem... schoval do dutiny obelisku...'
      Desátník vydechne naposledy. Z dutiny pod kamennou deskou obelisku vyjmeš těžký kožený svazek: *Kódovaný deník důlního dozorce* a mosazný klíč.
    on_complete_flag: "Q003_step4_clues_found"

  - id: 5
    objective: "Konfrontuj nečekaného zvěda a rozhodni o osudu deníku"
    location_id: "crossroads"
    trigger: "branch_choice"
    narrative: |
      Jakmile vstaneš s deníkem v ruce, z mlhy vystoupí dvě postavy:
      Jednou je bratr Lucian, Kaelenův ozbrojený akolyta v bílém plášti, který tě sledoval z Oakhaven.
      Druhou je překupník z Nového Přístavu, který vylezl z pašerácké stezky a nabízí za deník hromadu stříbra.
      Zároveň víš, že na deník čeká Aldric, pro něhož je to jediná páka na udržení pořádku.
```

---

## Větvení a Morální Volby (Branches)

```yaml
branches:
  A:
    label: "Věrnost městu – Odevzdat deník a klíč Strážmistru Aldricovi"
    narrative: |
      Odmítneš nabídky překupníka i hrozby akolyty. S tasenou dýkou donutíš bratra Luciana ustoupit a spěcháš zpět do Oakhaven přímo za Aldricem.
      Aldric ve strážnici horečně listuje stránkami: 'Bohové na nebi... Někdo z městské rady už tři měsíce tajně dovážel těžební nálože z Železného Prahu přímo do zakázaných šachet dolu! Tohle nebyla nehoda, to byla příprava na krádež celého revíru!'
      Aldric ti vyplatí žold z městské pokladny, nechá tě zapsat do čestné knihy gardy a začíná organizovat noční hlídky kolem cechovních skladů.
    set_flags:
      - "Q003_completed_A"
      - "aldric_has_mining_records"
      - "guard_alerted_to_sabotage"
    reward:
      gold: 45
      xp: 160
      items:
        - "Kódovaný deník důlního dozorce (uložen u Aldrica jako důkazní materiál)"
        - "Mosazný klíč k prachárně Železného Prahu (zůstává hráči do budoucího questu Q006)"
        - "Císařská jezdecká dýka"
    reputation_change:
      valerijske_imperium: 5
      oakhaven: 15
      teokracie_solariova: -5
    unlock_quests: ["Q004_PecetAPlamen"]

  B:
    label: "Zlatý zisk – Prodat depeši překupníkovi ze Svobodných měst"
    narrative: |
      Stříbro má větší váhu než slova starého strážmistra. Předáš šifrovaný deník překupníkovi z Nového Přístavu, který ti do dlaně vysype těžký měšec zlaťáků a podstrčí ti falešný, spálený pergamen pro Aldrica:
      'Moudrá volba, příteli. Naše lidi v přístavu velmi zajímá, jaké krystaly se tu kopou. Pokud budeš mít v budoucnu víc takových cetek, Nový Přístav ti nezůstane nic dlužen.'
      Mosazný klíč k prachárně si ponecháš pro sebe. Aldricovi nahlásíš, že karavana byla do mrtě spálena. Aldric je zklamán, ale uvěří ti. V hostinci U Zlomeného štítu však máš od této chvíle otevřené dveře k černému trhu.
    set_flags:
      - "Q003_completed_B"
      - "free_cities_bought_intel"
      - "player_has_smuggler_favor"
    reward:
      gold: 90
      xp: 140
      items:
        - "Mosazný klíč k prachárně Železného Prahu"
        - "Prsten překupnického cechu Nového Přístavu (-10 % sleva na černém trhu)"
    reputation_change:
      svobodna_mesta: 15
      oakhaven: -5
      valerijske_imperium: -5
    unlock_quests: ["Q004_PecetAPlamen"]

  C:
    label: "Odevzdání Inkvizici – Předat důkazy bratru Lucianovi pro Kaelena"
    narrative: |
      Uvěříš, že pouze přísná ruka Solariana dokáže zastavit šířící se kletbu. Předáš deník do rukou bratra Luciana.
      Lucian pergamen políbí a schová pod plášť: 'Solarian vidí tvou poslušnost, bratře. Inkvizitor Kaelen tyto důkazy použije před městskou radou. Ti bezbožní kováři a kacířští měšťané poznají váhu slunečního soudu.'
      Inkvizice okamžitě využije zápisy o výbušninách jako záminku k obvinění kováře Torbena a městské správy z napomáhání kacířství. Atmosféra v Oakhaven zhoustne k prasknutí a u městských bran vyrostou hlídky Plamenného meče.
    set_flags:
      - "Q003_completed_C"
      - "kaelen_has_mining_records"
      - "inquisition_pressures_council"
    reward:
      gold: 35
      xp: 170
      items:
        - "Mosazný klíč k prachárně Železného Prahu (tajně zatajen před inkvizitorem)"
        - "Posvěcený křesací kámen Solariana"
    reputation_change:
      teokracie_solariova: 15
      oakhaven: -10
      zelezny_prah: -10
    unlock_quests: ["Q004_PecetAPlamen"]
```

---

## Dialogové Stromy (Dialogue Excerpts)

### Rozhovor s Aldricem před odchodem
```yaml
dialogue_aldric_start:
  speaker: "Strážmistr Aldric"
  lines:
    - text: "Ta kolona nevyjela ze stanice včera. Měli tu být za rozbřesku. Poslal jsem tam dva mladé kluky na koních, ale vrátili se jen koně se zkrvavenými sedly."
    - player_option_1: "Co přesně ta kolona vezla, Aldricu?"
      response: "Oficiálně? Ocelové trámy, nářadí pro důlní dílnu a mzdy pro posádku. Neoficiálně... bednu s pečetí císařského hejtmana. A právě po té bedně někdo šel. Kaelen už brousí meče svých fanatiků, a jestli tam dorazí dřív než my, vyhlásí v údolí kacířský hon."
    - player_option_2: "Mám očekávat bandity, nebo něco horšího?"
      response: "Běžný lapka krade koně a stříbro. Nechává za sebou stopy bot a oharky cigaret. Z toho, co říkali stopaři, tam zbyly jen louže studené krve a krystaly vyražené ze země. Dávej si zatraceně dobrý pozor."
```

### Dialog u obelisku s umírajícím desátníkem
```yaml
dialogue_courier_death:
  speaker: "Desátník Beric"
  lines:
    - text: "Voda... máš vodu?... V krku mám... jako by mi tam někdo nasypal drcené sklo..."
    - player_action: "Podat čutoru s vodou a zkontrolovat rány."
      response: "Díky... Stejně už necítím nohy. Přišli z lesa... Nejprve mlha, pak ten vysoký tón, co ti trhá bubínky v uších. Vlci neměli hlad... hledali schránu s nápisem 'Železný Práh'. Vzali rozbušky... a odtáhli je k dolu..."
    - player_question: "Kde jsou ty dokumenty?"
      response: "V obelisku... škvíra pod slunečním křížem... Vezmi to... nenech to těm psům..."
```

---

## Získané předměty & Návaznost na další questy
- **Kódovaný deník důlního dozorce:** Hlavní dějový spouštěč pro následující quest [[Q004_PecetAPlamen]], kde se podle zvolené větve rozhoduje o politickém střetu na radnici v Oakhaven.
- **Mosazný klíč k prachárně Železného Prahu:** Unikátní klíč, který hráč ponese celým aktem až do [[Q006_HlasyZPodzemi]] a [[Q007_ZtracenaKomora]], kde odemkne sklad trhacího prachu potřebného k záchraně nebo odpálení dolu.
- **Císařská jezdecká dýka:** Masivní čepel z valerijské oceli vhodná pro boj zblízka i páčení mechanismů.
