---
title: Sestra Libuše
tags: [npc, faction_teokracie, spy, religion]
npc_id: sestra_libuse
created: 2026-09-07
location: oakhaven_tavern
faction_id: teokracie_solariova
role: Tajný agent Řádu Plamenného meče (zamaskovaná jako putující jeptiška)
age: 34
appearance: "Drobná, nepadná šedá sutana s menším zlatým slunečním odznakem. Vlasy ukryté pod bílým šátkem. Tichý, téměř slyšitelný hlas. Neustále přebírá dřevěný růženec."
---

# Sestra Libuše

**Skutečná identita:** Agentka Řádu Plamenného meče, vyslaná osobně Velekněžím Sveldrlem — *nezávisle na Inkivzitoru Kaelenovi*, který o ní neví.

**Legenda (veřejná):** Putující jeptiška z kláštera sv. Heleny, která přichází do odlehlých vesnic šířit útěchu víry a vybírat dobrovolné dary pro sirotčinec v Sol-Sanctum.

**Skutečný cíl:** Sledovat Kaelenovu práci v Oakhaven a zjistit, zda Probuzeného ve skutečnosti přivedl živého do rukou Řádu nebo ne. Pokud Kaelen selhává nebo jedná příliš nezávisle — poslat zprávu Sveldrovi.

---

## Osobnost a Chování

Libuše je brilantní herečka. Navenek je tichá, laskavá, pokorná — pomáhá s nemocnými, zapaluje svíčky na kaplance za hostincem a nikdy nezvedá hlas. Ve skutečnosti je chladná, analytická a schopná fyzické likvidace cíle holýma rukama (trénink Řádu).

Její slabina: **skutečná víra**. Původně vstoupila do řádu z přesvědčení. Sveldrovy metody ji znepokojují — ale věrnostní přísaha ji drží. Hráč může tuto trhlinu využít.

---

## Dialogy

```yaml
dialog_greeting: >
  „Boží pokoj vám, poutníče. Jsem jen chudá sestra na cestě z kláštera. Říkají, že tato vesnice potřebuje útěchu — a útěchu umím přinést."
  
dialog_topics:
  - topic: o_sobe
    text: >
      „Z kláštera sv. Heleny. Cestuju sama, jak vidíte — bůh mě chrání. Prý tu nedávno bylo cosi... divného? Záblesky světla v dole? Mám se modlit, nebo se mám bát?"
  - topic: o_kaelenovi
    text: >
      *Mírný, nepostřehnutelný záchvěv u rtů.* „Inkvizitor? Ano, slyšela jsem... Páni z řádu jsou tak oddaní. Vy jste s ním mluvili? Co vám říkal?"
  - topic: o_aetheritech
    text: >
      „Krystaly... *přebírá pomaleji růženec* ...v zápisech sv. Heleny jsou zmínky o podobných jevech. Říkají, že tam, kde světlo krystalů svítí bez slunce, je místo, kde byl boží řád porušen. Víte, kde přesně se vyskytují?"
  - topic: o_probuzeni
    text: >
      „Probuzení... *ticho* ...jsou ubozí hříšníci. Řád jim nabízí spásu — v poslušnosti. Ne v ohni. Aspoň někteří z nás to tak vidí."

dialog_quest:
  - quest_id: Q110
    trigger: "hráč si ji prohlédne pečlivěji nebo ji sleduje"
    text: >
      „Vy mě sledujete, že? *úsměv bez očí* Jste chytřejší, než vypadáte. Dobře. Řekneme si pravdu — ale ne tady, kde nás slyší Odo."
```

---

## Skryté informace (dostupné při odhalení)

- Nese u sebe **zašifrovaný svitek** adresovaný „V.K.S." (Velekněz Kříže Sveldr) s pečetí Řádu.
- V jejím pokoji v hostinci (pokud hráč prohledá): **zrcadlový šifrovací klíč** + seznam jmen podezřelých obyvatel Oakhaven, mezi nimi **Bylinkářka Míra** (správně odhadla, že je ochrání), **Boris Mlynář** a překvapivě sám **Inkvizitor Kaelen** — označen jako „nespolehlivý".
- Fyzicky trénovaná: v boji si nevede hůře než průměrný voják. Upřednostňuje útěk a jedovatou jehlu (zastrčenou v růženci).
