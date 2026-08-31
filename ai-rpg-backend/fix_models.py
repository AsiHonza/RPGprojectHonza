import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

content = content.replace(
    "class ListCharactersRequest(BaseModel):\n    api_key: str", 
    "class ListCharactersRequest(BaseModel):\n    email: str"
)

content = content.replace(
    "class LoadGameRequest(BaseModel):\n    api_key: str\n    name: str",
    "class LoadGameRequest(BaseModel):\n    email: str\n    name: str"
)

content = content.replace(
    "class CharacterCreateRequest(BaseModel):\n    name: str\n    dnd_class: DndClass\n    race: DndRace\n    stats: CharacterStats\n    api_key: str",
    "class CharacterCreateRequest(BaseModel):\n    name: str\n    dnd_class: DndClass\n    race: DndRace\n    stats: CharacterStats\n    email: str\n    api_key: str"
)

content = content.replace(
    "class PlayerActionRequest(BaseModel):\n    api_key: str\n    name: str",
    "class PlayerActionRequest(BaseModel):\n    api_key: str\n    email: str\n    name: str"
)

content = content.replace(
    "class SaveStateRequest(BaseModel):\n    api_key: str\n    name: str\n    state: dict",
    "class SaveStateRequest(BaseModel):\n    email: str\n    name: str\n    state: dict"
)

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)
print("Models updated.")
