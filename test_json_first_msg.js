const text = `{"aktualni_region": "Začátek cesty", "popis_okoli": "Monumentální, deštěm bičovaná kamenná citadela střežící severní hranici. Všude leží bláto, těla padlých strážných a ve vzduchu je cítit ozón z magických výbojů a pachy krve zmutovaných stvůr.", "vypravec": "Jako půlork a barbar jsi zvyklý na pach krve a potu, ale deštěm bičované nádvoří Pevnosti Železný Práh páchne především nefalšovaným strachem. Zatímco Inkvizitor-Kardinál Lucian na jihu upaluje na hranicích každého zasaženého Probuzením a šamanka Ysolde svolává divoké kmeny k krvavým rituálům, ty zde v řetězech čelíš hněvu lorda Vance za neposlušnost. Než však kat stihne zvednout čepel, severní brána citadely se s ogravným třeskem prorazí pod náporem zmutované zvěře valící se z Karanténní Zóny. Ve tvých žilách vzplane divoký hněv, vlčí magie Probuzení ti dá sílu přetrhnout pouta a kolem tebe vypukne naprostý chaos.", "nabizene_akce": ["Rozhlédnout se", "Zkontrolovat vybavení", "Vydat se vpřed"]}`;

try {
    const dm_data = JSON.parse(text);
    console.log("Parse successful!");
    
    // Simulate what page.tsx does
    let lastAudioQueue = [];
    if (dm_data.vypravec) lastAudioQueue.push({text: dm_data.vypravec, type: "narrator"});
    if (dm_data.npc_dialogy && Array.isArray(dm_data.npc_dialogy)) {
        dm_data.npc_dialogy.forEach((n) => { 
            if (n.text) lastAudioQueue.push({text: n.text, type: n.pohlavi === "muz" ? "npc_muz" : "npc_zena"}) 
        });
    }
    console.log("No runtime errors in try block!");
} catch (e) {
    console.error("Error:", e);
}
