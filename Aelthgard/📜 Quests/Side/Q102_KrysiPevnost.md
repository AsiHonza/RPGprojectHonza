---
title: "Q102 - Krysí doupě na křižovatce"
tags: [quest, side, smugglers, crossroads]
quest_id: "Q102"
type: side
giver_id: "hostinsky_odo"
giver: "[[Hostinský Odo]]"
start_location_id: "oakhaven"
target_location_ids:
  - "crossroads"
location: "[[Oakhaven]] ➔ [[Stará křižovatka]]"
prerequisite_quests:
  - "Q003"
kingdom_id: 1
level_range: "2-3"
reward:
  gold: 30
  xp: 120
  items:
    - "Soudek pašovaného jablečného lihu (lze prodat nebo využít jako zápalnou směs)"
    - "Vyztužené kožené rukavice s olověnými broky"
  reputation:
    oakhaven: 5
    svobodna_mesta: 5
---

# Q102 – Krysí doupě na křižovatce

> *"Když se na křižovatce válí mrtví císařští vojáci a garda sedí podělaná strachy za hradbami, chytrý chlap ví, že nastal čas pro dobrý obchod. Jenže ti holomci ze starého mýtného domku si začali brát moc velký díl..."*  
> — [[Hostinský Odo]]

---

## Přehled úkolu
Zmatek na [[Stará křižovatka]] způsobený přepadením karavany v [[Q003_ZlomenaPrisaha]] využila místní banda vykutálených pašeráků, kterým se říká "Krysy z křižovatky". Zabrali opuštěnou mýtnou stanici a začali vybírat nezákonné mýto od zoufalých uprchlíků a kupců. Navíc odmítli vyplatit [[Hostinský Odo|Hostinskému Odovi]] jeho obvyklý podíl z pašovaného lihu a léků.

Odo hráče diskrétně požádá, aby mýtnici "provětral", přinesl zpět zabavený soudek a domluvil překupníkům rozumnější pravidla.

---

## Fáze úkolu (Steps)

```yaml
steps:
  - id: 1
    objective: "Promluv s Hostinským Odem v Hostinci U Zlomeného štítu"
    location_id: "oakhaven"
    trigger: "interact_npc:hostinsky_odo"
    narrative: |
      Odo si tě přitáhne k pultu pod záminkou nalití piva. Šeptá o staré mýtnici u Staré křižovatky: 'Banda hrdlořezů tam drží můj náklad. Vyřiď to tiše, ať o tom Aldric neví, a polovina lihu je tvoje.'
    on_complete_flag: "Q102_step1_done"

  - id: 2
    objective: "Vypátrej mýtnou stanici u Staré křižovatky a infiltruj dvůr"
    location_id: "crossroads"
    trigger: "combat_or_stealth"
    narrative: |
      Kamenná mýtnice je obehnána provizorní palisádou z ohořelých trámů přepadených vozů. Kolem ohně sedí čtveřice ozbrojených pašeráků hrajících kostky.
    on_complete_flag: "Q102_step2_done"

  - id: 3
    objective: "Konfrontuj vůdce pašeráků a rozhodni o jejich osudu"
    location_id: "crossroads"
    trigger: "branch_choice"
    narrative: |
      Vůdce překupníků, jizvami posetý chlapík přezdívaný Jednooký Ras, ti nabízí protinabídku: 'Proč sloužit starému tlouštíkovi Odovi? Nech nás tu kšeftovat, ber podíl ze zbraní z přepadené karavany a Odovi řekni, že nás sežrali stínoví vlci.'
```

---

## Morální větvení (Branches)
- **Varianta A (Splnit dohodu pro Oda):** Vyhladit pašeráky nebo je zmlátit do krve, vzít soudek a vrátit se k Odovi. Odo tě štědře odmění a otevře ti tajný obchod s kradeným zbožím.
- **Varianta B (Podíl z mýta):** Přijmout Rasovu nabídku. Pašeráci zůstanou na křižovatce a budou ti pravidelně odvádět procenta z kořisti ze [[Svobodná města]], ale Odo tě začne podezřívat.
- **Varianta C (Zákon a pořádek):** Nahlásit mýtnici [[Strážmistr Aldric|strážmistru Aldricovi]]. Městská garda mýtnici vyčistí, získáš reputaci u Impéria a Aldric ti věnuje armádní výstroj.
