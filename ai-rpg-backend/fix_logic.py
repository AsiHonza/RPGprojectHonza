import codecs
import re

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

# 1. list-characters
content = content.replace("f\"{req.api_key}#%\"", "f\"{req.email}#%\"")

# 2. create-character
content = content.replace("db_key = f\"{req.api_key}#{req.name}\"", "db_key = f\"{req.email}#{req.name}\"")

# 3. load-game
# It uses req.email#req.name now, but wait! load-game previously did `db_key = f"{req.api_key}#{req.name}"`.
content = content.replace("db_key = f\"{req.api_key}#{req.name}\"", "db_key = f\"{req.email}#{req.name}\"")

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)
print("Logic updated.")
