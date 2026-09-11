---
title: Porybný Gorman
tags: [character, npc, fisherman, questgiver, oakhaven, wetlands]
npc_id: porybny_gorman
location_id: oakhaven
location: "[[Atlas_Udoli_Oakhaven#📍-hex-02-dubová-blata--mrtvé-rameno-řeky-oak|Hex 02: Dubová blata]] / Rybářská chýše u Černého rákosí"
gender: muz
type: quest-giver, informant
disposition: neutral
faction_id: ""
quests:
  - Q106
trade_items:
  - { name: "Sušený uzený úhoř", type: "jídlo", price: 3 }
  - { name: "Rybářská síť a olůvka", type: "vybavení", price: 6 }
  - { name: "Bahenní leknínový kořen", type: "bylina", price: 2 }
  - { name: "Láhev páleného trnkového lihu", type: "pití", price: 4 }
---

# Porybný Gorman

> *"Všichni v Oakhaven brečí kvůli vlkům a císařským daním. Ať si zkusí sedět v děravém člunu uprostřed Černého rákosí, když se pod hladinou pohne hřbet starýho zubatýho sumce velkej jako vor! Ryby nelžou, panáčku. Zato vrchnost z města lže, jen hubu otevře."*  
> — Gorman, vyřezávající novou dřevěnou nohu na břehu řeky Oak

---

## Vzhled
Starý, sluncem a větrem ošlehaný chlap s plnovousem barvy říčního bahna, v němž uvízly šupiny a kousky rákosí. Má jen jednu zdravou nohu; druhou mu u kolene nahrazuje vyřezávaný jilmový kolík zakončený olověnou objímkou (říká, že o ni přišel při rvačce se sumcem před deseti lety). Nosí kabát z nepromokavé tulení a bobří kůže a starý klobouk s uvázanými rybářskými háčky.

## Osobnost
Nevrlý, kousavě vtipný a podezíravý samotář. Nesnáší výběrčí daní, inkvizitory i městské hejsky. Pokud mu však poutník přinese láhev ostré kořalky nebo pomůže vytáhnout zamotané sítě, Gorman se rozpovídá a ukáže se jako živoucí encyklopedie všech tajemství, která řeka Oak a okolní močály za padesát let pohltily.

## Motivace
Chce v klidu dožít u svého rákosí, mít co pít a ulovit legendárního pětisáhového sumce "Starého Fousáče", který mu před lety ukousl nohu a spolykal jeho rodinný stříbrný pečetní prsten.

## Znalosti a Tipy na Poklady (Loot Rumors)
- **Potopený pašerácký člun (Hex 02):** Gorman ví o přesném místě v mrtvém rameni řeky, kde před rokem ztroskotal člun s truhlou kradeného brandy a nožů ze Svobodných měst.
- **Tajný brod do Hvozdu:** Zná mělký písečný brod přes řeku Oak chráněný vrbovými korunami, kterým lze obejít mýtné hlídky na Staré křižovatce.
- **Krystalická nákaza ve vodě:** Jako první si všiml, že ryby v tůních pod dolem mají azurově zářící šupiny a nechutnají jako maso, ale jako síra a kamenec.

## Questy
- [[Q106_PytlakZBlat]] – zadavatel úkolu (lov legendárního sumce a záchrana ztracené truhly).

---

## Dialogy

```yaml
dialog_greeting:
  default: "Co tu čumíš, suchozemská kryso? Nešlapej mi na sítě! Jestli nemáš láhev pálenky nebo nechceš koupit sušenýho úhoře, tak pádluj zpátky za palisádu k těm svým městským chytrákům."
  if_flag_set:
    Q106_completed: "Á, podívejme se na něj! Chlap, co vyrval Fousáčovi z tlamy můj prsten a nerozbrečel se při tom v bahně! Sedni si na špalek, naleju ti doušek z toho nejlepšího, co řeka schovává."

dialog_topics:
  - topic: "Tajemství Černého rákosí"
    text: "Voda pamatuje všechno, co lidé zapomněli. Před třemi měsíci tudy v noci projížděl kočár ze Svobodných měst. Koně splašil nějakej řev z lesa a celá kára sjela z náspu do bažiny. Trhla se tam náprava. Jestli se nebojíš pijavic a bahna po pás, u třetí vrby na ohybu řeky ještě pořád čouhá ohořelé loukoťové kolo... a pod ním železná truhlička."
  - topic: "Proč máš dřevěnou nohu?"
    text: "Kvůli Fousáčovi, tomu zatracenýmu monstru s vousy jak lodní lana! Táhl mě za síť pod vodu tři sáhy hluboko. Musel jsem vlastní nohu uříznout filetovacím nožem, abych se neutopil. Od tý doby má v břiše mou botu, kost... i můj rodinnej stříbrňák!"
```
