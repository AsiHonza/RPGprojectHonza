import codecs
import re

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# Replace level * 100 with level * 300 in the XP logic
content = re.sub(r'newXp >= level \* 100', r'newXp >= level * 300', content)
content = re.sub(r'newXp - \(level \* 100\)', r'newXp - (level * 300)', content)

# Replace in the UI
content = re.sub(r'\(\(xp / \(level \* 100\)\) \* 100\)', r'((xp / (level * 300)) * 100)', content)
content = re.sub(r'<span key=\{`xp-\$\{xp\}`\} className="animate-flash">\{xp\}<\/span> / \{level \* 100\} XP', r'<span key={`xp-${xp}`} className="animate-flash">{xp}</span> / {level * 300} XP', content)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)

print("XP curve updated in frontend.")
