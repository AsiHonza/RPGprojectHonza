import codecs
import re

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# 1. Add state for availableSkills
if "const [availableSkills, setAvailableSkills]" not in content:
    content = content.replace(
        'const [skills, setSkills] = useState<any[]>([]);',
        'const [skills, setSkills] = useState<any[]>([]);\n  const [availableSkills, setAvailableSkills] = useState<any[]>([]);'
    )

# 2. Update loadGame to populate availableSkills
content = re.sub(
    r'setSkills\(state\.skills \|\| \[\]\);',
    r'setSkills(state.skills || []);\n          setAvailableSkills(state.available_skills || [\n            {id: "silny_uder", name: "Silný úder", desc: "Základní útok nablízko se zvýšeným poškozením (Aktivní)"},\n            {id: "ohniva_koule", name: "Ohnivá koule", desc: "Sešle zničující ohnivou kouli na cíl (Aktivní - Magie)"},\n            {id: "plizeni", name: "Stínový krok", desc: "Postava se přesune do stínů a získá výhodu na další útok (Aktivní)"},\n            {id: "lecive_slovo", name: "Léčivé slovo", desc: "Magicky obnoví trochu zdraví (Aktivní)"},\n            {id: "odolnost", name: "Železná kůže", desc: "V boji tě je těžší zranit. (Pasivní)"},\n            {id: "sermir", name: "Mistr meče", desc: "Vyšší šance na kritický zásah. (Pasivní)"}\n          ]);',
    content
)

# 3. Update startNewGame to use state from backend
old_start_state = """        if (res.ok) {
          localStorage.setItem("rpg_character", name);
          localStorage.setItem("rpg_class", dndClass);
          localStorage.setItem("rpg_race", race);
          localStorage.setItem("rpg_stats", JSON.stringify(rolledStats));
          setGameState("playing");
          setHp(100);
          setXp(0);
          setLevel(1);
          setSkillPoints(0);
          setInventory([
            { id: "starter_clothes", icon: "Shirt", name: "Cestovní oblečení", slot: "hruď", type: "zbroj", stats: "Obrana: 1", sell_price: 5, description: "Obyčejné, ale teplé." },
            { id: "starter_dagger", icon: "Sword", name: "Železná dýka", slot: "hlavní ruka", type: "zbraň", stats: "Poškození: 1d4", sell_price: 10, description: "Malá, ostrá dýka." },
            { id: "starter_potion", icon: "Potion", name: "Lektvar zdraví", slot: "žádný", type: "lektvar", stats: "Doplní 10 HP", sell_price: 20, description: "Léčí drobná zranění." }
          ]);
          setEquipped({
              "hlava": null,
              "hruď": "starter_clothes",
              "hlavní ruka": "starter_dagger",
              "druhá ruka": null,
              "prsten": null,
              "krk": null
          });
          
          // AUTO-PLAY intro
          playAudioSequentially([{text: data.intro_text, type: "narrator"}]);"""

new_start_state = """        if (res.ok) {
          localStorage.setItem("rpg_character", name);
          localStorage.setItem("rpg_class", dndClass);
          localStorage.setItem("rpg_race", race);
          localStorage.setItem("rpg_stats", JSON.stringify(rolledStats));
          setGameState("playing");
          
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
          
          // AUTO-PLAY intro
          playAudioSequentially([{text: data.intro_text, type: "narrator"}]);"""

content = re.sub(
    r'if \(res\.ok\) \{.*?playAudioSequentially\(\[\{text: data\.intro_text, type: "narrator"\}\]\);',
    new_start_state.strip(),
    content,
    flags=re.DOTALL
)

# 4. Update the skills mapping in UI
content = re.sub(
    r'\[\s*\{\s*id:\s*"silny_uder".*?\s*\]\.map\(skill => \{',
    r'(availableSkills.length > 0 ? availableSkills : [\n                  {id: "silny_uder", name: "Silný úder", desc: "Základní útok nablízko se zvýšeným poškozením (Aktivní)"},\n                  {id: "ohniva_koule", name: "Ohnivá koule", desc: "Sešle zničující ohnivou kouli na cíl (Aktivní - Magie)"},\n                  {id: "plizeni", name: "Stínový krok", desc: "Postava se přesune do stínů a získá výhodu na další útok (Aktivní)"},\n                  {id: "lecive_slovo", name: "Léčivé slovo", desc: "Magicky obnoví trochu zdraví (Aktivní)"},\n                  {id: "odolnost", name: "Železná kůže", desc: "V boji tě je těžší zranit. (Pasivní)"},\n                  {id: "sermir", name: "Mistr meče", desc: "Vyšší šance na kritický zásah. (Pasivní)"}\n                ]).map(skill => {',
    content,
    flags=re.DOTALL
)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)

print("Frontend skills and start logic updated.")
