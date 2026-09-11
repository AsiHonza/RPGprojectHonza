---
title: "Q107 - Opeřený zloděj pergamenů"
tags: [quest, side, comedy, exploration, crossroads, oakhaven]
quest_id: "Q107"
type: side
giver_id: "ucenec_fabian"
giver: "[[Učenec Fabian]]"
start_location_id: "oakhaven_townhall"
target_location_ids:
  - "crossroads"
location: "[[Oakhaven]] ➔ [[Stará křižovatka]] (Šibeniční jilm a obelisk)"
prerequisite_quests: []
prerequisite_flags: []
kingdom_id: 1
level_range: "2"
reward:
  gold: 25
  xp: 100
  items:
    - "Fabianova příruční mapa skrytých schránek v pohraničí"
    - "Mosazné zvětšovací sklíčko (pomáhá odhalovat tajné mechanismy ve zdech)"
    - "Pytlík lesklých skleněných kuliček a cetek"
  reputation:
    svobodna_mesta: 10
    oakhaven: 5
---

# Q107 – Opeřený zloděj pergamenů

> *"Ten pták byl drzý jako přístavní kapsář! Seděl jsem na patníku u Staré křižovatky, v klidu rýsoval proporce solariánského obelisku, když vtom sletěla ta černá obluda s křídly rozpětí dvou loktů, klofla mě do ucha a sebrala můj kožený zápisník! A víte, kam s ním odletěla?! Přímo nahoru do té ohavné rezavé klece pro popravené zločince! Prosím vás, v tom sešitě jsou zápisky o třech ztracených trezorech... přineste mi ho zpátky!"*  
> — Učenec Fabian, přikládající si studený stříbrňák na oteklé ucho

---

## Přehled úkolu
Učenec Fabian z Nového Přístavu přišel za bílého dne o své nejcennější dílo – terénní skicář a deník archeologických výzkumů. Zlodějem není nikdo jiný než **Krkavec Zobák**, obrovský starý krkavec, který si zvykl hnízdit v železné kostrové kleci zavěšené z ramene slunečního obelisku na [[Stará křižovatka|Staré křižovatce]].

Krkavci jsou pověstní svou láskou k lesklým předmětům a mosazná spona na Fabianově deníku byla neodolatelným lákadlem. Hráč se musí vydat na křižovatku, vyšplhat na zčernalý obelisk nebo krkavce přelstít lesklou návnadou a získat deník zpět.

---

## Fáze úkolu (Steps)

```yaml
steps:
  - id: 1
    objective: "Přijmi prosbu od Učence Fabiana v podkroví radnice v Oakhaven"
    location_id: "oakhaven_townhall"
    trigger: "interact_npc:ucenec_fabian"
    narrative: |
      Fabian nervózně pobíhá mezi policemi a naříká:
      'Ten deník má vazbu z teletiny a mosazný zámeček! Krkavec ho odvlekl do té šibeniční klece na Staré křižovatce. Dej si pozor na hejno krkavců kolem, jsou útoční. A vezmi si tyhle lesklé skleněné korálky – možná ho s nimi dokážeš vylákat z hnízda!'
    on_complete_flag: "Q107_step1_fabian_briefed"

  - id: 2
    objective: "Doraž na Starou křižovatku a lokalizuj hnízdo v železné kleci"
    location_id: "crossroads"
    trigger: "location_arrival"
    narrative: |
      Z ramene šestimetrového mramorového obelisku visí rezavá klec na tlustém řetězu.
      V kleci na lidské lebce sedí obří černý krkavec se zahnutým žlutým zobákem. V pařátech spokojeně drží Fabianův tlustý kožený sešit a okusuje jeho zlacené rohy. Kolem krouží hejno dalších patnácti hlasitě krákajících ptáků.
    on_complete_flag: "Q107_step2_nest_located"

  - id: 3
    objective: "Získej deník z hnízda (Šplh, lstivá výměna nebo sestřelení)"
    location_id: "crossroads"
    trigger: "skill_choice:retrieve_diary"
    narrative: |
      Hráč má tři cesty k řešení:
      a) Šplh po obelisku (Hod na Atletiku): Vyšplhat po vytesaných rýhách na obelisk a ručně vytrhnout deník z klece. Krkavci útočí klováním do očí.
      b) Lstivá výměna (Hod na Chytrost): Položit na kamenný sokl pod klecí lesklé mosazné zrcátko nebo stříbrnou lžičku. Krkavec neodolá, upustí deník do trávy a slétne dolů za novou kořistí.
      c) Přestřelení závěsného lana (Hod na Střelbu): Přesný výstřel z kuše přetne ztrouchnivělý řemen držící dno hnízda, sešit spadne na zem a hejno se s křikem rozprchne.
    on_complete_flag: "Q107_step3_diary_retrieved"

  - id: 4
    objective: "Otevři tajnou skrýš popsanou v deníku a vrať se za Fabianem"
    location_id: "crossroads"
    trigger: "loot_secret_cache"
    narrative: |
      Než hráč deník vrátí, může do něj nahlédnout. Na straně 14 je Fabianův nákres vyhořelé mýtnice:
      'Za krbem v mýtnici, třetí uvolněná cihla vpravo'.
      Hráč prohledá vyhořelou mýtnici a skutečně za cihlou nachází císařskou železnou pokladničku s 20 stříbrňáky a vyřezávaným achátovým pečetidlem!
    on_complete_flag: "Q107_step4_secret_looted"

  - id: 5
    objective: "Odevzdej zachráněný deník Fabianovi v Oakhaven"
    location_id: "oakhaven_townhall"
    trigger: "interact_npc:ucenec_fabian"
    narrative: |
      Fabian tiskne uslintaný a okousaný deník k prsům a dojatě třepe hráčovi rukou:
      'Všechny mé poznámky jsou v pořádku! Dokonce i ta skvrna od ptačího trusu vypadá trochu jako půdorys kláštera svaté Judity! Tady máš svou odměnu a tuto ručně kreslenou mapu okolí.'
    on_complete_flag: "Q107_completed"
```

---

## 🎒 Odměna & Skrytý Loot
- **Fabianova terénní mapa:** Odhaluje na mapě údolí polohu 3 skrytých bylinkářských zákoutí v Temném hvozdu a 2 opuštěných těžařských beden u řeky.
- **Skrytá pokladnička z mýtnice:** 20 stříbrných grošů a *Starožitné achátové pečetidlo* (lze prodat v krčmě nebo vrátit na radnici).
