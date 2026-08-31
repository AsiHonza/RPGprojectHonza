import codecs
import re

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

spell_effect = """  useEffect(() => {
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
  }, [level, dndClass, maxSpellSlots]);
"""

content = content.replace("  // Audio control effect", spell_effect + "\n  // Audio control effect")

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("useEffect added!")
