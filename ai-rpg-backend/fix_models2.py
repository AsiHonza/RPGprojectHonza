import codecs
import re

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

# Fix CharacterCreateRequest
content = re.sub(
    r'class CharacterCreateRequest\(BaseModel\):\n    name: str\n    dnd_class: DndClass\n    race: DndRace\n    stats: CharacterStats\n    api_key: str[^\n]*\n',
    'class CharacterCreateRequest(BaseModel):\n    name: str\n    dnd_class: DndClass\n    race: DndRace\n    stats: CharacterStats\n    email: str\n    api_key: str\n',
    content
)

# Fix PlayerActionRequest
content = re.sub(
    r'class PlayerActionRequest\(BaseModel\):\n    api_key: str\n    name: str\n',
    'class PlayerActionRequest(BaseModel):\n    api_key: str\n    email: str\n    name: str\n',
    content
)

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)
print("Models fixed properly.")
