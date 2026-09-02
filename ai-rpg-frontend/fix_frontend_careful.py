import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# 1. Add state for availableSkills
if "const [availableSkills, setAvailableSkills]" not in content:
    content = content.replace(
        'const [skills, setSkills] = useState<any[]>([]);',
        'const [skills, setSkills] = useState<any[]>([]);\n  const [availableSkills, setAvailableSkills] = useState<any[]>([]);'
    )

# 2. Update loadGame (find the exact spot for skills)
load_game_skills_old = "setSkills(state.skills || []);"
load_game_skills_new = """setSkills(state.skills || []);
        setAvailableSkills(state.available_skills || [
            {id: "silny_uder", name: "Silný úder", desc: "Základní útok nablízko se zvýšeným poškozením (Aktivní)"},
            {id: "ohniva_koule", name: "Ohnivá koule", desc: "Sešle zničující ohnivou kouli na cíl (Aktivní - Magie)"},
            {id: "plizeni", name: "Stínový krok", desc: "Postava se přesune do stínů a získá výhodu na další útok (Aktivní)"},
            {id: "lecive_slovo", name: "Léčivé slovo", desc: "Magicky obnoví trochu zdraví (Aktivní)"},
            {id: "odolnost", name: "Železná kůže", desc: "V boji tě je těžší zranit. (Pasivní)"},
            {id: "sermir", name: "Mistr meče", desc: "Vyšší šance na kritický zásah. (Pasivní)"}
        ]);"""
content = content.replace(load_game_skills_old, load_game_skills_new)

# 3. Update startNewGame 
# In startNewGame we want to replace the hardcoded state reset
start_game_old = """      if (res.ok) {
        setHistory([
          { type: "system", text: data.message },
          { type: "dm", popis_okoli: data.popis_okoli, vypravec: data.intro_text }
        ]);
        setSuggestedActions(["Rozhlédnout se", "Zkontrolovat vybavení", "Vydat se vpřed"]);
        setHp(100);
          setCurrentLocationDesc(data.popis_okoli || "Neznámé místo.");
          setCurrentRegion("Začátek cesty");
        const startInv = [
            {id: "starter_clothes", name: "Cestovní oblečení", type: "zbroj", slot: "hruď", description: "Obyčejné, ale teplé.", stats: "Obrana: 1", sell_price: 5, icon: "Shirt"},
            {id: "starter_dagger", name: "Železná dýka", type: "zbraň", slot: "hlavní ruka", description: "Malá, ostrá dýka.", stats: "Poškození: 1d4", sell_price: 10, icon: "Sword"},
            {id: "starter_potion", name: "Lektvar zdraví", type: "lektvar", slot: "žádný", description: "Léčí drobná zranění.", stats: "Doplní 10 HP", sell_price: 20, icon: "Potion"}
        ];
        setInventory(startInv);
        setEquipped({
            "hlava": null,
            "hruď": "starter_clothes",
            "hlavní ruka": "starter_dagger",
            "druhá ruka": null,
            "prsten": null,
            "krk": null
        });
        
        // AUTO-PLAY intro"""

start_game_new = """      if (res.ok) {
        setHistory([
          { type: "system", text: data.message },
          { type: "dm", popis_okoli: data.popis_okoli, vypravec: data.intro_text }
        ]);
        setSuggestedActions(["Rozhlédnout se", "Zkontrolovat vybavení", "Vydat se vpřed"]);
        setCurrentLocationDesc(data.popis_okoli || "Neznámé místo.");
        setCurrentRegion("Začátek cesty");
        
        const state = data.state || {};
        setHp(state.hp || 100);
        setXp(state.xp || 0);
        setLevel(state.level || 1);
        setSkillPoints(state.skillPoints || 0);
        setInventory(state.inventory || []);
        setEquipped(state.equipped || {});
        setSkills(state.skills || []);
        setAvailableSkills(state.available_skills || []);
        setJournal(state.journal || []);
        
        // AUTO-PLAY intro"""

content = content.replace(start_game_old, start_game_new)

# 4. Update Skills map
skills_map_old = """              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {id: "silny_uder", name: "Silný úder", desc: "Základní útok nablízko se zvýšeným poškozením (Aktivní)"},
                  {id: "ohniva_koule", name: "Ohnivá koule", desc: "Sešle zničující ohnivou kouli na cíl (Aktivní - Magie)"},
                  {id: "plizeni", name: "Stínový krok", desc: "Postava se přesune do stínů a získá výhodu na další útok (Aktivní)"},
                  {id: "lecive_slovo", name: "Léčivé slovo", desc: "Magicky obnoví trochu zdraví (Aktivní)"},
                  {id: "odolnost", name: "Železná kůže", desc: "V boji tě je těžší zranit. (Pasivní)"},
                  {id: "sermir", name: "Mistr meče", desc: "Vyšší šance na kritický zásah. (Pasivní)"}
                ].map(skill => {"""

skills_map_new = """              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(availableSkills.length > 0 ? availableSkills : [
                  {id: "silny_uder", name: "Silný úder", desc: "Základní útok nablízko se zvýšeným poškozením (Aktivní)"},
                  {id: "ohniva_koule", name: "Ohnivá koule", desc: "Sešle zničující ohnivou kouli na cíl (Aktivní - Magie)"},
                  {id: "plizeni", name: "Stínový krok", desc: "Postava se přesune do stínů a získá výhodu na další útok (Aktivní)"},
                  {id: "lecive_slovo", name: "Léčivé slovo", desc: "Magicky obnoví trochu zdraví (Aktivní)"},
                  {id: "odolnost", name: "Železná kůže", desc: "V boji tě je těžší zranit. (Pasivní)"},
                  {id: "sermir", name: "Mistr meče", desc: "Vyšší šance na kritický zásah. (Pasivní)"}
                ]).map(skill => {"""
content = content.replace(skills_map_old, skills_map_new)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("Safe frontend replace done.")
