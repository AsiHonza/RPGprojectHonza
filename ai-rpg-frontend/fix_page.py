import codecs
import re

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# 1. State Variables
state_vars = """  const [xp, setXp] = useState(0);
  const [skillPoints, setSkillPoints] = useState(0);"""
new_state_vars = """  const [xp, setXp] = useState(0);
  const [skillPoints, setSkillPoints] = useState(0);
  const [gold, setGold] = useState(15);
  const [currentSpellSlots, setCurrentSpellSlots] = useState(0);
  const [maxSpellSlots, setMaxSpellSlots] = useState(0);

  useEffect(() => {
    const isFullCaster = ["Wizard", "Sorcerer", "Cleric", "Druid", "Bard"].includes(dndClass);
    const isHalfCaster = ["Paladin", "Ranger"].includes(dndClass);
    const isThirdCaster = ["Warlock"].includes(dndClass);
    let slots = 0;
    if (isFullCaster) slots = level === 1 ? 2 : level === 2 ? 3 : level >= 3 ? 4 : 2;
    else if (isHalfCaster && level >= 2) slots = 2;
    else if (isThirdCaster) slots = level >= 2 ? 2 : 1;
    
    if (slots > maxSpellSlots) {
        setCurrentSpellSlots(prev => prev + (slots - maxSpellSlots));
        setMaxSpellSlots(slots);
    }
  }, [level, dndClass, maxSpellSlots]);"""
content = content.replace(state_vars, new_state_vars)

# 2. Add to autosave and dependency array
old_save = """            hp, inventory, equipped, level, xp, skillPoints, skills, inCombat, enemies, quests,
            locationType, currentRegion, pointsOfInterest, stats"""
new_save = """            hp, inventory, equipped, level, xp, skillPoints, skills, inCombat, enemies, quests,
            locationType, currentRegion, pointsOfInterest, stats, gold, currentSpellSlots, maxSpellSlots"""
content = content.replace(old_save, new_save)

old_deps = """locationType, currentRegion, pointsOfInterest, gameState, apiKey, stats]);"""
new_deps = """locationType, currentRegion, pointsOfInterest, gameState, apiKey, stats, gold, currentSpellSlots, maxSpellSlots]);"""
content = content.replace(old_deps, new_deps)

# 3. Process changes from backend
old_process = """           if (data.zmeny_stavu.xp_zmena) {"""
new_process = """           if (data.zmeny_stavu.zlato_zmena) {
             setGold(g => Math.max(0, g + data.zmeny_stavu.zlato_zmena));
           }
           if (data.zmeny_stavu.spell_slots_zmena) {
             setCurrentSpellSlots(s => Math.min(maxSpellSlots, Math.max(0, s + data.zmeny_stavu.spell_slots_zmena)));
           }
           if (data.zmeny_stavu.xp_zmena) {"""
content = content.replace(old_process, new_process)

# 4. Read from state on load Game
old_load = """        const state = data.character.state || {};
        setHp(state.hp || 100);"""
new_load = """        const state = data.character.state || {};
        setHp(state.hp || 100);
        if (state.gold !== undefined) setGold(state.gold);
        if (state.currentSpellSlots !== undefined) setCurrentSpellSlots(state.currentSpellSlots);
        if (state.maxSpellSlots !== undefined) setMaxSpellSlots(state.maxSpellSlots);"""
content = content.replace(old_load, new_load)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("Page patched part 1.")
