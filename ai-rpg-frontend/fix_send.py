import codecs
import re

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

old_body = """        body: JSON.stringify({ 
          api_key: apiKey.trim(), 
          action_text: actionText,
          stats: stats,
          level: level,
          skills: skills
        }),"""

new_body = """        body: JSON.stringify({ 
          email: email,
          name: name,
          api_key: apiKey.trim() || "DUMMY", 
          action_text: actionText,
          stats: stats,
          level: level,
          skills: skills
        }),"""

content = content.replace(old_body, new_body)

# Also fix setHistory for errors
content = content.replace(
    'setHistory(prev => [...prev, { type: "error", text: data.detail || "Chyba API." }]);',
    'setHistory(prev => [...prev, { type: "error", text: typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail) }]);'
)
content = content.replace(
    'setHistory([{ type: "error", text: data.detail || "Chyba API." }]);',
    'setHistory([{ type: "error", text: typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail) }]);'
)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("sendAction fixed.")
