const text = `{"aktualni_region": "Začátek cesty", "popis_okoli": "Gigantická, ponurá hradba z tmavého kamene zdobená gotickými chrliči ční nad zhoubnou mlhou Karanténní Zóny. Vzduch páchne spáleným mramorem, krví a ozónem ze syrové magie, z dálky se ozývá neustálé dunění poplašných zvonů.", "vypravec": "Tvá půlorkská krev v tobě neklidně vře, když s napjatými svaly a obouruční sekerou v dlani stojíš na masivních hradbách Pevnosti Železného Prahu, odkud chladný vítr přináší pach smrti z Karanténní Zóny. Právě ve chvíli, kdy kolem prochází přísná hlídka, kterou vyslal sám obávaný Bratr Lucien, se jeden z mladých strážných vedle tebe v křečích zhroutí na dlažbu. Jeho oči vzplanou nepřirozenou divokou magií a z těla mu začnou prorůstat temné krystaly – nastalo nekontrolovatelné Probuzení spojené se stínem boha Kulla. Inkvizitoři okamžitě tasí meče s úmyslem chlapce na místě bez milosti upálit, vřava na hradbách eskaluje a tvůj barbar v sobě cítí divoký vztek, který tě nutí okamžitě jednat.", "nabizene_akce": ["Rozhlédnout se", "Zkontrolovat vybavení", "Vydat se vpřed"]}`;
try {
    JSON.parse(text);
    console.log("Valid JSON");
} catch(e) {
    console.log("Invalid JSON", e);
}
