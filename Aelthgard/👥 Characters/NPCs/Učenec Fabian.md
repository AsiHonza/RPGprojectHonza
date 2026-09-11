---
title: Učenec Fabian
tags: [character, npc, scholar, cartographer, free_cities, oakhaven]
npc_id: ucenec_fabian
location_id: oakhaven_townhall
location: "[[Oakhaven]] – [[Městská radnice a archiv]] (podkrovní pracovna)"
gender: muz
type: quest-giver, scholar, collector
disposition: friendly
faction_id: svobodna_mesta
quests:
  - Q107
trade_items:
  - { name: "Rukopisná mapa pohraničních stezek", type: "mapa", price: 15 }
  - { name: "Lahvička archivního neblednoucího inkoustu", type: "předmět", price: 5 }
  - { name: "Zvětšovací sklo v mosazném rámu", type: "nástroj", price: 10 }
  - { name: "Uhlíkový papír na otisky run", type: "pomůcka", price: 3 }
---

# Učenec Fabian z Nového Přístavu

> *"Proč se všichni v tomhle barbarském údolí zajímají jen o to, co se dá sníst, propít nebo zabít kuší?! Uvědomujete si vůbec, že stojíte na základech první civilizace, která dokázala zkrotit aetherické toky dřív, než vaši předci vůbec objevili hrnčířský kruh?! A prosím... zavřete to okno, venku létá ten odporný černý pták, který na mě neustále zírá!"*  
> — Fabian, nervózně si rovnající brýle mezi stohy starých pergamenů

---

## Vzhled
Drobný, bledý mladík s kulatými mosaznými brýlemi s tlustými skly a věčně rozcuchanými rezavými vlasy. Nosí vybledlý sametový kabát střižený podle módy ze [[Svobodná města]], který je však na rukávech umazaný od černého a sépiového inkoustu. Neustále u sebe nosí těžkou koženou brašnu plnou voskových destiček, kružidel, měřítek a rýsovacích per.

## Osobnost
Vzdělaný, mírně arogantní, ale v hloubi duše k smrti vyděšený intelektuál. Trpí panickým strachem ze šelem, lesních běsů, hmyzu i fyzického násilí. Považuje obyvatele Oakhaven za nevzdělané balíky, ale zoufale potřebuje někoho s mečem, kdo by pro něj opisoval staré runové nápisy a přinášel archeologické vzorky ze zřícenin.

## Motivace
Byl vyslán Geografickou společností v Novém Přístavu, aby zmapoval staré solariánské chrámy a těžařské šachty v údolí. Touží napsat monumentální pojednání *"Atlas ztracených divů Aelthgardu"*, které by mu zajistilo profesorskou katedru.

## Tipy na Ztracený Loot a Tajné Komory
- **Skrytá krypta pod zvonicí (Ruiny kláštera):** Fabian ví, že pod zborcenou kaplí sv. Judity se nachází zazděný relikviář se stříbrným pohárem a rukopisem mnichů.
- **Rituální kruh pod menhirem (Hex 10):** Vypočítal z astronomických tabulek, že pod znesvěceným menhirem v hvozdu je zakopána obětní bronzová dýka z dob před Paktem Slunce.

## Questy
- [[Q107_OperenyZlodej]] – zadavatel úkolu (získání ukradeného deníku z hnízda krkavců na Staré křižovatce).

---

## Dialogy

```yaml
dialog_greeting:
  default: "Ach, návštěvník! Prosím tě, nesahat na ty mapy, inkoust ještě schne! Hledáš někoho, kdo umí číst staré runy, nebo máš u sebe nějaký neobvyklý minerál ze štol?"
  if_flag_set:
    Q107_completed: "Můj deník! Můj drahocenný deník s náčrty viaduktu! Ty... ty jsi opravdu vyšplhal do té odporné klece a vyhnal ty opeřené zloděje? Jsi zachránce vědy a vzdělanosti!"

dialog_topics:
  - topic: "Co dělá učenec z přístavu v zapadlém Oakhaven?"
    text: "Pohraniční marka Valérie je pro archeologa hotový ráj! Lidé vidí jen staré kameny a zříceniny, ale já vidím stopy tří různých ér. Klášter sv. Judity byl postaven na základech ještě starší kultovní svatyně. A ten obrovský pařez na náměstí? Ten strom nepokácela sekera, byl sťat soustředěným paprskem energie před pěti sty lety!"
  - topic: "Nevíš o nějakých cennostech v okolí?"
    text: "Pokud máš odvahu... Na Staré křižovatce bývala v podzemí mýtné stanice malá trezorová komůrka na mýtné groše. Když mýtnici vypálili zbojníci, vchod zasypalo ohořelé zdivo. V mých poznámkách stojí, že za krbem v hlavní místnosti stačí vytáhnout uvolněnou cihlu se znakem orlice... měla by tam být císařská pokladnička."
```
